import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workout.findFirst({
      where: {
        id: input,
      },
      include: {
        workoutSections: { include: { exercises: true } },
      },
    });
  }),

  getManybyCreatedBy: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workout.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        allowEdit: z.boolean().optional(),
        planSectionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.workout.create({
        data: {
          name: input.name,
          allowDisplayUserEdit: input.allowEdit,
          planSection: { connect: { id: input.planSectionId } },
          createdBy: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
      return plan;
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        newOrder: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.workout.update({
        where: {
          id: input.workoutId,
        },
        data: {
          order: input.newOrder,
        },
      });
      return plan;
    }),
});
