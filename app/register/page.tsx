"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import AuthInput from "../../components/auth/AuthInput";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for registration
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
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
              <AuthInput
                label="Full Name"
                type="text"
                required
                value={formData.fullName}
                onChange={(val) => setFormData({ ...formData, fullName: val })}
              />

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
                value={formData.phone}
                onChange={(val) => setFormData({ ...formData, phone: val })}
                placeholder="+91 |"
              />

              <AuthInput
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(val) => setFormData({ ...formData, password: val })}
              />

              <div className="flex items-start gap-3 pt-6">
                <div className="relative flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    className="w-4 h-4 border-gray-200 rounded-none accent-black cursor-pointer"
                  />
                </div>
                <label htmlFor="terms" className="text-[10px] text-gray-500 font-medium leading-tight">
                  I agree to Disport's <Link href="/document/terms" className="text-black font-bold hover:underline">Terms of Service</Link> and <Link href="/document/privacy" className="text-black font-bold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 mt-8"
              >
                Create Account <ArrowRight size={16} />
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
    </div>
  );
}
