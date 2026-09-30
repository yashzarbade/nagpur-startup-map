/**
 * Migration script for job_applications and job_alerts tables.
 * SAFE: Uses IF NOT EXISTS checks — idempotent and non-destructive.
 * 
 * Usage: npx tsx scripts/migrate-applications-alerts.ts
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback to .env
import postgres from "postgres";

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = postgres(connectionString);

  console.log("🔧 Starting migration: job_applications + job_alerts...\n");

  try {
    // 1. Create application_status enum
    await sql`
      DO $$ BEGIN
        CREATE TYPE application_status AS ENUM (
          'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED', 'WITHDRAWN'
        );
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `;
    console.log("✅ application_status enum");

    // 2. Create alert_frequency enum
    await sql`
      DO $$ BEGIN
        CREATE TYPE alert_frequency AS ENUM (
          'INSTANT', 'DAILY', 'WEEKLY'
        );
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `;
    console.log("✅ alert_frequency enum");

    // 3. Create job_applications table
    await sql`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        status application_status NOT NULL DEFAULT 'APPLIED',
        cover_message TEXT,
        resume_url TEXT,
        portfolio_url TEXT,
        linkedin_url TEXT,
        github_url TEXT,
        applicant_name VARCHAR(255),
        applicant_email VARCHAR(255),
        admin_notes TEXT,
        status_changed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    console.log("✅ job_applications table");

    // 4. Create indexes for job_applications
    await sql`CREATE INDEX IF NOT EXISTS job_applications_user_idx ON job_applications(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS job_applications_job_idx ON job_applications(job_id);`;
    await sql`CREATE INDEX IF NOT EXISTS job_applications_company_idx ON job_applications(company_id);`;
    await sql`CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications(status);`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS job_applications_user_job_idx ON job_applications(user_id, job_id);`;
    await sql`CREATE INDEX IF NOT EXISTS job_applications_created_idx ON job_applications(created_at);`;
    console.log("✅ job_applications indexes");

    // 5. Create job_alerts table
    await sql`
      CREATE TABLE IF NOT EXISTS job_alerts (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        city_id INTEGER REFERENCES cities(id),
        keyword VARCHAR(255),
        sector VARCHAR(100),
        skills TEXT,
        experience_level VARCHAR(50),
        employment_type VARCHAR(50),
        remote_type VARCHAR(50),
        frequency alert_frequency NOT NULL DEFAULT 'DAILY',
        active BOOLEAN NOT NULL DEFAULT TRUE,
        last_notified_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    console.log("✅ job_alerts table");

    // 6. Create indexes for job_alerts
    await sql`CREATE INDEX IF NOT EXISTS job_alerts_user_idx ON job_alerts(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS job_alerts_active_idx ON job_alerts(active);`;
    await sql`CREATE INDEX IF NOT EXISTS job_alerts_city_idx ON job_alerts(city_id);`;
    console.log("✅ job_alerts indexes");

    console.log("\n🎉 Migration complete! All tables and indexes created successfully.");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
