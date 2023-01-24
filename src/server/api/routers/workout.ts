import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workout.findFirst({
      where: {
        id: input,
      },
      include: {
        workoutSections: {
          include: { exercises: { include: { movement: true } } },
        },
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
      const workoutCount = await ctx.prisma.workout.count({
        where: {
          planSectionId: input.planSectionId,
        },
      });
      const workout = await ctx.prisma.workout.create({
        data: {
          name: input.name,
          allowDisplayUserEdit: input.allowEdit,
          planSection: { connect: { id: input.planSectionId } },
          order: workoutCount,
          createdBy: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
      return workout;
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        newOrder: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workout = await ctx.prisma.workout.update({
        where: {
          id: input.workoutId,
        },
        data: {
          order: input.newOrder,
        },
      });
      return workout;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteWorkout = ctx.prisma.workout.delete({
        where: {
          id: input.workoutId,
        },
      });
      return deleteWorkout;
    }),
});
