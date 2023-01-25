import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal, Button, LoadingOverlay, Grid } from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import SectionCard from "../../../components/dashboard/SectionCard";

const Plans: NextPage = () => {
  const planQuery = api.plan.getManybyCreatedBy.useQuery();

  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Grid>
          <LoadingOverlay visible={planQuery.isLoading} />
          {planQuery.data?.map((plan) => {
            return (
              <Grid.Col key={plan.id} md={6} lg={4}>
                <SectionCard key={plan.id} section={plan} />
              </Grid.Col>
            );
          })}
        </Grid>
      </DashboardLayout>
    </>
  );
};

export default Plans;
