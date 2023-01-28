import { createTRPCRouter } from "./trpc";
import { planRouter } from "./routers/plan";
import { planSectionRouter } from "./routers/planSection";
import { userRouter } from "./routers/user";
import { workoutRouter } from "./routers/workout";
import { exerciseRouter } from "./routers/exercise";
import { workoutSectionRouter } from "./routers/workoutSection";
import { workoutSectionTypeRouter } from "./routers/workoutSectionType";
import { movementRouter } from "./routers/movement";
import { workoutTypeRouter } from "./routers/workoutType";
import { workoutIntensityRouter } from "./routers/workoutIntensity";
import { workoutTargetAreaRouter } from "./routers/workoutTargetArea";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  exercise: exerciseRouter,
  plan: planRouter,
  planSection: planSectionRouter,
  user: userRouter,
  workout: workoutRouter,
  workoutSection: workoutSectionRouter,
  workoutSectionType: workoutSectionTypeRouter,
  movement: movementRouter,
  workoutIntensity: workoutIntensityRouter,
  workoutTargetArea: workoutTargetAreaRouter,
  workoutType: workoutTypeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
