import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../../../server/api";
import { createContext } from "../../../../../server/context";

export const runtime = "nodejs";

const handler = createNextApiHandler({
  router: appRouter,
  createContext,
});

export { handler as GET, handler as POST };
