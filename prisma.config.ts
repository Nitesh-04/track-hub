import "dotenv/config";
import { defineConfig } from "@prisma/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined. Please set it in your environment.");
}

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
