"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/components/Redux/RTK/authApi";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [resendTimer, setResendTimer] = useState(0);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [forgotPassword, { isLoading: sendingOtp }] =
    useForgotPasswordMutation();

  const [resetPassword, { isLoading: resetting }] =
    useResetPasswordMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);




  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    const res: any = await forgotPassword({ email });

    if (res?.data?.success) {
      toast.success(res.data.message || "OTP sent successfully");
      setStep(2);
      setResendTimer(120);
    } else {
      toast.error(res?.error?.data?.message || "Failed to send OTP");
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res: any = await resetPassword({
      email,
      otp,
      newPassword,
    });

    if (res?.data?.success) {
      toast.success("Password reset successful");
      router.push("/login");
    } else {
      toast.error(res?.error?.data?.message || "Failed to reset password");
    }
  };

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
                alt="Security"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
            </div>

            <div className="relative z-10 text-white space-y-6 max-w-sm">
              <h2 className="text-4xl font-extrabold leading-tight">
                Secure Your Account Access
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Don't worry, it happens to the best of us. Let's get you back into your account safely and quickly.
              </p>
              <div className="pt-8 flex gap-4">
                <div className="h-1 w-4 bg-white/40 rounded-full" />
                <div className="h-1 w-4 bg-white/40 rounded-full" />
                <div className="h-1 w-12 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Side: Forgot Password Form */}
          <div className="w-full md:w-1/2 p-4 md:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6 md:space-y-8">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {step === 1 ? "Forgot Password?" : "Reset Password"}
                </h1>
                <p className="text-sm text-gray-500 mt-1 md:mt-2">
                  {step === 1
                    ? "Enter your email address and we'll send you an OTP to reset your password."
                    : "Enter the OTP sent to your email and choose a new secure password."}
                </p>
              </div>

              <div className="space-y-5">
                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 hover:bg-white"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSendOtp}
                      disabled={sendingOtp}
                      className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {sendingOtp ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Enter OTP
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 hover:bg-white"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        New Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-10 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 hover:bg-white"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 hover:bg-white"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleResetPassword}
                      disabled={resetting}
                      className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {resetting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Resetting...</span>
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>

                    <button
                      disabled={resendTimer > 0}
                      onClick={handleSendOtp}
                      className={`w-full py-2 text-sm font-semibold transition-all ${resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-primary hover:text-primary/80"
                        }`}
                    >
                      {resendTimer > 0
                        ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, "0")}`
                        : "Didn't receive OTP? Resend"}
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => step === 2 ? setStep(1) : router.push("/login")}
                  className="text-gray-600 text-sm font-bold hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {step === 2 ? "Back to Email" : "Back to Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
