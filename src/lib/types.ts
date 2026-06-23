// Domain view-models used by the app UI. Decoupled from Prisma so pages can
// render from mock data now and from the live DB once DATABASE_URL is set.

export type Role = "OWNER" | "MANAGER" | "SELLER" | "INVESTOR";
export type Plan = "FREE" | "PRO" | "BUSINESS";

export type CompanyMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isOwner: boolean;
};
export type ActivityItem = {
  at: string; // ISO
  kind: "sale" | "lot" | "item";
  text: string;
  amount: string | null;
};
export type CompanyData = {
  companyName: string;
  ownerName: string;
  email: string;
  userCode: string;
  plan: Plan;
  joinedAt: string;
  lotsCount: number;
  productsCount: number;
  salesCount: number;
  revenue: number;
  currency: string;
  members: CompanyMember[];
  activity: ActivityItem[];
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  userCode: string;
  role: Role;
  plan: Plan;
  profileDone: boolean;
};

export type LotRow = {
  id: string;
  code: string;
  name: string;
  currency: string;
  margin: number;
  itemCount: number;
  remainingUnits: number;
  soldUnits: number;
  profit: number;
};

export type WarehouseRow = {
  id: string;
  code: string;
  partName: string;
  carName: string | null;
  oem: string | null;
  unit: string;
  qty: number;
  sold: number;
  remaining: number;
  costUsd: number;
  salePrice: number;
  currency: string;
  lotCode: string;
};

export type FinancePoint = { date: string; revenue: number };
export type LotProfit = { code: string; name: string; profit: number };

export type FinanceSummary = {
  revenue: number;
  profit: number;
  investments: number;
  roi: number; // percent
  lotsCount: number;
  productsCount: number;
  salesCount: number;
  aov: number;
  currency: string;
  revenueByDay: FinancePoint[];
  profitByLot: LotProfit[];
};

export type SalesDayPoint = { date: string; units: number; revenue: number };
export type BarDatum = { label: string; value: number; display: string };
export type AbcRow = {
  code: string;
  name: string;
  revenue: number;
  share: number; // %
  cumulative: number; // %
  cls: "A" | "B" | "C";
};
export type ForecastRow = {
  code: string;
  name: string;
  remaining: number;
  perDay: number;
  daysOfCover: number | null;
  eta: string | null; // ISO date
};
export type LowStockRow = {
  code: string;
  name: string;
  remaining: number;
  daysOfCover: number | null;
  reason: string;
};
export type SlowRow = {
  code: string;
  name: string;
  sold: number;
  remaining: number;
  sellThrough: number; // %
};
export type AnalyticsData = {
  currency: string;
  salesByDay: SalesDayPoint[];
  topSelling: BarDatum[];
  profitByProduct: BarDatum[];
  profitByLot: BarDatum[];
  abc: AbcRow[];
  forecast: ForecastRow[];
  lowStock: LowStockRow[];
  slowMoving: SlowRow[];
};

export type SaleRow = {
  id: string;
  soldAt: string; // ISO
  itemCode: string;
  partName: string;
  lotCode: string;
  qty: number;
  salePrice: number;
  total: number;
  currency: string;
  seller: string | null;
};
