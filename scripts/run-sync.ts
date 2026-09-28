import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { runJobSync } from "../src/lib/job-sync";

async function main() {
  console.log("🚀 Starting Job Synchronization on database...");
  try {
    const result = await runJobSync("MANUAL");
    console.log("\n=== Job Sync Results ===");
    console.log("Companies Checked:", result.companiesChecked);
    console.log("Jobs Found:", result.jobsFound);
    console.log("Jobs Created:", result.jobsCreated);
    console.log("Jobs Updated:", result.jobsUpdated);
    console.log("Jobs Expired:", result.jobsExpired);
    console.log("Errors:", result.errors);
    const errors = result.details.filter((d) => !d.success);
    if (errors.length > 0) {
      console.log("\nTop Errors / Warnings (first 5):");
      console.log(JSON.stringify(errors.slice(0, 5), null, 2));
    }
  } catch (err) {
    console.error("❌ Job sync crashed:", err);
  }
  process.exit(0);
}

main();
