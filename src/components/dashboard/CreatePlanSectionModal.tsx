import { Modal, Button, TextInput, Group } from "@mantine/core";
import { useForm, TransformedValues } from "@mantine/form";
import { api } from "../../utils/api";

type Props = {
  isCreatePlanSectionModalOpen: boolean;
  setIsCreatePlanSectionModalOpen: (value: boolean) => void;
  planId: string;
  nameSuggestion: string;
  refetch: () => void;
};
const CreatePlanModal = (props: Props): JSX.Element => {
  const {
    isCreatePlanSectionModalOpen,
    setIsCreatePlanSectionModalOpen,
    planId,
    nameSuggestion,
    refetch,
  } = props;

  const mutation = api.planSection.create.useMutation({
    onSuccess() {
      setIsCreatePlanSectionModalOpen(false);
      refetch();
    },
  });
  const form = useForm({
    initialValues: {
      name: "",
      planId: planId,
    },

    validate: {
      name: (value) =>
        value.length < 2
          ? `Please enter a Name e.g. '${nameSuggestion}'`
          : null,
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
        title="Plan"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder={nameSuggestion}
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

export default CreatePlanModal;
