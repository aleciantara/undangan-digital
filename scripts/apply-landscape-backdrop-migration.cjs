require("dotenv").config({ path: ".env.local" });
const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");

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
    const check = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'Invitation' AND column_name = 'landscapeBackdropFill'
    `);

    if (check.rowCount > 0) {
      console.log("landscapeBackdropFill column already exists.");
      return;
    }

    console.log("Adding landscapeBackdropFill to Invitation...");
    await pool.query(`
      ALTER TABLE "Invitation"
      ADD COLUMN "landscapeBackdropFill" BOOLEAN NOT NULL DEFAULT true;
    `);
    console.log("Done.");
  } finally {
    await pool.end().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
