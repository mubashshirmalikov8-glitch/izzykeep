"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Row = {
  oem: string;
  part: string;
  car: string;
  qty: number;
  sold: number;
};

// Real product mechanic: remaining = qty − sales. Lime = profit.
const ROWS: Row[] = [
  { oem: "04465-33471", part: "Колодки передние", car: "Camry 50", qty: 8, sold: 2 },
  { oem: "90915-YZZD4", part: "Фильтр масляный", car: "Corolla", qty: 24, sold: 5 },
  { oem: "48131-06710", part: "Пружина подвески", car: "Camry 70", qty: 6, sold: 1 },
  { oem: "17801-0H080", part: "Фильтр воздушный", car: "RAV4", qty: 15, sold: 0 },
];

const PROFIT_TOTAL = 1240;
const fmt = (n: number) => "$" + Math.round(n).toLocaleString("ru-RU");

export function LedgerDemo() {
  const root = useRef<HTMLDivElement>(null);
  const profit = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      const rems = gsap.utils.toArray<HTMLElement>("[data-remaining]");
      const profitEl = profit.current;

      if (prefersReducedMotion()) {
        gsap.set(rows, { opacity: 1, y: 0 });
        rems.forEach((el, i) => (el.textContent = String(ROWS[i].qty - ROWS[i].sold)));
        if (profitEl) profitEl.textContent = fmt(PROFIT_TOTAL);
        return;
      }

      gsap.set(rows, { opacity: 0, y: 12 });
      rems.forEach((el, i) => (el.textContent = String(ROWS[i].qty)));
      if (profitEl) profitEl.textContent = fmt(0);

      const tl = gsap.timeline({ delay: 0.35 });
      tl.to(rows, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 });

      ROWS.forEach((r, i) => {
        if (r.sold <= 0) return;
        tl.add(() => {
          rems[i].textContent = String(r.qty - r.sold);
        }, "+=0.45");
        tl.fromTo(
          rows[i],
          { backgroundColor: "rgba(139,92,246,0.16)" },
          { backgroundColor: "rgba(139,92,246,0)", duration: 0.9 },
          "<",
        );
      });

      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: PROFIT_TOTAL,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            if (profitEl) profitEl.textContent = fmt(counter.v);
          },
        },
        "<-0.5",
      );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="glass w-full overflow-hidden rounded-2xl"
    >
      {/* tab header */}
      <div className="flex items-center justify-between border-b border-izzy-hairline bg-izzy-surface-2 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-izzy-profit shadow-[0_0_10px] shadow-izzy-profit/60" />
          <span className="font-data text-xs tracking-wide text-izzy-steel">
            СКЛАД · LOT-7F3A21
          </span>
        </div>
        <span className="font-data text-[11px] text-izzy-muted">live</span>
      </div>

      {/* column header */}
      <div className="grid grid-cols-[5.5rem_1fr_3rem] gap-3 border-b border-izzy-hairline px-4 py-2.5 font-data text-[11px] uppercase tracking-wider text-izzy-muted sm:grid-cols-[7rem_1fr_5.5rem_3.5rem]">
        <span>OEM</span>
        <span>Запчасть</span>
        <span className="hidden sm:block">Авто</span>
        <span className="text-right">Ост.</span>
      </div>

      {/* rows */}
      <div>
        {ROWS.map((r) => (
          <div
            key={r.oem}
            data-row
            className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3 border-b border-izzy-hairline/60 px-4 py-3 last:border-0 sm:grid-cols-[7rem_1fr_5.5rem_3.5rem]"
          >
            <span className="truncate font-data text-xs text-izzy-steel">{r.oem}</span>
            <span className="truncate text-sm text-izzy-text">{r.part}</span>
            <span className="hidden truncate font-data text-xs text-izzy-muted sm:block">
              {r.car}
            </span>
            <span
              data-remaining
              className="text-right font-data text-sm font-semibold tabular-nums text-izzy-text"
            >
              {r.qty}
            </span>
          </div>
        ))}
      </div>

      {/* profit footer */}
      <div className="flex items-end justify-between border-t border-izzy-hairline bg-izzy-surface-2 px-4 py-4">
        <span className="text-xs text-izzy-muted">Прибыль с продаж</span>
        <span
          ref={profit}
          className="font-data text-2xl font-bold tabular-nums text-izzy-profit"
        >
          $0
        </span>
      </div>
    </div>
  );
}
