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

  getManybyCreatedBy: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.plan.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
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
