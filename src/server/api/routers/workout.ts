import { z } from "zod";
import { WorkoutBuilder } from "../generators/workout";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const workoutRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workout.findFirst({
      where: {
        id: input,
      },
      include: {
        workoutSections: {
          include: {
            workoutSectionType: { select: { name: true } },
            exercises: { include: { movement: true } },
          },
        },
        planSection: {
          select: {
            plan: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
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
      const items = await ctx.prisma.workout.findMany({
        take: limit + 1,
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          planSection: {
            select: {
              plan: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
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

  getTotalByCreatedBy: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workout.count({
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
      let workoutCount;
      input.planSectionId
        ? (workoutCount = await ctx.prisma.workout.count({
            where: {
              planSectionId: input.planSectionId,
            },
          }))
        : null;
      const workout = await ctx.prisma.workout.create({
        data: {
          name: input.name,
          usesEquipment: input.usesEquipment,
          planSection: input.planSectionId
            ? { connect: { id: input.planSectionId } }
            : undefined,
          order: workoutCount ?? 0,
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
        duration: z.number(),
        usesEquipment: z.boolean().optional(),
        planSectionId: z.string().optional(),
        workoutType: z.string(),
        workoutTargetArea: z.string(),
        workoutIntensity: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let workoutCount;
      input.planSectionId
        ? (workoutCount = await ctx.prisma.workout.count({
            where: {
              planSectionId: input.planSectionId,
            },
          }))
        : null;

      const filter = async (sectionType: string) => {
        if (sectionType === "Main") {
          return await ctx.prisma.movement.findMany({
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
        } else {
          return await ctx.prisma.movement.findMany({
            where: {
              workoutTargetArea: {
                some: { name: input.workoutTargetArea },
              },
              workoutSectionType: {
                some: { name: sectionType },
              },
            },
            select: {
              id: true,
            },
          });
        }
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
        input.duration,
        input.workoutType,
        input.workoutTargetArea,
        input.workoutIntensity,
        warmupMovements,
        mainMovements,
        cooldownMovements
      ).generate();

      return await ctx.prisma.workout.create({
        data: {
          name: input.name,
          usesEquipment: input.usesEquipment,
          planSection: input.planSectionId
            ? { connect: { id: input.planSectionId } }
            : undefined,
          order: workoutCount ?? 0,
          duration: input.duration,
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
    }),

  getDoneWorkoutsTotalDurationByCreatedBy: protectedProcedure.query(
    async ({ ctx }) => {
      const res = await ctx.prisma.workout.aggregate({
        where: {
          createdBy: {
            id: ctx.session.user.id,
          },
          isDone: true,
        },
        _sum: {
          duration: true,
        },
      });
      return res._sum.duration;
    }
  ),

  getDoneWorkoutsCountByCreatedBy: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.workout.aggregate({
      where: {
        createdBy: {
          id: ctx.session.user.id,
        },
        isDone: true,
      },
      _count: {
        id: true,
      },
    });
    return res._count.id;
  }),
});
