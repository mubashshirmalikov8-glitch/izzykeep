import type { CurrentUser } from "./types";

// Demo dataset — used until DATABASE_URL is set. Numbers mirror the landing
// ledger so the marketing demo and the real app stay consistent.

export const DEMO_USER: CurrentUser = {
  id: "demo-user",
  name: "Иван",
  email: "demo@izzykeep.uz",
  userCode: "1024753",
  role: "SELLER",
  plan: "PRO",
};

export type MockLot = {
  id: string;
  code: string;
  name: string;
  currency: string;
  margin: number;
};

export type MockItem = {
  id: string;
  code: string;
  lotId: string;
  partName: string;
  carName: string | null;
  oem: string | null;
  unit: string;
  qty: number;
  costUsd: number;
  salePrice: number;
};

export type MockSale = {
  id: string;
  itemId: string;
  lotId: string;
  qty: number;
  salePrice: number;
  seller: string | null;
  soldAt: string;
};

export const MOCK_LOTS: MockLot[] = [
  { id: "lot1", code: "LOT-7F3A21", name: "Toyota — партия №1", currency: "USD", margin: 25 },
  { id: "lot2", code: "LOT-3B81C0", name: "Lexus оптом", currency: "USD", margin: 30 },
];

export const MOCK_ITEMS: MockItem[] = [
  { id: "i1", code: "ITEM-A1", lotId: "lot1", partName: "Колодки передние", carName: "Camry 50", oem: "04465-33471", unit: "шт", qty: 8, costUsd: 12, salePrice: 22 },
  { id: "i2", code: "ITEM-A2", lotId: "lot1", partName: "Фильтр масляный", carName: "Corolla", oem: "90915-YZZD4", unit: "шт", qty: 24, costUsd: 3, salePrice: 7 },
  { id: "i3", code: "ITEM-A3", lotId: "lot1", partName: "Пружина подвески", carName: "Camry 70", oem: "48131-06710", unit: "шт", qty: 6, costUsd: 28, salePrice: 45 },
  { id: "i4", code: "ITEM-B1", lotId: "lot2", partName: "Фильтр воздушный", carName: "RAV4", oem: "17801-0H080", unit: "шт", qty: 15, costUsd: 6, salePrice: 13 },
  { id: "i5", code: "ITEM-B2", lotId: "lot2", partName: "Амортизатор задний", carName: "LX570", oem: "48530-69745", unit: "шт", qty: 4, costUsd: 95, salePrice: 150 },
];

export const MOCK_SALES: MockSale[] = [
  { id: "s1", itemId: "i1", lotId: "lot1", qty: 2, salePrice: 22, seller: "Иван", soldAt: "2026-06-18T10:20:00Z" },
  { id: "s2", itemId: "i2", lotId: "lot1", qty: 5, salePrice: 7, seller: "Иван", soldAt: "2026-06-19T14:05:00Z" },
  { id: "s3", itemId: "i3", lotId: "lot1", qty: 1, salePrice: 45, seller: "Алишер", soldAt: "2026-06-20T09:40:00Z" },
  { id: "s4", itemId: "i5", lotId: "lot2", qty: 1, salePrice: 150, seller: "Иван", soldAt: "2026-06-20T16:30:00Z" },
];
