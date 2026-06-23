// Static reference: what each role can do. Informational, not enforced yet.
const ROLES = ["Owner", "Manager", "Seller", "Investor"] as const;

const CAPS: { label: string; allow: [boolean, boolean, boolean, boolean] }[] = [
  { label: "Просмотр склада", allow: [true, true, true, true] },
  { label: "Продажи", allow: [true, true, true, false] },
  { label: "Создание лотов", allow: [true, true, false, false] },
  { label: "Финансы и аналитика", allow: [true, true, false, true] },
  { label: "Управление командой", allow: [true, false, false, false] },
  { label: "Настройки компании", allow: [true, false, false, false] },
];

export function PermissionsOverview() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse">
        <thead>
          <tr className="border-b border-izzy-hairline">
            <th className="py-2 pr-3 text-left font-data text-[11px] uppercase tracking-wider text-izzy-muted">
              Возможность
            </th>
            {ROLES.map((r) => (
              <th key={r} className="px-2 py-2 text-center font-data text-[11px] uppercase tracking-wider text-izzy-steel">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAPS.map((cap) => (
            <tr key={cap.label} className="border-b border-izzy-hairline/60 last:border-0">
              <td className="py-2.5 pr-3 text-sm text-izzy-text">{cap.label}</td>
              {cap.allow.map((ok, i) => (
                <td key={i} className="px-2 py-2.5 text-center font-data text-sm">
                  {ok ? <span className="text-izzy-profit">✓</span> : <span className="text-izzy-muted">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
