import React, { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Group,
  Checkbox,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "../../utils/api";

type Props = {
  isCreateWorkoutModalOpen: boolean;
  setIsCreateWorkoutModalOpen: (value: boolean) => void;
  parentId: string;
  refetch: () => void;
};
const CreateWorkoutModal = (props: Props): JSX.Element => {
  const {
    isCreateWorkoutModalOpen,
    setIsCreateWorkoutModalOpen,
    parentId,
    refetch,
  } = props;

  const mutation = api.workout.generate.useMutation({
    onSuccess() {
      refetch();
      form.reset();
      setIsCreateWorkoutModalOpen(false);
    },
  });

  const { data: workoutTypes, isLoading: isWorkoutTypesLoading } =
    api.workoutType.getAll.useQuery();
  const { data: workoutTargetAreas, isLoading: isWorkoutTargetAreasLoading } =
    api.workoutTargetArea.getAll.useQuery();
  const { data: workoutIntensitys, isLoading: isWorkoutIntensitysLoading } =
    api.workoutIntensity.getAll.useQuery();

  const form = useForm({
    initialValues: {
      name: "",
      planSectionId: parentId,
      workoutType: "Cardio",
      workoutTargetArea: "Full Body",
      workoutIntensity: "Intermediate",
      usesEquipment: false,
    },

    validate: {
      name: (value) => (value.length < 1 ? `Please enter a Name` : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutation.mutate({ ...values });
  };

  if (!workoutTypes) {
    return <></>;
  }

  return (
    <>
      <Modal
        opened={isCreateWorkoutModalOpen}
        onClose={() => setIsCreateWorkoutModalOpen(false)}
        title="Create Workout"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            inputWrapperOrder={["label", "input", "error"]}
            withAsterisk
            {...form.getInputProps("name")}
          />
          {workoutTypes ? (
            <Select
              mt="md"
              label="Choose workout type"
              searchable
              required
              nothingFound="No options"
              data={workoutTypes.map(({ name }) => {
                return { value: name, label: name };
              })}
              filter={(value, item) =>
                item.value.toLowerCase().includes(value.toLowerCase().trim())
              }
              {...form.getInputProps("workoutType")}
            />
          ) : null}
          {workoutTargetAreas ? (
            <Select
              mt="md"
              label="Choose workout target area"
              searchable
              required
              nothingFound="No options"
              data={workoutTargetAreas.map(({ name }) => {
                return { value: name, label: name };
              })}
              filter={(value, item) =>
                item.value.toLowerCase().includes(value.toLowerCase().trim())
              }
              {...form.getInputProps("workoutTargetArea")}
            />
          ) : null}
          {workoutIntensitys ? (
            <Select
              mt="md"
              label="Choose workout level"
              searchable
              required
              nothingFound="No options"
              data={workoutIntensitys.map(({ name }) => {
                return { value: name, label: name };
              })}
              filter={(value, item) =>
                item.value.toLowerCase().includes(value.toLowerCase().trim())
              }
              {...form.getInputProps("workoutIntensity")}
            />
          ) : null}
          <Checkbox
            mt="md"
            label="Uses equipment"
            {...form.getInputProps("usesEquipment")}
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

export default CreateWorkoutModal;
