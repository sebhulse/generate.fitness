import type { WorkoutDurationInterval } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exerciseRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.exercise.findFirst({
      where: {
        id: input,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        workoutSectionId: z.string(),
        movement: z.string(),
        duration: z.number(),
        rest: z.number().optional(),
        interval: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exerciseCount: number = await ctx.prisma.exercise.count({
        where: {
          workoutSectionId: input.workoutSectionId,
        },
      });
      const exercise = await ctx.prisma.exercise.create({
        data: {
          workoutSection: { connect: { id: input.workoutSectionId } },
          movement: { connect: { name: input.movement } },
          duration: input.duration,
          order: exerciseCount,
          rest: input.rest,
          durationInterval: input.interval as WorkoutDurationInterval,
        },
      });
      return exercise;
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        newOrder: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exercise = await ctx.prisma.exercise.update({
        where: {
          id: input.exerciseId,
        },
        data: {
          order: input.newOrder,
        },
      });
      return exercise;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteExercise = ctx.prisma.exercise.delete({
        where: {
          id: input.exerciseId,
        },
      });
      return deleteExercise;
    }),
});
