"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Search, Compass, Flame, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Discover",
    headline: "First, we listen.",
    body: "Before we touch a single pixel, we learn your business — your audience, your goals, your competitors, and what's been tried before.",
    detail: "Market research · Competitor audit · Brand workshop",
    icon: Search,
    bg: "#7B8C6F",
  },
  {
    num: "02",
    title: "Plan",
    headline: "Then we map the path.",
    body: "We build a custom strategy across every channel — brand, web, social, and paid — so every dollar and every hour drives real results.",
    detail: "Growth roadmap · Channel strategy · Content calendar",
    icon: Compass,
    bg: "#5C7A8A",
  },
  {
    num: "03",
    title: "Build",
    headline: "Now we make it real.",
    body: "Design. Develop. Write. Film. Launch. We handle everything in-house so nothing gets lost in translation.",
    detail: "Website · Branding · Social content · Ad creative",
    icon: Flame,
    bg: "#8B7355",
  },
  {
    num: "04",
    title: "Grow",
    headline: "And we never stop.",
    body: "Monthly reports, weekly optimizations, constant testing. We treat your brand like it's ours — because that's how you win.",
    detail: "Analytics · A/B testing · Monthly strategy calls",
    icon: TrendingUp,
    bg: "#1A1A1A",
  },
];

export default function HowWeWork() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(steps.length - 1) * 100}%`]);

  return (
    <section
      id="services"
      ref={containerRef}
      style={{ height: `${steps.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Progress bar at top */}
        <motion.div
          className="absolute top-0 left-0 z-30 h-[2px] bg-white/30"
          style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
        />

        <motion.div className="flex h-full" style={{ x }}>
          {steps.map((step, i) => (
            <Panel key={step.num} step={step} index={i} progress={scrollYProgress} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Panel({
  step,
  index,
  progress,
}: {
  step: (typeof steps)[0];
  index: number;
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  const total = steps.length;
  const segStart = index / total;
  const segMid = (index + 0.5) / total;
  const segEnd = (index + 1) / total;

  const titleY = useTransform(progress, [segStart, segMid], [80, 0]);
  const titleOpacity = useTransform(progress, [segStart, segStart + 0.08], [0, 1]);
  const bodyY = useTransform(progress, [segStart + 0.02, segMid], [50, 0]);
  const bodyOpacity = useTransform(progress, [segStart + 0.02, segStart + 0.1], [0, 1]);
  const detailOpacity = useTransform(progress, [segStart + 0.04, segStart + 0.14], [0, 1]);
  const numOpacity = useTransform(
    progress,
    [segStart, segStart + 0.06, segEnd - 0.04, segEnd],
    [0, 0.06, 0.06, 0]
  );
  const ringScale = useTransform(progress, [segStart, segMid], [0.8, 1]);
  const ringOpacity = useTransform(progress, [segStart, segStart + 0.08, segEnd - 0.04, segEnd], [0, 0.06, 0.06, 0]);

  const isLast = index === total - 1;
  const Icon = step.icon;

  return (
    <div
      className="relative flex h-full w-screen shrink-0 items-center overflow-hidden"
      style={{ backgroundColor: step.bg }}
    >
      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Giant number */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        style={{ opacity: numOpacity }}
      >
        <span className="text-[clamp(18rem,45vw,36rem)] font-bold leading-none tracking-tighter text-white">
          {step.num}
        </span>
      </motion.div>

      {/* Decorative ring */}
      <motion.div
        className="pointer-events-none absolute right-[8%] top-[15%] h-[55vh] w-[55vh] rounded-full border border-white/[0.04]"
        style={{ scale: ringScale, opacity: ringOpacity }}
      />
      <motion.div
        className="pointer-events-none absolute right-[12%] top-[20%] h-[40vh] w-[40vh] rounded-full border border-white/[0.03]"
        style={{ scale: ringScale, opacity: ringOpacity }}
      />

      {/* Gradient glow */}
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[50%] w-[40%] rounded-full bg-white/[0.02] blur-[100px]" />

      {/* Content — left aligned with vertical layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] items-center px-8 sm:px-12 lg:px-16">
        <div className="flex-1">
          {/* Icon + step label */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
              <Icon className="h-[18px] w-[18px] text-white/50" />
            </div>
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/30">
              {step.title}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h3
            style={{ y: titleY, opacity: titleOpacity }}
            className="mt-7 text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
          >
            {step.headline}
          </motion.h3>

          {/* Body */}
          <motion.p
            style={{ y: bodyY, opacity: bodyOpacity }}
            className="mt-5 max-w-lg text-[clamp(0.92rem,1.2vw,1.05rem)] leading-[1.75] text-white/45"
          >
            {step.body}
          </motion.p>

          {/* Detail tags */}
          <motion.div
            style={{ opacity: detailOpacity }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {step.detail.split(" · ").map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[0.72rem] font-medium text-white/35"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTA on last panel */}
          {isLast && (
            <motion.div style={{ opacity: detailOpacity }} className="mt-10">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[0.88rem] font-medium text-[#1A1A1A] transition-all duration-200 hover:bg-white/90"
              >
                Start Your Growth →
              </a>
            </motion.div>
          )}
        </div>

        {/* Right side — large step number (desktop only) */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="hidden select-none lg:block"
        >
          <span
            className="text-[8rem] font-bold leading-none tracking-tighter text-white/[0.04]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {step.num}
          </span>
        </motion.div>
      </div>

      {/* Panel counter — bottom */}
      <motion.div
        style={{ opacity: titleOpacity }}
        className="absolute bottom-8 left-8 flex items-center gap-3 sm:bottom-10 sm:left-12"
      >
        <span className="text-[0.7rem] font-medium text-white/20">
          {step.num} / 04
        </span>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-6 bg-white/40" : "w-1.5 bg-white/10"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
