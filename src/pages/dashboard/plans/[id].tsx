import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { Breadcrumbs, Anchor, Loader } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import PlanInfoCard from "../../../components/dashboard/PlanInfoCard";
import SectionItemsDnd from "../../../components/dashboard/SectionItemsDnd";
import SectionsDnd from "../../../components/dashboard/SectionsDnd";

const Dashboard: NextPage = () => {
  const { query } = useRouter();
  const { data: plan, isLoading: isPlanLoading } = api.plan.getById.useQuery(
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

  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Breadcrumbs>{items}</Breadcrumbs>
        {isPlanLoading ? <Loader variant="dots" /> : <></>}
        {plan ? <PlanInfoCard plan={plan}></PlanInfoCard> : <></>}
        {plan?.planSections ? (
          <SectionsDnd sections={plan}></SectionsDnd>
        ) : (
          <></>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
