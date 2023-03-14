import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Button, Center, createStyles, Overlay } from "@mantine/core";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import { IconRun } from "@tabler/icons";

const useStyles = createStyles({
  wrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
});

const Realtime = () => {
  const { classes } = useStyles();

  const { query } = useRouter();
  const router = useRouter();
  const { data: workout } = api.workout.getById.useQuery(query.id as string, {
    refetchOnWindowFocus: false,
  });

  const [isAnimationOptionsOverlayOpen, setIsAnimationOptionsModalOpen] =
    useState(false);

  const playPauseAnimation = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    exerciseNameTl.current.paused(!exerciseNameTl.current.paused());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sectionNameTl.current.paused(!sectionNameTl.current.paused());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    exerciseTimerTl.current.paused(!exerciseTimerTl.current.paused());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workoutTimerTl.current.paused(!workoutTimerTl.current.paused());
  };

  const exitAnimation = () => {
    router.push(`/dashboard/workouts/${query.id as string}`);
  };

  const toggleAnimationOptions = () => {
    playPauseAnimation();
    setIsAnimationOptionsModalOpen(!isAnimationOptionsOverlayOpen);
  };

  const [exerciseName, setExerciseName] = useState("");
  const [sectionName, setSectionName] = useState("");

  const realtimeContainer = useRef(null);
  const exerciseNameEl = useRef(null);
  const exerciseNameTl = useRef();
  const sectionNameEl = useRef(null);
  const sectionNameTl = useRef();
  const exerciseTimerTl = useRef();
  const workoutTimerTl = useRef();

  useEffect(() => {
    if (workout) {
      let workoutTotalDuration = 0;
      const exerciseTimerTlCtx = gsap.context(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        exerciseTimerTl.current = gsap.timeline();
        let scaleY = 100;
        workout.workoutSections.forEach((section) => {
          section.exercises.forEach((exercise) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            exerciseTimerTl.current.to("#exerciseTimer", {
              yPercent: scaleY,
              duration: exercise.duration,
              ease: "linear",
            });
            if (scaleY === 100) {
              scaleY = 0;
            } else {
              scaleY = 100;
            }
            if (exercise.rest > 0) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              exerciseTimerTl.current.to("#exerciseTimer", {
                yPercent: scaleY,
                duration: exercise.rest,
                ease: "linear",
              });
              if (scaleY === 100) {
                scaleY = 0;
              } else {
                scaleY = 100;
              }
            }

            workoutTotalDuration =
              workoutTotalDuration + (exercise.duration + exercise.rest);
          });
        }, realtimeContainer);
      });
      const workoutTimerTlCtx = gsap.context(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        workoutTimerTl.current = gsap.timeline().to("#workoutTimer", {
          yPercent: 100,
          duration: workoutTotalDuration,
          ease: "linear",
        });
      }, realtimeContainer);
      const exerciseNameTlCtx = gsap.context(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        exerciseNameTl.current = gsap.timeline();
        workout.workoutSections.forEach((section) => {
          section.exercises.forEach((exercise) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            exerciseNameTl.current
              .to(exerciseNameEl, {
                ease: "elastic",
                onStart: () => setExerciseName(exercise.movement.name),
                duration: exercise.duration,
              })
              .to(exerciseNameEl, {
                ease: "elastic",
                onStart: () => setExerciseName("Rest"),
                duration: exercise.rest,
              });
          });
        });
      }, realtimeContainer);
      const sectionNameTlCtx = gsap.context(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sectionNameTl.current = gsap.timeline();
        workout.workoutSections.forEach((section) => {
          let sectionLength = 0;
          section.exercises.forEach((exercise) => {
            sectionLength = sectionLength + (exercise.duration + exercise.rest);
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          sectionNameTl.current.to(sectionNameEl, {
            ease: "elastic",
            onStart: () => setSectionName(section.name),
            duration: sectionLength,
          });
        });
      }, realtimeContainer);

      return () => {
        exerciseTimerTlCtx.revert();
        workoutTimerTlCtx.revert();
        exerciseNameTlCtx.revert();
        sectionNameTlCtx.revert();
      };
    }
  }, [workout]);

  return (
    <div>
      <div className={classes.wrapper}>
        <IconRun />
        <h1 ref={sectionNameEl}>{sectionName}</h1>
        <h1 ref={exerciseNameEl}>{exerciseName}</h1>
        <Button
          variant="outline"
          size="lg"
          color="gray"
          onClick={toggleAnimationOptions}
        >
          Options
        </Button>
      </div>
      <svg
        ref={realtimeContainer}
        style={{
          border: "2px solid #015e5e",
          borderRadius: "6px",
          width: "100vw",
          height: "100vh",
        }}
      >
        <rect
          id="exerciseTimer"
          style={{
            width: "100%",
            height: "100%",
            fill: "white",
            opacity: 0.2,
          }}
        ></rect>
        <rect
          id="workoutTimer"
          style={{
            width: "100%",
            height: "100%",
            fill: "cyan",
            opacity: 0.3,
          }}
        ></rect>
      </svg>
      {isAnimationOptionsOverlayOpen ? (
        <Overlay color="#000" opacity={0.88}>
          <Center
            className={classes.wrapper}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              opacity={1}
              onClick={() => toggleAnimationOptions()}
              style={{ margin: "1rem" }}
              color="cyan"
              size="lg"
            >
              Resume
            </Button>
            <Button
              opacity={1}
              onClick={() => exitAnimation()}
              variant="outline"
              color="cyan"
              size="lg"
            >
              Exit
            </Button>
          </Center>
        </Overlay>
      ) : null}
    </div>
  );
};
export default Realtime;
