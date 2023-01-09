import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal, Button, Group } from "@mantine/core";
import { api } from "../../utils/api";
import DashboardLayout from "../../layouts/DashboardLayout";

const Dashboard: NextPage = () => {
  const planQuery = api.plan.getManybyCreatedBy.useQuery();

  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <div>
          {planQuery.data?.map((plan) => {
            return <p key={plan.name}>{plan.name}</p>;
          })}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
