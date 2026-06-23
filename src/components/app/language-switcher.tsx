"use client";

import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

// UI is wired and persists the choice; only RU strings exist today.
// EN / UZ dictionaries are a TODO (see project notes).
const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "uz", label: "O‘zbek" },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("ru");

  const pick = (code: string) => {
    setLang(code);
    setOpen(false);
    document.cookie = `izzy-lang=${code}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-izzy-hairline px-2.5 py-2 text-xs text-izzy-muted transition-colors hover:text-izzy-text"
      >
        <Globe className="size-4" strokeWidth={1.75} />
        <span className="uppercase">{lang}</span>
        <ChevronDown className="size-3.5" strokeWidth={1.75} />
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
            className="shadow-premium absolute right-0 z-40 mt-2 w-40 overflow-hidden rounded-lg border border-izzy-hairline bg-izzy-surface py-1"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                role="menuitem"
                onClick={() => pick(l.code)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-izzy-text transition-colors hover:bg-izzy-surface-2"
              >
                {l.label}
                {l.code !== "ru" && (
                  <span className="font-data text-[10px] uppercase text-izzy-muted">скоро</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
