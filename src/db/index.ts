import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const client = postgres(process.env.DATABASE_URL, {
  max: 10,
  ssl: { rejectUnauthorized: false },
  connect_timeout: 30,
  onnotice: () => {},
});

export const db = drizzle(client, { schema });
