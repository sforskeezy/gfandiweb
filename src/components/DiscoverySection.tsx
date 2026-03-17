"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";

function LiquidButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#5D8B68]/25 px-7 py-3.5 text-[0.84rem] font-medium transition-all duration-500 hover:border-[#5D8B68]/40 hover:shadow-[0_4px_20px_rgba(93,139,104,0.15)]"
    >
      {/* Liquid fill container */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {/* The liquid body — rises on hover */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[#5D8B68]/[0.12] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-full group-hover:bg-[#5D8B68]">
          {/* Wave surface — the rotating oval that creates the wave illusion */}
          <div
            className="absolute -top-[2px] left-1/2 h-[20px] w-[300%] rounded-[45%] bg-[#ECEAE7] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#5D8B68]"
            style={{ animation: "liquid-wave 3s linear infinite" }}
          />
          {/* Secondary wave for depth */}
          <div
            className="absolute -top-[1px] left-1/2 h-[18px] w-[300%] rounded-[40%] bg-[#ECEAE7]/60 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#5D8B68]/80"
            style={{ animation: "liquid-wave 2.2s linear infinite reverse" }}
          />
        </div>
      </div>

      {/* Text content */}
      <span className="relative z-10 text-[#1A1A1A]/60 transition-colors duration-500 group-hover:text-white">
        {children}
      </span>
      <ArrowUpRight className="relative z-10 h-3.5 w-3.5 text-[#1A1A1A]/40 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
    </a>
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
          {/* Left — description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-sm text-[0.95rem] leading-[1.75] text-[#1A1A1A]/45 md:pb-2"
          >
            A full-service team of strategists, designers, and marketers
            engineering brand relevancy &amp; category signals for both the
            internet and people
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
          <LiquidButton href="#contact">Our Story</LiquidButton>
          <LiquidButton href="#services">Our Services</LiquidButton>
        </motion.div>
      </div>
    </section>
  );
}
