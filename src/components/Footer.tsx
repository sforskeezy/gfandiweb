"use client";

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
];

export default function Footer() {
  return (
    <footer className="border-t border-[#F0EDE8] px-4 pt-14 pb-8 sm:px-6 sm:pt-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-10 sm:grid-cols-[1fr,auto,auto]">
          {/* Brand column */}
          <div>
            <span className="text-xl font-semibold tracking-[-0.03em] text-[#1A1A1A]">
              Skyline
            </span>
            <p className="mt-3 max-w-xs text-[0.82rem] leading-relaxed text-[#AAA]">
              Marketing that actually grows your business. Strategy, branding, and performance — all under one roof.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#CCC]">
                {col.heading}
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-1 text-[0.82rem] text-[#888] transition-colors duration-150 hover:text-[#1A1A1A]"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#F5F3F0] pt-6 sm:flex-row">
          <p className="text-[0.72rem] text-[#CCC]">
            &copy; {new Date().getFullYear()} Skyline Marketing. All rights reserved.
          </p>
          <a
            href="#"
            className="text-[0.72rem] text-[#CCC] transition-colors duration-150 hover:text-[#999]"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
