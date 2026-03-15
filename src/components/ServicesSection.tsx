"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { Palette, Globe, BarChart3, MessageCircle } from "lucide-react";

const services = [
  {
    title: "Brand Strategy",
    tagline: "Define who you are",
    description:
      "We craft the identity, voice, and positioning that make people remember you. From logo to language — every detail is intentional.",
    features: ["Brand Identity & Logo", "Positioning & Messaging", "Visual Systems"],
    icon: Palette,
    image: "1618005182384-a83a8bd57fbe",
    bg: "#7B8C6F",
  },
  {
    title: "Web Design",
    tagline: "Convert visitors into customers",
    description:
      "Custom-built websites designed around your goals. No templates, no shortcuts — just pages that actually move the needle.",
    features: ["Custom Development", "UX & Conversion", "Next.js & Webflow"],
    icon: Globe,
    image: "1460925895917-afdab827c52f",
    bg: "#5C7A8A",
  },
  {
    title: "Performance Marketing",
    tagline: "Spend smarter, grow faster",
    description:
      "Paid campaigns across Meta, Google, and Instagram built to return. We handle strategy, creative, targeting, and optimization.",
    features: ["Paid Social & Search", "Analytics & Attribution", "Full-Funnel Strategy"],
    icon: BarChart3,
    image: "1551288049-bebda4e38f71",
    bg: "#8B7355",
  },
  {
    title: "Content & Social",
    tagline: "Show up where it matters",
    description:
      "Content strategy, creation, and management across every platform. We make your brand impossible to ignore.",
    features: ["Content Calendar", "Social Management", "Email & SMS"],
    icon: MessageCircle,
    image: "1611162617213-7d7a39e9b1d7",
    bg: "#6B7F6B",
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-15%" });
  const Icon = service.icon;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <motion.div
      ref={cardRef}
      className="sticky overflow-hidden rounded-[28px]"
      style={{
        top: `${80 + index * 20}px`,
        backgroundColor: service.bg,
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Large background number */}
      <div className="pointer-events-none absolute -right-2 -bottom-4 z-0 select-none text-[clamp(8rem,18vw,14rem)] font-bold leading-none text-white/[0.04]">
        0{index + 1}
      </div>

      <div className="relative z-10 grid min-h-[420px] gap-0 sm:min-h-[480px] lg:grid-cols-2">
        {/* Text content */}
        <div className="flex flex-col justify-center px-7 py-10 sm:px-10 sm:py-14 lg:px-14">
          <motion.div
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-5 w-5 text-white/70" />
              </div>
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.15em] text-white/40">
                0{index + 1} — {service.tagline}
              </span>
            </div>
          </motion.div>

          <motion.h3
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white"
          >
            {service.title}
          </motion.h3>

          <motion.p
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 max-w-md text-[0.9rem] leading-[1.7] text-white/60"
          >
            {service.description}
          </motion.p>

          <motion.div
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {service.features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[0.76rem] font-medium text-white/70"
              >
                {f}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[0.82rem] font-medium text-[#1A1A1A] transition-all duration-200 hover:bg-white/90"
            >
              Get Started →
            </a>
          </motion.div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.div className="h-full w-full" style={{ scale: imgScale }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://images.unsplash.com/photo-${service.image}?auto=format&fit=crop&w=900&q=80`}
              alt={service.title}
              className="h-full min-h-[220px] w-full object-cover sm:min-h-[280px] lg:min-h-full"
            />
          </motion.div>
          {/* Gradient overlay that blends image into the card color */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${service.bg} 0%, transparent 40%), linear-gradient(to right, ${service.bg} 0%, transparent 25%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });

  return (
    <section id="services" className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div ref={headerRef} className="mb-12 text-center sm:mb-16">
          <motion.p
            initial={false}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5 }}
            className="text-[0.78rem] tracking-[0.08em] text-[#AAAAAA]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            What we do
          </motion.p>
          <motion.h2
            initial={false}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1A1A1A]"
          >
            Services built to{" "}
            <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
              scale
            </span>
          </motion.h2>
          <motion.p
            initial={false}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-md text-[0.9rem] leading-[1.7] text-[#999]"
          >
            Everything your brand needs to grow — strategy through execution.
          </motion.p>
        </div>

        {/* Stacked sticky cards */}
        <div className="flex flex-col gap-6 pb-16">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
