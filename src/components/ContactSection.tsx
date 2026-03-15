"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section id="contact" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <motion.div
          ref={ref}
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] px-8 py-16 sm:px-14 sm:py-24 lg:px-20"
        >
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full" style={{ background: "#7B8C6F", filter: "blur(120px)", opacity: 0.15 }} />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-[350px] w-[350px] rounded-full" style={{ background: "#E8A782", filter: "blur(100px)", opacity: 0.1 }} />

          {/* Noise texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
            <motion.p
              initial={false}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-[0.75rem] tracking-[0.1em] text-white/30"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Let&apos;s talk
            </motion.p>

            <motion.h2
              initial={false}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white"
            >
              Ready to build something{" "}
              <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
                real?
              </span>
            </motion.h2>

            <motion.p
              initial={false}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-5 max-w-md text-[0.92rem] leading-[1.7] text-white/40"
            >
              Book a free strategy call. We&apos;ll learn about your business, audit what you have, and map out a growth plan — no strings attached.
            </motion.p>

            <motion.div
              initial={false}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[0.88rem] font-medium text-[#1A1A1A] transition-all duration-200 hover:bg-white/90"
              >
                Book a Free Call
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="mailto:hello@skylinemarketing.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-[0.88rem] font-medium text-white/70 transition-all duration-200 hover:border-white/25 hover:text-white"
              >
                hello@skylinemarketing.com
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
