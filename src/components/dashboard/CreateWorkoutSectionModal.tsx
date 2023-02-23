import { Modal, Button, TextInput, Group, NativeSelect } from "@mantine/core";
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

  const mutationCreateWorkoutSection = api.workoutSection.create.useMutation({
    onSuccess() {
      refetch();
      form.reset();
      setIsCreateSectionModalOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      workoutSectionType: "Warmup",
    },
    validate: {
      name: (value) => (value.length < 1 ? `Please enter a Name` : null),
    },
    transformValues: (values) => ({
      name: values.name,
      workoutId: parent.id,
      workoutSectionType: values.workoutSectionType,
    }),
  });

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    mutationCreateWorkoutSection.mutate({ ...values });
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
          {"planSections" in parent ? null : (
            <NativeSelect
              mt="md"
              data={["Warmup", "Workout", "Cooldown"]}
              label="Section Type"
              {...form.getInputProps("workoutSectionType")}
            />
          )}
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
