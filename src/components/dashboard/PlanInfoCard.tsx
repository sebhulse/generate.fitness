import { Loader, Card, Table, Alert } from "@mantine/core";
import type { RouterOutputs } from "../../utils/api";

type PlanGetByIdOutput = RouterOutputs["plan"]["getById"];

type Props = {
  plan: PlanGetByIdOutput;
};

const PlanInfoCard = (props: Props) => {
  const { plan } = props;

  return (
    <>
      {plan ? <h1>{plan.name}</h1> : null}
      {plan ? (
        <Card mt="md" radius="md">
          <Table>
            <tbody>
              <tr key={plan.name}>
                <td>Name</td>
                <td>{plan.name}</td>
              </tr>
              <tr key={plan.createdAt.toISOString()}>
                <td>Created</td>
                <td>{plan.createdAt.toISOString()}</td>
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
                <td>{plan.planInterval.toLowerCase()}</td>
              </tr>
              <tr key={"allowDisplayUserEdit"}>
                <td>Allow Edit</td>
                <td>{plan.allowDisplayUserEdit ? "Yes" : "No"}</td>
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
