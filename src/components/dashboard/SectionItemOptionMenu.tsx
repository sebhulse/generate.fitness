import { Menu, ActionIcon } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons";
import { useState } from "react";
import { api } from "../../utils/api";
import DeleteSectionItemModal from "./DeleteSectionItemModal";
import { useRouter } from "next/router";

type Props = {
  section: "Exercise" | "Workout";
  parentId: string;
  refetch: () => void;
};

const SectionOptionMenu = (props: Props) => {
  const { section, parentId, refetch } = props;
  const [isDeleteSectionItemModalOpen, setIsDeleteSectionItemModalOpen] =
    useState(false);
  const router = useRouter();

  const mutationDeleteWorkout = api.workout.delete.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const mutationDeleteExercise = api.exercise.delete.useMutation({
    onSuccess() {
      refetch();
    },
  });

  const handleDelete = () => {
    section === "Exercise"
      ? mutationDeleteExercise.mutate({ exerciseId: parentId })
      : mutationDeleteWorkout.mutate({ workoutId: parentId });
  };

  const handleEdit = () => {
    router.push(`/dashboard/workouts/${parentId}`);
  };

  return (
    <>
      <Menu shadow="md" width={200} position="left">
        <Menu.Target>
          <ActionIcon>
            <IconDotsVertical size={18} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{section} Options</Menu.Label>
          {section === "Workout" ? (
            <>
              <Menu.Item icon={<IconEdit size={14} />} onClick={handleEdit}>
                Edit
              </Menu.Item>
              {/* <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
                Transfer
              </Menu.Item> */}
            </>
          ) : null}

          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            onClick={() => {
              setIsDeleteSectionItemModalOpen(true);
            }}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DeleteSectionItemModal
        onClick={handleDelete}
        isDeleteSectionItemModalOpen={isDeleteSectionItemModalOpen}
        setIsDeleteSectionItemModalOpen={setIsDeleteSectionItemModalOpen}
        title={`Delete ${section}`}
        message="Are you sure you want to delete this section?"
      />
    </>
  );
};

export default SectionOptionMenu;
