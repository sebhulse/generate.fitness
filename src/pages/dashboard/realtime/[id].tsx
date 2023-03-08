import React, { useLayoutEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { createStyles } from "@mantine/core";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    margin: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const Realtime = () => {
  const { classes } = useStyles();

  const { query } = useRouter();
  const { data: workout } = api.workout.getById.useQuery(query.id as string, {
    refetchOnWindowFocus: false,
  });
  const [exerciseName, setExerciseName] = useState("");
  const [sectionName, setSectionName] = useState("");

  const realtimeContainer = useRef(null);
  const exerciseNameTl = useRef();
  const sectionNameTl = useRef();
  const exerciseTimerTl = useRef();
  const workoutTimerTl = useRef();

  useLayoutEffect(() => {
    if (workout) {
      console.log(workout);
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
              duration: exercise.duration / 10,
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
                duration: exercise.rest / 10,
                ease: "linear",
              });
              if (scaleY === 100) {
                scaleY = 0;
              } else {
                scaleY = 100;
              }
            }

            workoutTotalDuration =
              workoutTotalDuration + (exercise.duration + exercise.rest) / 10;
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
              .to("#exerciseName", {
                ease: "elastic",
                onStart: () => setExerciseName(exercise.movement.name),
                duration: exercise.duration / 10,
              })
              .to("#exerciseName", {
                ease: "elastic",
                onStart: () => setExerciseName("Rest"),
                duration: exercise.rest / 10,
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
            sectionLength =
              sectionLength + (exercise.duration + exercise.rest) / 10;
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          sectionNameTl.current.to("#sectionName", {
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
    <>
      <div className={classes.wrapper}>
        <h1 id="sectionName">{sectionName}</h1>
        <h1 id="exerciseName">{exerciseName}</h1>
      </div>
      <svg ref={realtimeContainer} style={{ width: "100vw", height: "100vh" }}>
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
    </>
  );
};
export default Realtime;
