import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { Breadcrumbs, Anchor, Loader } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import PlanInfoCard from "../../../components/dashboard/PlanInfoCard";
import SectionItemsDnd from "../../../components/dashboard/SectionItemsDnd";
import SectionsDnd from "../../../components/dashboard/SectionsDnd";

const Dashboard: NextPage = () => {
  const { query } = useRouter();
  const { data: workout, isLoading: isWorkoutLoading } =
    api.workout.getById.useQuery(query.id as string);

  const items = [
    { title: "Overview", href: "/dashboard" },
    { title: "Workouts", href: "/dashboard/workouts" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="Workouts" content="Dashboard to manage Workouts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Breadcrumbs>{items}</Breadcrumbs>
        {isWorkoutLoading ? <Loader variant="dots" /> : <></>}
        {/* {workout ? <PlanInfoCard plan={workout}></PlanInfoCard> : <></>} */}
        {workout?.workoutSections ? (
          <SectionsDnd parent={workout}></SectionsDnd>
        ) : (
          <></>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
