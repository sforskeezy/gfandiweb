"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogIn, ArrowRight, ArrowUpRight } from "lucide-react";

type DropdownId = "services" | "pricing" | "contact" | null;

const navLinks = [
  { label: "Services", href: "#services", dropdown: "services" as const },
  { label: "Pricing", href: "#pricing", dropdown: "pricing" as const },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact", dropdown: "contact" as const },
];

const serviceItems = [
  { title: "Web Design & Development", href: "#contact" },
  { title: "Brand Strategy", href: "#contact" },
  { title: "Performance Marketing", href: "#contact" },
  { title: "Content & Social", href: "#contact" },
  { title: "SEO & Growth", href: "#contact" },
  { title: "Analytics & Reporting", href: "#contact" },
];

const pricingItems = [
  { title: "Basic", desc: "Get online & start growing", href: "#pricing" },
  { title: "Pro", desc: "Full marketing engine", href: "#pricing" },
  { title: "Enterprise", desc: "Custom solution for scale", href: "#pricing" },
];

export default function Navbar({ onBookCall }: { onBookCall?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  useEffect(() => {
    if (activeDropdown) {
      const handleScroll = () => closeDropdown();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [activeDropdown, closeDropdown]);

  const leftServices = serviceItems.filter((_, i) => i % 2 === 0);
  const rightServices = serviceItems.filter((_, i) => i % 2 === 1);

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
          <div
            className="pointer-events-none absolute -bottom-px left-1/2 h-[1px] w-3/4 -translate-x-1/2 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(93,139,104,0.6), transparent)",
              opacity: scrolled ? 1 : 0.3,
            }}
          />

          {/* Logo */}
          <a href="#" className="group flex items-center gap-3">
            <img
              src="/d2b8263f-f484-4783-8fd0-daf49e85220b.png"
              alt="6POINT"
              className="h-7 w-7 brightness-0 invert sm:h-8 sm:w-8"
            />
            <span className="text-[1.1rem] font-semibold tracking-[-0.04em] text-white sm:text-[1.2rem]">
              6POINT
            </span>
          </a>

          {/* Center links */}
          <div className="hidden items-center lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.dropdown ? undefined : link.href}
                onClick={(e) => {
                  if (link.dropdown) {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === link.dropdown ? null : link.dropdown);
                  }
                }}
                onMouseEnter={() => {
                  setHovered(link.label);
                  if (link.dropdown) {
                    setActiveDropdown(link.dropdown);
                  } else {
                    setActiveDropdown(null);
                  }
                }}
                onMouseLeave={() => setHovered(null)}
                className="relative cursor-pointer px-4 py-2 text-[0.84rem] font-medium text-white/45 transition-colors duration-200 hover:text-white"
              >
                {hovered === link.label && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-lg bg-white/[0.08]"
                    transition={{ type: "spring", bounce: 0.12, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  {link.label}
                  {link.dropdown && (
                    <motion.span
                      animate={{ rotate: activeDropdown === link.dropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[0.55rem] opacity-50"
                    >
                      ▼
                    </motion.span>
                  )}
                </span>
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

      {/* Mega dropdowns */}
      <AnimatePresence>
        {activeDropdown && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={closeDropdown}
            />

            <motion.div
              key={activeDropdown}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 right-0 top-[88px] z-45 flex justify-center px-6 sm:px-10"
              onMouseLeave={closeDropdown}
            >
              <div className="w-full max-w-[920px] overflow-hidden rounded-2xl bg-[#FAFAF8] shadow-[0_24px_80px_rgba(0,0,0,0.25)]">

                {/* Services dropdown */}
                {activeDropdown === "services" && (
                  <div className="flex">
                    <div className="flex-1 px-10 py-10">
                      <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/30">
                        Core Services
                      </p>
                      <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                        <div className="space-y-1">
                          {leftServices.map((item) => (
                            <a
                              key={item.title}
                              href={item.href}
                              onClick={closeDropdown}
                              className="group block rounded-xl px-4 py-3 transition-all hover:bg-[#1A1A1A]/[0.04]"
                            >
                              <span className="text-[0.92rem] font-semibold tracking-[-0.01em] text-[#1A1A1A]/70 transition-colors group-hover:text-[#1A1A1A]">
                                {item.title}
                              </span>
                            </a>
                          ))}
                        </div>
                        <div className="space-y-1">
                          {rightServices.map((item) => (
                            <a
                              key={item.title}
                              href={item.href}
                              onClick={closeDropdown}
                              className="group block rounded-xl px-4 py-3 transition-all hover:bg-[#1A1A1A]/[0.04]"
                            >
                              <span className="text-[0.92rem] font-semibold tracking-[-0.01em] text-[#1A1A1A]/70 transition-colors group-hover:text-[#1A1A1A]">
                                {item.title}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 border-t border-[#1A1A1A]/[0.06] pt-5">
                        <a
                          href="#services"
                          onClick={closeDropdown}
                          className="group inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-5 py-2.5 text-[0.8rem] font-medium text-[#1A1A1A]/50 transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
                        >
                          View All Services
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>

                    {/* Image — rounded square, not touching edges */}
                    <div className="hidden shrink-0 items-center pr-10 xl:flex">
                      <div className="h-[220px] w-[220px] overflow-hidden rounded-2xl">
                        <img
                          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=500&fit=crop"
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing dropdown */}
                {activeDropdown === "pricing" && (
                  <div className="px-10 py-10">
                    <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/30">
                      Plans
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {pricingItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={closeDropdown}
                          className="group rounded-xl border border-[#1A1A1A]/[0.04] px-5 py-5 transition-all hover:border-[#1A1A1A]/[0.08] hover:bg-[#1A1A1A]/[0.02]"
                        >
                          <p className="text-[1rem] font-bold tracking-[-0.02em] text-[#1A1A1A]/80 group-hover:text-[#1A1A1A]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[0.78rem] text-[#1A1A1A]/35">
                            {item.desc}
                          </p>
                        </a>
                      ))}
                    </div>
                    <div className="mt-6 border-t border-[#1A1A1A]/[0.06] pt-5">
                      <a
                        href="#pricing"
                        onClick={closeDropdown}
                        className="group inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-5 py-2.5 text-[0.8rem] font-medium text-[#1A1A1A]/50 transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
                      >
                        Compare Plans
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Contact dropdown */}
                {activeDropdown === "contact" && (
                  <div className="px-10 py-10">
                    <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/30">
                      Get In Touch
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <a
                        href="mailto:hello@6pointsolutions.com"
                        onClick={closeDropdown}
                        className="group rounded-xl border border-[#1A1A1A]/[0.04] px-5 py-5 transition-all hover:border-[#1A1A1A]/[0.08] hover:bg-[#1A1A1A]/[0.02]"
                      >
                        <p className="text-[0.92rem] font-semibold text-[#1A1A1A]/80 group-hover:text-[#1A1A1A]">Email Us</p>
                        <p className="mt-1 text-[0.78rem] text-[#1A1A1A]/35">hello@6pointsolutions.com</p>
                      </a>
                      <button
                        onClick={() => { closeDropdown(); onBookCall?.(); }}
                        className="group rounded-xl border border-[#5D8B68]/20 bg-[#5D8B68]/[0.04] px-5 py-5 text-left transition-all hover:border-[#5D8B68]/30 hover:bg-[#5D8B68]/[0.08]"
                      >
                        <p className="text-[0.92rem] font-semibold text-[#5D8B68]">Book a Call</p>
                        <p className="mt-1 text-[0.78rem] text-[#1A1A1A]/35">Free strategy session</p>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                  onClick={() => { setMobileOpen(false); onBookCall?.(); }}
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
