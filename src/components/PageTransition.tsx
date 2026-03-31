"use client";

import { usePathname } from "next/navigation";
import { animate } from "motion/react";
import { useEffect, useRef } from "react";

export default function PageTransition() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const isFirst = useRef(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      const el = overlayRef.current;
      if (!el) return;

      // Quick opacity flash instead of slow black wipe
      const run = async () => {
        el.style.display = "block";
        await animate(el, { opacity: [0, 0.15, 0] }, { duration: 0.25, ease: "easeInOut" });
        el.style.display = "none";
      };
      run();
    }
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ display: "none", opacity: 0, backgroundColor: "#1A1A1A" }}
    />
  );
}
