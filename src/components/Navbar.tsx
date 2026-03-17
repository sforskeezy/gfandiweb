"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogIn, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ onBookCall }: { onBookCall?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5"
      >
        <nav
          className={`mx-auto flex w-full max-w-[1260px] items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 sm:px-7 sm:py-3.5 ${
            scrolled
              ? "bg-[#ECEAE7]/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] backdrop-blur-2xl"
              : "bg-[#ECEAE7]/40 backdrop-blur-lg"
          }`}
        >
          {/* Logo */}
          <a href="#" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7B8C6F]">
              <span className="text-[0.7rem] font-bold leading-none text-white">6P</span>
            </div>
            <span className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[#1A1A1A]">
              6POINT
            </span>
          </a>

          {/* Center links */}
          <div
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                className="relative px-5 py-2 text-[0.88rem] font-medium text-[#1A1A1A]/60 transition-colors duration-200 hover:text-[#1A1A1A]"
              >
                {hovered === link.label && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-xl bg-[#7B8C6F]/[0.07]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <a
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-[0.84rem] font-medium text-[#1A1A1A]/50 transition-colors duration-200 hover:text-[#1A1A1A]"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </a>
            <button
              onClick={onBookCall}
              className="group flex items-center gap-2 rounded-xl bg-[#7B8C6F] px-6 py-2.5 text-[0.84rem] font-medium text-white transition-all duration-300 hover:bg-[#6B7C5F] hover:shadow-[0_4px_20px_rgba(123,140,111,0.3)]"
            >
              Get in Touch
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 rounded-xl p-2.5 transition-colors hover:bg-black/5 lg:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5 text-[#1A1A1A]" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5 text-[#1A1A1A]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#ECEAE7] lg:hidden"
          >
            <div className="flex h-full flex-col justify-between px-8 pt-28 pb-12">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center justify-between border-b border-[#1A1A1A]/[0.06] py-5"
                  >
                    <span className="text-[1.8rem] font-medium tracking-[-0.02em] text-[#1A1A1A]">
                      {link.label}
                    </span>
                    <ArrowRight className="h-5 w-5 text-[#1A1A1A]/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#7B8C6F]" />
                  </motion.a>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-col gap-3"
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onBookCall?.();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7B8C6F] py-4 text-[0.95rem] font-medium text-white"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#1A1A1A]/10 py-4 text-[0.95rem] font-medium text-[#1A1A1A]/60"
                >
                  <LogIn className="h-4 w-4" />
                  Client Login
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
