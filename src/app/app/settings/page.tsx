import { PageHeader } from "@/components/app/page-header";
import { TelegramLink } from "./telegram-link";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Настройки" />

      <section className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
        <h2 className="font-display text-lg font-semibold">Telegram-бот</h2>
        <p className="mt-1.5 max-w-md text-sm text-izzy-muted">
          Привяжите Telegram, чтобы вести склад, продажи и отчёты прямо из бота. Данные общие с
          сайтом.
        </p>
        <div className="mt-5">
          <TelegramLink />
        </div>
      </section>

      <section className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
        <h2 className="font-display text-lg font-semibold">Профиль и интерфейс</h2>
        <p className="mt-1.5 text-sm text-izzy-muted">
          Имя, язык, тема и уведомления — появятся в следующем обновлении.
        </p>
      </section>
    </div>
  );
}
