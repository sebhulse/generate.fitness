import React from "react";
import {
  Modal,
  Button,
  TextInput,
  Group,
  Text,
  Slider,
  SegmentedControl,
  Badge,
  Input,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "../../utils/api";

type Props = {
  isDeleteAccountModalOpen: boolean;
  setIsDeleteAccountModalOpen: (value: boolean) => void;
};
const DeleteAccountModal = (props: Props): JSX.Element => {
  const { isDeleteAccountModalOpen, setIsDeleteAccountModalOpen } = props;

  //   const mutationGenerate = api.workout.generate.useMutation({
  //     onSuccess() {
  //       refetch ? refetch() : null;
  //       form.reset();
  //       setIsDeleteAccountModalOpen(false);
  //     },
  //   });
  //   const mutationCreate = api.workout.create.useMutation({
  //     onSuccess() {
  //       refetch ? refetch() : null;
  //       form.reset();
  //       setIsDeleteAccountModalOpen(false);
  //     },
  //   });

  return (
    <>
      <Modal
        opened={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Create Workout"
      ></Modal>
    </>
  );
};

export default DeleteAccountModal;
