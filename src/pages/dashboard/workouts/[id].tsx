import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import {
  Breadcrumbs,
  Anchor,
  Loader,
  Button,
  Group,
  Center,
  Title,
} from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import SectionsDnd from "../../../components/dashboard/SectionsDnd";
import { useSession } from "next-auth/react";
import ItemOptionMenu from "../../../components/dashboard/ItemOptionMenu";

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

  if (isWorkoutLoading)
    return (
      <DashboardLayout>
        <Center>
          <Loader />
        </Center>
      </DashboardLayout>
    );

  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="Workouts" content="Dashboard to manage Workouts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Breadcrumbs>{items}</Breadcrumbs>
        <Group position="apart">
          <Title mb="md" mt="md">
            {workout?.name}
          </Title>
          <ItemOptionMenu
            item="Workout"
            parentId={query.id as string}
            onDelete={() => router.push("/dashboard/workouts")}
          />
        </Group>
        <Button
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          onClick={() =>
            router.push(`/dashboard/realtime/${query.id as string}`)
          }
          size="lg"
        >
          Start workout
        </Button>

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
