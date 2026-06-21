import { Logo } from "@/components/landing/logo";

const COLS = [
  {
    title: "Продукт",
    links: ["Возможности", "Тарифы", "Как это работает"],
  },
  {
    title: "Компания",
    links: ["О нас", "Контакты", "Telegram-бот"],
  },
  {
    title: "Правовое",
    links: ["Оферта", "Конфиденциальность"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-izzy-hairline/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-display text-lg font-bold tracking-tight">IzzyKeep</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-izzy-muted">
              Складской учёт автозапчастей: лоты, остатки, продажи и прибыль в
              одном месте.
            </p>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h3 className="font-data text-xs uppercase tracking-wider text-izzy-steel">
                {c.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-izzy-muted transition-colors hover:text-izzy-text"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-izzy-hairline/60 pt-6 sm:flex-row sm:items-center">
          <p className="font-data text-xs text-izzy-muted">© 2026 IzzyKeep</p>
          <p className="font-data text-xs text-izzy-muted">Сделано для продавцов запчастей</p>
        </div>
      </div>
    </footer>
  );
}
