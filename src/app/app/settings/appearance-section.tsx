import { ThemeToggle } from "@/components/app/theme-toggle";
import { LanguageSwitcher } from "@/components/app/language-switcher";

export function AppearanceSection() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-izzy-text">Тема</p>
          <p className="text-xs text-izzy-muted">Светлая / тёмная</p>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-izzy-text">Язык</p>
          <p className="text-xs text-izzy-muted">RU · EN / UZ скоро</p>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
