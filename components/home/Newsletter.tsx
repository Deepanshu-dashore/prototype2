"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  return (
    <section className="bg-black py-24 border-t border-white/10">
      <div className="container flex justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div>
              <h2 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
                JOIN THE ELITE
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Get exclusive access to new drops, technical insights, and performance gear updates.
              </p> 
            </div>
            
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto w-full" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 bg-white/5 border border-white/20 px-6 py-4 text-white font-bold tracking-widest text-sm focus:outline-none focus:border-primary-bright transition-colors rounded-[4px]"
              />
              <button className="btn btn-primary px-12 py-4">
                Subscribe
              </button>
            </form>
            <div className="flex items-center justify-center gap-4 text-white/50 text-[9px] uppercase tracking-[0.3em] mt-2">
              <p>By subscribing you agree to our privacy policy</p>
              <span className="text-white/5">/</span>
              <p>Terms of service</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
