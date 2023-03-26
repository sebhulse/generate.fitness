import {
  Modal,
  Button,
  Group,
  Select,
  NumberInput,
  NativeSelect,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "../../utils/api";
import type { WorkoutSectionType, WorkoutType } from "./SectionsDnd";

type Props = {
  grandparent: WorkoutType;
  isCreateExerciseModalOpen: boolean;
  setIsCreateExerciseModalOpen: (value: boolean) => void;
  parent: WorkoutSectionType;
  refetch: () => void;
};
const CreateExerciseModal = (props: Props): JSX.Element => {
  const {
    isCreateExerciseModalOpen,
    setIsCreateExerciseModalOpen,
    parent,
    grandparent,
    refetch,
  } = props;

  const { data: movements, isLoading: isMovementsLoading } =
    parent.workoutSectionType.name === "Main"
      ? api.movement.filter.useQuery({
          workoutTypeId: grandparent.workoutTypeId,
          workoutTargetAreaId: grandparent.workoutTargetAreaId,
          workoutIntensityId: grandparent.workoutIntensityId,
          workoutSectionTypeId: parent.workoutSectionTypeId,
        })
      : api.movement.filter.useQuery({
          workoutTargetAreaId: grandparent.workoutTargetAreaId,
          workoutSectionTypeId: parent.workoutSectionTypeId,
        });

  const mutation = api.exercise.create.useMutation({
    onSuccess() {
      refetch();
      form.reset();
      setIsCreateExerciseModalOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      workoutSectionId: parent.id,
      movement: "",
      duration: 30,
      interval: "Seconds",
      rest: 15,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutation.mutate({ ...values });
  };

  return (
    <>
      <Modal
        opened={isCreateExerciseModalOpen}
        onClose={() => setIsCreateExerciseModalOpen(false)}
        title="Create Exercise"
      >
        <LoadingOverlay visible={isMovementsLoading} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {movements ? (
            <Select
              mt="md"
              label="Choose movement"
              searchable
              required
              nothingFound="No options"
              data={movements.map(({ name }) => {
                return { value: name, label: name };
              })}
              {...form.getInputProps("movement")}
            />
          ) : null}
          <div
            style={{
              maxWidth: "300px",
              display: "flex",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <Group position="apart">
              <div style={{ maxWidth: "100px" }}>
                <NumberInput
                  mt="md"
                  label="Duration"
                  {...form.getInputProps("duration")}
                />
              </div>
              <NativeSelect
                mt="md"
                data={["Seconds", "Reps"]}
                label="Interval"
                {...form.getInputProps("interval")}
              />
            </Group>
          </div>
          <Group position="center">
            <div style={{ maxWidth: "100px" }}>
              <NumberInput
                mt="md"
                label="Rest"
                {...form.getInputProps("rest")}
              />
            </div>
            <p>Seconds</p>
          </Group>
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

export default CreateExerciseModal;
