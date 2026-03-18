"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const DESCRIPTION = "A full-service team of strategists, designers, and marketers engineering brand relevancy & category signals for both the internet and people";

function TypewriterText({ text, started }: { text: string; started: boolean }) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    setDisplayCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayCount(i);
      if (i >= text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!started) return null;

  return (
    <span>
      {text.slice(0, displayCount)}
      {displayCount < text.length && (
        <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-[#5D8B68]" />
      )}
    </span>
  );
}

export default function DiscoverySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute -bottom-28 left-1/4 h-[550px] w-[550px] rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle, #D2B48C, transparent 70%)" }} />
      <div className="pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-[1200px]">
        {/* Split layout: description left, big heading right */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          {/* Left — description with typewriter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-md text-[1.05rem] font-medium leading-[1.8] text-[#1A1A1A]/65 md:pb-2"
          >
            <TypewriterText text={DESCRIPTION} started={inView} />
          </motion.p>

          {/* Right — big heading with overlapping image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <h2 className="text-[clamp(2.4rem,6.5vw,5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#1A1A1A]">
              Driving Growth{" "}
              <span className="inline-flex items-baseline gap-3">
                &amp;
                {/* Overlapping rounded image */}
                <span className="relative -mb-1 inline-block h-[clamp(2.2rem,5.5vw,4.2rem)] w-[clamp(2.2rem,5.5vw,4.2rem)] shrink-0 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop&crop=faces"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
              </span>
              <br />
              <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
                Discovery
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-3 text-[0.82rem] font-medium tracking-[0.02em] text-[#1A1A1A]/30"
            >
              on every searchable platform
            </motion.p>
          </motion.div>
        </div>

        {/* CTA buttons — centered, liquid fill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#contact"
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03, boxShadow: "0 6px 28px rgba(93,139,104,0.35)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#5D8B68] px-7 py-3.5 text-[0.84rem] font-semibold text-white shadow-[0_4px_20px_rgba(93,139,104,0.2)]"
          >
            Our Story
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.a>
          <motion.a
            href="#services"
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-7 py-3.5 text-[0.84rem] font-medium text-[#1A1A1A]/55 transition-colors duration-300 hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
          >
            Our Services
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
