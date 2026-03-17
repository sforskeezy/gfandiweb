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
        className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          className={`relative mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-2.5 transition-all duration-500 sm:px-6 sm:py-3 ${
            scrolled
              ? "rounded-2xl bg-[#1A1A1A]/[0.9] shadow-[0_8px_40px_rgba(0,0,0,0.15)] ring-1 ring-white/[0.06] backdrop-blur-2xl"
              : "rounded-2xl bg-[#1A1A1A]/[0.65] backdrop-blur-xl"
          }`}
        >
          {/* Green accent line */}
          <div
            className="pointer-events-none absolute -bottom-px left-1/2 h-[1px] w-3/4 -translate-x-1/2 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(93,139,104,0.6), transparent)",
              opacity: scrolled ? 1 : 0.3,
            }}
          />

          {/* Logo — spinning asterisk + wordmark */}
          <a href="#" className="group flex items-center gap-3">
            <img
              src="/d2b8263f-f484-4783-8fd0-daf49e85220b.png"
              alt="6POINT"
              className="h-7 w-7 brightness-0 invert sm:h-8 sm:w-8"
              style={{ animation: "logo-spin 5s cubic-bezier(0.3, 0, 0.1, 1) infinite" }}
            />
            <span className="text-[1.1rem] font-semibold tracking-[-0.04em] text-white sm:text-[1.2rem]">
              6POINT
            </span>
          </a>

          {/* Center links */}
          <div
            className="hidden items-center lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                className="relative px-4 py-2 text-[0.84rem] font-medium text-white/45 transition-colors duration-200 hover:text-white"
              >
                {hovered === link.label && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-lg bg-white/[0.08]"
                    transition={{ type: "spring", bounce: 0.12, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="/login"
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.82rem] font-medium text-white/35 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/70"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </a>
            <button
              onClick={onBookCall}
              className="group flex items-center gap-2 rounded-lg bg-[#5D8B68] px-5 py-2 text-[0.82rem] font-medium text-white transition-all duration-300 hover:bg-[#4E7A58] hover:shadow-[0_0_24px_rgba(93,139,104,0.45)]"
            >
              Get in Touch
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 rounded-lg p-2 transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5 text-white" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5 text-white" />
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
            className="fixed inset-0 z-40 bg-[#1A1A1A] lg:hidden"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />

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
                    className="group flex items-center justify-between border-b border-white/[0.06] py-5"
                  >
                    <span className="text-[1.8rem] font-medium tracking-[-0.02em] text-white">
                      {link.label}
                    </span>
                    <ArrowRight className="h-5 w-5 text-white/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#5D8B68]" />
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
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5D8B68] py-4 text-[0.95rem] font-medium text-white"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 py-4 text-[0.95rem] font-medium text-white/60"
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
