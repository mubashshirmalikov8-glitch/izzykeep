import { MobileNav } from "./mobile-nav";
import { StatusBadge } from "./status-badge";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { AccountMenu } from "./account-menu";
import type { CurrentUser } from "@/lib/types";

export function Topbar({ user }: { user: CurrentUser }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-izzy-hairline bg-izzy-bg/80 px-5 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        <span className="hidden font-data text-xs text-izzy-muted sm:block">
          Рабочее пространство
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <StatusBadge role={user.role} />
        <LanguageSwitcher />
        <ThemeToggle />
        <AccountMenu user={user} />
      </div>
    </header>
  );
}
