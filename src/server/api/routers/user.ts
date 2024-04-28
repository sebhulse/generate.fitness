import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),

  linkTrainerToUser: protectedProcedure
    .input(
      z.object({
        trainerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          trainer: {
            connect: { id: input.trainerId },
          },
        },
        include: {
          trainer: true,
        },
      });
      return plan;
    }),

  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
});
