import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import {
  Breadcrumbs,
  Anchor,
  Loader,
  Center,
  Group,
  Title,
} from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import PlanInfoCard from "../../../components/dashboard/PlanInfoCard";
import SectionsDnd from "../../../components/dashboard/SectionsDnd";
import { useSession } from "next-auth/react";
import ItemOptionMenu from "../../../components/dashboard/ItemOptionMenu";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
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

  if (isPlanLoading)
    return (
      <DashboardLayout>
        <Center>
          <Loader />
        </Center>
      </DashboardLayout>
    );

  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Breadcrumbs>{items}</Breadcrumbs>
        <Group position="apart">
          <Title mb="md" mt="md" style={{ textTransform: "capitalize" }}>
            {plan?.name}
          </Title>
          <ItemOptionMenu
            item="Plan"
            parentId={query.id as string}
            onDelete={() => router.push("/dashboard/plans")}
          />
        </Group>
        {plan ? <PlanInfoCard plan={plan}></PlanInfoCard> : <></>}
        {plan?.planSections ? <SectionsDnd parent={plan}></SectionsDnd> : <></>}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
