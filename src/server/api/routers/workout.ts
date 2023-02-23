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
          workoutSections: {
            create: [
              {
                name: "Warmup",
                workoutSectionType: { connect: { name: "Warmup" } },
                order: 0,
                exercises: {
                  create: [
                    {
                      duration: 60,
                      order: 0,
                      movement: {
                        connect: { name: "Jumping Jacks" },
                      },
                    },
                    {
                      duration: 30,
                      order: 0,
                      movement: {
                        connect: { name: "Push Up" },
                      },
                    },
                  ],
                },
              },
              {
                name: "Main",
                workoutSectionType: { connect: { name: "Main" } },
                order: 0,
                exercises: {
                  create: [
                    {
                      duration: 25,
                      order: 0,
                      movement: {
                        connect: { name: "Squats" },
                      },
                    },
                    {
                      duration: 30,
                      order: 0,
                      movement: {
                        connect: { name: "Sit Up" },
                      },
                    },
                  ],
                },
              },
              {
                name: "Cooldown",
                workoutSectionType: { connect: { name: "Cooldown" } },
                order: 0,
                exercises: {
                  create: [
                    {
                      duration: 35,
                      order: 0,
                      movement: {
                        connect: { name: "Reach Up Reach Down" },
                      },
                    },
                    {
                      duration: 15,
                      order: 0,
                      movement: {
                        connect: { name: "Lateral Lunge" },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });
      return workout;
    }),
});
