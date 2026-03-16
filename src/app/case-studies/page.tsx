"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, ArrowUpRight, TrendingUp, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const caseStudies = [
  {
    slug: "amaya-auto-detailing",
    name: "Amaya Auto Detailing",
    tagline: "From local shop to fully booked — in 90 days.",
    description:
      "We built a high-converting website, launched targeted ad campaigns, and turned their online presence into a booking machine.",
    heroStat: { value: "340%", label: "More Bookings" },
    services: ["Web Design", "Google Ads", "Meta Ads", "SEO"],
    url: "https://amayaautodetailing.com",
    gradient: "linear-gradient(135deg, #1A1A1A 0%, #2D3A2E 100%)",
    accent: "#9AAF8C",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-8 pt-32 sm:px-6 sm:pb-12 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-[10%] top-[20%] h-[450px] w-[450px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, rgba(154,175,140,0.25) 0%, transparent 65%)" }}
          />
          <div
            className="absolute bottom-[10%] right-[15%] h-[350px] w-[350px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(180,160,130,0.2) 0%, transparent 60%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1100px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-4 py-2 text-[0.78rem] font-medium text-[#999] transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#9AAF8C]"
          >
            Case Studies
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[700px] text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-[-0.04em] text-[#1A1A1A]"
          >
            Real results for{" "}
            <span style={{ fontFamily: "var(--font-serif)" }} className="italic text-[#888]">
              real businesses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-5 max-w-[480px] text-[1.05rem] leading-relaxed text-[#999]"
          >
            See how we help businesses grow with strategy, design, and performance marketing.
          </motion.p>
        </div>
      </section>

      {/* Case Study Cards */}
      <section className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-16">
        <div className="space-y-8">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <Link href={`/case-studies/${study.slug}`} className="group block">
                <div
                  className="relative overflow-hidden rounded-[28px] transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                  style={{ background: study.gradient }}
                >
                  {/* Ambient glow */}
                  <div
                    className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full opacity-20"
                    style={{ background: `radial-gradient(circle, ${study.accent} 0%, transparent 60%)` }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full opacity-10"
                    style={{ background: `radial-gradient(circle, ${study.accent} 0%, transparent 60%)` }}
                  />

                  <div className="relative z-10 flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:gap-12 lg:p-14">
                    {/* Left — Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-5 flex flex-wrap gap-2">
                        {study.services.map((s) => (
                          <span
                            key={s}
                            className="rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.06em]"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
                        {study.name}
                      </h2>

                      <p
                        className="mt-3 text-[clamp(1rem,2vw,1.2rem)] font-light leading-relaxed text-white/50"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        <em>{study.tagline}</em>
                      </p>

                      <p className="mt-5 max-w-[480px] text-[0.88rem] leading-[1.7] text-white/40">
                        {study.description}
                      </p>

                      <div className="mt-8 inline-flex items-center gap-2 text-[0.88rem] font-semibold text-white/70 transition-colors group-hover:text-white">
                        Read Case Study
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Right — Big stat */}
                    <div className="shrink-0 lg:text-right">
                      <div
                        className="text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none tracking-[-0.05em]"
                        style={{ color: study.accent }}
                      >
                        {study.heroStat.value}
                      </div>
                      <p className="mt-2 text-[0.82rem] font-medium tracking-wide text-white/40">
                        {study.heroStat.label}
                      </p>
                    </div>
                  </div>

                  {/* Bottom bar — site link */}
                  <div
                    className="relative z-10 flex items-center justify-between border-t px-8 py-4 sm:px-12"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <span className="text-[0.75rem] font-medium text-white/25">
                      {study.url.replace("https://", "")}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-[0.72rem] font-semibold transition-colors group-hover:text-white"
                      style={{ color: study.accent }}
                    >
                      Visit Site
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* More coming */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-[0.85rem] text-[#C5C2BC]">
            More case studies coming soon.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1A1A1A]/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-8 sm:py-28"
        >
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.04em] text-[#1A1A1A]">
            Want to be next?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1rem] text-[#999]">
            Let&apos;s talk about how we can grow your business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="group flex items-center gap-2.5 rounded-full bg-[#1A1A1A] px-8 py-4 text-[0.92rem] font-medium text-white transition-all hover:bg-[#333]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
