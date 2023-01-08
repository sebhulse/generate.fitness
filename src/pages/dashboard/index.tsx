import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";

import { api } from "../../utils/api";
import DashboardLayout from "../../layouts/DashboardLayout";

const Dashboard: NextPage = () => {
  const { data: sessionData } = useSession();

  const mutation = api.profile.createProfile.useMutation();
  const createExampleMut = () => {
    sessionData?.user?.id
      ? mutation.mutate({ userId: sessionData.user.id })
      : null;
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta
          name="dashboard"
          content="Dashboard to manage Workouts and Plans"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <div>
          <p>
            {sessionData && (
              <span>Logged in to dashboard as {sessionData.user?.name}</span>
            )}
          </p>

          <Button onClick={createExampleMut}>create mut</Button>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
