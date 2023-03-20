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
} from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IconSun, IconMoonStars, IconRun, IconHome } from "@tabler/icons";

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
      color: theme.colorScheme === "dark" ? "white" : "black",
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
      color: theme.colorScheme === "dark" ? "white" : "black",
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
    hiddenMobile: {
      [theme.fn.smallerThan("sm")]: {
        display: "none",
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
    { link: "/", label: "Home", icon: IconHome },
    { link: "/dashboard/", label: "Dashboard", icon: IconRun },
  ];
  const setLinkActive = () => {
    const urlWords = pathname.split("/");
    let label = "Overview";
    if (urlWords[0] === "") {
      label = "Home";
    }
    if (urlWords.indexOf("Dashboard") > 0) {
      label = "Dashboard";
    }
    return label;
  };

  const [active, setActive] = useState(setLinkActive());
  const { data: sessionData } = useSession();

  const [opened, setOpened] = useState(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const links = data.map((item) =>
    item.label === "Dashboard" && !sessionData?.user ? null : (
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
    )
  );

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
          color={dark ? "black" : "white"}
        >
          {links}
          <Button
            mt="xl"
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
            <Group position="apart" sx={{ height: "100%", width: "100%" }}>
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
                  className={classes.hiddenMobile}
                >
                  {sessionData ? "Sign out" : "Sign in"}
                </Button>
              </Group>
              <ActionIcon
                variant="outline"
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
              </ActionIcon>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  mr="xs"
                />
              </MediaQuery>
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
