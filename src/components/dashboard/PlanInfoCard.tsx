import { Progress, Card, Table, Alert } from "@mantine/core";
import { useEffect, useState } from "react";
import type { RouterOutputs } from "../../utils/api";

type PlanGetByIdOutput = RouterOutputs["plan"]["getById"];

type Props = {
  plan: PlanGetByIdOutput;
};

export const calculatePlanProgress = (
  plan: PlanGetByIdOutput,
  totalWorkouts: number
) => {
  let completeWorkouts = 0;
  plan
    ? plan.planSections.forEach((section) => {
        section.workouts.forEach((workout) => {
          if (workout.isDone) {
            completeWorkouts++;
          }
        });
      })
    : null;
  return completeWorkouts / totalWorkouts;
};

const calculateTotalWorkouts = (plan: PlanGetByIdOutput) => {
  let totalWorkouts = 0;
  plan
    ? plan.planSections.forEach((section) => {
        totalWorkouts += section.workouts.length;
      })
    : null;
  return totalWorkouts;
};

const PlanInfoCard = (props: Props) => {
  const { plan } = props;
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  useEffect(() => {
    setTotalWorkouts(calculateTotalWorkouts(plan));
  }, [plan]);

  return (
    <>
      {plan ? (
        <Card mt="md" radius="md">
          <Table>
            <tbody>
              <tr key={plan.createdAt.toISOString()}>
                <td>Created</td>
                <td>
                  {plan.createdAt.toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </td>
              </tr>
              {plan.description ? (
                <tr key={plan.description}>
                  <td>Description</td>
                  <td>{plan.description}</td>
                </tr>
              ) : null}
              {plan.startDate ? (
                <tr key={plan.startDate.toISOString()}>
                  <td>Start date</td>
                  <td>{plan.startDate.toISOString()}</td>
                </tr>
              ) : null}
              <tr key={plan.planInterval}>
                <td>Plan Interval</td>
                <td style={{ textTransform: "capitalize" }}>
                  {plan.planInterval.toLowerCase()}
                </td>
              </tr>
              <tr key="totalDuration">
                <td>Duration</td>
                <td style={{ textTransform: "capitalize" }}>
                  {`${
                    plan.planSections.length
                  } ${plan.planInterval.toLowerCase()}`}
                </td>
              </tr>
              <tr key="totalWorkouts">
                <td>Total Workouts</td>
                <td style={{ textTransform: "capitalize" }}>{totalWorkouts}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ paddingTop: "1rem" }}>
                  <Progress
                    value={calculatePlanProgress(plan, totalWorkouts) * 100}
                    color="cyan"
                    size="xl"
                    radius="xl"
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
      ) : (
        <Alert title="Loading Error" color="orange">
          Plan could not be loaded, please try again later.
        </Alert>
      )}
    </>
  );
};

export default PlanInfoCard;
