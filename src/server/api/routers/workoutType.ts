import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutTypeRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workoutType.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workoutType.findMany();
  }),
});
