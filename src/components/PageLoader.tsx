"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fast fade — no logo, no delay. Just briefly cover the initial render.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[99999] bg-[#ECEAE7]"
        />
      )}
    </AnimatePresence>
  );
}
