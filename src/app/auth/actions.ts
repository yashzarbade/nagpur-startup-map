"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { db } from "@/db";
import {
  userProfiles,
  submissions,
  claims,
  savedJobs,
  savedCompanies,
  notifications,
  companies,
  jobs,
  events,
  founders,
} from "@/db/schema";
import { getCurrentUser, getCurrentProfile, requireAuth, requireAdmin } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Sign in with email & password
 */
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const returnTo = (formData.get("returnTo") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Ensure profile in database
    const { getOrCreateProfile } = await import("@/lib/auth");
    await getOrCreateProfile(data.user);
  }

  revalidatePath("/", "layout");
  return { success: true, returnTo };
}

/**
 * Sign up with email & password
 */
export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string) || "";
  const returnTo = (formData.get("returnTo") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { getOrCreateProfile } = await import("@/lib/auth");
    await getOrCreateProfile({
      id: data.user.id,
      email: data.user.email,
      user_metadata: { full_name: fullName },
    });
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: data.session
      ? "Account created successfully!"
      : "Registration successful. Please check your email to confirm your account.",
    returnTo,
  };
}

/**
 * Sign out action
 */
export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Update user profile
 */
export async function updateProfileAction(formData: FormData) {
  const { profile } = await requireAuth();

  const fullName = (formData.get("fullName") as string)?.trim();
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const bio = (formData.get("bio") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const skills = (formData.get("skills") as string)?.trim();
  const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim();
  const githubUrl = (formData.get("githubUrl") as string)?.trim();
  const portfolioUrl = (formData.get("portfolioUrl") as string)?.trim();
  const avatar = (formData.get("avatar") as string)?.trim();

  // Validate username uniqueness if changed
  if (username && username !== profile.username) {
    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.username, username))
      .limit(1);

    if (existing && existing.userId !== profile.userId) {
      return { error: "Username is already taken by another user." };
    }
  }

  await db
    .update(userProfiles)
    .set({
      fullName: fullName || profile.fullName,
      username: username || profile.username,
      bio: bio ?? profile.bio,
      location: location ?? profile.location,
      city: city ?? profile.city,
      skills: skills ?? profile.skills,
      linkedinUrl: linkedinUrl ?? profile.linkedinUrl,
      githubUrl: githubUrl ?? profile.githubUrl,
      portfolioUrl: portfolioUrl ?? profile.portfolioUrl,
      avatar: avatar ?? profile.avatar,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, profile.userId));

  revalidatePath("/dashboard");
  revalidatePath(`/profile/${username || profile.username}`);
  return { success: true, message: "Profile updated successfully." };
}

/**
 * Toggle Save Job (Bookmark)
 */
export async function toggleSaveJobAction(jobId: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please log in to save jobs.", requiresLogin: true };
  }

  const [existing] = await db
    .select()
    .from(savedJobs)
    .where(and(eq(savedJobs.userId, user.id), eq(savedJobs.jobId, jobId)))
    .limit(1);

  if (existing) {
    await db
      .delete(savedJobs)
      .where(and(eq(savedJobs.userId, user.id), eq(savedJobs.jobId, jobId)));
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");
    return { saved: false };
  } else {
    await db.insert(savedJobs).values({
      userId: user.id,
      jobId,
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");
    return { saved: true };
  }
}

/**
 * Toggle Save Company (Bookmark)
 */
export async function toggleSaveCompanyAction(companyId: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please log in to save companies.", requiresLogin: true };
  }

  const [existing] = await db
    .select()
    .from(savedCompanies)
    .where(and(eq(savedCompanies.userId, user.id), eq(savedCompanies.companyId, companyId)))
    .limit(1);

  if (existing) {
    await db
      .delete(savedCompanies)
      .where(and(eq(savedCompanies.userId, user.id), eq(savedCompanies.companyId, companyId)));
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");
    return { saved: false };
  } else {
    await db.insert(savedCompanies).values({
      userId: user.id,
      companyId,
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");
    return { saved: true };
  }
}

/**
 * Create a new submission (Company, Job, Event, Founder)
 * Requires authenticated user. Content is saved with status = PENDING.
 * Cannot be published directly by normal users.
 */
export async function createSubmissionAction(input: {
  type: "COMPANY" | "JOB" | "EVENT" | "FOUNDER";
  cityId?: number;
  data: Record<string, any>;
}): Promise<{ success: boolean; submissionId?: number; error?: string }> {
  try {
    const { user, profile } = await requireAuth();

    const [submission] = await db
      .insert(submissions)
      .values({
        userId: user.id,
        type: input.type,
        cityId: input.cityId || 1,
        data: input.data,
        status: "PENDING",
        submitterEmail: user.email || profile.email,
        source: "USER_SUBMISSION",
      })
      .returning();

    // Create an automatic notification for user
    await db.insert(notifications).values({
      userId: user.id,
      title: `Submission Received: ${input.data.name || input.data.title || input.type}`,
      message: `Your ${input.type.toLowerCase()} submission is under review by our moderation team.`,
      type: "SUBMISSION_RECEIVED",
      link: "/dashboard",
    });

    revalidatePath("/dashboard");
    return { success: true, submissionId: submission.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit content" };
  }
}

/**
 * Create a claim request for a company
 */
export async function createClaimAction(input: {
  companyId: number;
  name: string;
  email: string;
  role?: string;
  linkedinUrl?: string;
  evidence?: string;
}): Promise<{ success: boolean; claimId?: number; error?: string }> {
  try {
    const { user } = await requireAuth();

    const [claim] = await db
      .insert(claims)
      .values({
        companyId: input.companyId,
        userId: user.id,
        name: input.name,
        email: input.email,
        role: input.role,
        linkedinUrl: input.linkedinUrl,
        evidence: input.evidence,
        status: "PENDING",
      })
      .returning();

    // Create notification
    await db.insert(notifications).values({
      userId: user.id,
      title: `Company Claim Submitted`,
      message: `Your verification claim is being reviewed by the admin team.`,
      type: "CLAIM_PENDING",
      link: "/dashboard",
    });

    revalidatePath("/dashboard");
    return { success: true, claimId: claim.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit claim" };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationReadAction(notificationId: number) {
  const { user } = await requireAuth();

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, user.id)));

  revalidatePath("/dashboard");
  return { success: true };
}
