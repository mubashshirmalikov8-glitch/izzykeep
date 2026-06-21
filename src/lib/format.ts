const SYMBOL: Record<string, string> = { USD: "$", UZS: "сум", RUB: "₽", EUR: "€" };

export function money(amount: number, currency = "USD"): string {
  const n = Math.round(amount).toLocaleString("ru-RU");
  const sym = SYMBOL[currency] ?? currency;
  return currency === "USD" || currency === "EUR" ? `${sym}${n}` : `${n} ${sym}`;
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
