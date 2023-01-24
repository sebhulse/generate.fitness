import { Modal, Text, Group, Button } from "@mantine/core";
import React from "react";

type Props = {
  onClick: () => void;
  message: string;
  title: string;
  isDeleteSectionItemModalOpen: boolean;
  setIsDeleteSectionItemModalOpen: (value: boolean) => void;
};

const DeleteSectionItemModal = (props: Props) => {
  const {
    onClick,
    message,
    title,
    isDeleteSectionItemModalOpen,
    setIsDeleteSectionItemModalOpen,
  } = props;
  return (
    <>
      <Modal
        opened={isDeleteSectionItemModalOpen}
        onClose={() => setIsDeleteSectionItemModalOpen(false)}
        title={title}
      >
        <Text>{message}</Text>
        <Group position="apart">
          <Button
            variant="outline"
            onClick={() => setIsDeleteSectionItemModalOpen(false)}
            mt="md"
          >
            Cancel
          </Button>
          <Button color={"red"} onClick={onClick} mt="md">
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};
export default DeleteSectionItemModal;
