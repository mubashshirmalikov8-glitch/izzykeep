import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { CurrentUser, Role, Plan } from "./types";
import { prisma } from "./prisma";
import { createClient } from "./supabase/server";

type AuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

type DbUser = {
  id: string;
  name: string | null;
  email: string;
  userCode: string;
  role: string;
  plan: string;
  profileDone: boolean;
};

function toCurrentUser(u: DbUser): CurrentUser {
  return {
    id: u.id,
    name: u.name ?? "",
    email: u.email,
    userCode: u.userCode,
    role: u.role as Role,
    plan: u.plan as Plan,
    profileDone: u.profileDone,
  };
}

// Unique 7-digit display code, retrying on the rare collision.
async function uniqueUserCode(): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = String(1_000_000 + Math.floor(Math.random() * 9_000_000));
    const taken = await prisma.user.findUnique({ where: { userCode: code }, select: { id: true } });
    if (!taken) return code;
  }
  throw new Error("Failed to generate a unique user code");
}

// Find-or-create the Prisma user for a Supabase auth user. Idempotent.
export async function provisionUser(authUser: AuthUser): Promise<CurrentUser> {
  let user = await prisma.user.findUnique({ where: { authId: authUser.id } });

  // Link a pre-existing row by email (e.g. created before auth) on first login.
  if (!user && authUser.email) {
    const byEmail = await prisma.user.findUnique({ where: { email: authUser.email } });
    if (byEmail) {
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: { authId: authUser.id },
      });
    }
  }

  if (!user) {
    const meta = authUser.user_metadata ?? {};
    const fullName =
      (typeof meta.full_name === "string" && meta.full_name) ||
      (typeof meta.name === "string" && meta.name) ||
      null;
    user = await prisma.user.create({
      data: {
        authId: authUser.id,
        email: authUser.email ?? `${authUser.id}@users.izzykeep.local`,
        name: fullName,
        userCode: await uniqueUserCode(),
        role: "SELLER",
        plan: "FREE",
        profileDone: false,
      },
    });
  }

  return toCurrentUser(user);
}

// Current authenticated user (provisions on first call). Deduped per request.
// Redirects to /login if there is no Supabase session.
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return provisionUser({ id: user.id, email: user.email, user_metadata: user.user_metadata });
});
