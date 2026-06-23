"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { money } from "@/lib/format";
import type { LotProfit } from "@/lib/types";

export function ProfitByLot({ lots, currency }: { lots: LotProfit[]; currency: string }) {
  const root = useRef<HTMLDivElement>(null);
  const max = Math.max(1, ...lots.map((l) => Math.abs(l.profit)));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const bars = root.current?.querySelectorAll("[data-bar]");
      if (bars?.length) {
        gsap.from(bars, { scaleX: 0, transformOrigin: "left center", duration: 0.8, stagger: 0.08, ease: "power3.out" });
      }
    },
    { scope: root },
  );

  if (!lots.length) {
    return <p className="py-12 text-center text-sm text-izzy-muted">Нет данных.</p>;
  }

  return (
    <div ref={root} className="flex flex-col gap-4">
      {lots.map((l) => (
        <div key={l.code}>
          <div className="flex items-center justify-between">
            <span className="font-data text-xs text-izzy-steel">{l.code}</span>
            <span className="font-data text-xs font-semibold text-izzy-text">{money(l.profit, currency)}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-izzy-surface-2">
            <div
              data-bar
              className="h-full rounded-full bg-izzy-profit"
              style={{ width: `${Math.max(2, (Math.abs(l.profit) / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
