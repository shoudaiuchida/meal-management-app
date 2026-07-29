import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL が設定されていません");
}

export const db = new Pool({
  connectionString,
});