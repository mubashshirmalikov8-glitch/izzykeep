-- Demo seed for IzzyKeep. Idempotent (ON CONFLICT DO NOTHING).
-- Mirrors src/lib/mock-data.ts so the app looks identical with or without DB.

INSERT INTO users (id, user_code, email, name, role, plan, profile_done, created_at, updated_at)
VALUES ('demo-user', '1024753', 'demo@izzykeep.uz', 'Иван', 'SELLER', 'PRO', true, now(), now())
ON CONFLICT (email) DO NOTHING;

INSERT INTO lots (id, code, name, currency, rate, margin, creator_id, owner_id, created_at, updated_at) VALUES
  ('lot1', 'LOT-7F3A21', 'Toyota — партия №1', 'USD', 1, 25, 'demo-user', 'demo-user', now(), now()),
  ('lot2', 'LOT-3B81C0', 'Lexus оптом',        'USD', 1, 30, 'demo-user', 'demo-user', now(), now())
ON CONFLICT (code) DO NOTHING;

INSERT INTO warehouse_items (id, code, lot_id, part_name, car_name, oem, unit, qty, cost_usd, margin, sale_price, created_at, updated_at) VALUES
  ('i1', 'ITEM-A1', 'lot1', 'Колодки передние',  'Camry 50', '04465-33471', 'шт',  8, 12, 25,  22, now(), now()),
  ('i2', 'ITEM-A2', 'lot1', 'Фильтр масляный',   'Corolla',  '90915-YZZD4', 'шт', 24,  3, 25,   7, now(), now()),
  ('i3', 'ITEM-A3', 'lot1', 'Пружина подвески',  'Camry 70', '48131-06710', 'шт',  6, 28, 25,  45, now(), now()),
  ('i4', 'ITEM-B1', 'lot2', 'Фильтр воздушный',  'RAV4',     '17801-0H080', 'шт', 15,  6, 30,  13, now(), now()),
  ('i5', 'ITEM-B2', 'lot2', 'Амортизатор задний','LX570',    '48530-69745', 'шт',  4, 95, 30, 150, now(), now())
ON CONFLICT (code) DO NOTHING;

INSERT INTO sales (id, lot_id, item_id, owner_id, qty, sale_price, total, seller, sold_at, created_at) VALUES
  ('s1', 'lot1', 'i1', 'demo-user', 2,  22,  44, 'Иван',   '2026-06-18T10:20:00Z', now()),
  ('s2', 'lot1', 'i2', 'demo-user', 5,   7,  35, 'Иван',   '2026-06-19T14:05:00Z', now()),
  ('s3', 'lot1', 'i3', 'demo-user', 1,  45,  45, 'Алишер', '2026-06-20T09:40:00Z', now()),
  ('s4', 'lot2', 'i5', 'demo-user', 1, 150, 150, 'Иван',   '2026-06-20T16:30:00Z', now())
ON CONFLICT (id) DO NOTHING;
