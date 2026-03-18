"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    heading: "Navigate",
    links: [
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Social",
    links: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "TikTok", href: "#" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "hello@6pointsolutions.com", href: "mailto:hello@6pointstrategies.com" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  const inView = useInView(footerRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: bigTextRef,
    offset: ["start end", "end end"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.6, 1]);
  const textScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[#1A1A1A]">
      {/* Top section — links */}
      <div className="relative z-10 px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Brand heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-16 sm:mb-20"
          >
            <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
              Ready to{" "}
              <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
                grow?
              </span>
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-[1.7] text-white/30">
              Strategy, branding, and performance marketing — all under one roof.
            </p>
          </motion.div>

          {/* Links grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8"
          >
            {footerLinks.map((col) => (
              <div key={col.heading}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/20">
                  {col.heading}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="group flex items-center gap-1.5 text-[0.85rem] text-white/35 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="mt-16 h-px w-full bg-white/[0.06]" />
        </div>
      </div>

      {/* Massive brand text — scroll reveal */}
      <div ref={bigTextRef} className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
        <motion.div
          style={{ y: textY, opacity: textOpacity, scale: textScale }}
          className="mx-auto w-full max-w-[1200px]"
        >
          <div className="select-none text-center text-[clamp(4rem,15vw,14rem)] font-black leading-[0.85] tracking-[-0.06em] text-white/[0.04]">
            6POINT
          </div>
        </motion.div>

        {/* Bottom bar — copyright */}
        <div className="mx-auto mt-10 flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[0.72rem] text-white/15">
            &copy; {new Date().getFullYear()} 6POINT Solutions. All rights reserved.
          </p>
          <a
            href="#"
            className="text-[0.72rem] text-white/15 transition-colors hover:text-white/30"
          >
            Back to top ↑
          </a>
        </div>
      </div>

      {/* Green glow at bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[800px]"
        style={{
          transform: "translateX(-50%) translateY(50%)",
          background: "radial-gradient(ellipse, rgba(93,139,104,0.15) 0%, transparent 70%)",
          animation: "footer-glow-pulse 4s ease-in-out infinite",
        }}
      />
    </footer>
  );
}
