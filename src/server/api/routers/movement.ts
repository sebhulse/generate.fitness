import { InputLabel } from "@mantine/core/lib/Input/InputLabel/InputLabel";
import { Workout } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const movementRouter = createTRPCRouter({
  filter: protectedProcedure
    .input(
      z.object({
        workoutTypeId: z.string(),
        workoutTargetAreaId: z.string(),
        workoutIntensityId: z.string(),
        workoutSectionTypeId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
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
    }),
});
