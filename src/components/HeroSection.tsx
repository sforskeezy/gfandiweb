"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const ROTATING_WORDS = ["brands", "businesses", "companies"];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ width: "4.8em", height: "1.12em" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index]}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HeroSection({ onBookCall }: { onBookCall?: () => void }) {
  return (
    <section className="relative flex flex-col justify-center px-4 pt-24 pb-0 sm:px-6 sm:pt-28">
      {/* Animated radiating gradient blobs */}
      <div className="pointer-events-none absolute -inset-20 z-0 overflow-visible sm:-inset-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute -top-20 -right-10 sm:-top-28 sm:right-0"
        >
          <div
            className="h-[350px] w-[350px] rounded-full sm:h-[500px] sm:w-[500px]"
            style={{ background: "#E8A782", animation: "blob-breathe 6s ease-in-out infinite" }}
          />
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(232,167,130,0.2)", animation: "radiate-ring 4s ease-in-out infinite" }} />
          <div className="absolute -inset-8 rounded-full" style={{ border: "1.5px solid rgba(232,167,130,0.12)", animation: "radiate-ring-slow 5s ease-in-out infinite 1s" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute -left-10 top-[20%] sm:-left-16"
        >
          <div
            className="h-[300px] w-[300px] rounded-full sm:h-[420px] sm:w-[420px]"
            style={{ background: "#9AAF8C", animation: "blob-breathe-alt 7s ease-in-out infinite 0.5s" }}
          />
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(154,175,140,0.2)", animation: "radiate-ring 5s ease-in-out infinite 0.5s" }} />
          <div className="absolute -inset-10 rounded-full" style={{ border: "1.5px solid rgba(154,175,140,0.1)", animation: "radiate-ring-slow 6s ease-in-out infinite 2s" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute -bottom-10 -right-8 sm:-bottom-16"
        >
          <div
            className="h-[280px] w-[280px] rounded-full sm:h-[400px] sm:w-[400px]"
            style={{ background: "#96AAC8", animation: "blob-breathe 5.5s ease-in-out infinite 1s" }}
          />
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(150,170,200,0.18)", animation: "radiate-ring 4.5s ease-in-out infinite 1.5s" }} />
          <div className="absolute -inset-6 rounded-full" style={{ border: "1.5px solid rgba(150,170,200,0.1)", animation: "radiate-ring-slow 5.5s ease-in-out infinite 0.8s" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute -bottom-6 -left-6"
        >
          <div
            className="h-[220px] w-[220px] rounded-full sm:h-[320px] sm:w-[320px]"
            style={{ background: "#D2B48C", animation: "blob-breathe-alt 6.5s ease-in-out infinite 2s" }}
          />
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(210,180,140,0.18)", animation: "radiate-ring 5s ease-in-out infinite 2.5s" }} />
          <div className="absolute -inset-6 rounded-full" style={{ border: "1px solid rgba(210,180,140,0.08)", animation: "radiate-ring-slow 6.5s ease-in-out infinite 1.2s" }} />
        </motion.div>
      </div>

      {/* The green hero box */}
      <div
        className="relative z-10 mx-auto w-full max-w-[1200px] overflow-hidden rounded-[32px] bg-[#7B8C6F] px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-36"
        style={{
          border: "1.5px solid rgba(255,255,255,0.2)",
          boxShadow: "0 0 30px rgba(123,140,111,0.25), 0 0 80px rgba(123,140,111,0.12)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            We build <RotatingWord /> that
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="mt-1 block text-[clamp(2.4rem,6vw,4.5rem)] italic leading-[1.08] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            actually sell.
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 max-w-lg text-[1rem] leading-[1.7] text-white/70"
          >
            Strategy, branding, and performance marketing for companies
            ready to own their market — not just exist in it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onBookCall}
              className="inline-block rounded-full bg-white px-7 py-3.5 text-[0.84rem] font-medium text-[#1A1A1A] transition-all duration-200 hover:bg-white/90"
            >
              Book a Call
            </button>
            <a
              href="#work"
              className="inline-block rounded-full border border-white/30 px-7 py-3.5 text-[0.84rem] font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10"
            >
              See Our Work
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
