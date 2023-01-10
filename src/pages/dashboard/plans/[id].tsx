import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { Breadcrumbs, Anchor, Loader } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import PlanInfoCard from "../../../components/dashboard/PlanInfoCard";
import DndTable from "../../../components/dashboard/DndTable";
import { DndListHandle } from "../../../components/dashboard/DndListHandle";

const Dashboard: NextPage = () => {
  const { query } = useRouter();
  const { data: plan, isLoading } = api.plan.getById.useQuery(
    query.id as string
  );

  const items = [
    { title: "Overview", href: "/dashboard" },
    { title: "Plans", href: "/dashboard/plans" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const data = [
    {
      position: 43214231,
      mass: 9877,
      symbol: "asda",
      name: "saa",
    },
    {
      position: 567657,
      mass: 7765,
      symbol: "ssd",
      name: "dsaf",
    },
  ];

  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Breadcrumbs>{items}</Breadcrumbs>
        {isLoading ? <Loader variant="dots" /> : <></>}
        {plan ? <PlanInfoCard plan={plan}></PlanInfoCard> : <></>}
        <DndListHandle data={data}></DndListHandle>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
