import { createTRPCRouter } from "./trpc";
import { planRouter } from "./routers/plan";
import { planSectionRouter } from "./routers/planSection";
import { userRouter } from "./routers/user";
import { workoutRouter } from "./routers/workout";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  plan: planRouter,
  planSection: planSectionRouter,
  user: userRouter,
  workout: workoutRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
