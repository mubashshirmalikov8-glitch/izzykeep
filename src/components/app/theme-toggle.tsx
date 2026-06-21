"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Flips the `.theme-light` class on #app-root (scoped to the app, not the
// landing) and persists the choice in a cookie the layout reads on next load.
export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const root = document.getElementById("app-root");
    setLight(root?.classList.contains("theme-light") ?? false);
  }, []);

  const toggle = () => {
    const root = document.getElementById("app-root");
    if (!root) return;
    const next = !root.classList.contains("theme-light");
    root.classList.toggle("theme-light", next);
    document.cookie = `izzy-theme=${next ? "light" : "dark"}; path=/; max-age=31536000; samesite=lax`;
    setLight(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Включить тёмную тему" : "Включить светлую тему"}
      className="flex size-9 items-center justify-center rounded-lg border border-izzy-hairline text-izzy-muted transition-colors hover:text-izzy-text"
    >
      {light ? <Moon className="size-[18px]" strokeWidth={1.75} /> : <Sun className="size-[18px]" strokeWidth={1.75} />}
    </button>
  );
}
