import {
  Modal,
  Button,
  TextInput,
  Group,
  Checkbox,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Workout } from "@prisma/client";
import { api } from "../../utils/api";
import type { PlanType, WorkoutSectionType, WorkoutType } from "./SectionsDnd";

type Props = {
  grandparent: WorkoutType;
  isCreateExerciseModalOpen: boolean;
  setIsCreateExerciseModalOpen: (value: boolean) => void;
  parentId: string;
  refetch: () => void;
};
const CreateExerciseModal = (props: Props): JSX.Element => {
  const {
    isCreateExerciseModalOpen,
    setIsCreateExerciseModalOpen,
    parentId,
    grandparent,
    refetch,
  } = props;

  const { data: movements, isLoading: isMovementsLoading } =
    api.movement.filter.useQuery({
      workoutTypeId: grandparent.workoutTypeId,
      workoutTargetAreaId: grandparent.workoutTargetAreaId,
      workoutIntensityId: grandparent.workoutIntensityId,
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
      name: "",
      workoutSectionId: parentId,
      movement: "",
      duration: 0,
    },

    validate: {
      name: (value) => (value.length < 1 ? `Please enter a Name` : null),
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            inputWrapperOrder={["label", "input", "error"]}
            withAsterisk
            {...form.getInputProps("name")}
          />
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
              filter={(value, item) =>
                item.value.toLowerCase().includes(value.toLowerCase().trim())
              }
              {...form.getInputProps("movement")}
            />
          ) : null}
          <Checkbox mt="md" label="Uses equipment" />
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
