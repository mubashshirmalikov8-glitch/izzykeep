"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { BarDatum } from "@/lib/types";

export function BarList({ items, color = "bg-izzy-profit" }: { items: BarDatum[]; color?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const max = Math.max(1, ...items.map((i) => Math.abs(i.value)));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const bars = root.current?.querySelectorAll("[data-bar]");
      if (bars?.length) {
        gsap.from(bars, { scaleX: 0, transformOrigin: "left center", duration: 0.8, stagger: 0.07, ease: "power3.out" });
      }
    },
    { scope: root },
  );

  if (!items.length) {
    return <p className="py-10 text-center text-sm text-izzy-muted">Нет данных.</p>;
  }

  return (
    <div ref={root} className="flex flex-col gap-4">
      {items.map((it) => (
        <div key={it.label}>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm text-izzy-text">{it.label}</span>
            <span className="shrink-0 font-data text-xs font-semibold text-izzy-text">{it.display}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-izzy-surface-2">
            <div
              data-bar
              className={`h-full rounded-full ${color}`}
              style={{ width: `${Math.max(2, (Math.abs(it.value) / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
