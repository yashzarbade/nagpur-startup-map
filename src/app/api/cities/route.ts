import { NextResponse } from "next/server";
import { db } from "@/db";
import { cities, companies, jobs } from "@/db/schema";
import { eq, asc, count } from "drizzle-orm";

export async function GET() {
  try {
    const allCities = await db.select().from(cities).orderBy(asc(cities.name));
    return NextResponse.json({ success: true, cities: allCities });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { slug, isPublished } = body;

    if (!slug || typeof isPublished !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid parameters. Required: slug and isPublished" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(cities)
      .set({
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(cities.slug, slug))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `City with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      city: updated,
      message: `City ${updated.name} published status set to ${isPublished}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
