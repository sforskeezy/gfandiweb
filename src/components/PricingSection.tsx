"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles, Globe, TrendingUp, Palette, BarChart3, Megaphone, Users } from "lucide-react";

const services = [
  { icon: Globe, label: "Web Design" },
  { icon: TrendingUp, label: "SEO" },
  { icon: Palette, label: "Branding" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Megaphone, label: "Ads" },
  { icon: Users, label: "Social Media" },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      {/* Background glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle, #5D8B68, transparent 65%)" }} />

      <div className="relative mx-auto w-full max-w-[900px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#1A1A1A]/30">
            Pricing
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1A1A1A]">
            Tailored to{" "}
            <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
              your
            </span>{" "}
            business
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[0.92rem] leading-[1.7] text-[#1A1A1A]/40">
            Every business is unique. We build custom packages based on your goals — no cookie-cutter plans.
          </p>
        </motion.div>

        {/* GET QUOTE Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mx-auto mt-16 max-w-[680px] overflow-hidden rounded-[32px] bg-[#1A1A1A] text-white"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 100px rgba(93,139,104,0.08)" }}
        >
          {/* Inner glows */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-[280px] w-[280px] rounded-full opacity-25" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[220px] w-[220px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

          <div className="relative px-8 pt-10 pb-10 sm:px-12 sm:pt-14 sm:pb-12">
            {/* Badge */}
            <div className="mb-8 flex">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5D8B68] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white">
                <Sparkles className="h-3 w-3" />
                Custom Package
              </span>
            </div>

            {/* Title + description */}
            <h3 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.1]">
              Get a Free Quote
            </h3>
            <p className="mt-4 max-w-md text-[0.95rem] leading-[1.7] text-white/45">
              Tell us about your business and goals. We&apos;ll craft a custom proposal with transparent pricing — no obligations, no surprises.
            </p>

            {/* Divider */}
            <div className="my-8 h-px bg-white/[0.08]" />

            {/* Service tags */}
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/25">
              Services we offer
            </p>
            <div className="flex flex-wrap gap-2.5">
              {services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div
                    key={svc.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2.5 text-[0.8rem] font-medium text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white/80"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {svc.label}
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <a
                href="/apply"
                className="group/btn flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#5D8B68] py-4.5 text-[0.92rem] font-semibold text-white transition-all duration-300 hover:bg-[#4E7A58] hover:shadow-[0_0_40px_rgba(93,139,104,0.35)]"
              >
                Get Your Free Quote
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
            </div>

            {/* Trust line */}
            <p className="mt-5 text-center text-[0.75rem] text-white/20">
              No contracts · No hidden fees · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
