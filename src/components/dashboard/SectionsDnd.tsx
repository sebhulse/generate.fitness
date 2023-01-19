import { useEffect, useState } from "react";
import {
  createStyles,
  Text,
  Card,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { IconGripVertical } from "@tabler/icons";
import StrictModeDroppable from "../react-dnd/StrictModeDroppable";
import SectionItemsDnd from "./SectionItemsDnd";
import type { PlanSection, Plan, Workout } from "@prisma/client";
import CreatePlanSectionModal from "./CreatePlanSectionModal";
import { api } from "../../utils/api";
const useStyles = createStyles((theme) => ({
  item: {
    display: "flex-column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  name: {
    fontSize: 30,
    fontWeight: 700,
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));

type Props = {
  parent: Plan & {
    planSections: (PlanSection & {
      workouts: Workout[];
    })[];
  };
};

const SectionsDnd = (props: Props) => {
  const { parent } = props;
  const { classes, cx } = useStyles();
  const [isCreatePlanSectionModalOpen, setIsCreatePlanSectionModalOpen] =
    useState(false);
  const [sectionsData, setSectionsData] = useListState<
    PlanSection & {
      workouts: Workout[];
    }
  >(parent.planSections.sort((a, b) => (a.order < b.order ? -1 : 1)));

  const { refetch: refetchPlan } = api.plan.getById.useQuery(parent.id, {
    onSuccess(data) {
      data
        ? setSectionsData.setState(
            data.planSections.sort((a, b) => (a.order < b.order ? -1 : 1))
          )
        : null;
    },
  });

  const mutationReorder = api.planSection.reorder.useMutation();

  useEffect(() => {
    sectionsData.map((item, index) => {
      if (item.order !== index) {
        mutationReorder.mutate({ planSectionId: item.id, newOrder: index });
      }
    });
  }, [sectionsData]);

  const sectionsComponents = sectionsData[0]
    ? sectionsData.map((section, index) => (
        <Draggable key={section.id} index={index} draggableId={section.id}>
          {(provided, snapshot) => (
            <div
              className={cx(classes.item, {
                [classes.itemDragging]: snapshot.isDragging,
              })}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "between",
                  alignItems: "center",
                }}
              >
                <div
                  {...provided.dragHandleProps}
                  className={classes.dragHandle}
                >
                  <IconGripVertical size={18} stroke={1.5} />
                </div>
                <Text className={classes.name}>{section.name}</Text>
              </div>
              <SectionItemsDnd parent={section}></SectionItemsDnd>
            </div>
          )}
        </Draggable>
      ))
    : null;

  return (
    <Card mt="md">
      <LoadingOverlay visible={mutationReorder.isLoading} overlayBlur={2} />

      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination) return;
          setSectionsData.reorder({
            from: source.index,
            to: destination.index,
          });
        }}
      >
        <StrictModeDroppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sectionsComponents}

              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <div className={cx(classes.item, {})}>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => {
              setIsCreatePlanSectionModalOpen(true);
            }}
          >
            Add section
          </Button>
        </div>
      </div>
      <CreatePlanSectionModal
        isCreatePlanSectionModalOpen={isCreatePlanSectionModalOpen}
        setIsCreatePlanSectionModalOpen={setIsCreatePlanSectionModalOpen}
        parentId={parent.id}
        refetch={refetchPlan}
      />
    </Card>
  );
};

export default SectionsDnd;
