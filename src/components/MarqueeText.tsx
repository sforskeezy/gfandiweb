"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function MarqueeText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  const phrase1 = "Building Brands That Sell";
  const phrase2 = "Strategy · Design · Growth";

  return (
    <section ref={ref} className="relative overflow-hidden py-16 sm:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #E8A782, transparent 70%)" }} />

      {/* Row 1 — scrolls left */}
      <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={`a-${i}`}
            className="mr-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-none tracking-[-0.04em] text-[#1A1A1A] sm:mr-10"
          >
            {phrase1}
            <span
              className="mx-4 inline-block text-[0.6em] text-[#5D8B68] sm:mx-6"
              style={{ animation: `diamond-glow 2.5s ease-in-out infinite ${i * 0.6}s` }}
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>

      {/* Row 2 — scrolls right, italic serif */}
      <motion.div style={{ x: x2 }} className="mt-2 flex whitespace-nowrap sm:mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={`b-${i}`}
            className="mr-6 text-[clamp(3rem,8vw,7rem)] italic leading-none tracking-[-0.04em] text-[#1A1A1A]/10 sm:mr-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {phrase2}
            <span
              className="mx-4 inline-block not-italic text-[0.6em] text-[#5D8B68] sm:mx-6"
              style={{ animation: `diamond-glow 3s ease-in-out infinite ${i * 0.8 + 0.3}s` }}
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
