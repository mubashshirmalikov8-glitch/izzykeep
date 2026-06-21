import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

// Seller vs Investor — drives a small status pill in the top bar.
export function StatusBadge({ role }: { role: Role }) {
  const seller = role === "SELLER";
  return (
    <span
      className={cn(
        "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-data text-xs sm:inline-flex",
        seller
          ? "border-izzy-brand/30 bg-izzy-brand/10 text-izzy-accent"
          : "border-izzy-profit/30 bg-izzy-profit/10 text-izzy-profit",
      )}
    >
      <span className={cn("size-1.5 rounded-full", seller ? "bg-izzy-accent" : "bg-izzy-profit")} />
      {seller ? "Seller" : "Investor"}
    </span>
  );
}
