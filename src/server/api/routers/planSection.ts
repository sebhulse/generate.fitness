import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const planSectionRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.planSection.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getManyByPlanId: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.planSection.findMany({
        where: {
          planId: input,
        },
        include: {
          workouts: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        planId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.planSection.create({
        data: {
          name: input.name,
          plan: {
            connect: { id: input.planId },
          },
        },
      });
      return plan;
    }),
});
