import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  Modal,
  Button,
  Group,
  Text,
  Box,
  Paper,
  Title,
  Stack,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import CreatePlanModal from "../../components/dashboard/CreatePlanModal";
import CreateWorkoutModal from "../../components/dashboard/CreateWorkoutModal";
import { useRouter } from "next/router";
import {
  IconCheck,
  IconClock,
  IconCross,
  IconListNumbers,
  IconNumber,
  IconX,
} from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen] =
    useState(false);
  const { query } = useRouter();
  const mutation = api.user.linkTrainerToUser.useMutation({
    onSuccess(data) {
      showNotification({
        id: "trainer-linked",
        autoClose: false,
        title: "Trainer linked",
        message: `Your trainer ${data.trainer?.name} was successfully linked to your account.`,
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError() {
      showNotification({
        id: "trainer-link-error",
        autoClose: false,
        title: "Trainer link error",
        message: `There was an error linking your trainer to your account. Please try again later.`,
        color: "red",
        icon: <IconX />,
      });
    },
  });

  const { data: totalDoneWorkoutDuration } =
    api.workout.getDoneWorkoutsTotalDurationByCreatedBy.useQuery();

  const { data: totalDoneWorkoutCount } =
    api.workout.getDoneWorkoutsCountByCreatedBy.useQuery();

  useEffect(() => {
    if (query.trainer !== undefined) {
      mutation.mutate({ trainerId: query.trainer as string });
    }
  }, [query.trainer]);

  return (
    <>
      <Head>
        <title>Overview</title>
        <meta name="Overview" content="Dashboard Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <div>
          <Text>Welcome, {sessionData?.user?.name}</Text>
          {totalDoneWorkoutCount && totalDoneWorkoutDuration ? (
            <Paper mt="md">
              <Title>Stats</Title>
              <Stack mt="md">
                <Group>
                  <IconClock />
                  <Text>
                    Total workout duration: {totalDoneWorkoutDuration / 60} mins
                  </Text>
                </Group>
                <Group>
                  <IconListNumbers />
                  <Text>Total workouts: {totalDoneWorkoutCount}</Text>
                </Group>
              </Stack>
            </Paper>
          ) : (
            <Paper mt="md">
              <Title>Stats</Title>
              <Text mt="md">
                Looks like you haven&apos;t completed a workout yet! Complete a
                workout to see your total stats here.
              </Text>
            </Paper>
          )}
          <Group mt="xl">
            <Button onClick={() => setIsCreatePlanModalOpen(true)}>
              Create Plan
            </Button>
            <Button onClick={() => setIsCreateWorkoutModalOpen(true)}>
              Create Workout
            </Button>
          </Group>
        </div>
        {isCreateWorkoutModalOpen ? (
          <CreateWorkoutModal
            isCreateWorkoutModalOpen={isCreateWorkoutModalOpen}
            setIsCreateWorkoutModalOpen={setIsCreateWorkoutModalOpen}
          />
        ) : (
          <></>
        )}
        {isCreatePlanModalOpen ? (
          <CreatePlanModal
            isCreatePlanModalOpen={isCreatePlanModalOpen}
            setIsCreatePlanModalOpen={setIsCreatePlanModalOpen}
          />
        ) : (
          <></>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
