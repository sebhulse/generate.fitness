import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const movementRouter = createTRPCRouter({
  filter: protectedProcedure
    .input(
      z.object({
        workoutTypeId: z.string().nullable(),
        workoutTargetAreaId: z.string().nullable(),
        workoutIntensityId: z.string().nullable(),
        workoutSectionTypeId: z.string().nullable(),
      })
    )
    .query(({ ctx, input }) => {
      if (
        input.workoutTypeId &&
        input.workoutIntensityId &&
        input.workoutTargetAreaId &&
        input.workoutSectionTypeId
      ) {
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
      } else if (input.workoutTargetAreaId && input.workoutSectionTypeId) {
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
