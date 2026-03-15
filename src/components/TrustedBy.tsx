"use client";

import { motion } from "motion/react";

const brands = [
  "Vertex",
  "Polaris",
  "Meridian",
  "Lumina",
  "Catalyst",
  "Arcadia",
];

export default function TrustedBy() {
  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8 py-16"
        >
          <p
            className="text-[0.78rem] tracking-[0.08em] text-[#AAAAAA]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Trusted by growing brands
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {brands.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="text-[0.95rem] font-medium tracking-[-0.01em] text-[#CCCCCC] transition-colors duration-300 hover:text-[#999]"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
