"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

const ROTATING_WORDS = ["brands", "businesses", "companies"];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ width: "4.8em", height: "1.12em" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index]}
          initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="absolute inset-0 flex items-center justify-center text-white/90"
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HeroSection({ onBookCall }: { onBookCall?: () => void }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 80]);
  const blobScale = useTransform(scrollY, [0, 400], [1, 1.15]);

  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12">
      {/* Animated gradient blobs — parallax */}
      <motion.div style={{ scale: blobScale }} className="pointer-events-none absolute -inset-20 z-0 overflow-visible sm:-inset-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.1 }}
          className="absolute -top-24 -right-16 sm:-top-36 sm:right-0"
        >
          <div
            className="h-[350px] w-[350px] rounded-full sm:h-[520px] sm:w-[520px]"
            style={{ background: "radial-gradient(circle, #E8A782 0%, #E8A782aa 60%, transparent 100%)", animation: "blob-breathe 6s ease-in-out infinite" }}
          />
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(232,167,130,0.18)", animation: "radiate-ring 4s ease-in-out infinite" }} />
          <div className="absolute -inset-10 rounded-full" style={{ border: "1px solid rgba(232,167,130,0.08)", animation: "radiate-ring-slow 5.5s ease-in-out infinite 1s" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="absolute -left-16 top-[15%] sm:-left-24"
        >
          <div
            className="h-[300px] w-[300px] rounded-full sm:h-[450px] sm:w-[450px]"
            style={{ background: "radial-gradient(circle, #9AAF8C 0%, #9AAF8Caa 60%, transparent 100%)", animation: "blob-breathe-alt 7s ease-in-out infinite 0.5s" }}
          />
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(154,175,140,0.15)", animation: "radiate-ring 5s ease-in-out infinite 0.5s" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.5 }}
          className="absolute -bottom-16 right-[10%]"
        >
          <div
            className="h-[280px] w-[280px] rounded-full sm:h-[400px] sm:w-[400px]"
            style={{ background: "radial-gradient(circle, #96AAC8 0%, #96AAC8aa 60%, transparent 100%)", animation: "blob-breathe 5.5s ease-in-out infinite 1s" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.7 }}
          className="absolute -bottom-10 -left-8"
        >
          <div
            className="h-[220px] w-[220px] rounded-full sm:h-[320px] sm:w-[320px]"
            style={{ background: "radial-gradient(circle, #D2B48C 0%, #D2B48Caa 60%, transparent 100%)", animation: "blob-breathe-alt 6.5s ease-in-out infinite 2s" }}
          />
        </motion.div>
      </motion.div>

      {/* Main green hero card */}
      <motion.div
        style={{ y: heroY }}
        className="relative z-10 mx-auto mt-4 w-full max-w-[1260px] sm:mt-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-[#7B8C6F] sm:rounded-[36px]"
          style={{
            border: "1.5px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 60px rgba(123,140,111,0.25), 0 0 120px rgba(123,140,111,0.1)",
          }}
        >
          {/* Noise overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

          {/* Inner glows */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }} />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-[300px] w-[300px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)" }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 text-center sm:px-12 sm:py-28 lg:px-20 lg:py-36">
            {/* Horizontal headline */}
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

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 max-w-lg text-[1rem] leading-[1.7] text-white/70"
            >
              Strategy, branding, and performance marketing for companies
              ready to own their market — not just exist in it.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={onBookCall}
                className="group flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[0.84rem] font-medium text-[#1A1A1A] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]"
              >
                Book a Call
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <a
                href="#work"
                className="flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-[0.84rem] font-medium text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                See Our Work
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
