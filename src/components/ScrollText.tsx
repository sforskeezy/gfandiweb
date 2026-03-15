"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const HIGHLIGHT_SET = new Set(["Branding", "Growth", "Content", "Results"]);

const wordsTop = [
  { text: "Strategy", serif: false },
  { text: "·" },
  { text: "Branding", serif: true },
  { text: "·" },
  { text: "Performance", serif: false },
  { text: "·" },
  { text: "Growth", serif: true },
  { text: "·" },
  { text: "Design", serif: false },
  { text: "·" },
  { text: "Results", serif: true },
  { text: "·" },
  { text: "Strategy", serif: false },
  { text: "·" },
  { text: "Branding", serif: true },
  { text: "·" },
  { text: "Performance", serif: false },
  { text: "·" },
  { text: "Growth", serif: true },
];

const wordsBottom = [
  { text: "Campaigns", serif: true },
  { text: "·" },
  { text: "Websites", serif: false },
  { text: "·" },
  { text: "Content", serif: true },
  { text: "·" },
  { text: "Analytics", serif: false },
  { text: "·" },
  { text: "Social", serif: true },
  { text: "·" },
  { text: "Conversion", serif: false },
  { text: "·" },
  { text: "Campaigns", serif: true },
  { text: "·" },
  { text: "Websites", serif: false },
  { text: "·" },
  { text: "Content", serif: true },
  { text: "·" },
  { text: "Analytics", serif: false },
];

function WordSpan({
  text,
  serif,
  lit,
}: {
  text: string;
  serif?: boolean;
  lit: boolean;
}) {
  if (text === "·") {
    return <span className="text-[0.5em] text-[#D4D4D4]">·</span>;
  }

  const shouldHighlight = HIGHLIGHT_SET.has(text);
  const active = shouldHighlight && lit;

  return (
    <span
      className={`inline-block px-1 text-[#1A1A1A] ${
        serif ? "italic" : "font-semibold"
      }`}
      style={{
        fontFamily: serif ? "var(--font-serif)" : undefined,
        fontSize: "inherit",
        background: active
          ? "linear-gradient(135deg, rgba(123,140,111,0.15), rgba(123,140,111,0.08))"
          : "transparent",
        borderRadius: active ? "12px" : "12px",
        padding: active ? "4px 14px" : "4px 4px",
        transition: "background 0.5s ease, padding 0.5s ease",
      }}
    >
      {text}
    </span>
  );
}

export default function ScrollText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const checkVisibility = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    setVisible(rect.top < windowH * 0.65 && rect.bottom > windowH * 0.35);
  }, []);

  useEffect(() => {
    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    return () => window.removeEventListener("scroll", checkVisibility);
  }, [checkVisibility]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xTop = useTransform(scrollYProgress, [0, 1], ["5%", "-40%"]);
  const xBottom = useTransform(scrollYProgress, [0, 1], ["-25%", "10%"]);

  return (
    <section ref={containerRef} className="overflow-hidden py-16 sm:py-24">
      <motion.div
        style={{ x: xTop }}
        className="flex items-center gap-6 whitespace-nowrap sm:gap-8"
      >
        {wordsTop.map((w, i) => (
          <span
            key={`t-${i}`}
            className="text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-[-0.04em]"
          >
            <WordSpan text={w.text} serif={w.serif} lit={visible} />
          </span>
        ))}
      </motion.div>

      <motion.div
        style={{ x: xBottom }}
        className="mt-3 flex items-center gap-6 whitespace-nowrap sm:mt-4 sm:gap-8"
      >
        {wordsBottom.map((w, i) => (
          <span
            key={`b-${i}`}
            className="text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-[-0.04em]"
          >
            <WordSpan text={w.text} serif={w.serif} lit={visible} />
          </span>
        ))}
      </motion.div>
    </section>
  );
}
