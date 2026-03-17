"use client";

import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";

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
    <section id="pricing" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p
            className="text-[0.78rem] tracking-[0.08em] text-[#AAAAAA]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Pricing
          </p>
          <h2 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1A1A1A]">
            Simple,{" "}
            <span
              className="italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[0.9rem] leading-[1.7] text-[#999]">
            One-time setup + a flat monthly fee. No contracts, no surprises.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col rounded-[24px] p-8 ${
                plan.accent
                  ? "bg-[#7B8C6F] text-white"
                  : "bg-[#F2EFE9] text-[#1A1A1A]"
              }`}
              style={
                plan.accent
                  ? {
                      border: "1.5px solid rgba(255,255,255,0.15)",
                      boxShadow:
                        "0 0 30px rgba(123,140,111,0.2), 0 0 60px rgba(123,140,111,0.08)",
                    }
                  : undefined
              }
            >
              {plan.badge && (
                <span className="absolute -top-3 left-8 rounded-full bg-white px-4 py-1 text-[0.7rem] font-semibold text-[#7B8C6F] shadow-sm">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-[0.82rem] leading-relaxed ${
                    plan.accent ? "text-white/70" : "text-[#999]"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  ${plan.monthly}
                </span>
                <span
                  className={`text-sm ${
                    plan.accent ? "text-white/60" : "text-[#AAA]"
                  }`}
                >
                  /mo
                </span>
              </div>
              <p
                className={`mt-1 text-[0.75rem] ${
                  plan.accent ? "text-white/50" : "text-[#BBB]"
                }`}
              >
                + ${plan.setup} one-time setup
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.accent ? "text-white/60" : "text-[#7B8C6F]"
                      }`}
                    />
                    <span
                      className={`text-[0.82rem] leading-snug ${
                        plan.accent ? "text-white/80" : "text-[#666]"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <a
                  href={`/apply?package=${plan.name.toLowerCase()}`}
                  className={`group flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.84rem] font-medium transition-all duration-200 ${
                    plan.accent
                      ? "bg-white text-[#1A1A1A] hover:bg-white/90"
                      : "bg-[#1A1A1A] text-white hover:bg-[#333]"
                  }`}
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
