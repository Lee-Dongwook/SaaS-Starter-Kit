import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

const db = drizzle({ client: sql });

console.log(db);
