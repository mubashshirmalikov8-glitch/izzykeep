"use client";

import { useState, useTransition } from "react";
import { createTelegramCode } from "./actions";

export function TelegramLink() {
  const [code, setCode] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const generate = () =>
    start(async () => {
      const r = await createTelegramCode();
      setCode(r.code);
    });

  return (
    <div>
      <button
        type="button"
        onClick={generate}
        disabled={pending}
        className="rounded-lg bg-izzy-brand-strong px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep disabled:opacity-50"
      >
        {pending ? "Генерация…" : code ? "Новый код" : "Получить код привязки"}
      </button>

      {code && (
        <div className="mt-4 rounded-xl border border-izzy-hairline bg-izzy-bg p-4">
          <p className="text-sm text-izzy-text">
            Отправьте боту в Telegram:{" "}
            <code className="rounded bg-izzy-surface-2 px-1.5 py-0.5 font-data text-izzy-accent">
              /start {code}
            </code>
          </p>
          <p className="mt-2 font-data text-xs text-izzy-muted">Код действует 15 минут.</p>
        </div>
      )}
    </div>
  );
}
