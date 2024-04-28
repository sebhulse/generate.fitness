import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
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
