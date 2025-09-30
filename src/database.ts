import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const isTest = process.env.NODE_ENV === "test";

export const client = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD as string,
  database: isTest
    ? process.env.DB_NAME_TEST || "full_stack_test"
    : process.env.DB_NAME,
});
