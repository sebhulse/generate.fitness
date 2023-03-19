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
        duration: z.number(),
        usesEquipment: z.boolean().optional(),
        planSectionId: z.string().optional(),
        workoutType: z.string(),
        workoutTargetArea: z.string(),
        workoutIntensity: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      performance.mark("generate_start");

      const workoutCount = await ctx.prisma.workout.count({
        where: {
          planSectionId: input.planSectionId,
        },
      });
      performance.mark("generate_count");
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
      performance.mark("warmup_filter");

      const mainMovementsRes = await filter("Main");
      const mainMovements = mainMovementsRes?.map((movement) => {
        return movement.id;
      });
      performance.mark("main_filter");

      const cooldownMovementsRes = await filter("Cooldown");
      const cooldownMovements = cooldownMovementsRes?.map((movement) => {
        return movement.id;
      });
      performance.mark("cooldown_filter");

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

      performance.mark("instantiate_builder");

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
      performance.mark("create_workout");
      const countMeasure = performance.measure(
        "countMeasure",
        "generate_start",
        "generate_count"
      );
      const filterWarmup = performance.measure(
        "filterWarmup",
        "generate_count",
        "warmup_filter"
      );
      const filterMain = performance.measure(
        "filterMain",
        "warmup_filter",
        "main_filter"
      );
      const filterCooldown = performance.measure(
        "filterCooldown",
        "main_filter",
        "cooldown_filter"
      );
      const instantiateBuilder = performance.measure(
        "instantiateBuilder",
        "cooldown_filter",
        "instantiate_builder"
      );
      const createWorkout = performance.measure(
        "createWorkout",
        "instantiate_builder",
        "create_workout"
      );
      console.log("measure workout duration:", countMeasure.duration);
      console.log("filter warmups duration:", filterWarmup.duration);
      console.log("filter main duration:", filterMain.duration);
      console.log("filter cooldown duration:", filterCooldown.duration);
      console.log("instantiate builder duration:", instantiateBuilder.duration);
      console.log("create workout duration:", createWorkout.duration);
      return workout;
    }),
});
