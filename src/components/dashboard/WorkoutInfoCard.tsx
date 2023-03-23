import React from "react";
import { Card, Table, Alert, Badge } from "@mantine/core";
import type { RouterOutputs } from "../../utils/api";
import Link from "next/link";

type WorkoutGetById = RouterOutputs["workout"]["getById"];

type Props = {
  workout: WorkoutGetById;
};

const WorkoutInfoCard = (props: Props) => {
  const { workout } = props;

  return (
    <>
      {workout ? (
        <Card mt="md" radius="md">
          <Table>
            <tbody>
              <tr key={workout.createdAt.toISOString()}>
                <td>Created</td>
                <td>
                  {workout.createdAt.toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </td>
              </tr>
              {workout.duration ? (
                <tr key={workout.duration}>
                  <td>Duration</td>
                  <td>
                    <Badge
                      color="blue"
                      variant="filled"
                      size="lg"
                      style={{ textTransform: "capitalize" }}
                    >
                      {`${Math.round(workout.duration / 60)} Minutes`}
                    </Badge>
                  </td>
                </tr>
              ) : null}
              {workout.planSection?.plan.name ? (
                <tr key={workout.planSection?.plan.name}>
                  <td>Connected plan</td>
                  <td>
                    <Badge
                      component={Link}
                      href={`/dashboard/plans/${workout.planSection?.plan.id}`}
                      color="gray"
                      variant="filled"
                      size="lg"
                      style={{ textTransform: "capitalize", cursor: "pointer" }}
                    >
                      {workout.planSection?.plan.name}
                    </Badge>
                  </td>
                </tr>
              ) : null}
              <tr key="done">
                <td>Done</td>
                <td>
                  {workout.isDone ? (
                    <Badge
                      color="green"
                      variant="filled"
                      size="lg"
                      style={{ textTransform: "capitalize" }}
                    >
                      Done
                    </Badge>
                  ) : (
                    <Badge
                      color="gray"
                      variant="filled"
                      size="lg"
                      style={{ textTransform: "capitalize" }}
                    >
                      Not done
                    </Badge>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
      ) : (
        <Alert title="Loading Error" color="orange">
          Workout could not be loaded, please try again later.
        </Alert>
      )}
    </>
  );
};

export default WorkoutInfoCard;
