import {
  Modal,
  Button,
  TextInput,
  NativeSelect,
  Switch,
  Group,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, TransformedValues } from "@mantine/form";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";

type Props = {
  isCreatePlanModalOpen: boolean;
  setIsCreatePlanModalOpen: (value: boolean) => void;
};
const CreatePlanModal = (props: Props): JSX.Element => {
  const { isCreatePlanModalOpen, setIsCreatePlanModalOpen } = props;
  const { data: sessionData } = useSession();
  const router = useRouter();
  const mutation = api.plan.create.useMutation({
    onSuccess(data) {
      setIsCreatePlanModalOpen(false);
      router.push(`/dashboard/plans/${data.id}`);
    },
  });
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      planInterval: "Weeks",
      allowEdit: false,
      userId: sessionData?.user ? sessionData.user.id : "",
    },

    validate: {
      name: (value) =>
        value.length < 2
          ? "Please enter a Name e.g. 'Sam's Workout Plan'"
          : null,
    },
    // transformValues: (values) => ({
    //   ...values,
    //   planInterval: values.planInterval.toUpperCase(),
    //   userId: sessionData?.user?.id,
    // }),
  });

  const handleSubmit = (values: typeof form.values) => {
    mutation.mutate({ ...values });
  };

  return (
    <>
      <Modal
        opened={isCreatePlanModalOpen}
        onClose={() => setIsCreatePlanModalOpen(false)}
        title="Plan"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            inputWrapperOrder={["label", "input", "error"]}
            withAsterisk
            {...form.getInputProps("name")}
          />
          <TextInput
            mt="md"
            label="Description"
            inputWrapperOrder={["label", "input"]}
            {...form.getInputProps("description")}
          />
          <DatePicker
            mt="md"
            placeholder="Pick date"
            label="Start date"
            {...form.getInputProps("startDate")}
          />
          <NativeSelect
            mt="md"
            data={["Weeks", "Months"]}
            label="Plan interval"
            {...form.getInputProps("planInterval")}
          />
          <Switch
            mt="md"
            label="Allow user to edit Plan"
            {...form.getInputProps("allowEdit", { type: "checkbox" })}
          />
          <Group position="center">
            <Button type="submit" mt="md">
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default CreatePlanModal;
