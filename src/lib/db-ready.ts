// Single source of truth for "is the database wired up yet?".
// Until you set a real DATABASE_URL (and run the migration), the app reads from
// mock data so every screen is fully viewable. Flip to live DB = set the env.
//
// Placeholder URLs (the prisma-init default, or .env.example stubs) count as
// "not ready" so a leftover placeholder never crashes the app into the DB path.
const url = process.env.DATABASE_URL?.trim() ?? "";
const isPlaceholder =
  url === "" ||
  url.includes("johndoe") ||
  url.includes("<") ||
  url.includes("u:p@localhost");

export const DB_READY = !isPlaceholder;
