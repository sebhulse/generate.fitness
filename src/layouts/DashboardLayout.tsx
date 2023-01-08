import { useState } from "react";
import {
  AppShell,
  createStyles,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  Group,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },
    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

type Props = {
  children: JSX.Element | JSX.Element[];
};
const DashboardLayout = (props: Props): JSX.Element => {
  const { children } = props;
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Overview");
  const { data: sessionData } = useSession();

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const data = [
    { link: "", label: "Overview" },
    { link: "", label: "Clients" },
    { link: "", label: "Plans" },
    { link: "", label: "Workouts" },
  ];
  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </a>
  ));

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          {links}
        </Navbar>
      }
      header={
        <Header height={60} px="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Group position="apart" sx={{ height: "100%" }}>
              <Group>
                <Link href="/" className={classes.link}>
                  Fitness.live
                </Link>
              </Group>

              <Group>
                <Button
                  onClick={
                    sessionData
                      ? () => signOut()
                      : () =>
                          signIn(undefined, {
                            callbackUrl: "/dashboard",
                          })
                  }
                >
                  {sessionData ? "Sign out" : "Sign in"}
                </Button>
              </Group>
            </Group>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};
export default DashboardLayout;
