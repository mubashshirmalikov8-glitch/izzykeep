import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { getCurrentUser } from "@/lib/auth";

const PLAN_LABEL: Record<string, string> = {
  FREE: "Бесплатный",
  PRO: "Pro",
  BUSINESS: "Business",
};
const ROLE_LABEL: Record<string, string> = {
  SELLER: "Продавец",
  INVESTOR: "Инвестор",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const initial = (user.name?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Профиль" />

      <div className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-izzy-brand-strong text-xl font-semibold text-white">
            {initial}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-bold">{user.name}</h2>
            <p className="truncate font-data text-sm text-izzy-muted">{user.email}</p>
          </div>
          <div className="ml-auto">
            <StatusBadge role={user.role} />
          </div>
        </div>

        <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-izzy-hairline bg-izzy-hairline sm:grid-cols-3">
          <Field label="Код пользователя" value={`#${user.userCode}`} />
          <Field label="Роль" value={ROLE_LABEL[user.role] ?? user.role} />
          <Field label="Тариф" value={PLAN_LABEL[user.plan] ?? user.plan} />
        </dl>

        <p className="mt-5 text-xs text-izzy-muted">
          Редактирование профиля появится вместе с входом через Google.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-izzy-surface p-4">
      <dt className="font-data text-[11px] uppercase tracking-wider text-izzy-muted">{label}</dt>
      <dd className="mt-1 font-data text-sm text-izzy-text">{value}</dd>
    </div>
  );
}
