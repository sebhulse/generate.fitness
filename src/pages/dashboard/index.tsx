import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal, Button, Group } from "@mantine/core";
import { useState } from "react";
import { api } from "../../utils/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import CreatePlanModal from "../../components/dashboard/CreatePlanModal";
import CreateWorkoutModal from "../../components/dashboard/CreateWorkoutModal";

const Dashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen] =
    useState(false);

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
          <CreateWorkoutModal
            isCreateWorkoutModalOpen={isCreateWorkoutModalOpen}
            setIsCreateWorkoutModalOpen={setIsCreateWorkoutModalOpen}
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
