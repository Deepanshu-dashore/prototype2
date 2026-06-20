"use client";

import React from "react";
import docData from "../../constants/documents.json";

export default function RefundExchangePage() {
  const data = docData.refundExchange;

  return (
    <div className="bg-white min-h-screen font-sans text-[#111] antialiased">
      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-6 uppercase font-heading">
            {data.title} – Disport
          </h1>
          <div className="flex flex-col gap-2 text-sm text-gray-500 font-body">
            <p>Effective: {data.effectiveDate}</p>
            <p>Last Updated: {data.lastUpdated}</p>
            <p>Status: Active / Official</p>
          </div>
        </header>

        <div className="prose prose-neutral max-w-none prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-headings:mb-4 prose-headings:mt-12">
          <div className="space-y-12">
            {data.sections.map((section, idx) => (
              <section key={idx} className="scroll-mt-24">
                {section.title && (
                  <h2 className="text-xl font-bold uppercase tracking-tight mb-6 font-heading">
                    {section.title}
                  </h2>
                )}
                
                <div className="space-y-4 font-body">
                  {section.type === "text" ? (
                    <p 
                      className="text-sm leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{ __html: (section as any).content.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-black">$1</span>') }} 
                    />
                  ) : (
                    <ul className="space-y-4">
                      {(section as any).items?.map((item: string, i: number) => (
                        <li key={i} className="flex gap-4 items-start">
                          <span className="text-xs font-bold min-w-[60px] text-gray-400 uppercase tracking-tighter pt-0.5">Section {i + 1}</span>
                          <p 
                            className="text-sm leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-black">$1</span>') }} 
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-20 pt-12 border-t border-gray-100 font-body">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-6 font-heading">Support & Inquiries</h2>
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <p><span className="font-bold text-black">Customer Care:</span> {data.contact.address}</p>
              <p><span className="font-bold text-black">Email:</span> {data.contact.email}</p>
              <p><span className="font-bold text-black">Phone:</span> {data.contact.phone}</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
