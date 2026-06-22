import "server-only";
import type { CurrentUser, Role, Plan } from "./types";
import { DB_READY } from "./db-ready";
import { DEMO_USER } from "./mock-data";

// TEMPORARY: returns a fixed demo user. Replace with the real session lookup
// once Google OAuth lands (read session cookie → resolve User). Until then,
// without a DB this returns the in-memory demo user; with a DB it upserts it.
export async function getCurrentUser(): Promise<CurrentUser> {
  if (!DB_READY) return DEMO_USER;

  const { prisma } = await import("./prisma");
  const u = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {},
    create: {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      userCode: DEMO_USER.userCode,
      role: DEMO_USER.role,
      plan: DEMO_USER.plan,
      profileDone: true,
    },
  });
  return {
    id: u.id,
    name: u.name ?? "Профиль",
    email: u.email,
    userCode: u.userCode,
    role: u.role as Role,
    plan: u.plan as Plan,
  };
}
