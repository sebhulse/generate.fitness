import {
  createStyles,
  Header,
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
} from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const HeaderMenu = () => {
  const { data: sessionData } = useSession();
  const { query } = useRouter();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();

  const callbackUrl = query.trainer
    ? `/dashboard/?trainer=${query.trainer}`
    : `/dashboard`;

  console.log(query.trainer);

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Group>
            <Link href="/" className={classes.link}>
              Fitness.live
            </Link>
          </Group>
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <Link href="/dashboard" className={classes.link}>
              Dashboard
            </Link>
          </Group>

          <Group className={classes.hiddenMobile}>
            <Button
              onClick={
                sessionData
                  ? () => signOut({ callbackUrl: "/" })
                  : () => signIn(undefined, { callbackUrl: callbackUrl })
              }
            >
              {sessionData ? "Sign out" : "Sign in"}
            </Button>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="sm"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Link href="/" className={classes.link}>
            Home
          </Link>
          <Link href="/dashboard" className={classes.link}>
            Dashboard
          </Link>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="md">
            <Button
              onClick={
                sessionData
                  ? () => signOut({ callbackUrl: "/" })
                  : () => signIn(undefined, { callbackUrl: callbackUrl })
              }
            >
              {sessionData ? "Sign out" : "Sign in"}
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default HeaderMenu;
