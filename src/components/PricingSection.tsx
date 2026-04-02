"use client";

import { motion } from "motion/react";
import { ArrowRight, Globe, TrendingUp, Palette, BarChart3, Megaphone, Users, CheckCircle2 } from "lucide-react";

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
    <section id="pricing" className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 bg-[#F4F1EC]">
      {/* Background accents */}
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#1A1A1A]/5 to-transparent" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.15] blur-[80px]" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-[1000px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white/50 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 backdrop-blur-md">
            Investment
          </div>
          <h2 className="mt-8 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#1A1A1A]">
            Built around{" "}
            <span className="italic text-[#888]" style={{ fontFamily: "var(--font-serif)" }}>
              your
            </span>{" "}
            goals
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1rem] leading-[1.7] text-[#1A1A1A]/60">
            No rigid tiers. No paying for things you don't need. We audit your business and construct a growth plan tailored specifically to you.
          </p>
        </motion.div>

        {/* Premium Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-[850px] overflow-hidden rounded-[40px] bg-white p-8 sm:p-12"
          style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)" }}
        >
          {/* Card inner decorative gradient */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#7B8C6F]/20 to-transparent blur-[60px]" />
          
          <div className="relative flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            {/* Left Col */}
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full bg-[#FAFAF9] px-3.5 py-1.5 border border-[#E8E6E3]">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]/80">
                  Custom Strategy
                </span>
              </div>

              <h3 className="mt-6 text-[2.2rem] font-bold tracking-[-0.03em] text-[#1A1A1A] leading-[1.1]">
                Request a Free Proposal
              </h3>
              
              <ul className="mt-8 space-y-4">
                {[
                  "Complete brand & digital audit",
                  "Customized milestone roadmap",
                  "Transparent pricing outline",
                  "No commitment until you're ready"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 text-[0.95rem] font-medium text-[#1A1A1A]/70"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7B8C6F]/10 text-[#7B8C6F]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-12">
                <a
                  href="/apply"
                  className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-[20px] bg-[#1A1A1A] px-8 py-5 text-[0.95rem] font-semibold text-white transition-all hover:bg-[#333] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Build My Quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </div>
            </div>

            {/* Right Col: Services Grid */}
            <div className="w-full md:w-[320px] shrink-0 rounded-[28px] bg-[#FAFAF9] p-8 border border-[#E8E6E3]">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]/40 mb-6">
                Available Capabilities
              </p>
              <div className="grid grid-cols-1 gap-1">
                {services.map((svc, i) => {
                  const Icon = svc.icon;
                  return (
                    <motion.div
                      key={svc.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                      className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white border border-[#E8E6E3] text-[#1A1A1A]/50 transition-colors group-hover:border-[#7B8C6F]/30 group-hover:text-[#7B8C6F] group-hover:bg-[#7B8C6F]/5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[0.88rem] font-semibold text-[#1A1A1A]/80 transition-colors group-hover:text-[#1A1A1A]">
                        {svc.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
