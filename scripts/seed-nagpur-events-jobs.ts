import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import postgres from "postgres";
import { EVENTS_DATA, JOBS_DATA } from "../src/lib/data";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });
  try {
    console.log("Seeding Nagpur events...");
    let eventCount = 0;
    for (const ev of EVENTS_DATA) {
      await sql`
        INSERT INTO events (
          title, slug, description, event_type, organizer, date,
          start_time, end_time, venue, location, registration_url,
          price, image_url, status, featured, city_id, created_at, updated_at
        ) VALUES (
          ${ev.title},
          ${ev.slug},
          ${ev.description},
          ${ev.eventType},
          ${ev.organizer},
          ${new Date(ev.date)},
          ${ev.startTime || null},
          ${ev.endTime || null},
          ${ev.venue || null},
          ${ev.location || "Nagpur"},
          ${ev.registrationUrl || null},
          ${ev.price || null},
          ${ev.imageUrl || null},
          ${(ev.status || "UPCOMING") as any},
          ${ev.featured ?? false},
          1,
          NOW(),
          NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET
          city_id = 1,
          status = EXCLUDED.status,
          date = EXCLUDED.date,
          venue = EXCLUDED.venue,
          location = EXCLUDED.location,
          registration_url = EXCLUDED.registration_url;
      `;
      eventCount++;
    }
    console.log(`Successfully seeded/updated ${eventCount} Nagpur events.`);

    console.log("Seeding Nagpur jobs from JOBS_DATA...");
    let jobCount = 0;
    for (const j of JOBS_DATA) {
      // Find company in DB by slug
      const [comp] = await sql`
        SELECT id FROM companies WHERE slug = ${j.companySlug} AND city_id = 1 LIMIT 1
      `;
      const companyId = comp ? comp.id : null;

      await sql`
        INSERT INTO jobs (
          title, slug, company_id, description, location, remote_type,
          employment_type, experience_min, experience_max, salary_min, salary_max,
          currency, skills, application_url, department, status, featured,
          city_id, posted_at, expires_at, created_at, updated_at, source_type
        ) VALUES (
          ${j.title},
          ${j.slug},
          ${companyId},
          ${j.description},
          ${j.location || "Nagpur"},
          ${j.remoteType || "ON_SITE"},
          ${j.employmentType || "FULL_TIME"},
          ${j.experienceMin ?? null},
          ${j.experienceMax ?? null},
          ${j.salaryMin ?? null},
          ${j.salaryMax ?? null},
          ${j.currency || "INR"},
          ${j.skills || null},
          ${j.applicationUrl || null},
          ${j.department || "General"},
          'ACTIVE',
          ${j.featured ?? false},
          1,
          ${j.postedAt ? new Date(j.postedAt) : new Date()},
          ${j.expiresAt ? new Date(j.expiresAt) : null},
          NOW(),
          NOW(),
          'GENERIC_CAREERS_PAGE'
        )
        ON CONFLICT (slug) DO UPDATE SET
          city_id = 1,
          status = 'ACTIVE',
          company_id = EXCLUDED.company_id,
          application_url = EXCLUDED.application_url;
      `;
      jobCount++;
    }
    console.log(`Successfully seeded/updated ${jobCount} Nagpur jobs.`);

    // Verify
    const finalEvents = await sql`SELECT city_id, count(*) FROM events GROUP BY city_id`;
    console.log("Events by city_id:", finalEvents);
    const finalJobs = await sql`SELECT city_id, count(*) FROM jobs GROUP BY city_id`;
    console.log("Jobs by city_id:", finalJobs);
  } catch (err: any) {
    console.error("Error seeding Nagpur events/jobs:", err);
  } finally {
    await sql.end();
  }
}

main();
