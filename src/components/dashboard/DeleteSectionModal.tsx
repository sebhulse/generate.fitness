import { Modal, Text, Group, Button } from "@mantine/core";
import React from "react";

type Props = {
  onClick: () => void;
  message: string;
  title: string;
  isDeleteSectionModalOpen: boolean;
  setIsDeleteSectionModalOpen: (value: boolean) => void;
};

const DeleteSectionModal = (props: Props) => {
  const {
    onClick,
    message,
    title,
    isDeleteSectionModalOpen,
    setIsDeleteSectionModalOpen,
  } = props;
  return (
    <>
      <Modal
        opened={isDeleteSectionModalOpen}
        onClose={() => setIsDeleteSectionModalOpen(false)}
        title={title}
      >
        <Text>{message}</Text>
        <Group position="apart">
          <Button
            variant="outline"
            onClick={() => setIsDeleteSectionModalOpen(false)}
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
export default DeleteSectionModal;
