"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { money } from "@/lib/format";
import type { SalesDayPoint } from "@/lib/types";

const W = 600;
const H = 220;
const PT = 16;
const PB = 24;
const PX = 10;

// Two independently-scaled series: revenue (brand) + units (steel).
export function SalesTrend({ points, currency }: { points: SalesDayPoint[]; currency: string }) {
  const root = useRef<SVGSVGElement>(null);
  const n = points.length;
  const maxR = Math.max(1, ...points.map((p) => p.revenue));
  const maxU = Math.max(1, ...points.map((p) => p.units));
  const innerW = W - PX * 2;
  const innerH = H - PT - PB;
  const x = (i: number) => PX + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yR = (v: number) => PT + innerH - (v / maxR) * innerH;
  const yU = (v: number) => PT + innerH - (v / maxU) * innerH;

  const path = (key: "revenue" | "units", y: (v: number) => number) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");

  const revLine = path("revenue", yR);
  const unitLine = path("units", yU);
  const grids = [0.5, 1].map((f) => PT + innerH - f * innerH);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      root.current.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.1, delay: i * 0.15, ease: "power2.out" },
        );
      });
    },
    { scope: root },
  );

  if (n === 0) {
    return <p className="py-12 text-center text-sm text-izzy-muted">Нет продаж за период.</p>;
  }

  return (
    <div>
      <svg ref={root} viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Продажи по дням">
        {grids.map((gy, i) => (
          <line key={i} x1={PX} x2={W - PX} y1={gy} y2={gy} stroke="var(--color-izzy-hairline)" strokeWidth="1" />
        ))}
        <path data-draw d={revLine} fill="none" stroke="var(--color-izzy-brand)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path data-draw d={unitLine} fill="none" stroke="var(--color-izzy-steel)" strokeWidth="2" strokeDasharray="4 4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 font-data text-[11px] text-izzy-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 bg-izzy-brand" /> выручка · макс {money(maxR, currency)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 bg-izzy-steel" /> штук · макс {maxU}
        </span>
        <span>
          {points[0].date.slice(5)} — {points[n - 1].date.slice(5)}
        </span>
      </div>
    </div>
  );
}
