"use client";

import React from 'react';
import { Icon } from '@iconify/react';

const trustItems = [
  {
    icon: "ph:truck-light",
    title: 'Fast Delivery',
    description: 'On all orders above $99',
  },
  {
    icon: "ph:shield-check-light",
    title: 'Quality Assured',
    description: '100% authentic performance gear',
  },
  {
    icon: "ph:lock-key-light",
    title: 'Secure Checkout',
    description: 'PCI-compliant encrypted payments',
  }, 
  {
    icon: "ph:arrow-counter-clockwise-light",
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
  },
  {
    icon: "ph:chat-centered-text-light",
    title: 'Elite Support',
    description: '24/7 dedicated athlete assistance',
  },
];

const TrustBar = () => {
  return (
    <section className="max-w-[var(--max-width-site)] mx-auto px-[var(--container-padding)] py-10" id="features-bar">
      <div className="bg-surface border border-gray-100! rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 py-[35px] px-5 sm:py-[30px] sm:px-[15px] gap-y-8 lg:gap-y-0">
        {trustItems.map((item, index) => (
          <div 
            key={index} 
            className={`
              flex flex-row items-center justify-center gap-4 px-[10px] relative
              sm:justify-start sm:pl-[10%] lg:justify-center lg:pl-[10px]
              max-[600px]:flex-col max-[600px]:justify-center max-[600px]:pl-0 max-[600px]:text-center max-[600px]:gap-3
              after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[45px] after:w-[1px] after:bg-[#e2e2e27d]
              ${(index + 1) % 5 === 0 ? 'after:hidden' : ''}
              lg:after:block
              max-[1024px]:after:hidden
              ${(index + 1) % 3 === 0 ? 'max-[1024px]:after:hidden' : 'max-[1024px]:after:block'}
              max-[768px]:after:hidden
              ${(index + 1) % 2 === 0 ? 'max-[768px]:after:hidden' : 'max-[768px]:after:block'}
              max-[600px]:after:hidden
            `}
          >
            <div className="text-text-primary opacity-90 shrink-0 flex items-center">
              <Icon icon={item.icon} width="32" height="32" />
            </div>
            <div className="flex flex-col gap-[2px]">
              <h3 className="font-heading text-[0.9375rem] lg:text-[0.875rem] xl:text-[0.9375rem] font-bold text-text-primary tracking-[-0.01em] leading-[1.2]">
                {item.title}
              </h3>
              <p className="font-body text-[0.75rem] text-text-secondary font-normal leading-[1.3]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
