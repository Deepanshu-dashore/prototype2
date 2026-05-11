"use client";

import { Mail, MapPin, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import React from "react";
import docData from "../../constants/documents.json";

export default function PrivacyPolicyPage() {
  const data = docData.privacy;

  return (
    <div className="bg-white min-h-screen font-sans text-black antialiased">
      {/* Dynamic Professional Header */}
      <div className="border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-[2px] bg-black" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Privacy & Data Protection</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8">
            Privacy <br />
            Policy
          </h1>
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-black">Revision:</span> {data.effectiveDate}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black">Status:</span> Active / Official
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-20">
        {/* Sticky Table of Contents - Left Side */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-6">Sections</p>
            {data.sections.filter(s => s.title).map((section, idx) => (
              <a 
                key={idx}
                href={`#privacy-section-${idx}`}
                className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                <span className="w-4 h-[1px] bg-gray-200 group-hover:w-8 group-hover:bg-black transition-all" />
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-2xl">
          <div className="space-y-24">
            {data.sections.map((section, idx) => (
              <section key={idx} id={`privacy-section-${idx}`} className="scroll-mt-24 group">
                {section.title && (
                  <div className="mb-8 overflow-hidden">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight mb-4 group-hover:translate-x-2 transition-transform">
                      {section.title}
                    </h2>
                    <div className="w-12 h-1 bg-black" />
                  </div>
                )}
                
                <div className="prose prose-sm prose-neutral max-w-none">
                  {section.type === "text" ? (
                    <p 
                      className="text-lg leading-relaxed text-gray-800 font-medium tracking-tight"
                      dangerouslySetInnerHTML={{ __html: (section as any).content.replace(/\*\*(.*?)\*\*/g, '<span className="font-black text-black">$1</span>') }} 
                    />
                  ) : (
                    <ul className="space-y-4 list-none p-0">
                      {(section as any).items?.map((item: string, i: number) => (
                        <li key={i} className="flex gap-4 items-start border-l-2 border-gray-100 pl-6 py-2 hover:border-black transition-colors">
                          <span className="text-[10px] font-black mt-1 text-gray-300">ARTICLE {i+1}</span>
                          <p 
                            className="text-base leading-snug font-semibold text-gray-800"
                            dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<span className="font-black text-black">$1</span>') }} 
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            {/* Support Block */}
            <section className="bg-black text-white p-12 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <ShieldCheck size={32} className="text-gray-400" />
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Your Security</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Policy Inquiries</p>
                      <p className="text-sm font-bold leading-relaxed">{data.contact.address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Contact Officer</p>
                      <div className="space-y-2">
                        <p className="text-sm font-bold flex items-center gap-2">
                          <Phone size={14} className="text-gray-500" /> {data.contact.phone}
                        </p>
                        <p className="text-sm font-bold flex items-center gap-2 underline decoration-gray-700 underline-offset-4">
                          <Mail size={14} className="text-gray-500" /> {data.contact.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <div className="text-right opacity-20 hidden md:block">
                      <ShieldCheck size={120} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-40 mb-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 mb-4">Confidential Document</p>
            <div className="text-4xl font-black uppercase italic tracking-tighter text-black opacity-10">
              Disport – Data Sovereignty
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full" />
            <p className="text-[10px] font-bold uppercase tracking-widest">© {new Date().getFullYear()} Disport Corporation</p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <a href="/document/privacy" className="text-black">Privacy Policy</a>
            <a href="/document/terms" className="hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
