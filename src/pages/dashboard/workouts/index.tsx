import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal, Button, Group, Grid, LoadingOverlay } from "@mantine/core";
import { api } from "../../../utils/api";

import DashboardLayout from "../../../layouts/DashboardLayout";
import SectionCard from "../../../components/dashboard/SectionCard";
import { useRouter } from "next/router";

const Workouts: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const workoutQuery = api.workout.getManybyCreatedBy.useQuery();
  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Grid>
          {/* <LoadingOverlay visible={workoutQuery.isLoading} /> */}
          {workoutQuery.data?.map((workout) => {
            return (
              <Grid.Col key={workout.id} md={6} lg={4}>
                <SectionCard key={workout.id} section={workout} />
              </Grid.Col>
            );
          })}
        </Grid>
      </DashboardLayout>
    </>
  );
};

export default Workouts;
