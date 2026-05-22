"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const TOTAL_BARS = 42;

export default function DisportLoader() {
    return (
        <div className="relative flex items-center justify-center w-screen h-screen bg-[#f5f5f5] overflow-hidden">

            {/* Background Glow */}
            <motion.div
                animate={{
                    opacity: [0.25, 0.4, 0.25],
                    scale: [1, 1.08, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="
          absolute
          w-[520px]
          h-[520px]
          rounded-full
          bg-orange-100
          blur-3xl
        "
            />

            {/* Main Loader */}
            <div className="relative w-[430px] h-[430px] flex items-center justify-center">

                {/* ANIMATED OUTER RING */}
                {Array.from({ length: TOTAL_BARS }).map((_, index) => {
                    const angle = (360 / TOTAL_BARS) * index;

                    return (
                        <motion.div
                            key={index}
                            className="absolute left-1/2 top-1/2"
                            style={{
                                transform: `
                  rotate(${angle}deg)
                  translateY(-185px)
                `,
                                transformOrigin: "center",
                            }}
                            animate={{
                                scaleY: [0.5, 1.5, 0.5],
                                opacity: [0.2, 1, 0.2],
                                y: [0, -12, 0],
                            }}
                            transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: index * 0.05,
                            }}
                        >
                            <div
                                className="rounded-full"
                                style={{
                                    width: "16px",
                                    height: `${55 + (index % 5) * 10}px`,
                                    background:
                                        index % 4 === 0
                                            ? "#ff6b00"
                                            : index % 3 === 0
                                                ? "#f4a340"
                                                : "#ffbf47",

                                    boxShadow: "0 0 22px rgba(255,140,0,0.45)",
                                }}
                            />
                        </motion.div>
                    );
                })}

                {/* CENTER CIRCLE */}
                <motion.div
                    animate={{
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
            relative
            z-20
            w-[285px]
            h-[285px]
            rounded-full
            bg-white
            border-[3px]
            border-[#e7e7e7]
            flex
            items-center
            justify-center
            shadow-[0_15px_50px_rgba(0,0,0,0.08)]
          "
                >
                    {/* Soft Inner Gradient */}
                    <div
                        className="
              absolute
              inset-0
              rounded-full
              bg-gradient-to-br
              from-white
              to-orange-50
            "
                    />

                    {/* Logo */}
                    <motion.div
                        animate={{
                            opacity: [0.75, 1, 0.75],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative z-10"
                    >
                        <Image
                            src="/DISPORT LOGOS/LOGO.webp"
                            alt="Disport"
                            width={180}
                            height={90}
                            priority
                            className="object-contain"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}