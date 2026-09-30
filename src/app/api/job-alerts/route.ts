import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobAlerts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/job-alerts — Get current user's job alerts
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await db
      .select()
      .from(jobAlerts)
      .where(eq(jobAlerts.userId, user.id))
      .orderBy(desc(jobAlerts.createdAt));

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("[job-alerts] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/job-alerts — Create a new job alert
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to create job alerts" }, { status: 401 });
    }

    const body = await request.json();
    const { name, cityId, keyword, sector, skills, experienceLevel, employmentType, remoteType, frequency } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Alert name is required" }, { status: 400 });
    }

    // Validate frequency
    const validFrequencies = ["INSTANT", "DAILY", "WEEKLY"];
    const alertFrequency = validFrequencies.includes(frequency) ? frequency : "DAILY";

    const [alert] = await db
      .insert(jobAlerts)
      .values({
        userId: user.id,
        name: name.trim().slice(0, 255),
        cityId: typeof cityId === "number" ? cityId : null,
        keyword: typeof keyword === "string" ? keyword.trim().slice(0, 255) : null,
        sector: typeof sector === "string" ? sector.trim().slice(0, 100) : null,
        skills: typeof skills === "string" ? skills.trim().slice(0, 500) : null,
        experienceLevel: typeof experienceLevel === "string" ? experienceLevel.slice(0, 50) : null,
        employmentType: typeof employmentType === "string" ? employmentType.slice(0, 50) : null,
        remoteType: typeof remoteType === "string" ? remoteType.slice(0, 50) : null,
        frequency: alertFrequency as any,
        active: true,
      })
      .returning();

    return NextResponse.json({ alert, message: "Job alert created successfully" }, { status: 201 });
  } catch (error) {
    console.error("[job-alerts] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/job-alerts — Update or toggle a job alert
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { alertId, action, ...updates } = body;

    if (!alertId) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
    }

    // Verify ownership
    const [existing] = await db
      .select({ id: jobAlerts.id, userId: jobAlerts.userId })
      .from(jobAlerts)
      .where(eq(jobAlerts.id, alertId))
      .limit(1);

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    if (action === "toggle") {
      const [current] = await db
        .select({ active: jobAlerts.active })
        .from(jobAlerts)
        .where(eq(jobAlerts.id, alertId))
        .limit(1);

      const [updated] = await db
        .update(jobAlerts)
        .set({ active: !current?.active, updatedAt: new Date() })
        .where(eq(jobAlerts.id, alertId))
        .returning();

      return NextResponse.json({ alert: updated });
    }

    // General update
    const updateData: any = { updatedAt: new Date() };
    if (updates.name) updateData.name = updates.name.slice(0, 255);
    if (updates.frequency) updateData.frequency = updates.frequency;
    if (updates.keyword !== undefined) updateData.keyword = updates.keyword?.slice(0, 255) || null;
    if (updates.sector !== undefined) updateData.sector = updates.sector?.slice(0, 100) || null;

    const [updated] = await db
      .update(jobAlerts)
      .set(updateData)
      .where(eq(jobAlerts.id, alertId))
      .returning();

    return NextResponse.json({ alert: updated });
  } catch (error) {
    console.error("[job-alerts] PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/job-alerts — Delete a job alert
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const alertId = Number(searchParams.get("id"));

    if (!alertId) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
    }

    // Verify ownership
    const [existing] = await db
      .select({ id: jobAlerts.id, userId: jobAlerts.userId })
      .from(jobAlerts)
      .where(eq(jobAlerts.id, alertId))
      .limit(1);

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await db.delete(jobAlerts).where(eq(jobAlerts.id, alertId));

    return NextResponse.json({ message: "Alert deleted" });
  } catch (error) {
    console.error("[job-alerts] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
