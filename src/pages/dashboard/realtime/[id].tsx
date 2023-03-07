import React, { useLayoutEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { type NextPage } from "next";
import Head from "next/head";
import { Breadcrumbs, Anchor, Loader, Button, Group } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import PlanInfoCard from "../../../components/dashboard/PlanInfoCard";
import SectionItemsDnd from "../../../components/dashboard/SectionItemsDnd";
import SectionsDnd from "../../../components/dashboard/SectionsDnd";

const Realtime = () => {
  const { query } = useRouter();
  const { data: workout, isLoading: isWorkoutLoading } =
    api.workout.getById.useQuery(query.id as string);
  const el = useRef(null);
  const tlExercises = useRef();
  const tlTimer = useRef();

  useLayoutEffect(() => {
    const ctx1 = gsap.context(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tlExercises.current = gsap.timeline().to(
        "#box",
        {
          yPercent: -100,
          duration: 2,
          ease: "linear",
        },
        0
      );
    }, el);
    const ctx2 = gsap.context(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tlTimer.current = gsap.timeline().to("#totalTimer", {
        yPercent: 100,
        duration: 5,
        ease: "linear",
      });
    }, el);

    return () => {
      ctx1.revert();
      ctx2.revert();
    };
  }, []);

  return (
    <>
      <svg className="app" ref={el} style={{ width: "100vw", height: "100vh" }}>
        <rect
          id="box"
          style={{
            width: "100%",
            height: "100%",
            fill: "white",
            opacity: 0.2,
          }}
        ></rect>
        <rect
          id="totalTimer"
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
