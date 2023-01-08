import { Modal, Button, Group } from "@mantine/core";

type Props = {
  isCreateWorkoutModalOpen: boolean;
  setIsCreateWorkoutModalOpen: (value: boolean) => void;
};
const CreateWorkoutModal = (props: Props): JSX.Element => {
  const { isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen } = props;

  return (
    <>
      <Modal
        opened={isCreateWorkoutModalOpen}
        onClose={() => setIsCreateWorkoutModalOpen(false)}
        title="Create Plan"
      >
        {/* Modal content */}
      </Modal>
    </>
  );
};

export default CreateWorkoutModal;
