import {
  createStyles,
  Paper,
  Text,
  Title,
  Button,
  Group,
  Badge,
} from "@mantine/core";
import type { Plan, Workout } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { RouterOutputs } from "../../utils/api";

const useStyles = createStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontFamily: `Greycliff CF ${theme.fontFamily}`,
    fontWeight: 900,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[8],
    lineHeight: 1.2,
    fontSize: 24,
    marginTop: theme.spacing.xs,
    textTransform: "capitalize",
  },

  category: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[8],
    opacity: 0.8,
    fontWeight: 700,
    fontSize: theme.fontSizes.sm,
  },
}));
type WorkoutGetManybyCreatedBy =
  RouterOutputs["workout"]["getManybyCreatedBy"]["items"][0];
type Props = {
  item: Plan | WorkoutGetManybyCreatedBy;
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
        <Group position="apart">
          <Text className={classes.category} size="xs">
            {`Created ${item.createdAt.toLocaleDateString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}`}
          </Text>
          {`duration` in item ? (
            <Badge
              color="gray"
              variant="filled"
              size="lg"
              style={{ textTransform: "capitalize" }}
            >
              {item.planSection?.plan.name}
            </Badge>
          ) : null}
        </Group>
        <Title order={3} className={classes.title}>
          {item.name}
        </Title>
        <Title className={classes.title}></Title>
      </div>
    </Paper>
  );
};
export default ItemCard;
