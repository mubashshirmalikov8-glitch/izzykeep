"use client";

import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function SecuritySection({ email }: { email: string }) {
  const [pending, start] = useTransition();

  const signOut = (scope: "local" | "global") =>
    start(async () => {
      await createClient().auth.signOut({ scope });
      window.location.href = "/login";
    });

  return (
    <div className="space-y-5">
      <div>
        <p className="font-data text-[11px] uppercase tracking-wider text-izzy-muted">Метод входа</p>
        <p className="mt-1 text-sm text-izzy-text">Google · {email}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => signOut("local")}
          disabled={pending}
          className="rounded-lg border border-izzy-hairline px-4 py-2.5 text-sm text-izzy-text transition-colors hover:bg-izzy-surface-2 disabled:opacity-50"
        >
          Выйти
        </button>
        <button
          type="button"
          onClick={() => signOut("global")}
          disabled={pending}
          className="rounded-lg border border-izzy-hairline px-4 py-2.5 text-sm text-izzy-text transition-colors hover:bg-izzy-surface-2 disabled:opacity-50"
        >
          Выйти на всех устройствах
        </button>
      </div>

      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-izzy-text">Опасная зона</p>
        <p className="mt-1 text-xs text-izzy-muted">Удаление аккаунта вместе со складом и продажами.</p>
        <button
          type="button"
          disabled
          className="mt-3 cursor-not-allowed rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400/70 opacity-60"
        >
          Удалить аккаунт (скоро)
        </button>
      </div>
    </div>
  );
}
