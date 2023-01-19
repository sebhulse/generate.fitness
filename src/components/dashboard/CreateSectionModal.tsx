import { Modal, Button, TextInput, Group } from "@mantine/core";
import { useForm, TransformedValues } from "@mantine/form";
import { api } from "../../utils/api";

type Props = {
  isCreateSectionModalOpen: boolean;
  setIsCreateSectionModalOpen: (value: boolean) => void;
  parentId: string;
  refetch: () => void;
};
const CreateSectionModal = (props: Props): JSX.Element => {
  const {
    isCreateSectionModalOpen,
    setIsCreateSectionModalOpen,
    parentId,
    refetch,
  } = props;

  const mutation = api.planSection.create.useMutation({
    onSuccess() {
      refetch();
      setIsCreateSectionModalOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      planId: parentId,
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
        opened={isCreateSectionModalOpen}
        onClose={() => setIsCreateSectionModalOpen(false)}
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

export default CreateSectionModal;
