"use client"

import dynamic from "next/dynamic";
const VerifyOtpModal = dynamic(() => import("@/components/Authentication/VerifyOtpModal"), { ssr: false });
const GoogleLogin = dynamic(() => import("@/components/custom/GoogleLogin"), { ssr: false });

import { userLogin } from "@/components/Authentication/userLogin";
import { setToken, setUserInfo } from "@/components/Redux/Slice/authSlice";
import { useAppDispatch } from "@/components/Redux/hooks";

import { setTokens } from "@/utils/authCookie";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginFormInputs {
  email: string
  password: string
}

const LoginPage = () => {
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifyModal, setVerifyModal] = useState(false)
  const closeModal = () => setVerifyModal(false)
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState<{
    email: string
    password: string
  } | null>(null)
  const [hasRedirect, setHasRedirect] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>()

  useEffect(() => {
    const redirectRoute = sessionStorage.getItem("redirect_to")
    setHasRedirect(!!redirectRoute)
  }, [])

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true)
    const toastId = toast.loading("Login Processing !")
    setLoginData({
      email: data.email,
      password: data.password,
    })

    try {
      const res = await userLogin(data)
      console.log(res)
      if (res?.data?.data?.isVerified === false) {
        toast.success("OTP sent! Please verify.", { id: toastId })
        reset()
        setLoading(false)
        setVerifyModal(true)
      } else if (res?.data?.data?.isVerified === true) {
        const user = res.data.data;
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;

        // Set Tokens FIRST
        if (accessToken && refreshToken) {
          setTokens(accessToken, refreshToken);
          dispatch(setToken({ accessToken }));
        }

        // Then set User Info
        dispatch(
          setUserInfo({
            _id: user._id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
            role: user.role,
            phone: user.phone,
            photo: user.photo,
            addresses: user.addresses || [],
          }),
        )
        reset()
        toast.success("Login Successfully", { id: toastId, duration: 2000 })
        const redirectRoute = sessionStorage.getItem("redirect_to")
        if (redirectRoute) {
          try {
            // Try to parse if it's a JSON string
            router.push(JSON.parse(redirectRoute))
          } catch (e) {
            // Fallback to raw string if parsing fails
            router.push(redirectRoute)
          }
          sessionStorage.removeItem("redirect_to")
          return
        }

        setLoading(false)
        if (user.role === "ADMIN") {
          window.location.href = "/dashboard"
          return
        }
        window.location.href = "/user-account"
      } else {
        toast.error(res?.message || "Valid Information Provide!", {
          id: toastId,
          duration: 2000,
        })
        setLoading(false)
      }
    } catch (err) {
      console.error("Error:", "Something went wrong")
      setLoading(false)
      toast.error("Something went wrong", { id: toastId, duration: 2000 }) // Add error toast
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 py-4 md:px-4 md:py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px] border border-white/20">

          {/* Left Side: Visual/Branding */}
          <div className="hidden md:flex md:w-1/2 relative bg-primary overflow-hidden items-center justify-center p-12">
            <div className="absolute inset-0 z-0">
              <img
                src="/auth-bg.png"
                alt="Shopping Experience"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
            </div>

            <div className="relative z-10 text-white space-y-6 max-w-sm">
              <h2 className="text-4xl font-extrabold leading-tight">
                Welcome Back to Your Shopping Haven
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Discover the latest trends and manage your orders with ease. Your perfect shopping journey continues here.
              </p>
              <div className="pt-8 flex gap-4">
                <div className="h-1 w-12 bg-white rounded-full" />
                <div className="h-1 w-4 bg-white/40 rounded-full" />
                <div className="h-1 w-4 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full md:w-1/2 p-4 md:p-12 flex flex-col justify-center">
            <VerifyOtpModal
              isOpen={isVerifyModal}
              onClose={closeModal}
              loginData={loginData}
            />

            <div className="max-w-md w-full mx-auto space-y-6 md:space-y-8">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 mt-1 md:mt-2">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      {...register("email", {
                        required: "Please enter your email address.",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address.",
                        },
                      })}
                      type="email"
                      id="email"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 ${errors.email ? "border-red-500 bg-red-50/50" : "hover:bg-white"
                        }`}
                      placeholder="name@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`w-full pl-10 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 ${errors.password ? "border-red-500 bg-red-50/50" : "hover:bg-white"
                        }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={staySignedIn}
                        onChange={(e) => setStaySignedIn(e.target.checked)}
                        className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      Stay signed in
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-all hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-2.5 md:py-3.5 px-4 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="space-y-4">
                <GoogleLogin />
              </div>

              <div className="text-center pt-2">
                <p className="text-gray-600 text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-bold hover:text-primary/80 transition-colors"
                  >
                    Create one for free
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



  )
}

export default LoginPage

