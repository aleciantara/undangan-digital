require("dotenv").config({ path: ".env.local" });

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

async function testPg(label, connectionString) {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: normalizeDatabaseUrl(connectionString),
    connectionTimeoutMillis: 25000,
  });

  try {
    const result = await pool.query("SELECT 1 AS ok");
    console.log(`${label}: OK`, result.rows[0]);
    return true;
  } catch (error) {
    console.error(`${label}: FAIL`, error.message);
    return false;
  } finally {
    await pool.end().catch(() => undefined);
  }
}

async function testNeonWs(label, connectionString) {
  const ws = require("ws");
  const { Pool, neonConfig } = require("@neondatabase/serverless");
  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: normalizeDatabaseUrl(connectionString) });

  try {
    const result = await pool.query("SELECT 1 AS ok");
    console.log(`${label}: OK`, result.rows[0]);
    return true;
  } catch (error) {
    console.error(`${label}: FAIL`, error.message);
    return false;
  } finally {
    await pool.end().catch(() => undefined);
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL is missing in .env.local");
    process.exit(1);
  }

  console.log("Testing database connections...\n");

  const pgPoolerOk = await testPg("TCP pooler (pg)", databaseUrl);
  const neonWsOk = await testNeonWs("WebSocket pooler (Neon)", databaseUrl);

  if (directUrl) {
    await testPg("TCP direct (pg)", directUrl);
  }

  if (neonWsOk) {
    console.log("\nUse WebSocket mode in app (already configured for neon.tech URLs).");
    process.exit(0);
  }

  process.exit(pgPoolerOk ? 0 : 1);
}

main();
