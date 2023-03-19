import { createStyles, Paper, Text, Title, Button } from "@mantine/core";
import type { Plan, Workout } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const useStyles = createStyles((theme) => ({
  card: {
    height: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  title: {
    fontFamily: `Greycliff CF ${theme.fontFamily}`,
    fontWeight: 900,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[8],
    lineHeight: 1.2,
    fontSize: 32,
    marginTop: theme.spacing.xs,
  },

  category: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[8],
    opacity: 0.7,
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

type Props = {
  item: Plan | Workout;
};

const ItemCard = (props: Props) => {
  const { item } = props;
  const { classes } = useStyles();

  return (
    <Paper
      component={Link}
      href={
        "planInterval" in item
          ? `/dashboard/plans/${item.id}`
          : `/dashboard/workouts/${item.id}`
      }
      shadow="md"
      p="xl"
      radius="md"
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          {item.id}
        </Text>
        <Title order={3} className={classes.title}>
          {item.name}
          {item.createdAt.toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </Title>
        <Title className={classes.title}></Title>
      </div>
    </Paper>
  );
};
export default ItemCard;
