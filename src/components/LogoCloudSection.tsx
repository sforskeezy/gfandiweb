"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { LogoCloud } from "@/components/ui/logo-cloud";

const logos = [
  {
    src: "https://svgl.app/library/nvidia-wordmark-light.svg",
    alt: "Nvidia",
  },
  {
    src: "https://svgl.app/library/supabase_wordmark_light.svg",
    alt: "Supabase",
  },
  {
    src: "https://svgl.app/library/openai_wordmark_light.svg",
    alt: "OpenAI",
  },
  {
    src: "https://svgl.app/library/turso-wordmark-light.svg",
    alt: "Turso",
  },
  {
    src: "https://svgl.app/library/vercel_wordmark.svg",
    alt: "Vercel",
  },
  {
    src: "https://svgl.app/library/github_wordmark_light.svg",
    alt: "GitHub",
  },
  {
    src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg",
    alt: "Claude AI",
  },
  {
    src: "https://svgl.app/library/clerk-wordmark-light.svg",
    alt: "Clerk",
  },
];

export default function LogoCloudSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section ref={ref} className="px-4 py-10 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-[1200px]"
      >
        <div className="mb-5 text-center">
          <span className="block text-[0.82rem] font-medium text-[#1A1A1A]/35">
            Already used by
          </span>
          <span className="font-bold text-[1.3rem] tracking-tight text-[#1A1A1A] md:text-[1.5rem]">
            Best in the Game
          </span>
        </div>

        <LogoCloud logos={logos} />
      </motion.div>
    </section>
  );
}
