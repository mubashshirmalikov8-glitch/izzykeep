import { PageHeader } from "@/components/app/page-header";
import { ProfileForm } from "./profile-form";
import { CompanyForm } from "./company-form";
import { TelegramSection } from "./telegram-section";
import { SecuritySection } from "./security-section";
import { AppearanceSection } from "./appearance-section";
import { getAccount } from "@/lib/queries/account";

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1.5 max-w-md text-sm text-izzy-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function SettingsPage() {
  const a = await getAccount();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="Настройки" subtitle="Профиль, компания, Telegram, безопасность и вид" />

      <Card title="Профиль">
        <ProfileForm defaultName={a.name} defaultPhone={a.phone} email={a.email} userCode={a.userCode} />
      </Card>

      <Card title="Компания">
        <CompanyForm defaultCompanyName={a.companyName} role={a.role} plan={a.plan} />
      </Card>

      <Card
        title="Telegram"
        description="Привяжите Telegram, чтобы вести склад, продажи и отчёты из бота. Данные общие с сайтом."
      >
        <TelegramSection linked={a.telegramLinked} telegramId={a.telegramId} />
      </Card>

      <Card title="Безопасность">
        <SecuritySection email={a.email} />
      </Card>

      <Card title="Внешний вид">
        <AppearanceSection />
      </Card>
    </div>
  );
}
