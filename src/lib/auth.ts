import { createServerSupabaseClient } from "./supabase/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { UserProfile } from "@/types";
import { redirect } from "next/navigation";

/**
 * Get current authenticated user from Supabase session
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch (err) {
    console.error("[auth] Error getting current user:", err);
    return null;
  }
}

/**
 * Ensure a user profile exists in database for the given auth user.
 * If not, create default profile with role = 'USER'.
 */
export async function getOrCreateProfile(authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}): Promise<UserProfile | null> {
  if (!authUser || !authUser.id) return null;

  try {
    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, authUser.id))
      .limit(1);

    if (existing) {
      return existing;
    }

    // Generate unique username
    const meta = authUser.user_metadata || {};
    const fullName =
      meta.full_name ||
      meta.name ||
      authUser.email?.split("@")[0] ||
      "User";
    const baseUsername = (
      meta.user_name ||
      authUser.email?.split("@")[0] ||
      "user"
    )
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    const username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
    const avatar = meta.avatar_url || meta.picture || null;

    const [created] = await db
      .insert(userProfiles)
      .values({
        userId: authUser.id,
        email: authUser.email || null,
        fullName,
        username,
        avatar,
        role: "USER",
        status: "ACTIVE",
      })
      .returning();

    return created || null;
  } catch (err) {
    console.error("[auth] Error getting or creating user profile:", err);
    return null;
  }
}

/**
 * Get the current user's profile and enforced role from DB
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getOrCreateProfile(user);
}

/**
 * Require authentication - redirects to login if not signed in
 */
export async function requireAuth(returnTo: string = "/dashboard"): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
  profile: UserProfile;
}> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const profile = await getOrCreateProfile(user);
  if (!profile) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  if (profile.status === "DISABLED") {
    redirect(`/login?error=account_disabled`);
  }

  return { user, profile };
}

/**
 * Strictly enforce ADMIN role on server side.
 * Never trust client headers or client state.
 * Returns 403 or redirects if unauthorized.
 */
export async function requireAdmin(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
  profile: UserProfile;
}> {
  const { user, profile } = await requireAuth("/admin");

  if (profile.role !== "ADMIN") {
    // Non-admin trying to access admin area: redirect to home or safe page
    redirect("/?error=unauthorized");
  }

  return { user, profile };
}

/**
 * Enforce COMPANY or ADMIN role
 */
export async function requireCompanyOrAdmin(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
  profile: UserProfile;
}> {
  const { user, profile } = await requireAuth("/dashboard");

  if (profile.role !== "COMPANY" && profile.role !== "ADMIN") {
    redirect("/dashboard?error=company_required");
  }

  return { user, profile };
}
