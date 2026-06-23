import "server-only";
import type { CompanyData, ActivityItem, CompanyMember, Plan, Role } from "../types";
import { money } from "../format";
import { DB_READY } from "../db-ready";
import { getCurrentUser } from "../auth";
import { DEMO_USER, MOCK_ITEMS, MOCK_LOTS, MOCK_SALES } from "../mock-data";

export async function getCompany(): Promise<CompanyData> {
  if (!DB_READY) {
    const lotById = new Map(MOCK_LOTS.map((l) => [l.id, l]));
    const itemById = new Map(MOCK_ITEMS.map((i) => [i.id, i]));
    const activity: ActivityItem[] = [];
    for (const l of MOCK_LOTS) activity.push({ at: "2026-06-22T07:46:00Z", kind: "lot", text: `Создан лот ${l.code} · ${l.name}`, amount: null });
    for (const s of MOCK_SALES) {
      const it = itemById.get(s.itemId);
      const l = lotById.get(s.lotId);
      activity.push({ at: s.soldAt, kind: "sale", text: `${s.seller ?? "—"} продал ${it?.partName ?? ""} ×${s.qty}`, amount: money(s.qty * s.salePrice, l?.currency ?? "USD") });
    }
    activity.sort((a, b) => b.at.localeCompare(a.at));
    return {
      companyName: "Моя компания",
      ownerName: DEMO_USER.name,
      email: DEMO_USER.email,
      userCode: DEMO_USER.userCode,
      plan: DEMO_USER.plan,
      joinedAt: "2026-06-14T00:00:00Z",
      lotsCount: MOCK_LOTS.length,
      productsCount: MOCK_ITEMS.length,
      salesCount: MOCK_SALES.length,
      revenue: MOCK_SALES.reduce((a, s) => a + s.qty * s.salePrice, 0),
      currency: MOCK_LOTS[0]?.currency ?? "USD",
      members: [{ id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email, role: DEMO_USER.role, isOwner: true }],
      activity: activity.slice(0, 8),
    };
  }

  const me = await getCurrentUser();
  const { prisma } = await import("../prisma");
  const u = await prisma.user.findUniqueOrThrow({ where: { id: me.id } });
  const lots = await prisma.lot.findMany({
    where: { ownerId: me.id },
    include: { items: { include: { sales: true } }, owner: true, creator: true },
  });

  // members = distinct FK-linked users across the owner's lots (+ owner self)
  const memberMap = new Map<string, CompanyMember>();
  const add = (x: { id: string; name: string | null; email: string; role: Role }) =>
    memberMap.set(x.id, { id: x.id, name: x.name ?? "—", email: x.email, role: x.role, isOwner: x.id === u.id });
  add(u);
  for (const l of lots) {
    add(l.owner);
    add(l.creator);
  }
  const members = [...memberMap.values()].sort((a, b) => Number(b.isOwner) - Number(a.isOwner));

  let products = 0;
  let salesCount = 0;
  let revenue = 0;
  const activity: ActivityItem[] = [];
  for (const l of lots) {
    activity.push({ at: l.createdAt.toISOString(), kind: "lot", text: `Создан лот ${l.code} · ${l.name}`, amount: null });
    for (const it of l.items) {
      products += 1;
      activity.push({ at: it.createdAt.toISOString(), kind: "item", text: `Добавлена позиция ${it.partName}`, amount: null });
      for (const s of it.sales) {
        salesCount += 1;
        revenue += Number(s.total);
        activity.push({
          at: s.soldAt.toISOString(),
          kind: "sale",
          text: `${s.seller ?? "—"} продал ${it.partName} ×${s.qty}`,
          amount: money(Number(s.total), l.currency),
        });
      }
    }
  }
  activity.sort((a, b) => b.at.localeCompare(a.at));

  return {
    companyName: u.companyName || "Моя компания",
    ownerName: u.name ?? "—",
    email: u.email,
    userCode: u.userCode,
    plan: u.plan as Plan,
    joinedAt: u.createdAt.toISOString(),
    lotsCount: lots.length,
    productsCount: products,
    salesCount,
    revenue,
    currency: lots[0]?.currency ?? "USD",
    members,
    activity: activity.slice(0, 8),
  };
}
