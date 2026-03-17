"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const services = [
  { title: "Web Design & Development", href: "#contact" },
  { title: "Brand Strategy", href: "#contact" },
  { title: "Performance Marketing", href: "#contact" },
  { title: "Content & Social", href: "#contact" },
  { title: "SEO & Growth", href: "#contact" },
  { title: "Analytics & Reporting", href: "#contact" },
];

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const left = services.filter((_, i) => i % 2 === 0);
  const right = services.filter((_, i) => i % 2 === 1);

  return (
    <section id="services" className="px-4 py-20 sm:px-6 sm:py-32">
      <div ref={ref} className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 flex items-end justify-between sm:mb-20"
        >
          <h2
            className="text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]"
          >
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
  service: { title: string; href: string };
  index: number;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  inView: boolean;
}) {
  return (
    <motion.a
      href={service.href}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex items-center border-b border-[#1A1A1A]/[0.08] py-6 sm:py-7"
    >
      {/* Hover pill background */}
      <motion.div
        className="absolute inset-x-1 inset-y-1 rounded-2xl"
        initial={false}
        animate={{
          backgroundColor: hovered ? "rgba(26,26,26,0.04)" : "rgba(26,26,26,0)",
          scale: hovered ? 1 : 0.98,
        }}
        transition={{ duration: 0.25 }}
      />

      <div className="relative z-10 flex w-full items-center justify-between px-3 sm:px-5">
        <div className="flex items-center gap-3">
          {/* Arrow that appears on hover */}
          <motion.div
            initial={false}
            animate={{
              width: hovered ? 32 : 0,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.25 }}
            className="flex h-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A1A1A]"
          >
            <ArrowUpRight className="h-4 w-4 text-white" />
          </motion.div>

          <span
            className="text-[clamp(1.1rem,2.5vw,1.65rem)] font-semibold tracking-[-0.02em] text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#1A1A1A]"
          >
            {service.title}
          </span>
        </div>
      </div>
    </motion.a>
  );
}
