import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Modal, Button, Group, Text, Title } from "@mantine/core";
import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import DeleteAccountModal from "../../components/dashboard/DeleteAccountModal";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  return (
    <>
      <Head>
        <title>Overview</title>
        <meta name="Overview" content="Dashboard Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Group position="apart">
          <div>
            <Title mb="lg">Profile</Title>
            <Text mb="md">Name: {sessionData?.user?.name}</Text>
            <Text mb="md">Email: {sessionData?.user?.email}</Text>
          </div>
          {sessionData?.user?.image ? (
            <Image
              src={sessionData?.user?.image}
              alt="profile image"
              width={50}
              height={50}
            />
          ) : null}
        </Group>
        <Button
          color={"red"}
          onClick={() => setIsDeleteAccountModalOpen(true)}
          mt="md"
        >
          Delete
        </Button>
        {isDeleteAccountModalOpen ? (
          <DeleteAccountModal
            isDeleteAccountModalOpen={isDeleteAccountModalOpen}
            setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen}
          />
        ) : (
          <></>
        )}
        {/* {isCreatePlanModalOpen ? (
          <CreatePlanModal
            isCreatePlanModalOpen={isCreatePlanModalOpen}
            setIsCreatePlanModalOpen={setIsCreatePlanModalOpen}
          />
        ) : (
          <></>
        )} */}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
