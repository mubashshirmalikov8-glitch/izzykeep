"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/app", label: "Склад" },
  { href: "/app/sold", label: "Проданно" },
];

export function WarehouseTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 border-b border-izzy-hairline">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm transition-colors",
              active
                ? "border-izzy-brand text-izzy-text"
                : "border-transparent text-izzy-muted hover:text-izzy-text",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
