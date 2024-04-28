import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  Button,
  Text,
  Stack,
  Loader,
  Center,
  Title,
  Group,
} from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import ItemCard from "../../../components/dashboard/ItemCard";
import CreateWorkoutModal from "../../../components/dashboard/CreateWorkoutModal";

const Workouts: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const [isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen] =
    useState(false);
  const workoutQuery = api.workout.getManybyCreatedBy.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const totalWorkouts = api.workout.getTotalByCreatedBy.useQuery();

  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Group position="apart">
          <Title>{totalWorkouts.data} Workouts</Title>
          <Button onClick={() => setIsCreateWorkoutModalOpen(true)}>
            Create Workout
          </Button>
        </Group>
        <Stack mt="lg">
          {workoutQuery.data?.pages.map((page) => {
            const itemCards = page.items?.map((workout) => {
              return <ItemCard key={workout.id} item={workout} />;
            });
            return itemCards;
          })}
        </Stack>
        {workoutQuery.isFetching ? (
          <Center mt="lg">
            <Loader />
          </Center>
        ) : workoutQuery.data?.pages[workoutQuery.data?.pages.length - 1]
            ?.nextCursor ? (
          <Center mt="lg">
            <Button onClick={() => workoutQuery.fetchNextPage()}>
              Load more
            </Button>
          </Center>
        ) : (
          <Center mt="lg">
            <Text color={"gray"}>That&#39;s all, folks!</Text>
          </Center>
        )}
        {isCreateWorkoutModalOpen ? (
          <CreateWorkoutModal
            isCreateWorkoutModalOpen={isCreateWorkoutModalOpen}
            setIsCreateWorkoutModalOpen={setIsCreateWorkoutModalOpen}
            refetch={workoutQuery.refetch}
          />
        ) : (
          <></>
        )}
      </DashboardLayout>
    </>
  );
};

export default Workouts;
