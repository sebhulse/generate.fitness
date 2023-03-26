import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const movementRouter = createTRPCRouter({
  filter: protectedProcedure
    .input(
      z.object({
        workoutTypeId: z.string().optional(),
        workoutTargetAreaId: z.string(),
        workoutIntensityId: z.string().optional(),
        workoutSectionTypeId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      if (input.workoutTypeId && input.workoutIntensityId) {
        return ctx.prisma.movement.findMany({
          where: {
            workoutType: {
              some: { id: input.workoutTypeId },
            },
            workoutTargetArea: {
              some: { id: input.workoutTargetAreaId },
            },
            workoutIntensity: {
              some: { id: input.workoutIntensityId },
            },
            workoutSectionType: {
              some: { id: input.workoutSectionTypeId },
            },
          },
        });
      } else {
        return ctx.prisma.movement.findMany({
          where: {
            workoutTargetArea: {
              some: { id: input.workoutTargetAreaId },
            },
            workoutSectionType: {
              some: { id: input.workoutSectionTypeId },
            },
          },
        });
      }
    }),
});
