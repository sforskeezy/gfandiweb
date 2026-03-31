"use client";

import { motion } from "motion/react";

const platforms = [
  { name: "Google", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/google.svg" },
  { name: "ChatGPT", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openai.svg" },
  { name: "Gemini", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/googlegemini.svg" },
  { name: "TikTok", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/tiktok.svg" },
  { name: "YouTube", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/youtube.svg" },
  { name: "Pinterest", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/pinterest.svg" },
  { name: "GIPHY", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/giphy.svg" },
  { name: "Reddit", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/reddit.svg" },
  { name: "Amazon", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazon.svg" },
];

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      {/* Performant gradient background — replaces GPU-heavy blur(40px) image */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(135deg, #3a5a40 0%, #4a7c59 25%, #588b6a 50%, #6b9080 75%, #4a6741 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/30" />
      </div>

      {/* Content — centered */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-20 text-center">
        {/* Credential */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 text-[0.58rem] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-[0.65rem]"
        >
          Trusted Performance Marketing Agency
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white"
        >
          We Create
          <br />
          <span className="inline-flex items-center gap-[0.12em]">
            Category
            <span className="relative inline-block h-[0.6em] w-[0.6em] shrink-0 overflow-hidden rounded-[0.12em] ring-2 ring-white/20">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&h=200&fit=crop"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            Leaders
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-5 text-[clamp(0.85rem,1.8vw,1.15rem)] italic text-white/55"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          on every searchable platform
        </motion.p>
      </div>

      {/* Platform logos — pinned to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute bottom-6 left-0 right-0 z-10 px-6 sm:bottom-10"
      >
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10">
          {platforms.map((p) => (
            <div key={p.name} className="flex items-center gap-2 opacity-60">
              <img
                src={p.src}
                alt={p.name}
                className="h-4 w-4 brightness-0 invert sm:h-[18px] sm:w-[18px]"
                loading="lazy"
              />
              <span className="text-[0.72rem] font-bold tracking-[-0.01em] text-white sm:text-[0.82rem]">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

