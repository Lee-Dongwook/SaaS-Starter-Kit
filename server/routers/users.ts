import { z } from "zod";
import { db, usersTable } from "../db";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(usersTable);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, input.id));
      return user[0] || null;
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().max(255),
        age: z.number().min(1),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const newUser = await db.insert(usersTable).values(input).returning();
      return newUser[0];
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().max(255).optional(),
        age: z.number().min(1).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updatedUser = await db
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, id))
        .returning();
      return updatedUser[0] || null;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(usersTable).where(eq(usersTable.id, input.id));
      return { success: true };
    }),
});
