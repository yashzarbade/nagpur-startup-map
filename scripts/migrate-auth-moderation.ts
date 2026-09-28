import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL!;
console.log("Connecting to Postgres database for auth & moderation migration...");

const sql = postgres(url, {
  ssl: "require",
  connect_timeout: 15,
  max: 1,
});

async function main() {
  try {
    console.log("1. Creating enums if not exist...");
    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('USER', 'COMPANY', 'ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE user_status AS ENUM ('ACTIVE', 'DISABLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log("2. Creating user_profiles table...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        email VARCHAR(255),
        full_name VARCHAR(255),
        username VARCHAR(100) UNIQUE,
        avatar TEXT,
        bio TEXT,
        location VARCHAR(200),
        city VARCHAR(100),
        skills TEXT,
        linkedin_url TEXT,
        github_url TEXT,
        portfolio_url TEXT,
        role user_role NOT NULL DEFAULT 'USER',
        status user_status NOT NULL DEFAULT 'ACTIVE',
        claimed_company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log("3. Creating saved_jobs table...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_saved_jobs UNIQUE(user_id, job_id)
      );
    `);

    console.log("4. Creating saved_companies table...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS saved_companies (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_saved_companies UNIQUE(user_id, company_id)
      );
    `);

    console.log("5. Creating notifications table...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'INFO',
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        link TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log("6. Updating submissions table with moderation fields...");
    await sql.unsafe(`
      ALTER TABLE submissions
        ADD COLUMN IF NOT EXISTS user_id TEXT,
        ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    `);

    console.log("7. Updating claims table with moderation fields...");
    await sql.unsafe(`
      ALTER TABLE claims
        ADD COLUMN IF NOT EXISTS user_id TEXT,
        ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    `);

    console.log("8. Updating companies table with claimed_by_user_id...");
    await sql.unsafe(`
      ALTER TABLE companies
        ADD COLUMN IF NOT EXISTS claimed_by_user_id TEXT;
    `);

    console.log("9. Creating indexes...");
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
      CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON user_profiles(username);
      CREATE INDEX IF NOT EXISTS saved_jobs_user_id_idx ON saved_jobs(user_id);
      CREATE INDEX IF NOT EXISTS saved_companies_user_id_idx ON saved_companies(user_id);
      CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id, is_read);
      CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON submissions(user_id);
    `);

    console.log("✅ Migration completed successfully!");
  } catch (err: any) {
    console.error("Migration Error:", err);
  } finally {
    await sql.end();
  }
}

main();
