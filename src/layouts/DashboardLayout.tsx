import { useState } from "react";
import {
  AppShell,
  createStyles,
  Navbar,
  Header,
  ActionIcon,
  useMantineColorScheme,
  MediaQuery,
  Burger,
  Group,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  IconSun,
  IconMoonStars,
  IconInfoSquare,
  IconNotes,
  IconRun,
  IconUsers,
} from "@tabler/icons";

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
    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
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
  const { pathname } = useRouter();
  const data = [
    { link: "/dashboard/", label: "Overview", icon: IconInfoSquare },
    { link: "/dashboard/clients", label: "Clients", icon: IconUsers },
    { link: "/dashboard/plans", label: "Plans", icon: IconNotes },
    { link: "/dashboard/workouts", label: "Workouts", icon: IconRun },
  ];
  const setLinkActive = () => {
    const urlWords = pathname.split("/");
    let label = "Overview";
    data.map((item) => {
      if (urlWords.indexOf(item.label.toLowerCase()) > 0) {
        label = item.label;
      }
    });
    return label;
  };
  const [active, setActive] = useState(setLinkActive());
  const { data: sessionData } = useSession();

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const links = data.map((item) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
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
                  generate.fitness
                </Link>
              </Group>

              <Group>
                <Button
                  onClick={
                    sessionData
                      ? () => signOut({ callbackUrl: "/" })
                      : () =>
                          signIn(undefined, {
                            callbackUrl: "/dashboard",
                          })
                  }
                >
                  {sessionData ? "Sign out" : "Sign in"}
                </Button>
              </Group>
              <ActionIcon
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
              </ActionIcon>
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
