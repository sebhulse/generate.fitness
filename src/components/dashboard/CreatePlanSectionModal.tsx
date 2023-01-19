import { Modal, Button, TextInput, Group } from "@mantine/core";
import { useForm, TransformedValues } from "@mantine/form";
import { api } from "../../utils/api";

type Props = {
  isCreatePlanSectionModalOpen: boolean;
  setIsCreatePlanSectionModalOpen: (value: boolean) => void;
  parentId: string;
  refetch: () => void;
  order: number;
};
const CreatePlanSectionModal = (props: Props): JSX.Element => {
  const {
    isCreatePlanSectionModalOpen,
    setIsCreatePlanSectionModalOpen,
    parentId,
    refetch,
    order,
  } = props;

  const mutation = api.planSection.create.useMutation({
    onSuccess() {
      refetch();
      setIsCreatePlanSectionModalOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      planId: parentId,
      order: order,
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
        opened={isCreatePlanSectionModalOpen}
        onClose={() => setIsCreatePlanSectionModalOpen(false)}
        title="Create Plan Section"
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

export default CreatePlanSectionModal;
