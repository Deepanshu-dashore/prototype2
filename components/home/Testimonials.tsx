"use client";

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  rating: number;
  title: string;
  comment: string;
  author: string;
}
 
const testimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    title: 'Super Comfortable!',
    comment: 'Wearing this set feels just like being at home – super comfy! No matter how much I move around, it never feels tight.',
    author: 'Anna'
  },
  {
    id: 2,
    rating: 5,
    title: 'Cute & Practical',
    comment: 'The fabric is super soft and absorbs sweat quickly, so I still feel fresh after workouts. My friends even said the outfit looks cute on me.',
    author: 'May'
  },
  {
    id: 3,
    rating: 5,
    title: 'Sporty & Stylish',
    comment: 'I wear this set to class then head straight to the gym, no outfit change. Comfy for workouts yet stylish enough for hanging out.',
    author: 'Nicole'
  },
  {
    id: 4,
    rating: 5,
    title: 'Breathable & Confident',
    comment: 'Even after heavy cardio, the outfit stays breathable. Squats or planks? No worries about losing shape – still confident.',
    author: 'Tramy'
  },
  {
    id: 5,
    rating: 5,
    title: 'Flawless Gym Fit!',
    comment: 'The compression leggings are incredible. They hold their shape perfectly during squats and the waist never slides down.',
    author: 'Sarah'
  },
  {
    id: 6,
    rating: 5,
    title: 'Like Running on Clouds',
    comment: 'These training shoes completely changed my running routines. Extremely lightweight and the energy rebound is incredible.',
    author: 'Jessica'
  }
];

const Testimonials = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (selectedTestimonial) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedTestimonial]);

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-[var(--color-black)] mb-2">
          Loved by our community
        </h2>
        <p className="font-body text-sm text-gray-500 max-w-lg mx-auto">
          See what our customers are saying about our products
        </p>
      </div>

      {/* Marquee Wrapper with relative position for side fades */}
      <div className="relative w-full flex items-center justify-center overflow-hidden">
        {/* Soft elegant blur masks on the left and right edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Endless Marquee Loop Container using Framer Motion */}
        <motion.div 
          className="flex gap-5 py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
          }}
        >
          {/* Card list - Render twice for a perfect seamless handoff */}
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-[260px] md:w-[300px] bg-[#FAF9F8] rounded-[20px] border border-gray-100 p-5 flex flex-col justify-between shadow-xs transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="ph:star-fill"
                      className="text-amber-500 text-sm md:text-base"
                    />
                  ))}
                </div>

                {/* Review Details */}
                <h3 className="font-heading text-base font-bold text-[#382830] mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Subtle Read Review link on the same line */}
              <div className="mt-auto flex items-center justify-between text-xs font-body pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 font-bold text-[#382830]">
                  <Icon
                    icon="ph:check-circle-fill"
                    className="text-emerald-600 text-sm"
                  />
                  <span>{item.author}</span>
                </div>
                <button
                  onClick={() => setSelectedTestimonial(item)}
                  className="text-gray-400 hover:text-[#ec7700] text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer border-none"
                >
                  Read Review
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal Overlay */}
      {selectedTestimonial && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div 
            className="relative bg-white w-full max-w-md rounded-[20px] p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col gap-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button top right */}
            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center border-none"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Stars */}
            <div className="flex gap-0.5">
              {[...Array(selectedTestimonial.rating)].map((_, i) => (
                <Icon
                  key={i}
                  icon="ph:star-fill"
                  className="text-amber-500 text-lg sm:text-xl"
                />
              ))}
            </div>

            {/* Title & Author */}
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#382830] mb-2 leading-snug">
                {selectedTestimonial.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-body font-bold text-emerald-600">
                <Icon
                  icon="ph:check-circle-fill"
                  className="text-emerald-600 text-sm"
                />
                <span>Verified Customer • {selectedTestimonial.author}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 w-full" />

            {/* Comment */}
            <div className="font-body text-xs sm:text-sm text-gray-600 leading-relaxed max-h-[30vh] overflow-y-auto pr-2">
              "{selectedTestimonial.comment}"
            </div>

            {/* Footer Close Button */}
            <div className="mt-2 flex justify-end">
              <button 
                onClick={() => setSelectedTestimonial(null)}
                className="bg-[#ec7700] hover:bg-orange-600 text-white font-heading font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-[4px] transition-all duration-300 cursor-pointer border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
