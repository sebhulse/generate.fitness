import React, { useState } from "react";
import { Button, Center, Stack, Title, Text } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  const [movement, setMovement] = useState("");
  const [count, setCount] = useState(0);
  const movements = ["Push up", "Squat", "Sit up"];
  const handleGenerate = () => {
    const randomMovement =
      movements[Math.floor(Math.random() * movements.length)];
    setMovement(randomMovement ? randomMovement : "Push up");
    setCount(count + 1);
  };

  return (
    <>
      <Head>
        <title>Fitness</title>
        <meta name="description" content="Fitness planning app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Stack align="center" p="md">
          <Title variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
            generate.fitness
          </Title>
          <Text align="center" size="lg">
            <i>Coming soon 🚀</i>
          </Text>
          <Text align="center">
            <a href="https://sebhulse.medium.com/subscribe">Subscribe</a> to be
            among the first to be notified about the release.
          </Text>
          <Button
            size="lg"
            m="xl"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            onClick={handleGenerate}
          >
            Generate
          </Button>
          {movement ? <Text>Suggestion {count}:</Text> : null}
          {movement ? <Text>{movement}</Text> : null}
        </Stack>
      </Center>
    </>
  );
};

export default Home;
