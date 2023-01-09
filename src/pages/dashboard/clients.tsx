import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal, Button, Group } from "@mantine/core";

import DashboardLayout from "../../layouts/DashboardLayout";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Clients</title>
        <meta name="Clients" content="Dashboard to manage Clients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <p>Clients</p>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
