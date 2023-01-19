import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const planSectionRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.planSection.findFirst({
      where: {
        id: input,
      },
      include: {
        workouts: true,
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
      const planSectionCount = await ctx.prisma.planSection.count({
        where: {
          planId: input.planId,
        },
      });
      const plan = await ctx.prisma.planSection.create({
        data: {
          name: input.name,
          order: planSectionCount,
          plan: {
            connect: { id: input.planId },
          },
        },
      });
      return plan;
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        planSectionId: z.string(),
        newOrder: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.planSection.update({
        where: {
          id: input.planSectionId,
        },
        data: {
          order: input.newOrder,
        },
      });
      return plan;
    }),
});
