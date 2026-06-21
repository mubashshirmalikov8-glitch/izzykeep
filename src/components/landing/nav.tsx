"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/landing/logo";

const LINKS = [
  { href: "#how", label: "Как это работает" },
  { href: "#features", label: "Возможности" },
  { href: "#pricing", label: "Тарифы" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-izzy-hairline bg-izzy-bg/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2" aria-label="IzzyKeep — на главную">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight">IzzyKeep</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-izzy-muted transition-colors hover:text-izzy-text"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#"
            className="rounded-lg px-3.5 py-2 text-sm text-izzy-muted transition-colors hover:text-izzy-text"
          >
            Войти
          </a>
          <a
            href="#cta"
            className="rounded-lg bg-izzy-brand-strong px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep"
          >
            Начать бесплатно
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
          aria-expanded={open}
          className="flex size-9 items-center justify-center rounded-lg border border-izzy-hairline text-izzy-text md:hidden"
        >
          <span className="font-data text-sm">{open ? "✕" : "≡"}</span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-izzy-hairline bg-izzy-bg px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-izzy-muted hover:bg-izzy-surface hover:text-izzy-text"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-izzy-brand-strong px-3.5 py-2.5 text-center text-sm font-medium text-white"
            >
              Начать бесплатно
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
