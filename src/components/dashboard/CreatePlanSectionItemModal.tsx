import { Modal, Button, TextInput, Group, Checkbox } from "@mantine/core";
import { useForm, TransformedValues } from "@mantine/form";
import { api } from "../../utils/api";

type Props = {
  isCreateSectionItemModalOpen: boolean;
  setIsCreateSectionItemModalOpen: (value: boolean) => void;
  parentId: string;
  refetch: () => void;
};
const CreatePlanSectionItemModal = (props: Props): JSX.Element => {
  const {
    isCreateSectionItemModalOpen,
    setIsCreateSectionItemModalOpen,
    parentId,
    refetch,
  } = props;

  const mutation = api.workout.create.useMutation({
    onSuccess() {
      refetch();
      setIsCreateSectionItemModalOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      planSectionId: parentId,
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
        opened={isCreateSectionItemModalOpen}
        onClose={() => setIsCreateSectionItemModalOpen(false)}
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

export default CreatePlanSectionItemModal;
