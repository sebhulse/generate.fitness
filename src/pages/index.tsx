import { type NextPage } from "next";
import Head from "next/head";
import HeaderMenu from "../components/index/HeaderMenu";
import { Button, Center, Text } from "@mantine/core";
import { IconPencil, IconPlus, IconPlayerPlay } from "@tabler/icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PublicLayout from "../layouts/PublicLayout";

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
          style={{ fontSize: "3rem", marginTop: "10rem", marginBottom: "1rem" }}
        >
          Organise your fitness journey <br />
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
          >
            Start for free
          </Button>
        </Center>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              margin: "5rem",
            }}
          >
            <IconPencil size={50} style={{ marginRight: "2rem" }} />
            <Text ta="center" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
              Customise training plans
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              margin: "5rem",
            }}
          >
            <IconPlus size={50} style={{ marginRight: "2rem" }} />
            <Text ta="center" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
              Generate varied workouts
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              margin: "5rem",
            }}
          >
            <IconPlayerPlay size={50} style={{ marginRight: "2rem" }} />
            <Text ta="center" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
              Smash your workouts in real-time
            </Text>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export default Home;
