import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { IconArrowLeft } from "@tabler/icons";
import {
  Text,
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
import WorkoutInfoCard from "../../../components/dashboard/WorkoutInfoCard";
import Link from "next/link";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const { query } = useRouter();
  const { data: workout, isLoading: isWorkoutLoading } =
    api.workout.getById.useQuery(query.id as string);

  const isNotTimebasedWorkout = workout?.workoutSections?.some((section) =>
    section.exercises?.some(
      (exercise) => exercise.durationInterval !== "Seconds"
    )
  );

  if (isWorkoutLoading)
    return (
      <DashboardLayout>
        <Center>
          <Loader />
        </Center>
      </DashboardLayout>
    );

  if (!workout) return <></>;

  return (
    <>
      <Head>
        <title>Workout</title>
        <meta name="Workouts" content="Dashboard to manage Workouts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Anchor component={Link} href="/dashboard/workouts" display="flex">
          <IconArrowLeft />
          <Text ml="xs">Back</Text>
        </Anchor>
        <Group position="apart" style={{ flexWrap: "nowrap" }}>
          <Title mb="xl" mt="sm" style={{ textTransform: "capitalize" }}>
            {workout?.name}
          </Title>
          <ItemOptionMenu
            item="Workout"
            parentId={query.id as string}
            onDelete={() => router.push("/dashboard/workouts")}
          />
        </Group>
        {!isNotTimebasedWorkout ? (
          <Center>
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
          </Center>
        ) : (
          <></>
        )}

        {workout ? (
          <WorkoutInfoCard workout={workout}></WorkoutInfoCard>
        ) : (
          <></>
        )}
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
