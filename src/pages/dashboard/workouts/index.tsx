import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Modal,
  Button,
  Text,
  Stack,
  LoadingOverlay,
  Loader,
  Center,
} from "@mantine/core";
import { api } from "../../../utils/api";

import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import ItemCard from "../../../components/dashboard/ItemCard";

const Workouts: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const workoutQuery = api.workout.getManybyCreatedBy.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Stack>
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
      </DashboardLayout>
    </>
  );
};

export default Workouts;
