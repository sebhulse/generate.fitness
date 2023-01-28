import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutSectionTypeRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workoutSectionType.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workoutSectionType.findMany();
  }),
});
