"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowUpRight,
  Globe,
  Lightbulb,
  BarChart3,
  Share2,
  Search,
  PieChart,
} from "lucide-react";

const services = [
  { title: "Web Design & Development", href: "#contact", icon: Globe },
  { title: "Brand Strategy", href: "#contact", icon: Lightbulb },
  { title: "Performance Marketing", href: "#contact", icon: BarChart3 },
  { title: "Content & Social", href: "#contact", icon: Share2 },
  { title: "SEO & Growth", href: "#contact", icon: Search },
  { title: "Analytics & Reporting", href: "#contact", icon: PieChart },
];

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const left = services.filter((_, i) => i % 2 === 0);
  const right = services.filter((_, i) => i % 2 === 1);

  return (
    <section id="services" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
      {/* Background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.15]" style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.1]" style={{ background: "radial-gradient(circle, #E8A782, transparent 70%)" }} />

      <div ref={ref} className="relative mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 flex items-end justify-between sm:mb-20"
        >
          <h2 className="text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
            Our{" "}
            <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
              Services
            </span>
          </h2>
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-5 py-2.5 text-[0.82rem] font-medium text-[#1A1A1A]/60 transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] sm:flex"
          >
            View All Services
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>

        {/* Services grid — two columns */}
        <div className="grid gap-0 sm:grid-cols-2">
          {/* Left column */}
          <div className="border-t border-[#1A1A1A]/[0.08]">
            {left.map((service) => {
              const realIndex = services.indexOf(service);
              return (
                <ServiceRow
                  key={service.title}
                  service={service}
                  index={realIndex}
                  hovered={hovered === realIndex}
                  onHover={() => setHovered(realIndex)}
                  onLeave={() => setHovered(null)}
                  inView={inView}
                />
              );
            })}
          </div>
          {/* Right column */}
          <div className="border-t border-[#1A1A1A]/[0.08] sm:border-l">
            {right.map((service) => {
              const realIndex = services.indexOf(service);
              return (
                <ServiceRow
                  key={service.title}
                  service={service}
                  index={realIndex}
                  hovered={hovered === realIndex}
                  onHover={() => setHovered(realIndex)}
                  onLeave={() => setHovered(null)}
                  inView={inView}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center sm:hidden">
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-6 py-3 text-[0.82rem] font-medium text-[#1A1A1A]/60"
          >
            View All Services
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  hovered,
  onHover,
  onLeave,
  inView,
}: {
  service: { title: string; href: string; icon: React.ComponentType<{ className?: string }> };
  index: number;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  inView: boolean;
}) {
  const Icon = service.icon;

  return (
    <motion.a
      href={service.href}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex items-center border-b border-[#1A1A1A]/[0.08] py-5 sm:py-6"
    >
      {/* Dark pill that fills in on hover */}
      <motion.div
        className="absolute inset-x-0 inset-y-0.5 rounded-2xl"
        initial={false}
        animate={{
          backgroundColor: hovered ? "#1A1A1A" : "rgba(26,26,26,0)",
          scale: hovered ? 1 : 0.97,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 flex w-full items-center justify-between px-4 sm:px-5">
        <div className="flex items-center gap-3.5">
          {/* Icon circle */}
          <motion.div
            initial={false}
            animate={{
              backgroundColor: hovered ? "#5D8B68" : "rgba(93,139,104,0.1)",
              scale: hovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          >
            <Icon
              className={`h-[18px] w-[18px] transition-colors duration-300 ${
                hovered ? "text-white" : "text-[#5D8B68]"
              }`}
            />
          </motion.div>

          {/* Title */}
          <motion.span
            initial={false}
            animate={{
              x: hovered ? 6 : 0,
              color: hovered ? "#ffffff" : "#1A1A1A",
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(1.05rem,2.5vw,1.55rem)] font-semibold tracking-[-0.02em]"
          >
            {service.title}
          </motion.span>
        </div>

        {/* Arrow circle that slides in */}
        <motion.div
          initial={false}
          animate={{
            width: hovered ? 40 : 0,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5D8B68]"
        >
          <ArrowUpRight className="h-4 w-4 text-white" />
        </motion.div>
      </div>
    </motion.a>
  );
}
