"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import AuthInput from "../../components/auth/AuthInput";
import { useMutationApi } from "../../hooks/useApi";
import API_ENDPOINTS from "../constants/apiConfig";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  otp: string;
  terms: boolean;
  isVerify: boolean;
  isOtpSend: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    otp: "",
    terms: false,
    isVerify: false,
    isOtpSend: false,
  });

  const { mutateAsync: registerUser, isPending } = useMutationApi({
    key: "register",
    url: API_ENDPOINTS.USER.REGISTER,
    method: "POST",
    requireAuth: false,
    options: {
      onSuccess: (data: any) => {
        console.log("Registration successful", data);
        toast.success("Account created successfully!");
        router.push("/login");
      },
      onError: (err: any) => {
        console.error("Registration error", err);
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Registration failed. Please try again.";
        toast.error(message);
      },
    },
  });

  const { mutateAsync: sendOtp, isPending: OtpIsPending } = useMutationApi({
    key: "sendOtp",
    url: API_ENDPOINTS.USER.SEND_OTP,
    method: "POST",
    requireAuth: false,
    options: {
      onSuccess: () => {
        toast.success("OTP sent to your email!");
        setFormData((prev) => ({ ...prev, isOtpSend: true }));
      },
      onError: (err: any) => {
        console.error("OTP send error", err);
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to send OTP. Please try again.";
        toast.error(message);
      },
    },
  });

  const { mutateAsync: verifyOtp, isPending: verifyOtpIsPending } = useMutationApi({
    key: "verifyOtp",
    url: API_ENDPOINTS.USER.VERIFY_OTP,
    method: "POST",
    requireAuth: false,
    options: {
      onSuccess: () => {
        toast.success("Email verified successfully!");
        setFormData((prev) => ({ ...prev, isVerify: true }));
      },
      onError: (err: any) => {
        console.error("OTP verify error", err);
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Invalid OTP. Please try again.";
        toast.error(message);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.isVerify) {
      // Step 1: Send OTP
      if (!formData.email) {
        toast.error("Please enter your email first.");
        return;
      }
      sendOtp({ payload: { email: formData.email } } as any);
    } else {
      // Step 2: Register (only send API-relevant fields)
      const { firstName, lastName, email, mobileNumber, password, otp } = formData;
      registerUser({ payload: { firstName, lastName, email, mobileNumber, password, otp } } as any);
    }
  };

  // Compute disabled state for submit button
  const isSubmitDisabled = formData.isVerify
    ? isPending
    : formData.isOtpSend
      ? true  // OTP sent but not yet verified — disable "Send OTP", user should verify first
      : OtpIsPending;

  return (
    <main className="flex-1 flex flex-col lg:flex-row">
      {/* Left Side: Image/Brand Section */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
          alt="Technical Movement"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4">
            Motion <br /> Without Limits
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] max-w-md">
            Unlock your true potential with gear engineered for the next generation of athletes.
          </p>
        </div>

        {/* Decorative Technical Elements */}
        <div className="absolute top-16 left-16 flex flex-col gap-1 items-start opacity-20">
          <div className="w-24 h-[1px] bg-white"></div>
          <div className="w-16 h-[1px] bg-white"></div>
          <div className="w-8 h-[1px] bg-white"></div>
          <span className="text-[10px] text-white font-mono mt-2">REG.SYS.BETA.2</span>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <header className="mb-8">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black mb-2">
              Join Us
            </h1>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Start your technical performance journey.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <AuthInput
                label="First Name"
                type="text"
                required
                value={formData.firstName}
                onChange={(val) => setFormData({ ...formData, firstName: val })}
              />
              <AuthInput
                label="Last Name"
                type="text"
                required
                value={formData.lastName}
                onChange={(val) => setFormData({ ...formData, lastName: val })}
              />
            </div>

            <AuthInput
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
            />

            <AuthInput
              label="Phone Number"
              type="tel"
              required
              value={formData.mobileNumber}
              onChange={(val) => setFormData({ ...formData, mobileNumber: val })}
              placeholder="+91 |"
            />

            <AuthInput
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(val) => setFormData({ ...formData, password: val })}
            />

            {formData.isOtpSend &&
              <div className="flex gap-3 items-baseline">
                <AuthInput
                  label="Otp"
                  type="text"
                  required={formData.isOtpSend}
                  value={formData.otp}
                  onChange={(val) => setFormData({ ...formData, otp: val })}
                />
                <button
                  onClick={() => {
                    if (!formData.otp) {
                      toast.error("Please enter the OTP.");
                      return;
                    }
                    verifyOtp({ payload: { email: formData.email, otp: formData.otp } } as any);
                  }}
                  type="button"
                  disabled={verifyOtpIsPending || formData.isVerify}
                  className="w-full bg-black text-white py-4.5 text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formData.isVerify ? "Verified ✓" : verifyOtpIsPending ? <><Loader2 size={14} className="animate-spin" /> Verifying</> : "Verify"}
                </button>
              </div>
            }

            <div className="flex items-start gap-3 pt-6">
              <div className="relative flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded-none accent-black cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-[11px] text-gray-500 font-medium leading-relaxed">
                I have read and accepted the <Link href="/document/terms" className="text-black font-bold underline underline-offset-2">Terms & Conditions</Link> and the <Link href="/document/privacy" className="text-black font-bold underline underline-offset-2">Disport Privacy Policy</Link>.*
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formData.isVerify
                ? (isPending ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight size={16} /></>)
                : (OtpIsPending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send Otp")}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase">
                Or join with
              </span>
            </div>

            <button className="w-full flex items-center justify-center gap-4 py-4 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48">
                <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" strokeWidth={1} stroke="#ffc107"></path>
                <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" strokeWidth={1} stroke="#ff3d00"></path>
                <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" strokeWidth={1} stroke="#4caf50"></path>
                <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" strokeWidth={1} stroke="#1976d2"></path>
              </svg>
              Google
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
              Already a member?
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-4 border border-black text-black text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
