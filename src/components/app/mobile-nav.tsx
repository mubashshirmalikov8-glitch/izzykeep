"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/landing/logo";
import { NAV_ITEMS, PROFILE_ITEM, isActivePath } from "./nav-items";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = [...NAV_ITEMS, PROFILE_ITEM];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Открыть меню"
        className="flex size-9 items-center justify-center rounded-lg border border-izzy-hairline text-izzy-text lg:hidden"
      >
        <span className="font-data text-base leading-none">≡</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[82%] flex-col border-r border-izzy-hairline bg-izzy-surface">
            <div className="flex h-16 items-center justify-between border-b border-izzy-hairline px-5">
              <span className="flex items-center gap-2">
                <Logo />
                <span className="font-display text-lg font-bold tracking-tight">IzzyKeep</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="flex size-8 items-center justify-center rounded-lg text-izzy-muted hover:text-izzy-text"
              >
                <span className="font-data">✕</span>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              <ul className="flex flex-col gap-1">
                {items.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-izzy-brand/12 text-izzy-text"
                            : "text-izzy-muted hover:bg-izzy-surface-2 hover:text-izzy-text",
                        )}
                      >
                        <Icon
                          className={cn("size-[18px] shrink-0", active ? "text-izzy-brand" : "")}
                          strokeWidth={1.75}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
