"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/landing/logo";
import { NAV_ITEMS, PROFILE_ITEM, isActivePath, type NavItem } from "./nav-items";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/lib/types";

export function Sidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-1/5 min-w-[15rem] max-w-[18rem] shrink-0 flex-col border-r border-izzy-hairline bg-izzy-surface lg:flex">
      <Link href="/app" className="flex h-16 items-center gap-2 border-b border-izzy-hairline px-5">
        <Logo />
        <span className="font-display text-lg font-bold tracking-tight">IzzyKeep</span>
      </Link>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={isActivePath(pathname, item.href)} />
          ))}
        </ul>
      </nav>

      <div className="border-t border-izzy-hairline p-3">
        <NavLink
          item={PROFILE_ITEM}
          active={isActivePath(pathname, PROFILE_ITEM.href)}
          trailing={<span className="font-data text-xs text-izzy-muted">#{user.userCode}</span>}
        />
      </div>
    </aside>
  );
}

function NavLink({
  item,
  active,
  trailing,
}: {
  item: NavItem;
  active: boolean;
  trailing?: React.ReactNode;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
          active
            ? "bg-izzy-brand/12 text-izzy-text"
            : "text-izzy-muted hover:bg-izzy-surface-2 hover:text-izzy-text",
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-izzy-brand" />
        )}
        <Icon
          className={cn("size-[18px] shrink-0", active ? "text-izzy-brand" : "")}
          strokeWidth={1.75}
        />
        <span className="truncate">{item.label}</span>
        {trailing && <span className="ml-auto truncate">{trailing}</span>}
      </Link>
    </li>
  );
}
