import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./src/db/drizzle",
  dialect: "sqlite",
  driver: "expo", // <--- very important
  verbose: true,
});
