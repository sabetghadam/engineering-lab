import { createServer } from "node:http";
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, ".env") });

const { Pool } = pg;

const port = Number(process.env.PORT ?? 3002);
const name = process.env.BACKEND_NAME ?? "backend-1";

// Connection pool to eng_lab database.
// Adjust user/password/host to match your pg_hba.conf setup.
const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "eng_lab",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD, // set via env, avoid hardcoding
});

const server = createServer(async (req, res) => {
  try {
    // Query the users table for the row where name = 'Ali'
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE name = $1 LIMIT 1",
      ["Ali"],
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        backend: name,
        port,
        timestamp: new Date().toISOString(),
        ali: rows[0] ?? null, // the matching row, or null if not found
      }),
    );
 } catch (err: unknown) {
  console.error("DB query failed:", err);

  const message =
    err instanceof Error ? err.message : "Unknown database error";

  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: "database_error",
      message,
    }),
  );
}
});

server.listen(port, "127.0.0.1", () => {
  console.log(`${name} listening on 127.0.0.1:${port}`);
});