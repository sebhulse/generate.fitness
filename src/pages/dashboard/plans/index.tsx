import type { NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  Button,
  Center,
  Loader,
  Text,
  Stack,
  Title,
  Group,
} from "@mantine/core";
import { api } from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import ItemCard from "../../../components/dashboard/ItemCard";
import { useState } from "react";
import CreatePlanModal from "../../../components/dashboard/CreatePlanModal";

const Plans: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);

  const planQuery = api.plan.getManybyCreatedBy.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const totalPlans = api.plan.getTotalByCreatedBy.useQuery();

  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="Plans" content="Dashboard to manage Plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Group position="apart">
          <Title>{totalPlans.data} Plans</Title>
          <Button onClick={() => setIsCreatePlanModalOpen(true)}>
            Create Plan
          </Button>
        </Group>
        <Stack mt="lg">
          {planQuery.data?.pages.map((page) => {
            const itemCards = page.items?.map((plan) => {
              return <ItemCard key={plan.id} item={plan} />;
            });
            return itemCards;
          })}
        </Stack>

        {planQuery.isFetching ? (
          <Center mt="lg">
            <Loader />
          </Center>
        ) : planQuery.data?.pages[planQuery.data?.pages.length - 1]
            ?.nextCursor ? (
          <Center mt="lg">
            <Button onClick={() => planQuery.fetchNextPage()}>Load more</Button>
          </Center>
        ) : (
          <Center mt="lg">
            <Text color={"gray"}>That&#39;s all, folks!</Text>
          </Center>
        )}
        {isCreatePlanModalOpen ? (
          <CreatePlanModal
            isCreatePlanModalOpen={isCreatePlanModalOpen}
            setIsCreatePlanModalOpen={setIsCreatePlanModalOpen}
          />
        ) : (
          <></>
        )}
      </DashboardLayout>
    </>
  );
};

export default Plans;
