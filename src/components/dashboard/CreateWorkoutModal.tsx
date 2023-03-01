import React, { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Group,
  Checkbox,
  Text,
  Slider,
  SegmentedControl,
  Badge,
  Input,
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

  const mutationGenerate = api.workout.generate.useMutation({
    onSuccess() {
      refetch();
      form.reset();
      setIsCreateWorkoutModalOpen(false);
    },
  });
  const mutationCreate = api.workout.create.useMutation({
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
      workoutType: "Cardio",
      workoutTargetArea: "Core",
      workoutIntensity: "Advanced",
      usesEquipment: false,
      duration: 0,
      generate: "Generate",
    },

    validate: {
      name: (value) => (value.length < 1 ? `Please enter a Name` : null),
    },
    transformValues: (values) => {
      return {
        ...values,
        planSectionId: parentId,
        duration: values.duration * 60,
      };
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (values.generate === "Generate") {
      mutationGenerate.mutate({ ...values });
    } else {
      mutationCreate.mutate({ ...values });
    }
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
            <Input.Wrapper label="Type" mt="md">
              <SegmentedControl
                title="Workout type"
                fullWidth
                data={workoutTypes.map(({ name }) => {
                  return name;
                })}
                {...form.getInputProps("workoutType")}
              ></SegmentedControl>
            </Input.Wrapper>
          ) : null}
          {workoutTargetAreas ? (
            <Input.Wrapper label="Target Area" mt="md">
              <SegmentedControl
                title="Workout target area"
                fullWidth
                data={workoutTargetAreas.map(({ name }) => {
                  return {
                    value: name,
                    label: name.replace(" Body", ""),
                  };
                })}
                {...form.getInputProps("workoutTargetArea")}
              ></SegmentedControl>
            </Input.Wrapper>
          ) : null}
          {workoutIntensitys ? (
            <Input.Wrapper label="Intensity" mt="md">
              <SegmentedControl
                title="Workout intensity"
                fullWidth
                data={workoutIntensitys.map(({ name }) => {
                  let label;
                  if (name === "Beginner") {
                    label = "Beg";
                  } else if (name === "Intermediate") {
                    label = "Int";
                  } else if (name === "Advanced") {
                    label = "Adv";
                  } else label = "Int";
                  return {
                    value: name,
                    label: label,
                  };
                })}
                {...form.getInputProps("workoutIntensity")}
              ></SegmentedControl>
            </Input.Wrapper>
          ) : null}
          {/* <Checkbox
            mt="md"
            label="Uses equipment"
            {...form.getInputProps("usesEquipment")}
          /> */}

          <SegmentedControl
            mt="xl"
            color="cyan"
            data={["Generate", "Blank"]}
            fullWidth
            {...form.getInputProps("generate")}
          />
          {form.getInputProps("generate").value === "Generate" ? (
            <Input.Wrapper label="Duration" mt="md">
              <Slider
                thumbSize={20}
                min={10}
                max={50}
                {...form.getInputProps("duration")}
              />
              <Group mt="md" position="center" align="center">
                <Badge id="durationBadge" size="lg">
                  {form.getInputProps("duration").value}
                </Badge>
                <Text>Min</Text>
              </Group>
            </Input.Wrapper>
          ) : null}

          <Group position="center">
            {form.getInputProps("generate").value === "Generate" ? (
              <Button
                type="submit"
                mt="md"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
              >
                Generate
              </Button>
            ) : (
              <Button type="submit" mt="md">
                Create
              </Button>
            )}
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default CreateWorkoutModal;
