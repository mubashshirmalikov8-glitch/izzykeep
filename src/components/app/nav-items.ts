import {
  Package,
  Building2,
  Layers,
  Wallet,
  LineChart,
  Star,
  Settings,
  HelpCircle,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Склад", icon: Package },
  { href: "/app/company", label: "Компания", icon: Building2 },
  { href: "/app/lots", label: "Лот", icon: Layers },
  { href: "/app/finance", label: "Финансы", icon: Wallet },
  { href: "/app/analytics", label: "Аналитика", icon: LineChart },
  { href: "/app/rating", label: "Рейтинг", icon: Star },
  { href: "/app/settings", label: "Настройки", icon: Settings },
  { href: "/app/faq", label: "FAQ", icon: HelpCircle },
];

export const PROFILE_ITEM: NavItem = { href: "/app/profile", label: "Профиль", icon: User };

export function isActivePath(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}
