import type { PlanInterval } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const planRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.plan.findFirst({
      where: {
        id: input,
      },
      include: {
        planSections: { include: { workouts: true } },
      },
    });
  }),

  getManybyCreatedBy: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const items = await ctx.prisma.plan.findMany({
        take: limit + 1,
        where: {
          userId: ctx.session.user.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem ? nextItem.id : undefined;
      }
      return {
        items,
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        startDate: z.date().optional(),
        planInterval: z.string().optional(),
        allowEdit: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.plan.create({
        data: {
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          allowDisplayUserEdit: input.allowEdit,
          planInterval: input.planInterval as PlanInterval,
          createdBy: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
      return plan;
    }),
});
