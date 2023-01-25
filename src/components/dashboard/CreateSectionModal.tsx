import { Modal, Button, TextInput, Group } from "@mantine/core";
import { useForm, type TransformedValues } from "@mantine/form";
import { api } from "../../utils/api";
import type { WorkoutType, PlanType } from "./SectionsDnd";

type Props = {
  isCreateSectionModalOpen: boolean;
  setIsCreateSectionModalOpen: (value: boolean) => void;
  parent: WorkoutType | PlanType;
  refetch: () => void;
};
const CreateSectionModal = (props: Props): JSX.Element => {
  const {
    isCreateSectionModalOpen,
    setIsCreateSectionModalOpen,
    parent,
    refetch,
  } = props;

  const mutationCreatePlanSection = api.planSection.create.useMutation({
    onSuccess() {
      refetch();
      setIsCreateSectionModalOpen(false);
    },
  });
  const mutationCreateWorkoutSection = api.workoutSection.create.useMutation({
    onSuccess() {
      refetch();
      setIsCreateSectionModalOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? `Please enter a Name` : null),
    },
    transformValues: (values) =>
      "planSections" in parent
        ? {
            ...values,
            planId: parent.id,
          }
        : { ...values, workoutId: parent.id },
  });

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    "planId" in values
      ? mutationCreatePlanSection.mutate({ ...values })
      : mutationCreateWorkoutSection.mutate({ ...values });
  };

  return (
    <>
      <Modal
        opened={isCreateSectionModalOpen}
        onClose={() => setIsCreateSectionModalOpen(false)}
        title={`Create ${"Plan" in parent ? "Plan" : "Workout"} Section`}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            inputWrapperOrder={["label", "input", "error"]}
            withAsterisk
            {...form.getInputProps("name")}
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

export default CreateSectionModal;
