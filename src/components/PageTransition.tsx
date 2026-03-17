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

      const run = async () => {
        el.style.display = "block";
        el.style.transformOrigin = "bottom";
        await animate(el, { scaleY: [0, 1] }, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
        await new Promise((r) => setTimeout(r, 100));
        el.style.transformOrigin = "top";
        await animate(el, { scaleY: [1, 0] }, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
        el.style.display = "none";
      };
      run();
    }
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-[#1A1A1A]"
      style={{ display: "none", transform: "scaleY(0)" }}
    />
  );
}
