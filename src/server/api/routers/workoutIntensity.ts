import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutIntensityRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workoutIntensity.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workoutIntensity.findMany();
  }),
});
