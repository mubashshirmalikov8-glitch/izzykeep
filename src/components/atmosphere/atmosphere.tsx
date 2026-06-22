"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { GearRing, BrakeDisc, SpringCoil, EngineContour, HexNut } from "./shapes";

type Variant = "landing" | "auth" | "app";
type Depth = 1 | 2 | 3;
type Shape = { key: string; depth: Depth; float: boolean; cls: string; node: React.ReactNode };

const CONFIG: Record<
  Variant,
  { grid: number; violet: string; lime: string; scroll: boolean; mouse: boolean; mask: string }
> = {
  landing: {
    grid: 0.28,
    violet: "bg-izzy-brand/15",
    lime: "bg-izzy-profit/10",
    scroll: true,
    mouse: true,
    mask: "[mask-image:radial-gradient(ellipse_85%_70%_at_50%_25%,black,transparent)]",
  },
  auth: {
    grid: 0.22,
    violet: "bg-izzy-brand/14",
    lime: "bg-izzy-profit/8",
    scroll: false,
    mouse: true,
    mask: "[mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]",
  },
  app: {
    grid: 0.1,
    violet: "bg-izzy-brand/6",
    lime: "bg-izzy-profit/5",
    scroll: false,
    mouse: false,
    mask: "[mask-image:radial-gradient(ellipse_90%_80%_at_70%_0%,black,transparent)]",
  },
};

const SHAPES: Record<Variant, Shape[]> = {
  landing: [
    { key: "g1", depth: 1, float: true, cls: "-right-32 -top-32 size-[34rem] text-izzy-hairline opacity-50", node: <GearRing className="size-full" /> },
    { key: "e1", depth: 1, float: true, cls: "-bottom-28 -left-24 size-[26rem] text-izzy-hairline opacity-40", node: <EngineContour className="size-full" /> },
    { key: "b1", depth: 2, float: true, cls: "left-[6%] top-[34%] size-[11rem] text-izzy-steel opacity-25", node: <BrakeDisc className="size-full" /> },
    { key: "s1", depth: 3, float: true, cls: "right-[10%] top-[52%] h-[15rem] w-[7rem] text-izzy-brand opacity-[0.18]", node: <SpringCoil className="size-full" /> },
    { key: "h1", depth: 3, float: true, cls: "left-[44%] top-[12%] size-[6.5rem] text-izzy-profit opacity-[0.16]", node: <HexNut className="size-full" /> },
  ],
  auth: [
    { key: "g1", depth: 1, float: true, cls: "-right-24 -top-24 size-[26rem] text-izzy-hairline opacity-50", node: <GearRing className="size-full" /> },
    { key: "b1", depth: 2, float: true, cls: "-left-16 bottom-[8%] size-[14rem] text-izzy-steel opacity-25", node: <BrakeDisc className="size-full" /> },
    { key: "h1", depth: 3, float: true, cls: "right-[14%] top-[16%] size-[6rem] text-izzy-brand opacity-[0.18]", node: <HexNut className="size-full" /> },
  ],
  app: [
    { key: "g1", depth: 1, float: false, cls: "-right-40 -top-40 size-[40rem] text-izzy-hairline opacity-[0.35]", node: <GearRing className="size-full" /> },
  ],
};

export function Atmosphere({ variant = "landing" }: { variant?: Variant }) {
  const root = useRef<HTMLDivElement>(null);
  const cfg = CONFIG[variant];
  const shapes = SHAPES[variant];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, {
          y: "+=14",
          rotation: "+=4",
          duration: 9 + i * 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]");

      if (cfg.scroll) {
        layers.forEach((l) => {
          const d = Number(l.dataset.depth);
          gsap.to(l, {
            yPercent: d * 5,
            ease: "none",
            scrollTrigger: { trigger: document.documentElement, start: "top top", end: "max", scrub: true },
          });
        });
      }

      if (!cfg.mouse) return;

      const setters = layers.map((l) => {
        const d = Number(l.dataset.depth);
        return {
          f: d * 6,
          x: gsap.quickTo(l, "x", { duration: 1.1, ease: "power3" }),
          y: gsap.quickTo(l, "y", { duration: 1.1, ease: "power3" }),
        };
      });
      const onMove = (e: PointerEvent) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s) => {
          s.x(-cx * s.f);
          s.y(-cy * s.f);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [variant] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={cn(
        "pointer-events-none -z-10 overflow-hidden [perspective:1000px]",
        variant === "app" ? "absolute inset-0" : "fixed inset-0",
      )}
    >
      {/* ambient gradient blobs */}
      <div className={cn("absolute -left-[10%] -top-[10%] size-[42rem] rounded-full blur-[140px] izzy-drift-a", cfg.violet)} />
      <div className={cn("absolute -right-[12%] top-[30%] size-[38rem] rounded-full blur-[150px] izzy-drift-b", cfg.lime)} />

      {/* quiet grid */}
      <div className={cn("blueprint-grid absolute inset-0", cfg.mask)} style={{ opacity: cfg.grid }} />

      {/* depth shapes */}
      {shapes.map((s) => (
        <div key={s.key} data-depth={s.depth} className={cn("absolute will-change-transform", s.cls)}>
          <div {...(s.float ? { "data-float": "" } : {})} className="size-full">
            {s.node}
          </div>
        </div>
      ))}
    </div>
  );
}
