"use client";

import React, { useState } from "react";

interface AuthInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function AuthInput({ label, type, value, onChange, required = false, placeholder, icon }: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mt-6">
      {/* Border Container */}
      <div 
        className={`relative flex items-center border rounded-md transition-all duration-300 ${
          isFocused ? 'border-black ring-1 ring-black' : 'border-gray-300'
        }`}
      >
        {/* Label (Floating/Sliding Effect) */}
        <label 
          className={`absolute left-4 transition-all duration-300 pointer-events-none bg-white px-1 font-semibold uppercase ${
            isFocused || value 
              ? '-top-2.5 text-[10px] text-black z-10' 
              : 'top-1/2 -translate-y-1/2 text-[11px] text-gray-400'
          }`}
        >
          {label}
        </label>

        {/* Input */}
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ""}
          className="w-full bg-transparent py-4 px-5 text-sm focus:outline-none placeholder:text-gray-300"
        />

        {/* Icon (Optional) */}
        {icon && (
          <div className="pr-4 text-gray-400 group-focus-within:text-black">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
