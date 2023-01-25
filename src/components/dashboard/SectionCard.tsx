import { createStyles, Paper, Text, Title, Button } from "@mantine/core";
import type { Plan, Workout } from "@prisma/client";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  card: {
    height: 200,
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
  section: Plan | Workout;
};

const SectionCard = (props: Props) => {
  const { section } = props;
  const { classes } = useStyles();
  const router = useRouter();

  const handleEdit = () => {
    "planInterval" in section
      ? router.push(`/dashboard/plans/${section.id}`)
      : router.push(`/dashboard/workouts/${section.id}`);
  };

  return (
    <Paper shadow="md" p="xl" radius="md" className={classes.card}>
      <div>
        <Text className={classes.category} size="xs">
          {section.id}
        </Text>
        <Title order={3} className={classes.title}>
          {section.name}
        </Title>
      </div>
      <Button variant="white" color="dark" onClick={handleEdit}>
        Edit
      </Button>
    </Paper>
  );
};
export default SectionCard;
