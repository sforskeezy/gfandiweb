"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const DESCRIPTION = "A full-service team of strategists, designers, and marketers engineering brand relevancy & category signals for both the internet and people";

function ScrollText({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 85%", "end 60%"],
  });

  const words = text.split(" ");
  
  return (
    <p 
      ref={container}
      className="max-w-md text-[1.1rem] sm:text-[1.2rem] font-semibold leading-[1.7] md:pb-2 flex flex-wrap gap-x-1.5 gap-y-1"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        
        return (
          <ScrollWord key={i} word={word} progress={scrollYProgress} range={[start, end]} />
        );
      })}
    </p>
  );
}

function ScrollWord({ word, progress, range }: { word: string, progress: any, range: [number, number] }) {
  const characters = word.split("");
  const amount = range[1] - range[0];
  const step = amount / word.length;
  
  return (
    <span className="relative inline-block">
      {characters.map((char, i) => {
        const charStart = range[0] + (step * i);
        const charEnd = range[0] + (step * (i + 1));
        return (
          <ScrollChar key={i} char={char} progress={progress} range={[charStart, charEnd]} />
        );
      })}
    </span>
  );
}

function ScrollChar({ char, progress, range }: { char: string, progress: any, range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const color = useTransform(progress, range, ["rgba(26,26,26,0.15)", "rgba(26,26,26,1)"]);
  
  return (
    <motion.span style={{ color }}>{char}</motion.span>
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
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
          {/* Left — description with Scroll effect */}
          <div className="relative w-full md:w-[45%] lg:w-[40%]">
            <ScrollText text={DESCRIPTION} />
          </div>

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

        {/* CTA buttons — centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
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
            href="/apply"
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-7 py-3.5 text-[0.84rem] font-medium text-[#1A1A1A]/55 transition-colors duration-300 hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
          >
            Get a Quote
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
