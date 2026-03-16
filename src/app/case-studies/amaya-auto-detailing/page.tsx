"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowLeft, ArrowUpRight, TrendingUp, Users, Sparkles, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const study = {
  name: "Amaya Auto Detailing",
  tagline: "From local shop to fully booked — in 90 days.",
  hero: "We helped Amaya Auto Detailing transform their digital presence and build a system that consistently fills their schedule with high-value customers.",
  challenge:
    "Amaya Auto Detailing had the skills and the reputation in their local area, but their online presence wasn't converting. Their old website was outdated, they had no ad strategy, and most new customers came from word-of-mouth alone. They needed a digital engine that could scale.",
  solution:
    "We designed and built a high-converting website that showcased their premium services, launched targeted Google and Meta ad campaigns to capture local intent, and implemented SEO strategies that put them on the map — literally. Within 90 days, their calendar was full.",
  stats: [
    { label: "Increase in Bookings", value: "340", suffix: "%", icon: TrendingUp },
    { label: "New Customers Monthly", value: "120", suffix: "+", icon: Users },
    { label: "Conversion Rate", value: "8.2", suffix: "%", icon: Sparkles },
  ],
  services: ["Website Design & Development", "Google Ads", "Meta Ads", "SEO", "Brand Identity"],
  testimonial: {
    quote: "6POINT completely changed our business. We went from slow weeks to being booked out. The website they built for us is exactly what we needed.",
    author: "Amaya",
    role: "Owner, Amaya Auto Detailing",
  },
  url: "https://amayaautodetailing.com",
};

function AnimatedStat({ value, suffix, label, icon: Icon, delay }: {
  value: string;
  suffix: string;
  label: string;
  icon: typeof TrendingUp;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Icon className="mb-4 h-5 w-5 text-[#9AAF8C]" />
      <div className="flex items-baseline gap-0.5">
        <span className="text-[clamp(3rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.04em] text-[#1A1A1A]">
          {value}
        </span>
        <span className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-semibold text-[#9AAF8C]">
          {suffix}
        </span>
      </div>
      <p className="mt-2 text-[0.82rem] font-medium tracking-wide text-[#A5A29D]">
        {label}
      </p>
    </motion.div>
  );
}

export default function AmayaCaseStudyPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-[15%] top-[10%] h-[500px] w-[500px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, rgba(154,175,140,0.3) 0%, transparent 65%)" }}
          />
          <div
            className="absolute bottom-[5%] right-[10%] h-[400px] w-[400px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(180,160,130,0.25) 0%, transparent 60%)" }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-[1100px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/case-studies"
              className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-4 py-2 text-[0.78rem] font-medium text-[#999] transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Case Studies
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#9AAF8C]"
          >
            Case Study
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[900px] text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#1A1A1A]"
          >
            {study.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 max-w-[600px] text-[clamp(1.1rem,2.2vw,1.35rem)] font-light leading-relaxed text-[#888]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <em>{study.tagline}</em>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href={study.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-[0.88rem] font-medium text-white transition-all hover:bg-[#333]"
            >
              Visit Live Site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#results"
              className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-7 py-3.5 text-[0.88rem] font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              See Results
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="results" className="relative border-y border-[#1A1A1A]/[0.06] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-16 sm:grid-cols-3 sm:px-8 sm:py-20">
          {study.stats.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={i * 0.12}
            />
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C5C2BC]">
              The Challenge
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-[#1A1A1A]">
              Great service, but invisible online
            </h2>
            <p className="mt-5 text-[0.95rem] leading-[1.75] text-[#888]">
              {study.challenge}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#9AAF8C]">
              Our Solution
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-[#1A1A1A]">
              A digital engine built to convert
            </h2>
            <p className="mt-5 text-[0.95rem] leading-[1.75] text-[#888]">
              {study.solution}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1A1A1A]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(154,175,140,0.2) 0%, transparent 60%)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative z-10 mx-auto max-w-[900px] px-5 py-20 sm:px-8 sm:py-28"
        >
          <Quote className="mb-6 h-10 w-10 text-[#9AAF8C]/40" />
          <blockquote
            className="text-[clamp(1.3rem,3vw,2rem)] font-light leading-[1.5] tracking-[-0.01em] text-white/90"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;{study.testimonial.quote}&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 max-w-[40px] bg-[#9AAF8C]/30" />
            <div>
              <p className="text-[0.88rem] font-semibold text-white/90">{study.testimonial.author}</p>
              <p className="text-[0.78rem] text-white/40">{study.testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C5C2BC]">
            What We Did
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-[#1A1A1A]">
            Services provided
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {study.services.map((service, i) => (
              <motion.span
                key={service}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="rounded-full border border-[#1A1A1A]/[0.08] bg-white px-6 py-3 text-[0.85rem] font-medium text-[#666] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
              >
                {service}
              </motion.span>
            ))}
          </div>
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
            Want results like this?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1rem] text-[#999]">
            Let&apos;s talk about how we can grow your business the same way.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="group flex items-center gap-2.5 rounded-full bg-[#1A1A1A] px-8 py-4 text-[0.92rem] font-medium text-white transition-all hover:bg-[#333]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/case-studies"
              className="rounded-full border border-[#1A1A1A]/10 px-8 py-4 text-[0.92rem] font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              All Case Studies
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
