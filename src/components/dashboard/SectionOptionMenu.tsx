import { Menu, ActionIcon } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons";
import { useState } from "react";
import { api } from "../../utils/api";
import DeleteSectionModal from "./DeleteSectionModal";

type Props = {
  section: "Plan" | "Workout";
  parentId: string;
  refetch: () => void;
};

const SectionOptionMenu = (props: Props) => {
  const { section, parentId, refetch } = props;
  const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] =
    useState(false);

  const mutationDeletePlanSection = api.planSection.delete.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const mutationDeleteWorkoutSection = api.workoutSection.delete.useMutation({
    onSuccess() {
      refetch();
    },
  });

  const handleDelete = () => {
    section === "Plan"
      ? mutationDeletePlanSection.mutate({ planSectionId: parentId })
      : mutationDeleteWorkoutSection.mutate({ workoutSectionId: parentId });
  };

  return (
    <>
      <Menu shadow="md" width={180} position="left">
        <Menu.Target>
          <ActionIcon>
            <IconDotsVertical size={18} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{section} Section Options</Menu.Label>
          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            onClick={() => {
              setIsDeleteSectionModalOpen(true);
            }}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DeleteSectionModal
        onClick={handleDelete}
        isDeleteSectionModalOpen={isDeleteSectionModalOpen}
        setIsDeleteSectionModalOpen={setIsDeleteSectionModalOpen}
        title={`Delete ${section} Section`}
        message={`Are you sure you want to delete this ${section} section?`}
      />
    </>
  );
};

export default SectionOptionMenu;
