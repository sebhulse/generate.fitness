import { Card, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  smallCards: {
    display: "none",
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  largeCards: {
    display: "flex",
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "none",
    },
  },
}));

const HomeOpenSource = () => {
  const { classes } = useStyles();
  return (
    <div>
      <Text ta="center" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
        Embrace Open Source Fitness
      </Text>
      <Text
        ta="center"
        style={{
          fontSize: "1.4rem",
          padding: "2rem",
        }}
      >
        At Generate.Fitness, we believe in the power of collaboration.
        That&#39;s why we&#39;ve chosen to open source our platform. It&#39;s
        about transparency, flexibility, and community.
      </Text>
      <Text ta="center" size="xl" mb="xl">
        What does this mean for you?
      </Text>
      <div className={classes.largeCards}>
        <Card shadow="sm" style={{ margin: "0.5rem", padding: "2rem" }}>
          <Text weight={500} size="lg">
            Full Control
          </Text>
          <Text mt="xs" color="dimmed" size="sm">
            Customize your fitness experience according to your unique
            preferences.
          </Text>
        </Card>
        <Card shadow="sm" style={{ margin: "0.5rem", padding: "2rem" }}>
          <Text weight={500} size="lg">
            Clear Transparency
          </Text>
          <Text mt="xs" color="dimmed" size="sm">
            Gain insights into how your fitness data is handled through the code
            and make informed choices.
          </Text>
        </Card>
        <Card shadow="sm" style={{ margin: "0.5rem", padding: "2rem" }}>
          <Text weight={500} size="lg">
            Endless Opportunities
          </Text>
          <Text mt="xs" color="dimmed" size="sm">
            Explore, experiment, create new features, and contribute for
            everyone to benefit.
          </Text>
        </Card>
      </div>
      <div className={classes.smallCards}>
        <Card shadow="sm" style={{ margin: "1rem", padding: "2rem" }}>
          <Text weight={500} size="lg">
            Full Control
          </Text>
          <Text mt="xs" color="dimmed" size="sm">
            Customize your fitness experience according to your unique
            preferences.
          </Text>
        </Card>
        <Card shadow="sm" style={{ margin: "1rem", padding: "2rem" }}>
          <Text weight={500} size="lg">
            Clear Transparency
          </Text>
          <Text mt="xs" color="dimmed" size="sm">
            Gain insights into how your fitness data is handled through the code
            and make informed choices.
          </Text>
        </Card>
        <Card shadow="sm" style={{ margin: "1rem", padding: "2rem" }}>
          <Text weight={500} size="lg">
            Endless Opportunities
          </Text>
          <Text mt="xs" color="dimmed" size="sm">
            Explore, experiment, create new features, and contribute for
            everyone to benefit.
          </Text>
        </Card>
      </div>
    </div>
  );
};
export default HomeOpenSource;
