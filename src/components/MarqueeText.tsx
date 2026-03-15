"use client";

import { motion } from "motion/react";

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="inline-block h-[0.7em] w-[0.7em] align-middle"
    >
      <path
        d="M10 8L22 20L10 32"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 8L32 20L20 32"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="inline-block h-[0.75em] w-[0.75em] align-middle"
    >
      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" />
      <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="3" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  );
}

export default function MarqueeText() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p
            className="text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15] tracking-[-0.03em] text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            We help <ChevronIcon /> ambitious
            teams turn bold visions
            into <TargetIcon /> lasting impact.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
