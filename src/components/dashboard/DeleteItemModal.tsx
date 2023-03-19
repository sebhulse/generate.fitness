import { Modal, Text, Group, Button } from "@mantine/core";
import React from "react";

type Props = {
  onClick: () => void;
  isLoading: boolean;
  message: string;
  title: string;
  isDeleteItemModalOpen: boolean;
  setIsDeleteItemModalOpen: (value: boolean) => void;
};

const DeleteItemModal = (props: Props) => {
  const {
    onClick,
    isLoading,
    message,
    title,
    isDeleteItemModalOpen,
    setIsDeleteItemModalOpen,
  } = props;
  return (
    <>
      <Modal
        opened={isDeleteItemModalOpen}
        onClose={() => setIsDeleteItemModalOpen(false)}
        title={title}
      >
        <Text>{message}</Text>
        <Group position="apart">
          <Button
            variant="outline"
            onClick={() => setIsDeleteItemModalOpen(false)}
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
export default DeleteItemModal;
