import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Modal, Button, Group, Notification } from "@mantine/core";
import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import CreatePlanModal from "../../components/dashboard/CreatePlanModal";
import CreateWorkoutModal from "../../components/dashboard/CreateWorkoutModal";
import { useRouter } from "next/router";
import { IconCheck } from "@tabler/icons";
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
  });

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
          <p>
            {sessionData && (
              <span>Logged in to dashboard as {sessionData.user?.name}</span>
            )}
          </p>
          <CreatePlanModal
            isCreatePlanModalOpen={isCreatePlanModalOpen}
            setIsCreatePlanModalOpen={setIsCreatePlanModalOpen}
          />

          <Group>
            <Button onClick={() => setIsCreatePlanModalOpen(true)}>
              Create Plan
            </Button>
            <Button onClick={() => setIsCreateWorkoutModalOpen(true)}>
              Create Workout
            </Button>
          </Group>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
