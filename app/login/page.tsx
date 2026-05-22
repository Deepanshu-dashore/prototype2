"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthInput from "../../components/auth/AuthInput";
import { useMutationApi } from "@/hooks/useApi";
import API_ENDPOINTS from "../constants/apiConfig";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutateAsync: loginUser, isPending, isError, error } = useMutationApi({
    key: "register",
    url: API_ENDPOINTS.USER.LOGIN,
    method: "POST",
    requireAuth: false,
    options: {
      onSuccess: (data) => {
        console.log("Registration successful", data);
        alert("login Sucessfully Done!!");
        redirect("/");
        // TODO: redirect or show success message
      },
      onError: (err) => {
        console.error("login error", err);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for login
    loginUser({ payload: formData })
  };

  return (
    <main className="flex-1 flex flex-col lg:flex-row">
      {/* Left Side: Image/Brand Section */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
          alt="Technical Training"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4">
            Engineered <br /> for Performance
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] max-w-md">
            Join the elite. Access exclusive drops, technical insights, and personalized training gear.
          </p>
        </div>

        {/* Decorative Technical Elements */}
        <div className="absolute top-16 left-16 flex flex-col gap-1 items-start opacity-20">
          <div className="w-24 h-[1px] bg-white"></div>
          <div className="w-16 h-[1px] bg-white"></div>
          <div className="w-8 h-[1px] bg-white"></div>
          <span className="text-[10px] text-white font-mono mt-2">SYS.VER.4.0.1</span>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <header className="mb-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black mb-2">
              Login
            </h1>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Get personalized picks & faster checkout
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Enter 10-digit mobile number or email"
              type="email"
              required
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              placeholder="+91 |"
            />

            <div className="relative group">
              <AuthInput
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(val) => setFormData({ ...formData, password: val })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/3 -translate-y-1/2 text-gray-400 hover:text-black transition-colors z-20 mt-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 mt-8"
            >
              {isPending ? "Signing In.." : "Sign In"} {isPending ? <Loader2 size={16} /> : <ArrowRight size={16} />}
            </button>

            <p className="mt-4 text-[10px] text-gray-500 font-medium leading-relaxed">
              By entering this site, you agree to the <Link href="/document/terms" className="text-black font-bold underline! underline-offset-2!">Terms & Conditions</Link> and <Link href="/document/privacy" className="text-black font-bold underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </form>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Or continue with
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

          <p className="mt-7 text-center text-xs font-semibold text-gray-600">
            NOT A MEMBER?{" "}
            <Link href="/register" className="text-black font-bold underline decoration-1 underline-offset-4 hover:opacity-70 transition-opacity ml-1">
              JOIN US
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
