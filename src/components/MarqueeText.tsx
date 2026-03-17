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
    <section ref={ref} className="overflow-hidden py-16 sm:py-24">
      {/* Row 1 — scrolls left */}
      <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={`a-${i}`}
            className="mr-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-none tracking-[-0.04em] text-[#1A1A1A] sm:mr-10"
          >
            {phrase1}
            <span className="mx-4 text-[0.6em] text-[#1A1A1A]/15 sm:mx-6">✦</span>
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
            <span className="mx-4 not-italic text-[0.6em] text-[#1A1A1A]/10 sm:mx-6">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
