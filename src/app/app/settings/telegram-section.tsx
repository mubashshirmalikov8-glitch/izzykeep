"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { createTelegramCode, unlinkTelegram } from "./actions";

export function TelegramSection({ linked, telegramId }: { linked: boolean; telegramId: string | null }) {
  const [code, setCode] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const generate = () =>
    start(async () => {
      const r = await createTelegramCode();
      setCode(r.code);
      setMsg(null);
    });

  const unlink = () =>
    start(async () => {
      const r = await unlinkTelegram();
      setMsg(r.message);
      setCode(null);
    });

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className={cn("size-2 rounded-full", linked ? "bg-izzy-profit" : "bg-izzy-muted")} />
        <span className="text-sm text-izzy-text">
          {linked ? "Подключено" : "Не подключено"}
          {linked && telegramId && (
            <span className="font-data text-xs text-izzy-muted"> · id {telegramId}</span>
          )}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={generate}
          disabled={pending}
          className="rounded-lg bg-izzy-brand-strong px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep disabled:opacity-50"
        >
          {pending ? "…" : code ? "Новый код" : "Получить код привязки"}
        </button>
        {linked && (
          <button
            type="button"
            onClick={unlink}
            disabled={pending}
            className="rounded-lg border border-izzy-hairline px-4 py-2.5 text-sm text-izzy-text transition-colors hover:bg-izzy-surface-2 disabled:opacity-50"
          >
            Отвязать
          </button>
        )}
      </div>

      {code && (
        <div className="mt-4 rounded-xl border border-izzy-hairline bg-izzy-bg p-4">
          <p className="text-sm text-izzy-text">
            Отправьте боту:{" "}
            <code className="rounded bg-izzy-surface-2 px-1.5 py-0.5 font-data text-izzy-accent">
              /start {code}
            </code>
          </p>
          <p className="mt-2 font-data text-xs text-izzy-muted">Код действует 15 минут.</p>
        </div>
      )}
      {msg && <p className="mt-3 text-xs text-izzy-profit">{msg}</p>}
    </div>
  );
}
