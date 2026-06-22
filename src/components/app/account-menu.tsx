"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings, User as UserIcon, LogOut } from "lucide-react";
import type { CurrentUser } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export function AccountMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const initial = (user.name?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-izzy-surface-2"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-izzy-brand-strong text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden text-sm text-izzy-text sm:block">{user.name}</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-lg border border-izzy-hairline bg-izzy-surface py-1 shadow-xl shadow-black/30"
          >
            <div className="border-b border-izzy-hairline px-3 py-3">
              <p className="truncate text-sm font-medium text-izzy-text">{user.name}</p>
              <p className="truncate font-data text-xs text-izzy-muted">{user.email}</p>
            </div>
            <MenuLink href="/app/profile" icon={<UserIcon className="size-4" strokeWidth={1.75} />} onClick={() => setOpen(false)}>
              Профиль
            </MenuLink>
            <MenuLink href="/app/settings" icon={<Settings className="size-4" strokeWidth={1.75} />} onClick={() => setOpen(false)}>
              Настройки
            </MenuLink>
            <div className="my-1 border-t border-izzy-hairline" />
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await createClient().auth.signOut();
                window.location.href = "/login";
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-izzy-text transition-colors hover:bg-izzy-surface-2"
            >
              <span className="text-izzy-muted">
                <LogOut className="size-4" strokeWidth={1.75} />
              </span>
              Выйти
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-izzy-text transition-colors hover:bg-izzy-surface-2"
    >
      <span className="text-izzy-muted">{icon}</span>
      {children}
    </Link>
  );
}
