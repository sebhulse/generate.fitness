import { type NextPage } from "next";
import Head from "next/head";
import HeaderMenu from "../components/index/HeaderMenu";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fitness</title>
        <meta name="description" content="Fitness planning app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderMenu />
    </>
  );
};

export default Home;
