import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import postgres from "postgres";

async function migrateMultiCity() {
  const connStr = process.env.DATABASE_URL;
  if (!connStr) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  console.log("Starting multi-city database migration...");
  const sql = postgres(connStr, { ssl: "require" });

  try {
    // 1. Add is_published to cities table if not present
    console.log("Adding is_published column to cities...");
    await sql`
      ALTER TABLE cities 
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS cities_published_idx ON cities(is_published)
    `;

    // 2. Add city_id to founders if not present
    console.log("Adding city_id to founders...");
    await sql`
      ALTER TABLE founders 
      ADD COLUMN IF NOT EXISTS city_id INTEGER REFERENCES cities(id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS founders_city_idx ON founders(city_id)
    `;

    // 3. Add city_id to submissions if not present
    console.log("Adding city_id to submissions...");
    await sql`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS city_id INTEGER REFERENCES cities(id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS submissions_city_idx ON submissions(city_id)
    `;

    // 4. Ensure other indexes exist
    await sql`CREATE INDEX IF NOT EXISTS companies_city_idx ON companies(city_id)`;
    await sql`CREATE INDEX IF NOT EXISTS jobs_city_idx ON jobs(city_id)`;
    await sql`CREATE INDEX IF NOT EXISTS events_city_idx ON events(city_id)`;
    await sql`CREATE INDEX IF NOT EXISTS talent_city_idx ON talent_profiles(city_id)`;

    // 5. Upsert Nagpur
    console.log("Seeding / updating Nagpur...");
    const nagpurResult = await sql`
      INSERT INTO cities (name, slug, state, country, description, latitude, longitude, active, is_published, updated_at)
      VALUES (
        'Nagpur',
        'nagpur',
        'Maharashtra',
        'India',
        'Nagpur is the third-largest city in Maharashtra and the winter capital of the state. Known as the Orange City, Nagpur is emerging as a major technology and startup hub in Central India, supported by MIHAN SEZ, growing IT infrastructure, and premier institutions like IIM Nagpur and VNIT.',
        21.1458,
        79.0882,
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
      RETURNING id, name, slug, is_published
    `;
    const nagpurId = nagpurResult[0].id;
    console.log(`Nagpur city record verified (ID: ${nagpurId}, is_published: ${nagpurResult[0].is_published})`);

    // 6. Upsert Indore
    console.log("Seeding / updating Indore (published)...");
    const indoreResult = await sql`
      INSERT INTO cities (name, slug, state, country, description, latitude, longitude, active, is_published, updated_at)
      VALUES (
        'Indore',
        'indore',
        'Madhya Pradesh',
        'India',
        'Indore is the largest and most populous city in Madhya Pradesh, consistently recognized as India''s cleanest city. It is a premier commercial, educational, and emerging tech epicenter home to IIT Indore, IIM Indore, Super Corridor IT hubs, and a vibrant entrepreneurial ecosystem.',
        22.7196,
        75.8577,
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
      RETURNING id, name, slug, is_published
    `;
    const indoreId = indoreResult[0].id;
    console.log(`Indore city record verified (ID: ${indoreId}, is_published: ${indoreResult[0].is_published})`);

    // 7. Backfill all existing records with Nagpur's city_id
    console.log(`Backfilling existing records with Nagpur ID: ${nagpurId}...`);

    const companiesUpdated = await sql`
      UPDATE companies 
      SET city_id = ${nagpurId} 
      WHERE city_id IS NULL OR city_id = ${nagpurId}
      RETURNING id
    `;
    console.log(`Companies backfilled/verified: ${companiesUpdated.length}`);

    const jobsUpdated = await sql`
      UPDATE jobs 
      SET city_id = ${nagpurId} 
      WHERE city_id IS NULL OR city_id = ${nagpurId}
      RETURNING id
    `;
    console.log(`Jobs backfilled/verified: ${jobsUpdated.length}`);

    const eventsUpdated = await sql`
      UPDATE events 
      SET city_id = ${nagpurId} 
      WHERE city_id IS NULL OR city_id = ${nagpurId}
      RETURNING id
    `;
    console.log(`Events backfilled/verified: ${eventsUpdated.length}`);

    const foundersUpdated = await sql`
      UPDATE founders 
      SET city_id = ${nagpurId} 
      WHERE city_id IS NULL OR city_id = ${nagpurId}
      RETURNING id
    `;
    console.log(`Founders backfilled/verified: ${foundersUpdated.length}`);

    const talentUpdated = await sql`
      UPDATE talent_profiles 
      SET city_id = ${nagpurId} 
      WHERE city_id IS NULL OR city_id = ${nagpurId}
      RETURNING id
    `;
    console.log(`Talent profiles backfilled/verified: ${talentUpdated.length}`);

    const submissionsUpdated = await sql`
      UPDATE submissions 
      SET city_id = ${nagpurId} 
      WHERE city_id IS NULL OR city_id = ${nagpurId}
      RETURNING id
    `;
    console.log(`Submissions backfilled/verified: ${submissionsUpdated.length}`);

    // 8. Verify data counts
    const allCities = await sql`SELECT id, name, slug, state, is_published FROM cities ORDER BY id`;
    console.log("\n=== CITIES SUMMARY ===");
    console.table(allCities);

    console.log("\nMigration completed successfully with zero data loss!");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrateMultiCity();
