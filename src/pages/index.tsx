import { type NextPage } from "next";
import Head from "next/head";
import HeaderMenu from "../components/index/HeaderMenu";
import { Button, Center, Text } from "@mantine/core";
import { IconPencil, IconPlus, IconPlayerPlay } from "@tabler/icons";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fitness</title>
        <meta name="description" content="Fitness planning app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderMenu />

      <Text
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
        ta="center"
        fz="xl"
        fw={700}
        style={{ fontSize: "6rem", marginTop: "10rem", marginBottom: "1rem" }}
      >
        Generate Fitness.
      </Text>
      <Center>
        <Text ta="center" style={{ maxWidth: "800px", marginBottom: "2rem" }}>
          Start creating customised training plans and generating unique
          workouts now!
        </Text>
      </Center>
      <Center>
        <Button
          type="submit"
          mt="md"
          size="lg"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
        >
          Go
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
    </>
  );
};

export default Home;
