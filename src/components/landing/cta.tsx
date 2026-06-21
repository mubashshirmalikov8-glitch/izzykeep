import { Reveal } from "@/components/landing/reveal";

export function CTA() {
  return (
    <section id="cta" className="scroll-mt-20 border-t border-izzy-hairline/60">
      <div className="relative mx-auto max-w-6xl overflow-hidden px-5 py-28 lg:py-36">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="blueprint-grid absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
          <div className="absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-izzy-brand/15 blur-[120px]" />
        </div>

        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Наведите порядок в складе уже сегодня.
            </h2>
            <p className="mt-5 text-lg text-izzy-muted">
              Заведите первый лот за пару минут и сразу увидите остатки и прибыль.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-lg bg-izzy-brand-strong px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep"
              >
                Начать бесплатно
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-lg border border-izzy-hairline px-6 py-3.5 text-sm font-medium text-izzy-text transition-colors hover:bg-izzy-surface"
              >
                Как это работает
              </a>
            </div>
            <p className="mt-5 font-data text-xs text-izzy-muted">
              Бесплатный тариф · без карты
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
