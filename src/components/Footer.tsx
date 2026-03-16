"use client";

import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    heading: "Navigate",
    links: [
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
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden px-4 pt-20 pb-10 sm:px-6 sm:pt-28 sm:pb-12"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      {/* Soft pastel yellow glow from bottom */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Wide soft wash */}
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            width: "200%",
            height: "100%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse 65% 70% at 50% 100%, rgba(253,240,180,0.55) 0%, rgba(254,249,220,0.35) 30%, rgba(255,253,240,0.15) 55%, transparent 80%)",
          }}
        />
        {/* Warmer center accent */}
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            width: "120%",
            height: "60%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(253,230,160,0.4) 0%, rgba(254,243,200,0.2) 40%, transparent 70%)",
          }}
        />
        {/* Very soft peach tint on edges */}
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            width: "180%",
            height: "80%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,235,200,0.12) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        {/* Brand heading */}
        <div className="mb-16 sm:mb-20">
          <h2
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            style={{ color: "#1A1A1A" }}
          >
            6POINT{" "}
            <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
              Strategies
            </span>
          </h2>
          <p
            className="mt-4 max-w-md text-[0.95rem] leading-[1.7]"
            style={{ color: "rgba(26,26,26,0.35)" }}
          >
            Strategy, branding, and performance marketing — all under one roof.
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8">
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p
                className="text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "rgba(26,26,26,0.22)" }}
              >
                {col.heading}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-1.5 text-[0.85rem] transition-colors duration-150 hover:text-[#1A1A1A]"
                    style={{ color: "rgba(26,26,26,0.4)" }}
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <p
              className="text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "rgba(26,26,26,0.22)" }}
            >
              Contact
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="mailto:hello@6pointstrategies.com"
                className="text-[0.85rem] transition-colors duration-150 hover:text-[#1A1A1A]"
                style={{ color: "rgba(26,26,26,0.4)" }}
              >
                hello@6pointstrategies.com
              </a>
            </div>
          </div>

          {/* Legal column */}
          <div>
            <p
              className="text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "rgba(26,26,26,0.22)" }}
            >
              Legal
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="#"
                className="text-[0.85rem] transition-colors duration-150 hover:text-[#1A1A1A]"
                style={{ color: "rgba(26,26,26,0.4)" }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[0.85rem] transition-colors duration-150 hover:text-[#1A1A1A]"
                style={{ color: "rgba(26,26,26,0.4)" }}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row"
          style={{ borderTop: "1px solid rgba(26,26,26,0.06)" }}
        >
          <p className="text-[0.72rem]" style={{ color: "rgba(26,26,26,0.2)" }}>
            &copy; {new Date().getFullYear()} 6POINT Strategies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
