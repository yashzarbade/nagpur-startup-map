"use server";

import { db } from "@/db";
import {
  userProfiles,
  submissions,
  claims,
  companies,
  companyTags,
  jobs,
  events,
  founders,
  notifications,
  adminActions,
  jobApplications,
  jobAlerts,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { runJobSync } from "@/lib/job-sync";
import { resolveOrCreateCompany } from "@/lib/job-sync/deduplicator";
import { expirePassedWalkins } from "@/lib/job-sync/syncer";

/**
 * Trigger manual job sync from admin dashboard
 */
export async function triggerJobSyncAction() {
  await requireAdmin();
  try {
    const result = await runJobSync("MANUAL");
    revalidatePath("/admin");
    return { success: true, result };
  } catch (err: any) {
    return { error: err.message || "Job sync failed" };
  }
}

/**
 * Clean up expired walk-in jobs
 */
export async function expireWalkinsAction() {
  await requireAdmin();
  try {
    const expiredCount = await expirePassedWalkins();
    revalidatePath("/admin");
    revalidatePath("/walkins");
    return { success: true, expiredCount };
  } catch (err: any) {
    return { error: err.message || "Failed to expire walk-in jobs" };
  }
}

/**
 * Generate a clean URL slug from title/name
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Approve a submission and automatically publish the record
 */
export async function approveSubmissionAction(submissionId: number) {
  const { user: adminUser } = await requireAdmin();

  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);

  if (!submission) {
    return { error: "Submission not found." };
  }

  const data = (submission.data as Record<string, any>) || {};
  const cityId = submission.cityId || data.cityId || 1;

  let publishedEntityId: number | null = null;
  let publishedSlug = "";

  try {
    if (submission.type === "COMPANY") {
      const name = data.name || "Untitled Startup";
      let slug = data.slug || slugify(name);
      // Ensure unique slug
      const [existingSlug] = await db
        .select({ id: companies.id })
        .from(companies)
        .where(eq(companies.slug, slug))
        .limit(1);
      if (existingSlug) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const [newCompany] = await db
        .insert(companies)
        .values({
          name,
          slug,
          logoUrl: data.logoUrl || null,
          websiteUrl: data.websiteUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          xUrl: data.xUrl || data.twitterUrl || null,
          instagramUrl: data.instagramUrl || null,
          descriptionShort: data.descriptionShort || null,
          descriptionLong: data.descriptionLong || null,
          sector: data.sector || "Software",
          companyType: data.companyType || "Startup",
          stage: data.stage || "BOOTSTRAPPED",
          foundedYear: data.foundedYear ? parseInt(String(data.foundedYear), 10) : new Date().getFullYear(),
          teamSize: data.teamSize || "1-10",
          locationName: data.locationName || data.location || "Nagpur",
          address: data.address || null,
          latitude: data.latitude ? String(data.latitude) : null,
          longitude: data.longitude ? String(data.longitude) : null,
          cityId,
          hiring: Boolean(data.hiring),
          careersUrl: data.careersUrl || null,
          verificationStatus: "VERIFIED",
          lastVerifiedAt: new Date(),
          verificationSource: "Central India Tech Moderation",
          claimedByUserId: submission.userId || null,
        })
        .returning();

      publishedEntityId = newCompany.id;
      publishedSlug = newCompany.slug;

      // Add tags if provided
      if (data.tags) {
        const tagList = Array.isArray(data.tags)
          ? data.tags
          : String(data.tags).split(",").map((t) => t.trim()).filter(Boolean);

        for (const tag of tagList) {
          await db.insert(companyTags).values({
            companyId: newCompany.id,
            tag,
          });
        }
      }

      // Add founder if provided
      if (data.founderName) {
        const founderSlug = slugify(`${data.founderName}-${slug}`);
        await db.insert(founders).values({
          name: data.founderName,
          slug: founderSlug,
          role: data.founderRole || "Founder & CEO",
          companyId: newCompany.id,
          linkedinUrl: data.founderLinkedin || null,
          cityId,
        });
      }
    } else if (submission.type === "JOB") {
      const title = data.title || "Untitled Role";
      let companyId = data.companyId ? parseInt(String(data.companyId), 10) : null;

      // If companySlug was provided instead
      if (!companyId && data.companySlug) {
        const [comp] = await db
          .select({ id: companies.id })
          .from(companies)
          .where(eq(companies.slug, data.companySlug))
          .limit(1);
        if (comp) companyId = comp.id;
      }

      if (!companyId && data.companyName) {
        const comp = await resolveOrCreateCompany(data.companyName, cityId);
        companyId = comp.id;
      }

      if (!companyId) {
        // Fallback to first verified company or throw
        const [firstComp] = await db.select({ id: companies.id }).from(companies).limit(1);
        companyId = firstComp ? firstComp.id : 1;
      }

      const isWalkin = Boolean(data.isWalkin);
      const walkinDate = data.walkinDate ? new Date(data.walkinDate) : null;
      const expiry = walkinDate
        ? new Date(walkinDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      let slug = data.slug || slugify(`${title}-${Date.now().toString().slice(-4)}`);
      const [newJob] = await db
        .insert(jobs)
        .values({
          companyId,
          title,
          slug,
          description: data.description || null,
          location: data.location || (cityId === 1 ? "Nagpur" : cityId === 3 ? "Indore" : "Bhopal"),
          remoteType: data.remoteType || "ON_SITE",
          employmentType: data.employmentType || "FULL_TIME",
          experienceMin: data.experienceMin ? parseInt(String(data.experienceMin), 10) : null,
          experienceMax: data.experienceMax ? parseInt(String(data.experienceMax), 10) : null,
          salaryMin: data.salaryMin ? parseInt(String(data.salaryMin), 10) : null,
          salaryMax: data.salaryMax ? parseInt(String(data.salaryMax), 10) : null,
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || null,
          applicationUrl: data.applicationUrl || null,
          sourceType: isWalkin ? "WALKIN_SUBMISSION" : "MANUAL",
          department: data.department || "Engineering",
          status: "ACTIVE",
          cityId,
          isWalkin,
          walkinDate,
          walkinStartTime: data.walkinStartTime || null,
          walkinEndTime: data.walkinEndTime || null,
          walkinVenue: data.walkinVenue || null,
          verificationStatus: "VERIFIED",
          moderationStatus: "APPROVED",
          contactDetails: data.contactDetails || null,
          expiresAt: expiry,
        })
        .returning();

      publishedEntityId = newJob.id;
      publishedSlug = newJob.slug;
    } else if (submission.type === "EVENT") {
      const title = data.title || "Untitled Event";
      let slug = data.slug || slugify(`${title}-${Date.now().toString().slice(-4)}`);
      const eventDate = data.date ? new Date(data.date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const [newEvent] = await db
        .insert(events)
        .values({
          title,
          slug,
          description: data.description || null,
          eventType: data.eventType || "MEETUP",
          organizer: data.organizer || "Community",
          date: eventDate,
          startTime: data.startTime || null,
          endTime: data.endTime || null,
          venue: data.venue || null,
          location: data.location || "Nagpur",
          registrationUrl: data.registrationUrl || null,
          price: data.price || "Free",
          imageUrl: data.imageUrl || null,
          status: "UPCOMING",
          cityId,
        })
        .returning();

      publishedEntityId = newEvent.id;
      publishedSlug = newEvent.slug;
    } else if (submission.type === "FOUNDER") {
      const name = data.name || "Untitled Founder";
      let slug = data.slug || slugify(name);
      let companyId = data.companyId ? parseInt(String(data.companyId), 10) : null;

      const [newFounder] = await db
        .insert(founders)
        .values({
          name,
          slug,
          role: data.role || "Founder",
          bio: data.bio || null,
          photoUrl: data.photoUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          websiteUrl: data.websiteUrl || null,
          xUrl: data.xUrl || data.twitterUrl || null,
          location: data.location || "Nagpur",
          companyId,
          cityId,
        })
        .returning();

      publishedEntityId = newFounder.id;
      publishedSlug = newFounder.slug;
    }

    // Update submission record
    await db
      .update(submissions)
      .set({
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: adminUser.id,
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId));

    // Notify user if submitted by a registered user
    if (submission.userId) {
      await db.insert(notifications).values({
        userId: submission.userId,
        title: `Submission Approved! 🎉`,
        message: `Your ${submission.type.toLowerCase()} submission has been verified and published to Central India Tech.`,
        type: "SUBMISSION_APPROVED",
        link: publishedSlug ? `/${submission.type.toLowerCase()}/${publishedSlug}` : "/dashboard",
      });
    }

    // Log admin action
    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "APPROVE_SUBMISSION",
      entityType: submission.type,
      entityId: publishedEntityId,
      notes: `Approved submission #${submissionId}`,
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true, publishedEntityId, publishedSlug };
  } catch (err: any) {
    console.error("[admin] Error approving submission:", err);
    return { error: err.message || "Failed to approve submission." };
  }
}

/**
 * Reject a submission with an optional reason
 */
export async function rejectSubmissionAction(
  submissionId: number,
  rejectionReason: string = "Submission does not meet listing guidelines."
) {
  const { user: adminUser } = await requireAdmin();

  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);

  if (!submission) {
    return { error: "Submission not found." };
  }

  await db
    .update(submissions)
    .set({
      status: "REJECTED",
      rejectionReason,
      reviewedAt: new Date(),
      reviewedBy: adminUser.id,
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));

  if (submission.userId) {
    await db.insert(notifications).values({
      userId: submission.userId,
      title: `Submission Update: Rejected`,
      message: `Your ${submission.type.toLowerCase()} submission was not approved: ${rejectionReason}`,
      type: "SUBMISSION_REJECTED",
      link: "/dashboard",
    });
  }

  await db.insert(adminActions).values({
    adminId: adminUser.id,
    action: "REJECT_SUBMISSION",
    entityType: submission.type,
    entityId: submissionId,
    notes: `Reason: ${rejectionReason}`,
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Request changes on a submission
 */
export async function requestChangesSubmissionAction(
  submissionId: number,
  notes: string
) {
  const { user: adminUser } = await requireAdmin();

  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);

  if (!submission) {
    return { error: "Submission not found." };
  }

  await db
    .update(submissions)
    .set({
      status: "CHANGES_REQUESTED",
      rejectionReason: notes,
      reviewedAt: new Date(),
      reviewedBy: adminUser.id,
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));

  if (submission.userId) {
    await db.insert(notifications).values({
      userId: submission.userId,
      title: `Changes Requested for Submission`,
      message: `Moderation note: ${notes}`,
      type: "CHANGES_REQUESTED",
      link: "/dashboard",
    });
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Approve a company verification claim
 */
export async function approveClaimAction(claimId: number) {
  const { user: adminUser } = await requireAdmin();

  const [claim] = await db
    .select()
    .from(claims)
    .where(eq(claims.id, claimId))
    .limit(1);

  if (!claim) {
    return { error: "Claim not found." };
  }

  // Update claim status
  await db
    .update(claims)
    .set({
      status: "APPROVED",
      reviewedAt: new Date(),
      reviewedBy: adminUser.id,
      updatedAt: new Date(),
    })
    .where(eq(claims.id, claimId));

  // Link company to claimed state
  await db
    .update(companies)
    .set({
      claimed: true,
      claimedByUserId: claim.userId || null,
      verificationStatus: "CLAIMED",
      updatedAt: new Date(),
    })
    .where(eq(companies.id, claim.companyId));

  // If claimed by a registered user, upgrade their role to COMPANY
  if (claim.userId) {
    await db
      .update(userProfiles)
      .set({
        role: "COMPANY",
        claimedCompanyId: claim.companyId,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, claim.userId));

    await db.insert(notifications).values({
      userId: claim.userId,
      title: `Company Claim Approved! 🏢`,
      message: `Your company claim has been verified. You can now manage your company profile and post jobs.`,
      type: "CLAIM_APPROVED",
      link: "/dashboard",
    });
  }

  await db.insert(adminActions).values({
    adminId: adminUser.id,
    action: "APPROVE_CLAIM",
    entityType: "COMPANY",
    entityId: claim.companyId,
    notes: `Claim #${claimId} approved for user ${claim.userId || claim.email}`,
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/startups");
  return { success: true };
}

/**
 * Reject a company claim
 */
export async function rejectClaimAction(
  claimId: number,
  rejectionReason: string = "Ownership verification could not be established."
) {
  const { user: adminUser } = await requireAdmin();

  const [claim] = await db
    .select()
    .from(claims)
    .where(eq(claims.id, claimId))
    .limit(1);

  if (!claim) {
    return { error: "Claim not found." };
  }

  await db
    .update(claims)
    .set({
      status: "REJECTED",
      rejectionReason,
      reviewedAt: new Date(),
      reviewedBy: adminUser.id,
      updatedAt: new Date(),
    })
    .where(eq(claims.id, claimId));

  if (claim.userId) {
    await db.insert(notifications).values({
      userId: claim.userId,
      title: `Company Claim Rejected`,
      message: `Your verification claim was not approved: ${rejectionReason}`,
      type: "CLAIM_REJECTED",
      link: "/dashboard",
    });
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Change user role (USER, COMPANY, ADMIN)
 */
export async function updateUserRoleAction(
  targetUserId: string,
  newRole: "USER" | "COMPANY" | "ADMIN"
) {
  const { user: adminUser } = await requireAdmin();

  await db
    .update(userProfiles)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, targetUserId));

  await db.insert(notifications).values({
    userId: targetUserId,
    title: `Account Role Updated`,
    message: `Your account role has been updated to ${newRole}.`,
    type: "ROLE_UPDATED",
    link: "/dashboard",
  });

  await db.insert(adminActions).values({
    adminId: adminUser.id,
    action: "UPDATE_USER_ROLE",
    entityType: "USER",
    notes: `Updated user ${targetUserId} to role ${newRole}`,
  });

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Toggle user account status (ACTIVE vs DISABLED)
 */
export async function toggleUserStatusAction(
  targetUserId: string,
  newStatus: "ACTIVE" | "DISABLED"
) {
  const { user: adminUser } = await requireAdmin();

  await db
    .update(userProfiles)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, targetUserId));

  await db.insert(adminActions).values({
    adminId: adminUser.id,
    action: "TOGGLE_USER_STATUS",
    entityType: "USER",
    notes: `Set user ${targetUserId} status to ${newStatus}`,
  });

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Moderate a Job (Expire, Verify, Delete)
 */
export async function moderateJobAction(
  jobId: number,
  action: "EXPIRE" | "ACTIVATE" | "DELETE"
) {
  const { user: adminUser } = await requireAdmin();

  if (action === "EXPIRE") {
    await db.update(jobs).set({ status: "EXPIRED" }).where(eq(jobs.id, jobId));
  } else if (action === "ACTIVATE") {
    await db.update(jobs).set({ status: "ACTIVE" }).where(eq(jobs.id, jobId));
  } else if (action === "DELETE") {
    await db.delete(jobs).where(eq(jobs.id, jobId));
  }

  revalidatePath("/admin");
  revalidatePath("/jobs");
  return { success: true };
}

/**
 * Moderate an Event (Cancel, Verify, Delete)
 */
export async function moderateEventAction(
  eventId: number,
  action: "CANCEL" | "ACTIVATE" | "DELETE"
) {
  const { user: adminUser } = await requireAdmin();

  if (action === "CANCEL") {
    await db.update(events).set({ status: "CANCELLED" }).where(eq(events.id, eventId));
  } else if (action === "ACTIVATE") {
    await db.update(events).set({ status: "UPCOMING" }).where(eq(events.id, eventId));
  } else if (action === "DELETE") {
    await db.delete(events).where(eq(events.id, eventId));
  }

  revalidatePath("/admin");
  revalidatePath("/events");
  return { success: true };
}

// ─── Phase 6: Production CMS Direct Management Actions ───────────────────────

export interface CompanyAdminInput {
  name: string;
  slug?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  sector?: string;
  companyType?: string;
  stage?: any;
  foundedYear?: number | null;
  teamSize?: string;
  locationName?: string;
  address?: string;
  latitude?: string | null;
  longitude?: string | null;
  cityId: number;
  hiring?: boolean;
  featured?: boolean;
  verificationStatus?: any;
  careersUrl?: string;
}

/**
 * Directly create a new company in production DB
 */
export async function createCompanyAction(data: CompanyAdminInput) {
  const { user: adminUser } = await requireAdmin();

  try {
    if (!data.name || !data.cityId) {
      return { error: "Company name and city are required." };
    }

    let slug = data.slug || slugify(data.name);
    const existing = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const [newComp] = await db
      .insert(companies)
      .values({
        name: data.name.trim(),
        slug,
        websiteUrl: data.websiteUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        descriptionShort: data.descriptionShort || null,
        descriptionLong: data.descriptionLong || null,
        sector: data.sector || "Software",
        companyType: data.companyType || "Startup",
        stage: data.stage || "UNKNOWN",
        foundedYear: data.foundedYear || null,
        teamSize: data.teamSize || "1-10",
        locationName: data.locationName || null,
        address: data.address || null,
        latitude: data.latitude ? String(data.latitude) : null,
        longitude: data.longitude ? String(data.longitude) : null,
        cityId: data.cityId,
        hiring: !!data.hiring,
        featured: !!data.featured,
        careersUrl: data.careersUrl || null,
        verificationStatus: data.verificationStatus || "VERIFIED",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastVerifiedAt: new Date(),
        verificationSource: "ADMIN_CONSOLE",
      })
      .returning();

    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "CREATE_COMPANY",
      entityType: "COMPANY",
      entityId: newComp.id,
      notes: `Admin manually created company ${newComp.name} (cityId: ${newComp.cityId})`,
    });

    revalidatePath("/admin");
    revalidatePath("/startups");
    revalidatePath("/", "layout");

    return { success: true, company: newComp };
  } catch (err: any) {
    console.error("[admin] Error creating company:", err);
    return { error: err.message || "Failed to create company." };
  }
}

/**
 * Directly update an existing company in production DB
 */
export async function updateCompanyAction(companyId: number, data: Partial<CompanyAdminInput>) {
  const { user: adminUser } = await requireAdmin();

  try {
    const [existing] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!existing) {
      return { error: "Company not found." };
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updatePayload.name = data.name.trim();
    if (data.websiteUrl !== undefined) updatePayload.websiteUrl = data.websiteUrl || null;
    if (data.linkedinUrl !== undefined) updatePayload.linkedinUrl = data.linkedinUrl || null;
    if (data.descriptionShort !== undefined) updatePayload.descriptionShort = data.descriptionShort || null;
    if (data.descriptionLong !== undefined) updatePayload.descriptionLong = data.descriptionLong || null;
    if (data.sector !== undefined) updatePayload.sector = data.sector;
    if (data.companyType !== undefined) updatePayload.companyType = data.companyType;
    if (data.stage !== undefined) updatePayload.stage = data.stage;
    if (data.foundedYear !== undefined) updatePayload.foundedYear = data.foundedYear || null;
    if (data.teamSize !== undefined) updatePayload.teamSize = data.teamSize;
    if (data.locationName !== undefined) updatePayload.locationName = data.locationName;
    if (data.address !== undefined) updatePayload.address = data.address;
    if (data.latitude !== undefined) updatePayload.latitude = data.latitude ? String(data.latitude) : null;
    if (data.longitude !== undefined) updatePayload.longitude = data.longitude ? String(data.longitude) : null;
    if (data.cityId !== undefined) updatePayload.cityId = data.cityId;
    if (data.hiring !== undefined) updatePayload.hiring = data.hiring;
    if (data.featured !== undefined) updatePayload.featured = data.featured;
    if (data.careersUrl !== undefined) updatePayload.careersUrl = data.careersUrl || null;
    if (data.verificationStatus !== undefined) updatePayload.verificationStatus = data.verificationStatus;

    const [updated] = await db
      .update(companies)
      .set(updatePayload)
      .where(eq(companies.id, companyId))
      .returning();

    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "UPDATE_COMPANY",
      entityType: "COMPANY",
      entityId: companyId,
      notes: `Updated company details for #${companyId}`,
    });

    revalidatePath("/admin");
    revalidatePath(`/company/${existing.slug}`);
    revalidatePath("/startups");
    revalidatePath("/", "layout");

    return { success: true, company: updated };
  } catch (err: any) {
    console.error("[admin] Error updating company:", err);
    return { error: err.message || "Failed to update company." };
  }
}

/**
 * Toggle company status or publication
 */
export async function toggleCompanyStatusAction(
  companyId: number,
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED"
) {
  const { user: adminUser } = await requireAdmin();

  await db
    .update(companies)
    .set({ verificationStatus, updatedAt: new Date() })
    .where(eq(companies.id, companyId));

  await db.insert(adminActions).values({
    adminId: adminUser.id,
    action: "TOGGLE_COMPANY_STATUS",
    entityType: "COMPANY",
    entityId: companyId,
    notes: `Set company #${companyId} verificationStatus to ${verificationStatus}`,
  });

  revalidatePath("/admin");
  revalidatePath("/startups");
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Toggle company featured status
 */
export async function toggleCompanyFeaturedAction(companyId: number, featured: boolean) {
  const { user: adminUser } = await requireAdmin();

  await db
    .update(companies)
    .set({ featured, updatedAt: new Date() })
    .where(eq(companies.id, companyId));

  revalidatePath("/admin");
  revalidatePath("/startups");
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Delete / Archive company
 */
export async function deleteCompanyAction(companyId: number) {
  const { user: adminUser } = await requireAdmin();

  await db.delete(companies).where(eq(companies.id, companyId));

  await db.insert(adminActions).values({
    adminId: adminUser.id,
    action: "DELETE_COMPANY",
    entityType: "COMPANY",
    entityId: companyId,
    notes: `Deleted company #${companyId}`,
  });

  revalidatePath("/admin");
  revalidatePath("/startups");
  revalidatePath("/", "layout");
  return { success: true };
}

// ─── Phase 6: Job CMS Management Actions ─────────────────────────────────────

export interface JobAdminInput {
  title: string;
  companyId: number;
  cityId: number;
  description?: string;
  location?: string;
  department?: string;
  remoteType?: "ON_SITE" | "REMOTE" | "HYBRID";
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  experienceMin?: number | null;
  experienceMax?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skills?: string;
  applicationUrl?: string;
  isWalkin?: boolean;
  walkinDate?: string | null;
  walkinStartTime?: string | null;
  walkinEndTime?: string | null;
  walkinVenue?: string | null;
  status?: "ACTIVE" | "EXPIRED" | "ARCHIVED";
  featured?: boolean;
}

/**
 * Create a new Job or Walk-in drive directly
 */
export async function createJobAction(data: JobAdminInput) {
  const { user: adminUser } = await requireAdmin();

  try {
    if (!data.title || !data.companyId || !data.cityId) {
      return { error: "Job title, company, and city are required." };
    }

    let slug = slugify(`${data.title}-${Date.now().toString().slice(-4)}`);
    const isWalkin = !!data.isWalkin;
    const walkinDate = data.walkinDate ? new Date(data.walkinDate) : null;
    const expiry = isWalkin && walkinDate
      ? new Date(walkinDate.getTime() + 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const [newJob] = await db
      .insert(jobs)
      .values({
        title: data.title.trim(),
        slug,
        companyId: data.companyId,
        cityId: data.cityId,
        description: data.description || null,
        location: data.location || (data.cityId === 3 ? "Indore" : data.cityId === 6 ? "Bhopal" : "Nagpur"),
        department: data.department || "Engineering",
        remoteType: data.remoteType || "ON_SITE",
        employmentType: data.employmentType || "FULL_TIME",
        experienceMin: data.experienceMin || null,
        experienceMax: data.experienceMax || null,
        salaryMin: data.salaryMin || null,
        salaryMax: data.salaryMax || null,
        skills: data.skills || null,
        applicationUrl: data.applicationUrl || null,
        sourceType: isWalkin ? "WALKIN_SUBMISSION" : "MANUAL",
        isWalkin,
        walkinDate,
        walkinStartTime: data.walkinStartTime || null,
        walkinEndTime: data.walkinEndTime || null,
        walkinVenue: data.walkinVenue || null,
        status: data.status || "ACTIVE",
        featured: !!data.featured,
        verificationStatus: "VERIFIED",
        moderationStatus: "APPROVED",
        expiresAt: expiry,
        postedAt: new Date(),
      })
      .returning();

    // Mark company as hiring
    await db.update(companies).set({ hiring: true }).where(eq(companies.id, data.companyId));

    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "CREATE_JOB",
      entityType: "JOB",
      entityId: newJob.id,
      notes: `Admin manually created job #${newJob.id}: ${newJob.title}`,
    });

    revalidatePath("/admin");
    revalidatePath("/jobs");
    revalidatePath("/walkins");
    revalidatePath("/", "layout");

    return { success: true, job: newJob };
  } catch (err: any) {
    console.error("[admin] Error creating job:", err);
    return { error: err.message || "Failed to create job." };
  }
}

/**
 * Update an existing Job or Walk-in drive
 */
export async function updateJobAction(jobId: number, data: Partial<JobAdminInput>) {
  const { user: adminUser } = await requireAdmin();

  try {
    const updatePayload: Record<string, any> = {};

    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.companyId !== undefined) updatePayload.companyId = data.companyId;
    if (data.cityId !== undefined) updatePayload.cityId = data.cityId;
    if (data.description !== undefined) updatePayload.description = data.description || null;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.department !== undefined) updatePayload.department = data.department;
    if (data.remoteType !== undefined) updatePayload.remoteType = data.remoteType;
    if (data.employmentType !== undefined) updatePayload.employmentType = data.employmentType;
    if (data.experienceMin !== undefined) updatePayload.experienceMin = data.experienceMin || null;
    if (data.experienceMax !== undefined) updatePayload.experienceMax = data.experienceMax || null;
    if (data.salaryMin !== undefined) updatePayload.salaryMin = data.salaryMin || null;
    if (data.salaryMax !== undefined) updatePayload.salaryMax = data.salaryMax || null;
    if (data.skills !== undefined) updatePayload.skills = data.skills || null;
    if (data.applicationUrl !== undefined) updatePayload.applicationUrl = data.applicationUrl || null;
    if (data.isWalkin !== undefined) updatePayload.isWalkin = data.isWalkin;
    if (data.walkinDate !== undefined) updatePayload.walkinDate = data.walkinDate ? new Date(data.walkinDate) : null;
    if (data.walkinStartTime !== undefined) updatePayload.walkinStartTime = data.walkinStartTime || null;
    if (data.walkinEndTime !== undefined) updatePayload.walkinEndTime = data.walkinEndTime || null;
    if (data.walkinVenue !== undefined) updatePayload.walkinVenue = data.walkinVenue || null;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.featured !== undefined) updatePayload.featured = data.featured;

    const [updated] = await db
      .update(jobs)
      .set(updatePayload)
      .where(eq(jobs.id, jobId))
      .returning();

    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "UPDATE_JOB",
      entityType: "JOB",
      entityId: jobId,
      notes: `Admin updated job #${jobId}`,
    });

    revalidatePath("/admin");
    revalidatePath("/jobs");
    revalidatePath(`/job/${updated.slug}`);
    revalidatePath("/walkins");
    revalidatePath("/", "layout");

    return { success: true, job: updated };
  } catch (err: any) {
    console.error("[admin] Error updating job:", err);
    return { error: err.message || "Failed to update job." };
  }
}

// ─── Phase 6: Event CMS Management Actions ───────────────────────────────────

export interface EventAdminInput {
  title: string;
  cityId: number;
  date: string;
  description?: string;
  eventType?: any;
  organizer?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  location?: string;
  registrationUrl?: string;
  price?: string;
  imageUrl?: string;
  status?: any;
  featured?: boolean;
}

/**
 * Directly create an event
 */
export async function createEventAction(data: EventAdminInput) {
  const { user: adminUser } = await requireAdmin();

  try {
    if (!data.title || !data.cityId || !data.date) {
      return { error: "Event title, city, and date are required." };
    }

    const slug = slugify(`${data.title}-${Date.now().toString().slice(-4)}`);

    const [newEvent] = await db
      .insert(events)
      .values({
        title: data.title.trim(),
        slug,
        cityId: data.cityId,
        date: new Date(data.date),
        description: data.description || null,
        eventType: data.eventType || "MEETUP",
        organizer: data.organizer || "Community",
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        venue: data.venue || null,
        location: data.location || (data.cityId === 3 ? "Indore" : data.cityId === 6 ? "Bhopal" : "Nagpur"),
        registrationUrl: data.registrationUrl || null,
        price: data.price || "Free",
        imageUrl: data.imageUrl || null,
        status: data.status || "UPCOMING",
        featured: !!data.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "CREATE_EVENT",
      entityType: "EVENT",
      entityId: newEvent.id,
      notes: `Admin manually created event #${newEvent.id}: ${newEvent.title}`,
    });

    revalidatePath("/admin");
    revalidatePath("/events");
    revalidatePath("/", "layout");

    return { success: true, event: newEvent };
  } catch (err: any) {
    console.error("[admin] Error creating event:", err);
    return { error: err.message || "Failed to create event." };
  }
}

/**
 * Directly update an event
 */
export async function updateEventAction(eventId: number, data: Partial<EventAdminInput>) {
  const { user: adminUser } = await requireAdmin();

  try {
    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.cityId !== undefined) updatePayload.cityId = data.cityId;
    if (data.date !== undefined) updatePayload.date = new Date(data.date);
    if (data.description !== undefined) updatePayload.description = data.description || null;
    if (data.eventType !== undefined) updatePayload.eventType = data.eventType;
    if (data.organizer !== undefined) updatePayload.organizer = data.organizer;
    if (data.startTime !== undefined) updatePayload.startTime = data.startTime || null;
    if (data.endTime !== undefined) updatePayload.endTime = data.endTime || null;
    if (data.venue !== undefined) updatePayload.venue = data.venue || null;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.registrationUrl !== undefined) updatePayload.registrationUrl = data.registrationUrl || null;
    if (data.price !== undefined) updatePayload.price = data.price;
    if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl || null;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.featured !== undefined) updatePayload.featured = data.featured;

    const [updated] = await db
      .update(events)
      .set(updatePayload)
      .where(eq(events.id, eventId))
      .returning();

    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "UPDATE_EVENT",
      entityType: "EVENT",
      entityId: eventId,
      notes: `Admin updated event #${eventId}`,
    });

    revalidatePath("/admin");
    revalidatePath("/events");
    revalidatePath(`/event/${updated.slug}`);
    revalidatePath("/", "layout");

    return { success: true, event: updated };
  } catch (err: any) {
    console.error("[admin] Error updating event:", err);
    return { error: err.message || "Failed to update event." };
  }
}

/**
 * Fetch ecosystem data quality diagnostics for admin console
 */
export async function getDataQualityReportAction() {
  await requireAdmin();

  try {
    const [allCompanies, allJobs, allApplications] = await Promise.all([
      db.select({
        id: companies.id,
        name: companies.name,
        slug: companies.slug,
        websiteUrl: companies.websiteUrl,
        latitude: companies.latitude,
        longitude: companies.longitude,
        sector: companies.sector,
        companyType: companies.companyType,
        verificationStatus: companies.verificationStatus,
        cityId: companies.cityId,
      }).from(companies),
      db.select({
        id: jobs.id,
        title: jobs.title,
        companyId: jobs.companyId,
        status: jobs.status,
        postedAt: jobs.postedAt,
        applicationUrl: jobs.applicationUrl,
      }).from(jobs),
      db.select({
        id: jobApplications.id,
        status: jobApplications.status,
      }).from(jobApplications),
    ]);

    const missingWebsite = allCompanies.filter((c) => !c.websiteUrl || !c.websiteUrl.trim());
    const missingCoords = allCompanies.filter((c) => !c.latitude || !c.longitude);
    const unverifiedCompanies = allCompanies.filter((c) => c.verificationStatus !== "VERIFIED");
    const missingSector = allCompanies.filter((c) => !c.sector || c.sector === "Other");

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const staleJobs = allJobs.filter(
      (j) => j.status === "ACTIVE" && j.postedAt && new Date(j.postedAt) < thirtyDaysAgo
    );

    const applicationsByStatus: Record<string, number> = {
      APPLIED: 0,
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      HIRED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };
    for (const app of allApplications) {
      if (applicationsByStatus[app.status] !== undefined) {
        applicationsByStatus[app.status]++;
      }
    }

    return {
      success: true,
      summary: {
        totalCompanies: allCompanies.length,
        missingWebsiteCount: missingWebsite.length,
        missingCoordsCount: missingCoords.length,
        unverifiedCount: unverifiedCompanies.length,
        missingSectorCount: missingSector.length,
        totalJobs: allJobs.length,
        activeJobsCount: allJobs.filter((j) => j.status === "ACTIVE").length,
        staleJobsCount: staleJobs.length,
        totalApplications: allApplications.length,
        applicationsByStatus,
      },
      flaggedCompanies: {
        missingCoords: missingCoords.slice(0, 50).map((c) => ({ id: c.id, name: c.name, slug: c.slug, cityId: c.cityId })),
        missingWebsite: missingWebsite.slice(0, 50).map((c) => ({ id: c.id, name: c.name, slug: c.slug, cityId: c.cityId })),
      },
    };
  } catch (err: any) {
    console.error("[admin] Error getting data quality report:", err);
    return { error: err.message || "Failed to generate data quality report." };
  }
}

/**
 * Update candidate application status (APPLIED -> UNDER_REVIEW -> SHORTLISTED -> INTERVIEW -> HIRED / REJECTED)
 */
export async function updateApplicationStatusAction(
  applicationId: number,
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "REJECTED" | "HIRED" | "WITHDRAWN",
  adminNotes?: string
) {
  const { user: adminUser } = await requireAdmin();

  try {
    const [existing] = await db
      .select({
        id: jobApplications.id,
        userId: jobApplications.userId,
        jobId: jobApplications.jobId,
        status: jobApplications.status,
      })
      .from(jobApplications)
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (!existing) {
      return { error: "Application not found" };
    }

    const [updated] = await db
      .update(jobApplications)
      .set({
        status,
        statusChangedAt: new Date(),
        updatedAt: new Date(),
        ...(adminNotes ? { adminNotes } : {}),
      })
      .where(eq(jobApplications.id, applicationId))
      .returning();

    // Get job info for the notification
    const [job] = await db
      .select({ title: jobs.title })
      .from(jobs)
      .where(eq(jobs.id, existing.jobId))
      .limit(1);

    // Send in-app notification to applicant
    await db.insert(notifications).values({
      userId: existing.userId,
      title: `Application Status Updated: ${status.replace("_", " ")}`,
      message: `Your application status for "${job?.title || "role"}" has progressed to ${status.replace("_", " ")}.`,
      type: "APPLICATION",
      link: "/profile/applications",
    });

    await db.insert(adminActions).values({
      adminId: adminUser.id,
      action: "UPDATE_APPLICATION_STATUS",
      entityType: "JOB",
      entityId: applicationId,
      notes: `Updated application #${applicationId} to ${status}`,
    });

    revalidatePath("/admin");
    revalidatePath("/profile/applications");

    return { success: true, application: updated };
  } catch (err: any) {
    console.error("[admin] Error updating application status:", err);
    return { error: err.message || "Failed to update application status." };
  }
}

