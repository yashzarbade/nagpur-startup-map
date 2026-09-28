import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const email = process.argv[2];

if (!email) {
  console.log("Usage: npx tsx scripts/make-admin.ts <email>");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require", max: 1 });

async function main() {
  try {
    const res = await sql`
      UPDATE user_profiles
      SET role = 'ADMIN'
      WHERE LOWER(email) = LOWER(${email.trim()})
      RETURNING id, user_id, email, full_name, role;
    `;

    if (res.length === 0) {
      console.log(`No user profile found with email: ${email}`);
      console.log("Please sign up / log in on the website first, then run this script.");
    } else {
      console.log("Successfully updated user to ADMIN:", res[0]);
    }
  } catch (err) {
    console.error("Error setting admin:", err);
  } finally {
    await sql.end();
  }
}

main();
