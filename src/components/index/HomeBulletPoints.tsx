import { IconPlus, IconPencil, IconPlayerPlay } from "@tabler/icons";
import { Text } from "@mantine/core";

const HomeBulletPoints = () => {
  return (
    <div style={{ marginBottom: "5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          margin: "2rem",
        }}
      >
        <div style={{ height: "50px", width: "50px" }}>
          <IconPlus size={50} style={{ marginRight: "2rem" }} />
        </div>
        <div style={{ marginLeft: "2rem" }}>
          <Text ta="left" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
            Generate varied workouts
          </Text>
          <Text fz="md">
            Our intuitive interface and powerful algorithms make it easy for you
            to generate personalised workouts to meet your unique fitness goals.
          </Text>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          margin: "2rem",
        }}
      >
        <div style={{ height: "50px", width: "50px" }}>
          <IconPencil size={50} style={{ marginRight: "2rem" }} />
        </div>
        <div style={{ marginLeft: "2rem" }}>
          <Text ta="left" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
            Customise training plans
          </Text>
          <Text fz="md">
            With our vast library of exercises and workouts, you can mix and
            match to create the perfect plan for you.
          </Text>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          margin: "2rem",
        }}
      >
        <div style={{ height: "50px", width: "50px" }}>
          <IconPlayerPlay size={50} style={{ marginRight: "2rem" }} />
        </div>
        <div style={{ marginLeft: "2rem" }}>
          <Text ta="left" fz="xl" fw={700} style={{ fontSize: "1.5rem" }}>
            Smash your workouts in real-time
          </Text>
          <Text fz="md">
            Experience the future of fitness with your real-time dynamic guide,
            ensuring you stay on track and motivated throughout your session.
          </Text>
        </div>
      </div>
    </div>
  );
};
export default HomeBulletPoints;
