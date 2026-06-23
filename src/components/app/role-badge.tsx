import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const ROLE: Record<Role, { label: string; cls: string; dot: string }> = {
  OWNER: { label: "Owner", cls: "border-izzy-brand/30 bg-izzy-brand/10 text-izzy-accent", dot: "bg-izzy-accent" },
  MANAGER: { label: "Manager", cls: "border-izzy-steel/30 bg-izzy-surface-2 text-izzy-steel", dot: "bg-izzy-steel" },
  SELLER: { label: "Seller", cls: "border-izzy-hairline bg-izzy-surface-2 text-izzy-muted", dot: "bg-izzy-muted" },
  INVESTOR: { label: "Investor", cls: "border-izzy-profit/30 bg-izzy-profit/10 text-izzy-profit", dot: "bg-izzy-profit" },
};

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const r = ROLE[role] ?? ROLE.SELLER;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-data text-xs",
        r.cls,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", r.dot)} />
      {r.label}
    </span>
  );
}
