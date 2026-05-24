"use client";

import React from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface Testimonial {
  id: number;
  rating: number;
  title: string;
  comment: string;
  author: string;
  product: {
    name: string;
    price: string;
    image: string;
    link: string;
  };
}
 
const testimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    title: 'Super Comfortable!',
    comment: 'Wearing this set feels just like being at home – super comfy! No matter how much I move around, it never feels tight.',
    author: 'Anna',
    product: {
      name: 'Breezeflow midi jumpsuit dress',
      price: '₹2,499',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2070&auto=format&fit=crop',
      link: '/products',
    }
  },
  {
    id: 2,
    rating: 5,
    title: 'Cute & Practical',
    comment: 'The fabric is super soft and absorbs sweat quickly, so I still feel fresh after workouts. My friends even said the outfit looks cute on me.',
    author: 'May',
    product: {
      name: 'Coral sports bra',
      price: '₹1,899',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
      link: '/products',
    }
  },
  {
    id: 3,
    rating: 5,
    title: 'Sporty & Stylish',
    comment: 'I wear this set to class then head straight to the gym, no outfit change. Comfy for workouts yet stylish enough for hanging out.',
    author: 'Nicole',
    product: {
      name: 'Breeze active tank',
      price: '₹1,499',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
      link: '/products',
    }
  },
  {
    id: 4,
    rating: 5,
    title: 'Breathable & Confident',
    comment: 'Even after heavy cardio, the outfit stays breathable. Squats or planks? No worries about losing shape – still confident.',
    author: 'Tramy',
    product: {
      name: 'Enduro mesh top',
      price: '₹2,199',
      image: 'https://images.unsplash.com/photo-1578762560072-05382373a8f4?q=80&w=2070&auto=format&fit=crop',
      link: '/products',
    }
  },
  {
    id: 5,
    rating: 5,
    title: 'Flawless Gym Fit!',
    comment: 'The compression leggings are incredible. They hold their shape perfectly during squats and the waist never slides down.',
    author: 'Sarah',
    product: {
      name: 'Velocity leggings',
      price: '₹2,999',
      image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=2070&auto=format&fit=crop',
      link: '/products',
    }
  },
  {
    id: 6,
    rating: 5,
    title: 'Like Running on Clouds',
    comment: 'These training shoes completely changed my running routines. Extremely lightweight and the energy rebound is incredible.',
    author: 'Jessica',
    product: {
      name: 'Ignite foam runners',
      price: '₹8,999',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
      link: '/products',
    }
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 mb-16 text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-[var(--color-black)] mb-3">
          Loved by our community
        </h2>
        <p className="font-body text-base text-gray-500 max-w-lg mx-auto">
          See what our customers are saying about our products
        </p>
      </div>

      {/* Marquee Wrapper with relative position for side fades */}
      <div className="relative w-full flex items-center justify-center overflow-hidden">
        {/* Soft elegant blur masks on the left and right edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Endless Marquee Loop Container */}
        <div className="flex gap-6 animate-marquee py-4">
          {/* Card list - Render twice for a perfect seamless handoff */}
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-[300px] md:w-[360px] bg-[#FAF9F8] rounded-[28px] border border-gray-100 p-8 flex flex-col justify-between shadow-xs transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="ph:star-fill"
                      className="text-amber-500 text-lg md:text-xl"
                    />
                  ))}
                </div>

                {/* Review Details */}
                <h3 className="font-heading text-lg md:text-xl font-bold text-[#382830] mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-gray-600 leading-relaxed mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="mt-auto">
                {/* Author with Verified Badge */}
                <div className="flex items-center gap-2 text-sm font-body font-bold text-[#382830] mb-5">
                  <Icon
                    icon="ph:check-circle-fill"
                    className="text-emerald-600 text-base"
                  />
                  <span>{item.author}</span>
                </div>

                {/* Border Divider */}
                <div className="border-t border-gray-200/60 my-4" />

                {/* Linked Product Visual Footer */}
                <Link
                  href={item.product.link}
                  className="flex items-center gap-4 group/prod"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 shadow-inner">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/prod:scale-105"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-body text-[13px] font-medium text-gray-700 truncate group-hover/prod:text-[var(--color-primary-bright)] transition-colors duration-300">
                      {item.product.name}
                    </h4>
                    <span className="font-heading text-sm font-bold text-[#382830]">
                      {item.product.price}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
