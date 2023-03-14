import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { Breadcrumbs, Anchor, Loader, Button, Group } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import SectionsDnd from "../../../components/dashboard/SectionsDnd";
import { useSession } from "next-auth/react";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
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
        <Group position="apart">
          <h1>{workout?.name}</h1>
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            onClick={() =>
              router.push(`/dashboard/realtime/${query.id as string}`)
            }
            size="lg"
          >
            Realtime
          </Button>
        </Group>

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
