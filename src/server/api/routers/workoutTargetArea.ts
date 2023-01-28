import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutTargetAreaRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workoutTargetArea.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workoutTargetArea.findMany();
  }),
});
