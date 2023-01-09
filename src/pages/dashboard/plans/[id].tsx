import { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal, Button, Group } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { query } = useRouter();
  const { id } = query;

  const getData = (id: string | string[] | undefined) => {
    if (id) {
      return api.plan.getById.useQuery(id as string);
    }
  };

  const data = getData(id);

  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <p>{data?.data?.name ? data?.data?.name : "No Data"}</p>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
