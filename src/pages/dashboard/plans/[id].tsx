import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { Anchor, Loader, Center, Group, Title, Text } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import PlanInfoCard from "../../../components/dashboard/PlanInfoCard";
import SectionsDnd from "../../../components/dashboard/SectionsDnd";
import { useSession } from "next-auth/react";
import ItemOptionMenu from "../../../components/dashboard/ItemOptionMenu";
import { IconArrowLeft } from "@tabler/icons";
import Link from "next/link";

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
        <Anchor component={Link} href="/dashboard/plans" display="flex">
          <IconArrowLeft />
          <Text ml="xs">Back</Text>
        </Anchor>
        <Group position="apart" style={{ flexWrap: "nowrap" }}>
          <Title mb="md" mt="sm" style={{ textTransform: "capitalize" }}>
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
