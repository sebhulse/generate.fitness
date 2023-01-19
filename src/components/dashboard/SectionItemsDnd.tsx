import React, { useState, useEffect, useRef } from "react";
import {
  createStyles,
  ScrollArea,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
} from "react-beautiful-dnd";
import { IconGripVertical } from "@tabler/icons";
import StrictModeDroppable from "../react-dnd/StrictModeDroppable";
import type {
  Workout,
  PlanSection,
  WorkoutSection,
  Exercise,
} from "@prisma/client";
import CreatePlanSectionItemModal from "./CreatePlanSectionItemModal";
import { api } from "../../utils/api";

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex",
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

export type WorkoutSectionType = WorkoutSection & {
  exercises: Exercise[];
};

export type PlanSectionType = PlanSection & {
  workouts: Workout[];
};

type Props = {
  parent: WorkoutSectionType & PlanSectionType;
};

const SectionItemsDnd = (props: Props) => {
  const { parent } = props;
  const { classes, cx } = useStyles();
  const [isCreateSectionItemModalOpen, setIsCreateSectionItemModalOpen] =
    useState(false);

  const isParentPlanSection = parent.workouts ? true : false;

  const parentSections = isParentPlanSection
    ? parent.workouts
    : parent.exercises;

  const [sectionItemsData, setSectionItemsData] = useListState<
    Workout | Exercise
  >(parentSections.sort((a, b) => (a.order < b.order ? -1 : 1)));

  const { refetch: refetch } = isParentPlanSection
    ? api.planSection.getById.useQuery(parent.id, {
        onSuccess(data) {
          data
            ? setSectionItemsData.setState(
                data.workouts.sort((a, b) => (a.order < b.order ? -1 : 1))
              )
            : null;
        },
      })
    : api.workoutSection.getById.useQuery(parent.id, {
        onSuccess(data) {
          data
            ? setSectionItemsData.setState(
                data.exercises.sort((a, b) => (a.order < b.order ? -1 : 1))
              )
            : null;
        },
      });

  const mutationReorder = isParentPlanSection
    ? api.workout.reorder.useMutation()
    : api.exercises.reorder.useMutation();

  useEffect(() => {
    sectionItemsData.map((item, index) => {
      if (item.order !== index) {
        isParentPlanSection
          ? mutationReorder.mutate({
              workoutId: item.id,
              newOrder: index,
            })
          : mutationReorder.mutate({
              exerciseId: item.id,
              newOrder: index,
            });
      }
    });
  }, [sectionItemsData]);

  const items = sectionItemsData[0]
    ? sectionItemsData.map((sectionItem, index) => (
        <Draggable
          key={sectionItem.id}
          index={index}
          draggableId={sectionItem.id}
        >
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
              </div>
              {sectionItem.order}
            </div>
          )}
        </Draggable>
      ))
    : null;

  return (
    <ScrollArea>
      <LoadingOverlay visible={mutationReorder.isLoading} overlayBlur={2} />

      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination) return;
          setSectionItemsData.reorder({
            from: source.index,
            to: destination.index,
          });
        }}
      >
        <StrictModeDroppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}

              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <div className={cx(classes.item, {})}>
        <div>
          <Button
            onClick={() => {
              setIsCreateSectionItemModalOpen(true);
            }}
          >
            Add workout
          </Button>
        </div>
      </div>
      <CreatePlanSectionItemModal
        isCreateSectionItemModalOpen={isCreateSectionItemModalOpen}
        setIsCreateSectionItemModalOpen={setIsCreateSectionItemModalOpen}
        parentId={parent.id}
        refetch={refetch}
      />
    </ScrollArea>
  );
};
export default SectionItemsDnd;
