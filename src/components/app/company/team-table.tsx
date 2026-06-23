import { RoleBadge } from "@/components/app/role-badge";
import type { CompanyMember } from "@/lib/types";

export function TeamTable({ members }: { members: CompanyMember[] }) {
  if (!members.length) return <p className="py-10 text-center text-sm text-izzy-muted">Пока только вы.</p>;
  return (
    <ul className="flex flex-col">
      {members.map((m) => (
        <li key={m.id} className="flex items-center gap-3 border-b border-izzy-hairline/60 py-3 last:border-0">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-izzy-surface-2 text-sm font-semibold text-izzy-text">
            {(m.name.trim()[0] ?? "?").toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-izzy-text">
              {m.name}
              {m.isOwner && <span className="text-izzy-muted"> · вы</span>}
            </p>
            <p className="truncate font-data text-xs text-izzy-muted">{m.email}</p>
          </div>
          <RoleBadge role={m.role} />
        </li>
      ))}
    </ul>
  );
}
