import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutSectionRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workoutSection.findFirst({
      where: {
        id: input,
      },
      include: { exercises: { include: { movement: true } } },
    });
  }),

  getManyByWorkoutId: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.workoutSection.findMany({
        where: {
          workoutId: input,
        },
        include: {
          exercises: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        workoutId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workoutSectionCount = await ctx.prisma.workoutSection.count({
        where: {
          workoutId: input.workoutId,
        },
      });
      const workoutSection = await ctx.prisma.workoutSection.create({
        data: {
          name: input.name,
          order: workoutSectionCount,
          workout: {
            connect: { id: input.workoutId },
          },
        },
      });
      return workoutSection;
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        workoutSectionId: z.string(),
        newOrder: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workoutSection = await ctx.prisma.workoutSection.update({
        where: {
          id: input.workoutSectionId,
        },
        data: {
          order: input.newOrder,
        },
      });
      return workoutSection;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        workoutSectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteExercises = ctx.prisma.exercise.deleteMany({
        where: {
          workoutSectionId: input.workoutSectionId,
        },
      });

      const deleteWorkoutSection = ctx.prisma.workoutSection.delete({
        where: {
          id: input.workoutSectionId,
        },
      });

      const transaction = await ctx.prisma.$transaction([
        deleteExercises,
        deleteWorkoutSection,
      ]);
      return transaction;
    }),
});
