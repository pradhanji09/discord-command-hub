import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationFilesPath = path.resolve(__dirname, "migrations");
// console.log("migrationFilesPath", migrationFilesPath);

const config = {
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Supabase requires TLS
  },
  pool: { min: 0, max: 5 },
  migrations: {
    directory: migrationFilesPath,
    tableName: "knex_migrations",
  },
};

export default config;
