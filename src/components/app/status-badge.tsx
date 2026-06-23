import { RoleBadge } from "@/components/app/role-badge";
import type { Role } from "@/lib/types";

// Role pill in the top bar (Owner / Manager / Seller / Investor).
export function StatusBadge({ role }: { role: Role }) {
  return <RoleBadge role={role} className="hidden sm:inline-flex" />;
}
