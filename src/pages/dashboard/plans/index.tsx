import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Stack } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import ItemCard from "../../../components/dashboard/ItemCard";

const Plans: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const planQuery = api.plan.getManybyCreatedBy.useQuery();
  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Stack>
          {/* <LoadingOverlay visible={planQuery.isLoading} /> */}
          {planQuery.data?.map((plan) => {
            return <ItemCard key={plan.id} item={plan} />;
          })}
        </Stack>
      </DashboardLayout>
    </>
  );
};

export default Plans;
