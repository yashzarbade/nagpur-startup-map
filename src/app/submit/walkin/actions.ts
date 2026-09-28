"use server";

import { db } from "@/db";
import { submissions, cities, jobs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { resolveOrCreateCompany, generateDeduplicationKey } from "@/lib/job-sync/deduplicator";
import { generateJobSlug } from "@/lib/job-sync/normalizer";

export const walkinSubmissionSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(200),
  title: z.string().min(3, "Job title must be at least 3 characters").max(200),
  city: z.enum(["nagpur", "indore", "bhopal"], {
    message: "Please select a valid Central India city (Nagpur, Indore, or Bhopal)",
  }),
  venue: z.string().min(5, "Please provide the complete interview venue / address").max(1000),
  walkinDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please provide a valid walk-in interview date",
  }),
  walkinStartTime: z.string().min(2, "Please enter interview start time (e.g. 10:00 AM)").max(50),
  walkinEndTime: z.string().max(50).optional(),
  description: z.string().min(20, "Please provide a job description of at least 20 characters").max(10000),
  qualifications: z.string().max(500).optional(),
  experience: z.string().max(100).optional(),
  salary: z.string().max(100).optional(),
  employmentType: z.string().optional(),
  skills: z.string().max(1000).optional(),
  applicationUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  announcementUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  submitterEmail: z.string().email("Please provide a valid email address"),
  contactDetails: z.string().max(500).optional(),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

export type WalkinFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitWalkinAction(
  prevState: WalkinFormState | null,
  formData: FormData
): Promise<WalkinFormState> {
  try {
    const rawData = {
      companyName: formData.get("companyName"),
      title: formData.get("title"),
      city: formData.get("city"),
      venue: formData.get("venue"),
      walkinDate: formData.get("walkinDate"),
      walkinStartTime: formData.get("walkinStartTime"),
      walkinEndTime: formData.get("walkinEndTime") || undefined,
      description: formData.get("description"),
      qualifications: formData.get("qualifications") || undefined,
      experience: formData.get("experience") || undefined,
      salary: formData.get("salary") || undefined,
      employmentType: formData.get("employmentType") || "FULL_TIME",
      skills: formData.get("skills") || undefined,
      applicationUrl: formData.get("applicationUrl") || undefined,
      announcementUrl: formData.get("announcementUrl") || undefined,
      submitterEmail: formData.get("submitterEmail"),
      contactDetails: formData.get("contactDetails") || undefined,
      honeypot: formData.get("website_hp") || "", // Honeypot field
    };

    const parsed = walkinSubmissionSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    // Check that walk-in date is not in the deep past
    const interviewDate = new Date(data.walkinDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (interviewDate < yesterday) {
      return {
        success: false,
        errors: {
          walkinDate: ["Walk-in date cannot be in the past. Please enter an upcoming date."],
        },
      };
    }

    // Lookup city ID
    const [cityRecord] = await db
      .select({ id: cities.id })
      .from(cities)
      .where(eq(cities.slug, data.city))
      .limit(1);

    const cityId = cityRecord?.id ?? (data.city === "nagpur" ? 1 : data.city === "indore" ? 3 : 6);

    // Save into submissions queue for moderation
    await db.insert(submissions).values({
      type: "JOB",
      status: "PENDING",
      submitterEmail: data.submitterEmail,
      source: "WALKIN_FORM",
      cityId,
      data: {
        isWalkin: true,
        companyName: data.companyName,
        title: data.title,
        city: data.city,
        cityId,
        walkinVenue: data.venue,
        walkinDate: data.walkinDate,
        walkinStartTime: data.walkinStartTime,
        walkinEndTime: data.walkinEndTime,
        description: data.description,
        qualifications: data.qualifications,
        experience: data.experience,
        salary: data.salary,
        employmentType: data.employmentType,
        skills: data.skills,
        applicationUrl: data.applicationUrl,
        announcementUrl: data.announcementUrl,
        contactDetails: data.contactDetails,
        submitterEmail: data.submitterEmail,
      },
    });

    // Also insert into jobs with PENDING moderation status so admin can review directly
    const company = await resolveOrCreateCompany(data.companyName, cityId);
    const dedupKey = generateDeduplicationKey(data.title, data.companyName, cityId, interviewDate);
    const slug = generateJobSlug(data.title, company.slug, `w${Date.now().toString(36)}`);

    await db.insert(jobs).values({
      companyId: company.id,
      cityId,
      title: data.title,
      slug,
      description: data.description,
      location: `${data.city.toUpperCase()}, Central India`,
      employmentType: (data.employmentType as any) || "FULL_TIME",
      remoteType: "ON_SITE",
      applicationUrl: data.applicationUrl || data.announcementUrl || "https://centralindiatech.com/walkins",
      sourceUrl: data.announcementUrl || null,
      sourceType: "WALKIN_SUBMISSION",
      isWalkin: true,
      walkinDate: interviewDate,
      walkinStartTime: data.walkinStartTime,
      walkinEndTime: data.walkinEndTime || null,
      walkinVenue: data.venue,
      skills: data.skills || null,
      contactDetails: data.contactDetails || null,
      verificationStatus: "PENDING",
      moderationStatus: "PENDING", // Requires admin review
      deduplicationKey: dedupKey,
      status: "ACTIVE",
    });

    revalidatePath("/walkins");
    revalidatePath("/admin");

    return {
      success: true,
      message:
        "Walk-in drive submitted successfully! Our moderation team will verify the announcement before publishing it.",
    };
  } catch (err: any) {
    console.error("[submitWalkinAction] Error:", err);
    return {
      success: false,
      message: "An unexpected error occurred while saving your submission. Please try again.",
    };
  }
}
