"use client";

import React from "react";
import Link from "next/link";
import docData from "../../constants/documents.json";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  const data = docData.terms;

  return (
    <div className="bg-white min-h-screen font-sans text-[#111] antialiased">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Terms and Conditions of Sale – Disport
          </h1>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <p>Effective: {data.effectiveDate}</p>
            <p>Last Update: {data.lastUpdated}</p>
          </div>
        </header>

        <div className="prose prose-neutral max-w-none prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-headings:mb-4 prose-headings:mt-12">
          <p className="text-sm leading-relaxed mb-8">
            This page provides you information about Disport Performance Limited ("Disport", "Retailer", "we", "our" and/or "us"), and the terms and conditions (the "Terms") on which we sell products in accordance with the sections below ("Products") through the website <Link href="/" className="underline underline-offset-4 font-bold text-black">www.disport.com</Link> ("our site"/"Site") to you. These Terms will apply to any contract between us for the sale of Products to you ("Contract"). Before using our site, please read these Terms carefully and make sure that you understand them.
          </p>

          <p className="text-sm leading-relaxed mb-8">
            Please note that before placing an order or making a payment you will be asked to agree to these Terms. If you refuse to accept these Terms, you will not be able to order any Products from our site or make any payments related thereto.
          </p>

          <p className="text-sm leading-relaxed mb-12">
            You should view, read and print a copy of these Terms or save them to your computer for future reference. We may amend these Terms from time to time as set out below. Every time you wish to order Products or use our site, please check these Terms to ensure you understand the terms which will apply at that time.
          </p>

          <div className="space-y-12">
            {data.sections.map((section, idx) => (
              <section key={idx} className="scroll-mt-24">
                {section.title && (
                  <h2 className="text-xl font-bold uppercase tracking-tight mb-6">
                    {section.title}
                  </h2>
                )}
                
                <div className="space-y-4">
                  {section.type === "text" ? (
                    <p 
                      className="text-sm leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{ __html: (section as any).content.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-black">$1</span>') }} 
                    />
                  ) : (
                    <ul className="space-y-4">
                      {(section as any).items?.map((item: string, i: number) => (
                        <li key={i} className="flex gap-4 items-start">
                          <span className="text-sm font-bold min-w-[24px]">{idx + 1}.{i + 1}</span>
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

          <section className="mt-20 pt-12 border-t border-gray-100">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Information About Us</h2>
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <p><span className="font-bold text-black">Address:</span> {data.contact.address}</p>
              <p><span className="font-bold text-black">Email:</span> {data.contact.email}</p>
              <p><span className="font-bold text-black">Phone:</span> {data.contact.phone}</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

