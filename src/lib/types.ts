// Domain view-models used by the app UI. Decoupled from Prisma so pages can
// render from mock data now and from the live DB once DATABASE_URL is set.

export type Role = "SELLER" | "INVESTOR";
export type Plan = "FREE" | "PRO" | "BUSINESS";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  userCode: string;
  role: Role;
  plan: Plan;
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
