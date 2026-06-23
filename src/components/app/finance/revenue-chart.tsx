"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { money } from "@/lib/format";
import type { FinancePoint } from "@/lib/types";

const W = 600;
const H = 220;
const PT = 16;
const PB = 24;
const PX = 10;

export function RevenueChart({ points, currency }: { points: FinancePoint[]; currency: string }) {
  const root = useRef<SVGSVGElement>(null);
  const n = points.length;
  const max = Math.max(1, ...points.map((p) => p.revenue));
  const innerW = W - PX * 2;
  const innerH = H - PT - PB;
  const x = (i: number) => PX + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => PT + innerH - (v / max) * innerH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.revenue).toFixed(1)}`).join(" ");
  const area = n ? `${line} L${x(n - 1).toFixed(1)},${(PT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PT + innerH).toFixed(1)} Z` : "";
  const grids = [0.5, 1].map((f) => PT + innerH - f * innerH);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      const path = root.current.querySelector<SVGPathElement>("[data-line]");
      const fill = root.current.querySelector("[data-area]");
      const dots = root.current.querySelectorAll("[data-dot]");
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" });
      }
      if (fill) gsap.fromTo(fill, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.3 });
      if (dots.length) gsap.fromTo(dots, { attr: { r: 0 } }, { attr: { r: 3 }, duration: 0.4, stagger: 0.06, delay: 0.6, ease: "back.out(2)" });
    },
    { scope: root },
  );

  if (n === 0) {
    return <p className="py-12 text-center text-sm text-izzy-muted">Нет продаж за период.</p>;
  }

  return (
    <div>
      <svg ref={root} viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Выручка по дням">
        <defs>
          <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-izzy-brand)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-izzy-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {grids.map((gy, i) => (
          <line key={i} x1={PX} x2={W - PX} y1={gy} y2={gy} stroke="var(--color-izzy-hairline)" strokeWidth="1" />
        ))}
        {area && <path data-area d={area} fill="url(#rev-grad)" />}
        <path data-line d={line} fill="none" stroke="var(--color-izzy-brand)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} data-dot cx={x(i)} cy={y(p.revenue)} r="3" fill="var(--color-izzy-surface)" stroke="var(--color-izzy-brand)" strokeWidth="2" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between font-data text-[11px] text-izzy-muted">
        <span>{points[0].date.slice(5)}</span>
        <span>макс {money(max, currency)}</span>
        <span>{points[n - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}
