import { createStyles, Paper, Text, Title, Group, Badge } from "@mantine/core";
import type { Plan } from "@prisma/client";
import Link from "next/link";
import type { RouterOutputs } from "../../utils/api";

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
        ? theme.colors.gray[0]
        : theme.colors.gray[8],
    lineHeight: 1.2,
    fontSize: 24,
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
export type WorkoutGetManybyCreatedBy =
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
      withBorder
      p="md"
      radius="md"
      className={classes.card}
    >
      <div>
        <Group position="apart">
          <Title className={classes.title}>{item.name}</Title>
          <Text className={classes.category} size="xs">
            {`Created ${item.createdAt.toLocaleDateString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}`}
          </Text>
          {`duration` in item ? (
            <>
              {item.planSection?.plan.name ? (
                <Badge
                  color="gray"
                  variant="filled"
                  size="lg"
                  style={{ textTransform: "capitalize" }}
                >
                  {item.planSection?.plan.name}
                </Badge>
              ) : null}
              {item.duration ? (
                <Badge
                  color="blue"
                  variant="filled"
                  size="lg"
                  style={{ textTransform: "capitalize" }}
                >
                  {`${Math.round(item.duration / 60)} minutes`}
                </Badge>
              ) : null}
              {item.isDone ? (
                <Badge
                  color="green"
                  variant="filled"
                  size="lg"
                  style={{ textTransform: "capitalize" }}
                >
                  Done
                </Badge>
              ) : null}
            </>
          ) : null}
        </Group>
      </div>
    </Paper>
  );
};
export default ItemCard;
