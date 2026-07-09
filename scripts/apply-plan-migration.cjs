require("dotenv").config({ path: ".env.local" });
const fs = require("node:fs");
const path = require("node:path");
const ws = require("ws");
const { Pool, neonConfig } = require("@neondatabase/serverless");

function normalizeDatabaseUrl(connectionString) {
  const url = connectionString
    .replace(/([?&])channel_binding=require(&)?/g, "$1")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");

  const params = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");
  if (!params.has("sslmode")) params.set("sslmode", "require");
  params.set("uselibpqcompat", "true");
  params.delete("channel_binding");

  const base = url.includes("?") ? url.slice(0, url.indexOf("?")) : url;
  return `${base}?${params.toString()}`;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: normalizeDatabaseUrl(connectionString) });

  try {
    const planCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'plan'
    `);

    if (planCheck.rowCount > 0) {
      console.log("Plan column already exists. Skipping migration SQL.");
      return;
    }

    const migrationPath = path.join(
      process.cwd(),
      "prisma",
      "migrations",
      "20260708140000_add_user_plan",
      "migration.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");
    console.log("Applying add-user-plan migration via WebSocket...");
    await pool.query(sql);
    console.log("Migration applied.");
  } finally {
    await pool.end().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
