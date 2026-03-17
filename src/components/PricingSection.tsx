"use client";

import { motion } from "motion/react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Basic",
    setup: 350,
    monthly: 75,
    description: "Everything you need to get online and start growing.",
    features: [
      "Modern Website",
      "Online Menu Integration",
      "Google Business Profile Setup",
      "SEO Optimization",
      "Logo & Graphic Design",
      "Social Media Launch (12 posts/mo)",
      "Customer Message Responses",
    ],
    accent: false,
  },
  {
    name: "Pro",
    setup: 450,
    monthly: 100,
    description: "Level up with ordering integrations and more content.",
    badge: "Most Popular",
    features: [
      "Everything in Basic",
      "Online Ordering Integration",
      "DoorDash, Uber Eats & More",
      "Weekly Google Business Posts",
      "15 Social Media Posts/mo",
    ],
    accent: true,
  },
  {
    name: "Elite",
    setup: 550,
    monthly: 150,
    description: "Full-service marketing with ads, outreach, and reporting.",
    features: [
      "Everything in Basic & Pro",
      "Paid Ads Management",
      "Facebook, Google & Instagram Ads",
      "Influencer Outreach",
      "Analytics Tracking",
      "Dedicated Social Media Manager",
      "Monthly Performance Reports",
      "Event Organization Support",
    ],
    accent: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      {/* Background glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14]" style={{ background: "radial-gradient(circle, #5D8B68, transparent 65%)" }} />
      <div className="pointer-events-none absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full opacity-[0.1]" style={{ background: "radial-gradient(circle, #96AAC8, transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p
            className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#1A1A1A]/30"
          >
            Pricing
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1A1A1A]">
            Simple,{" "}
            <span
              className="italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[0.92rem] leading-[1.7] text-[#1A1A1A]/40">
            One-time setup + a flat monthly fee. No contracts, no surprises.
          </p>
        </motion.div>

        <div className="mt-16 grid items-start gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative flex flex-col overflow-hidden rounded-[28px] p-8 transition-all duration-500 sm:p-9 ${
                plan.accent
                  ? "bg-[#1A1A1A] text-white lg:-mt-4 lg:mb-4"
                  : "bg-white/70 text-[#1A1A1A] ring-1 ring-[#1A1A1A]/[0.04] backdrop-blur-sm hover:ring-[#1A1A1A]/[0.08]"
              }`}
              style={
                plan.accent
                  ? {
                      boxShadow: "0 12px 50px rgba(0,0,0,0.2), 0 0 80px rgba(93,139,104,0.08)",
                    }
                  : {
                      boxShadow: "0 2px 20px rgba(0,0,0,0.03)",
                    }
              }
            >
              {/* Accent card inner glows */}
              {plan.accent && (
                <>
                  <div className="pointer-events-none absolute -top-20 -right-20 h-[250px] w-[250px] rounded-full opacity-25" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />
                  <div className="pointer-events-none absolute -bottom-16 -left-16 h-[200px] w-[200px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />
                  <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
                </>
              )}

              {/* Badge */}
              {plan.badge && (
                <div className="relative mb-6 flex">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5D8B68] px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="relative">
                <h3 className={`text-[1.3rem] font-semibold tracking-[-0.02em] ${plan.accent ? "text-white" : "text-[#1A1A1A]"}`}>
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-[0.84rem] leading-relaxed ${
                    plan.accent ? "text-white/50" : "text-[#1A1A1A]/40"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="relative mt-7 flex items-baseline gap-1.5">
                <span className={`text-[2.8rem] font-bold tracking-[-0.03em] leading-none ${plan.accent ? "text-white" : "text-[#1A1A1A]"}`}>
                  ${plan.monthly}
                </span>
                <span
                  className={`text-[0.85rem] font-medium ${
                    plan.accent ? "text-white/40" : "text-[#1A1A1A]/30"
                  }`}
                >
                  /mo
                </span>
              </div>
              <p
                className={`mt-1.5 text-[0.75rem] ${
                  plan.accent ? "text-white/30" : "text-[#1A1A1A]/25"
                }`}
              >
                + ${plan.setup} one-time setup
              </p>

              {/* Divider */}
              <div className={`my-7 h-px ${plan.accent ? "bg-white/[0.08]" : "bg-[#1A1A1A]/[0.06]"}`} />

              <div className="relative flex flex-col gap-3.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                      plan.accent ? "bg-[#5D8B68]/30" : "bg-[#5D8B68]/10"
                    }`}>
                      <Check
                        className={`h-3 w-3 ${
                          plan.accent ? "text-[#5D8B68]" : "text-[#5D8B68]"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[0.84rem] leading-snug ${
                        plan.accent ? "text-white/70" : "text-[#1A1A1A]/55"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative mt-auto pt-9">
                <a
                  href={`/apply?package=${plan.name.toLowerCase()}`}
                  className={`group/btn flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-[0.86rem] font-medium transition-all duration-300 ${
                    plan.accent
                      ? "bg-[#5D8B68] text-white hover:bg-[#4E7A58] hover:shadow-[0_0_30px_rgba(93,139,104,0.3)]"
                      : "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
                  }`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
