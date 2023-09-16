import { type NextPage } from "next";
import Head from "next/head";
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
        <Center>
          <div style={{ maxWidth: "1000px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                margin: "2rem",
              }}
            >
              <div style={{ height: "50px", width: "50px" }}>
                <IconPencil size={50} style={{ marginRight: "2rem" }} />
              </div>
              <div style={{ marginLeft: "2rem" }}>
                <Text ta="left" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
                  Customise training plans
                </Text>
                <Text fz="md">
                  With our vast library of exercises and workouts, you can mix
                  and match to create the perfect plan for you.
                </Text>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                margin: "2rem",
              }}
            >
              <div style={{ height: "50px", width: "50px" }}>
                <IconPlus size={50} style={{ marginRight: "2rem" }} />
              </div>
              <div style={{ marginLeft: "2rem" }}>
                <Text ta="left" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
                  Generate varied workouts
                </Text>
                <Text fz="md">
                  Our intuitive interface and powerful algorithms make it easy
                  for you to generate personalised workouts to meet your unique
                  fitness goals.
                </Text>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                margin: "2rem",
              }}
            >
              <div style={{ height: "50px", width: "50px" }}>
                <IconPlayerPlay size={50} style={{ marginRight: "2rem" }} />
              </div>
              <div style={{ marginLeft: "2rem" }}>
                <Text ta="left" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
                  Smash your workouts in real-time
                </Text>
                <Text fz="md">
                  Experience the future of fitness with your real-time dynamic
                  guide, ensuring you stay on track and motivated throughout
                  your session.
                </Text>
              </div>
            </div>
          </div>{" "}
        </Center>
        <Center>
          <div>
            <Text>Embrace Open Source Fitness</Text>
            <Text>
              At generate.fitness, we believe in the power of collaboration.
              That's why we've chosen to open source our platform. It's about
              transparency, flexibility, and community.
            </Text>
            <Text>What does this mean for you?</Text>
            <Text>
              <ul>
                <li>
                  Full Control: Customize your fitness experience according to
                  your unique preferences.
                </li>
                <li>
                  Collective Innovation: Join hands with fellow enthusiasts to
                  drive fitness technology forward.
                </li>
                <li>
                  Clear Transparency: Gain insights into how your fitness data
                  is handled and make informed choices.
                </li>
                <li>
                  Endless Opportunities: Explore, experiment, and create new
                  possibilities.
                </li>
              </ul>
              Together, we're redefining fitness technology for a more open and
              honest future.
            </Text>
          </div>
        </Center>
      </PublicLayout>
    </>
  );
};

export default Home;
