import { Modal, Button, TextInput, Group, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "../../utils/api";

type Props = {
  isCreateExerciseModalOpen: boolean;
  setIsCreateExerciseModalOpen: (value: boolean) => void;
  parentId: string;
  refetch: () => void;
};
const CreateExerciseModal = (props: Props): JSX.Element => {
  const {
    isCreateExerciseModalOpen,
    setIsCreateExerciseModalOpen,
    parentId,
    refetch,
  } = props;

  const mutation = api.exercise.create.useMutation({
    onSuccess() {
      refetch();
      setIsCreateExerciseModalOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      workoutSectionId: parentId,
      movementId: "clcmf2ez900006msl5opl7z49",
      duration: 0,
    },

    validate: {
      name: (value) => (value.length < 1 ? `Please enter a Name` : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutation.mutate({ ...values });
  };

  return (
    <>
      <Modal
        opened={isCreateExerciseModalOpen}
        onClose={() => setIsCreateExerciseModalOpen(false)}
        title="Create Workout"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            inputWrapperOrder={["label", "input", "error"]}
            withAsterisk
            {...form.getInputProps("name")}
          />
          <Checkbox mt="md" label="Uses equipment" />
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

export default CreateExerciseModal;
