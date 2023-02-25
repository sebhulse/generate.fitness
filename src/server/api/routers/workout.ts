import { z } from "zod";
import { WorkoutBuilder } from "../generators/workout";
import { api } from "../../../utils/api";

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
        usesEquipment: z.boolean().optional(),
        planSectionId: z.string().optional(),
        workoutType: z.string(),
        workoutTargetArea: z.string(),
        workoutIntensity: z.string(),
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
          usesEquipment: input.usesEquipment,
          planSection: { connect: { id: input.planSectionId } },
          order: workoutCount,
          createdBy: {
            connect: { id: ctx.session.user.id },
          },
          workoutType: {
            connect: { name: input.workoutType },
          },
          workoutTargetArea: {
            connect: { name: input.workoutTargetArea },
          },
          workoutIntensity: {
            connect: { name: input.workoutIntensity },
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

  generate: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        duration: z.number().optional(),
        usesEquipment: z.boolean().optional(),
        planSectionId: z.string().optional(),
        workoutType: z.string(),
        workoutTargetArea: z.string(),
        workoutIntensity: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workoutCount = await ctx.prisma.workout.count({
        where: {
          planSectionId: input.planSectionId,
        },
      });
      const filter = async (sectionType: string) => {
        const response = await ctx.prisma.movement.findMany({
          where: {
            workoutType: {
              some: { name: input.workoutType },
            },
            workoutTargetArea: {
              some: { name: input.workoutTargetArea },
            },
            workoutIntensity: {
              some: { name: input.workoutIntensity },
            },
            workoutSectionType: {
              some: { name: sectionType },
            },
          },
          select: {
            id: true,
          },
        });
        return response;
      };
      const warmupMovementsRes = await filter("Warmup");
      const warmupMovements = warmupMovementsRes?.map((movement) => {
        return movement.id;
      });
      const mainMovementsRes = await filter("Main");
      const mainMovements = mainMovementsRes?.map((movement) => {
        return movement.id;
      });
      const cooldownMovementsRes = await filter("Cooldown");
      const cooldownMovements = cooldownMovementsRes?.map((movement) => {
        return movement.id;
      });

      const generated = new WorkoutBuilder(
        input.name,
        600,
        input.workoutType,
        input.workoutTargetArea,
        input.workoutIntensity,
        warmupMovements,
        mainMovements,
        cooldownMovements
      ).generate();
      console.log("before");
      console.log(generated);
      const workout = await ctx.prisma.workout.create({
        data: {
          name: input.name,
          usesEquipment: input.usesEquipment,
          planSection: { connect: { id: input.planSectionId } },
          order: workoutCount,
          createdBy: {
            connect: { id: ctx.session.user.id },
          },
          workoutType: {
            connect: { name: input.workoutType },
          },
          workoutTargetArea: {
            connect: { name: input.workoutTargetArea },
          },
          workoutIntensity: {
            connect: { name: input.workoutIntensity },
          },
          workoutSections: generated,
        },
      });
      return workout;
    }),
});
