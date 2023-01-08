import { Modal, Button, Group } from "@mantine/core";

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
        title="Create Plan"
      >
        {/* Modal content */}
      </Modal>
    </>
  );
};

export default CreatePlanModal;
