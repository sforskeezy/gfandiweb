"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Our Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
      >
        <nav
          className={`flex w-full max-w-[1100px] items-center justify-between rounded-full border-b px-5 py-3.5 transition-all duration-500 sm:px-8 sm:py-4 ${
            scrolled
              ? "border-[#1A1A1A]/[0.06] bg-[#f0ede8]/80 shadow-[0_2px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] backdrop-blur-xl"
              : "border-[#1A1A1A]/[0.06] bg-[#f0ede8]/50 backdrop-blur-md"
          }`}
        >
          <a href="#" className="pl-2">
            <span className="text-2xl font-semibold tracking-[-0.03em] text-[#1A1A1A] sm:text-[1.7rem]">
              Skyline
            </span>
          </a>

          <div
            className="hidden items-center gap-2 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                className="relative rounded-full px-6 py-2.5 text-[0.95rem] text-[#1A1A1A]/80 transition-colors duration-150 hover:text-[#1A1A1A]"
              >
                {hovered === link.label && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[#1A1A1A]/[0.05]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden rounded-full bg-[#1A1A1A] px-7 py-3 text-[0.9rem] font-medium text-white transition-colors duration-200 hover:bg-[#333] md:block"
          >
            Book a Call
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-3 transition-colors hover:bg-black/5 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-[#1A1A1A]" />
            ) : (
              <Menu className="h-6 w-6 text-[#1A1A1A]" />
            )}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-white/95 backdrop-blur-2xl md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="text-2xl font-light text-[#1A1A1A]"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.25 }}
              className="mt-4 rounded-full bg-[#1A1A1A] px-8 py-3.5 text-sm font-medium text-white"
            >
              Book a Call
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
