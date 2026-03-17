"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

const ROTATING_WORDS = ["brands", "businesses", "companies"];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ width: "4.5em", height: "1.12em" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center italic"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HeroSection({ onBookCall }: { onBookCall?: () => void }) {
  return (
    <section className="relative px-4 pt-32 pb-8 sm:px-6 sm:pt-40 sm:pb-16">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Small top tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-2 w-2 rounded-full bg-[#7B8C6F]" />
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]/30">
            Strategy · Design · Marketing
          </span>
        </motion.div>

        {/* Giant headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-[900px] text-[clamp(2.8rem,7.5vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#1A1A1A]"
        >
          We build <RotatingWord /> that actually{" "}
          <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
            sell.
          </span>
        </motion.h1>

        {/* Subtext + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-[1.05rem] leading-[1.7] text-[#1A1A1A]/40">
            Strategy, branding, and performance marketing for companies
            ready to own their market — not just exist in it.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBookCall}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-[0.88rem] font-medium text-white transition-all duration-200 hover:bg-[#333]"
            >
              Book a Call
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/12 px-7 py-3.5 text-[0.88rem] font-medium text-[#1A1A1A]/60 transition-all duration-200 hover:border-[#1A1A1A]/25 hover:text-[#1A1A1A]"
            >
              Our Services
            </a>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 gap-0 border-t border-[#1A1A1A]/[0.06] pt-8 sm:grid-cols-4"
        >
          {[
            { value: "50+", label: "Clients Served" },
            { value: "98%", label: "Client Retention" },
            { value: "3x", label: "Average ROI" },
            { value: "24hr", label: "Response Time" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-4 sm:py-0 ${i > 0 ? "sm:border-l sm:border-[#1A1A1A]/[0.06] sm:pl-8" : ""}`}
            >
              <p className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.02em] text-[#1A1A1A]">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.75rem] text-[#1A1A1A]/30">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
