import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import postgres from "postgres";

async function migrateJobAutomation() {
  const connStr = process.env.DATABASE_URL;
  if (!connStr) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  console.log("Starting safe additive database migration for Job Automation & Walk-Ins...");
  const sql = postgres(connStr, { ssl: "require" });

  try {
    // 1. Ensure enum values in job_source_type
    console.log("Updating job_source_type enum...");
    const newSourceEnums = [
      "LINKEDIN",
      "NAUKRI",
      "INDEED",
      "TELEGRAM",
      "WORKABLE",
      "LEVER",
      "WALKIN_SUBMISSION",
    ];
    for (const val of newSourceEnums) {
      await sql.unsafe(`ALTER TYPE job_source_type ADD VALUE IF NOT EXISTS '${val}';`);
    }

    // 2. Ensure Bhopal is in cities table
    console.log("Upserting Bhopal into cities...");
    await sql`
      INSERT INTO cities (name, slug, state, country, description, latitude, longitude, active, is_published, updated_at)
      VALUES (
        'Bhopal',
        'bhopal',
        'Madhya Pradesh',
        'India',
        'Bhopal is the capital city of Madhya Pradesh, known as the City of Lakes. It is a premier educational, administrative, and emerging technology center home to MANIT, IISER, AIIMS, and an expanding startup and IT ecosystem around MP Nagar and Mandideep industrial corridor.',
        23.2599,
        77.4126,
        true,
        true,
        NOW()
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        name = EXCLUDED.name,
        state = EXCLUDED.state,
        country = EXCLUDED.country,
        description = EXCLUDED.description,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        active = EXCLUDED.active,
        is_published = true,
        updated_at = NOW()
      RETURNING id, name, slug, is_published;
    `;
    console.log("Bhopal city record verified.");

    // 3. Add additive columns to jobs table
    console.log("Adding additive columns to jobs table...");
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS walkin_date TIMESTAMP;`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS walkin_start_time VARCHAR(50);`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS walkin_end_time VARCHAR(50);`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS walkin_venue TEXT;`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_walkin BOOLEAN NOT NULL DEFAULT false;`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_channel VARCHAR(255);`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_message_id VARCHAR(100);`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_job_id VARCHAR(255);`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING';`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED';`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS first_seen_at TIMESTAMP DEFAULT NOW();`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deduplication_key VARCHAR(255);`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_details TEXT;`;
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS raw_data JSONB;`;

    // 4. Create indexes for performance and fast lookups
    console.log("Creating indexes for jobs table...");
    await sql`CREATE INDEX IF NOT EXISTS jobs_is_walkin_idx ON jobs(is_walkin);`;
    await sql`CREATE INDEX IF NOT EXISTS jobs_walkin_date_idx ON jobs(walkin_date);`;
    await sql`CREATE INDEX IF NOT EXISTS jobs_city_walkin_idx ON jobs(city_id, is_walkin);`;
    await sql`CREATE INDEX IF NOT EXISTS jobs_dedup_key_idx ON jobs(deduplication_key);`;
    await sql`CREATE INDEX IF NOT EXISTS jobs_source_job_id_idx ON jobs(source_type, source_job_id);`;
    await sql`CREATE INDEX IF NOT EXISTS jobs_moderation_idx ON jobs(moderation_status);`;

    // 5. Create job_source_health table to track automation health
    console.log("Creating job_source_health table...");
    await sql`
      CREATE TABLE IF NOT EXISTS job_source_health (
        id SERIAL PRIMARY KEY,
        source_type VARCHAR(50) NOT NULL,
        source_name VARCHAR(100) NOT NULL,
        city_slug VARCHAR(50),
        status VARCHAR(50) NOT NULL DEFAULT 'IDLE',
        last_sync_at TIMESTAMP,
        last_success_at TIMESTAMP,
        jobs_discovered INTEGER NOT NULL DEFAULT 0,
        jobs_inserted INTEGER NOT NULL DEFAULT 0,
        jobs_updated INTEGER NOT NULL DEFAULT 0,
        jobs_expired INTEGER NOT NULL DEFAULT 0,
        error_summary TEXT,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS job_source_health_type_idx ON job_source_health(source_type);`;
    await sql`CREATE INDEX IF NOT EXISTS job_source_health_city_idx ON job_source_health(city_slug);`;

    console.log("Additive database migration completed successfully with ZERO data loss!");
  } catch (err: any) {
    console.error("Migration error:", err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrateJobAutomation();
