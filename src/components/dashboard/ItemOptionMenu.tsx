import { Menu, ActionIcon } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons";
import { useState } from "react";
import { api } from "../../utils/api";
import DeleteItemModal from "./DeleteItemModal";

type Props = {
  item: "Plan" | "Workout";
  parentId: string;
  onDelete: () => void;
};

const ItemOptionMenu = (props: Props) => {
  const { item, parentId, onDelete } = props;
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);

  const mutationDeleteWorkout = api.workout.delete.useMutation({
    onSuccess() {
      onDelete();
    },
  });
  const mutationDeletePlan = api.plan.delete.useMutation({
    onSuccess() {
      onDelete();
    },
  });

  const handleDelete = () => {
    item === "Plan"
      ? mutationDeletePlan.mutate({ planId: parentId })
      : mutationDeleteWorkout.mutate({ workoutId: parentId });
  };

  return (
    <>
      <Menu shadow="md" width={150} position="left">
        <Menu.Target>
          <ActionIcon>
            <IconDotsVertical size={30} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{item} Options</Menu.Label>
          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            onClick={() => {
              setIsDeleteItemModalOpen(true);
            }}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DeleteItemModal
        onClick={handleDelete}
        isLoading={
          item === "Plan"
            ? mutationDeletePlan.isLoading
            : mutationDeleteWorkout.isLoading
        }
        isDeleteItemModalOpen={isDeleteItemModalOpen}
        setIsDeleteItemModalOpen={setIsDeleteItemModalOpen}
        title={`Delete ${item}`}
        message={`Are you sure you want to delete this ${item}?`}
      />
    </>
  );
};

export default ItemOptionMenu;
