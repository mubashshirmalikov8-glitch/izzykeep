import { PageHeader } from "@/components/app/page-header";
import { DemoNotice } from "@/components/app/demo-notice";
import { CompanyProfile } from "@/components/app/company/company-profile";
import { TeamTable } from "@/components/app/company/team-table";
import { PermissionsOverview } from "@/components/app/company/permissions-overview";
import { ActivitySummary } from "@/components/app/company/activity-summary";
import { getCompany } from "@/lib/queries/company";
import { DB_READY } from "@/lib/db-ready";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-izzy-steel">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function CompanyPage() {
  const data = await getCompany();

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader title="Компания" subtitle="Профиль, команда, роли и активность" />
      {!DB_READY && <DemoNotice />}

      <CompanyProfile data={data} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Команда">
          <TeamTable members={data.members} />
        </Card>
        <Card title="Последняя активность">
          <ActivitySummary items={data.activity} />
        </Card>
      </div>

      <Card title="Права доступа">
        <PermissionsOverview />
      </Card>
    </div>
  );
}
