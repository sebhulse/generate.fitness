import { type NextPage } from "next";
import Head from "next/head";
import { Button, Card, Center, Group, Text } from "@mantine/core";
import { IconPencil, IconPlus, IconPlayerPlay } from "@tabler/icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PublicLayout from "../layouts/PublicLayout";
import HomeBulletPoints from "../components/index/HomeBulletPoints";
import HomeOpenSource from "../components/index/HomeOpenSource";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { query } = useRouter();

  const callbackUrl = query.trainer
    ? `/dashboard/?trainer=${query.trainer}`
    : `/dashboard`;
  return (
    <>
      <Head>
        <title>Fitness</title>
        <meta name="description" content="Fitness planning app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PublicLayout>
        <Text
          ta="center"
          fz="xl"
          fw={700}
          style={{ fontSize: "3rem", marginTop: "5rem", marginBottom: "1rem" }}
        >
          Simplify your fitness journey <br />
          with{" "}
          <Text
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            ta="center"
            fz="xl"
            fw={700}
            style={{ fontSize: "3rem", display: "inline" }}
          >
            Generate Fitness
          </Text>
          .
        </Text>
        <Center>
          <Text
            ta="center"
            style={{
              fontSize: "1.4rem",
              maxWidth: "600px",
              marginBottom: "2rem",
              padding: "2rem",
            }}
          >
            Create custom training plans, generate varied workouts, and smash
            your real-time workouts.
          </Text>
        </Center>
        <Center>
          <Button
            type="submit"
            mt="sm"
            size="lg"
            radius="xl"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            onClick={() => {
              sessionData?.user
                ? router.push("/dashboard")
                : signIn(undefined, { callbackUrl: callbackUrl });
            }}
            style={{ marginBottom: "4rem" }}
          >
            Start for free
          </Button>
        </Center>
        <Center style={{ marginBottom: "4rem" }}>
          <div style={{ maxWidth: "1000px" }}>
            <HomeBulletPoints />
            <HomeOpenSource />
            <Center>
              <Button
                type="submit"
                mt="xl"
                size="lg"
                radius="xl"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
                onClick={() => {
                  sessionData?.user
                    ? router.push("/dashboard")
                    : signIn(undefined, { callbackUrl: callbackUrl });
                }}
                style={{ marginBottom: "4rem" }}
              >
                Start for free
              </Button>
            </Center>
          </div>
        </Center>
      </PublicLayout>
    </>
  );
};

export default Home;
