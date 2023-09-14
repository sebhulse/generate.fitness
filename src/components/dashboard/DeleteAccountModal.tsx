import React from "react";
import { Modal, Button, Group, Text } from "@mantine/core";

type Props = {
  isDeleteAccountModalOpen: boolean;
  setIsDeleteAccountModalOpen: (value: boolean) => void;
  onClick: () => void;
  isLoading: boolean;
};
const DeleteAccountModal = (props: Props): JSX.Element => {
  const {
    isDeleteAccountModalOpen,
    setIsDeleteAccountModalOpen,
    onClick,
    isLoading,
  } = props;

  return (
    <>
      <Modal
        opened={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Delete Account"
      >
        <Text>
          Are you sure you want to delete your account? This action is
          immediate, irreversible, and you will be signed out.
        </Text>
        <Group position="apart">
          <Button
            variant="outline"
            onClick={() => setIsDeleteAccountModalOpen(false)}
            mt="md"
          >
            Cancel
          </Button>
          <Button color={"red"} onClick={onClick} mt="md" loading={isLoading}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DeleteAccountModal;
