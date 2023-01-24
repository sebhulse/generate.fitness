import { Modal, Text, Checkbox, Group, Button } from "@mantine/core";
import React from "react";

type Props = {
  onClick: () => void;
  message: string;
  title: string;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
};

const DeleteModal = (props: Props) => {
  const { onClick, message, title, isDeleteModalOpen, setIsDeleteModalOpen } =
    props;
  return (
    <>
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={title}
      >
        <Text>{message}</Text>
        <Group position="apart">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
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
export default DeleteModal;
