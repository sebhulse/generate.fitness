import { Menu, ActionIcon } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons";
import { useState } from "react";
import { api } from "../../utils/api";
import DeleteModal from "./DeleteModal";
import { useRouter } from "next/router";

type Props = {
  section: "Plan" | "Workout";
  parentId: string;
  refetch: () => void;
};

const SectionOptionMenu = (props: Props) => {
  const { section, parentId, refetch } = props;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

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
          <Menu.Label>{section} Section Options</Menu.Label>
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
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DeleteModal
        onClick={handleDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        title="Delete Plan Section"
        message="Are you sure you want to delete this section?"
      />
    </>
  );
};

export default SectionOptionMenu;
