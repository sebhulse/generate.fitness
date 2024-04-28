import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { Button, Group, Text, Title } from "@mantine/core";
import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import DeleteAccountModal from "../../components/dashboard/DeleteAccountModal";
import { api } from "../../utils/api";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  const mutationDeleteUser = api.user.deleteUser.useMutation({
    async onSuccess() {
      // send email to confirm account deletion?
      setIsDeleteAccountModalOpen(false);
      showNotification({
        id: "account-deleted",
        autoClose: false,
        title: "Account deleted",
        message: `Your account and all data was successfully deleted.`,
        color: "green",
        icon: <IconCheck />,
      });
      await new Promise((r) => setTimeout(r, 3000));
      signOut();
    },
    onError() {
      showNotification({
        id: "account-delete-error",
        autoClose: false,
        title: "Delete account error",
        message: `There was an error while attempting to delete your account. Please try again later.`,
        color: "red",
        icon: <IconX />,
      });
    },
  });

  const handleDelete = () => {
    mutationDeleteUser.mutate();
  };

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
          Delete account
        </Button>
        {isDeleteAccountModalOpen ? (
          <DeleteAccountModal
            onClick={handleDelete}
            isLoading={mutationDeleteUser.isLoading}
            isDeleteAccountModalOpen={isDeleteAccountModalOpen}
            setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen}
          />
        ) : (
          <></>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
