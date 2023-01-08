import {
  Modal,
  Button,
  TextInput,
  NativeSelect,
  Switch,
  Group,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";

type Props = {
  isCreatePlanModalOpen: boolean;
  setIsCreatePlanModalOpen: (value: boolean) => void;
};
const CreatePlanModal = (props: Props): JSX.Element => {
  const { isCreatePlanModalOpen, setIsCreatePlanModalOpen } = props;

  return (
    <>
      <Modal
        opened={isCreatePlanModalOpen}
        onClose={() => setIsCreatePlanModalOpen(false)}
        title="Plan"
      >
        <TextInput
          label="Name"
          inputWrapperOrder={["label", "input", "error"]}
          error="Please enter a Workout Plan Name"
          withAsterisk
        />
        <TextInput
          mt="md"
          label="Description"
          inputWrapperOrder={["label", "input"]}
        />
        <DatePicker
          mt="md"
          placeholder="Pick date"
          label="Start date"
          withAsterisk
        />
        <NativeSelect
          mt="md"
          data={["Weeks", "Months"]}
          label="Plan interval"
        />
        <Switch mt="md" label="Allow user to edit Plan" />
        <Group position="center">
          <Button mt="md">Submit</Button>
        </Group>
      </Modal>
    </>
  );
};

export default CreatePlanModal;
