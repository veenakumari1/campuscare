"use client";

import { useEffect, useRef } from "react";

export default function CursorEffect() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = ref.current!;
    let x = -100, y = -100, cx = -100, cy = -100, scale = 1, raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
      const t = e.target as HTMLElement | null;
      const big = t?.closest("a, button, input, textarea, select, label, h1, h2, h3, h4, p, [data-cursor='big']");
      scale = big ? 4 : 1;
    };
    const onLeave = () => (el.style.opacity = "0");

    const tick = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Dark area -> pure white circle, light area -> pure black circle (no color tint)
  const filter = "grayscale(1) invert(1) contrast(1000%)";
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-5 w-5 rounded-full opacity-0 transition-opacity duration-200"
      style={{
        willChange: "transform",
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
      }}
    />
  );
}
