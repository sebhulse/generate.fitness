import { createStyles, Container, Group } from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: "1rem",
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
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
    },
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

const links = [
  { label: "Privacy", link: "/privacy-policy" },
  { label: "Terms", link: "/terms" },
  { label: "Contact", link: "mailto:hi@generate.fitness" },
  { label: "GitHub", link: "" },
];

const Footer = () => {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Link key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group position="left">
          <Link href="/" className={classes.link}>
            generate.fitness
          </Link>
        </Group>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
};
export default Footer;
