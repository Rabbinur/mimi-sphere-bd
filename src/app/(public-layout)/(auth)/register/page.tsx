"use client"

import { userRegister } from "@/components/Authentication/userRegister";
import VerifyOtpModal from "@/components/Authentication/VerifyOtpModal";
import GoogleLogin from "@/components/custom/GoogleLogin";
import { Eye, EyeOff, Lock, Mail, Smartphone, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginFormInputs {
  name: string
  email: string
  phone: string
  password: string
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifyModal, setVerifyModal] = useState(false)
  const closeModal = () => setVerifyModal(false)
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState<{
    email: string
    password: string
  } | null>(null)
  const [hasRedirect, setHasRedirect] = useState(false)

  useEffect(() => {
    const redirectRoute = sessionStorage.getItem("redirect_to")
    setHasRedirect(!!redirectRoute)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    const toastId = toast.loading("Processing...")
    const registerData = {
      name: data?.name,
      email: data?.email,
      password: data?.password,
      phone: data.phone,
    }

    setLoginData({
      email: data.email,
      password: data.password,
    })
    setLoading(true)
    try {
      const response = await userRegister(registerData)
      if (response?.status === 409) {
        toast.error(response?.data?.message || "User email already exists!", { id: toastId })
        setLoading(false)
      } else if (response?.data?.data?.isVerified === false) {
        toast.success("OTP sent! Please verify.", { id: toastId })
        setLoading(false)
        setVerifyModal(true)
      } else {
        toast.success("User registered successfully.", { id: toastId })
        setLoading(false)
        setVerifyModal(false)
      }
    } catch (err) {
      toast.error("Something Went Wrong", { id: toastId })
      setLoading(false)
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
                Join Our Exclusive Community
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Create an account to unlock personalized recommendations, early access to sales, and a seamless checkout experience.
              </p>
              <div className="pt-8 flex gap-4">
                <div className="h-1 w-4 bg-white/40 rounded-full" />
                <div className="h-1 w-12 bg-white rounded-full" />
                <div className="h-1 w-4 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Side: Register Form */}
          <div className="w-full md:w-1/2 p-4 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[800px]">
            <VerifyOtpModal isOpen={isVerifyModal} onClose={closeModal} loginData={loginData} />

            <div className="max-w-md w-full mx-auto space-y-6 md:space-y-8 py-2 md:py-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  Create Account
                </h1>
                <p className="text-sm text-gray-500 mt-1 md:mt-2">
                  Start your shopping journey with us today.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        id="name"
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 ${errors.name ? "border-red-500 bg-red-50/50" : "hover:bg-white"
                          }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs font-medium ml-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
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
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 ${errors.email ? "border-red-500 bg-red-50/50" : "hover:bg-white"
                          }`}
                        placeholder="name@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs font-medium ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Smartphone className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        {...register("phone", { required: "Phone number is required" })}
                        type="tel"
                        id="phone"
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 ${errors.phone ? "border-red-500 bg-red-50/50" : "hover:bg-white"
                          }`}
                        placeholder="+880 1XXX XXXXXX"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs font-medium ml-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        {...register("password", {
                          required: "Password is required",
                          minLength: { value: 8, message: "Password must be at least 8 characters long" },
                        })}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className={`w-full pl-10 pr-12 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 ${errors.password ? "border-red-500 bg-red-50/50" : "hover:bg-white"
                          }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs font-medium ml-1">{errors.password.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-2.5 md:py-3.5 px-4 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 md:mt-4"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or join with</span>
                </div>
              </div>

              <div className="space-y-4">
                <GoogleLogin />
              </div>

              <div className="text-center pt-2">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-bold hover:text-primary/80 transition-colors"
                  >
                    Sign In instead
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

export default RegisterPage
