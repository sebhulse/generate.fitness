import React, { useState, useEffect } from "react";
import {
  createStyles,
  ScrollArea,
  Button,
  LoadingOverlay,
  Text,
  Group,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { IconGripVertical } from "@tabler/icons";
import StrictModeDroppable from "../react-dnd/StrictModeDroppable";
import type { Workout, Exercise, Movement } from "@prisma/client";
import CreateWorkoutModal from "./CreateWorkoutModal";
import CreateExerciseModal from "./CreateExerciseModal";
import { api } from "../../utils/api";
import type {
  WorkoutSectionType,
  PlanSectionType,
  PlanType,
  WorkoutType,
} from "./SectionsDnd";
import SectionItemOptionMenu from "./SectionItemOptionMenu";

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex-column",
    alignItems: "center",
    justifyContent: "center",
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

type ExerciseType = Exercise & {
  movement: Movement;
};

type Props = {
  grandparent: WorkoutType | PlanType;
  parent: WorkoutSectionType | PlanSectionType;
};

const SectionItemsDnd = (props: Props) => {
  const { parent, grandparent } = props;
  const { classes, cx } = useStyles();
  const [isCreateSectionItemModalOpen, setIsCreateSectionItemModalOpen] =
    useState(false);

  const parentSections =
    "workouts" in parent ? parent.workouts : parent.exercises;

  const [sectionItemsData, setSectionItemsData] = useListState<
    Workout | ExerciseType
  >(parentSections.sort((a, b) => (a.order < b.order ? -1 : 1)));

  const { refetch: refetch } =
    "workouts" in parent
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

  const mutationReorderWorkout = api.workout.reorder.useMutation();
  const mutationReorderExercise = api.exercise.reorder.useMutation();

  useEffect(() => {
    sectionItemsData.map((item, index) => {
      if (item.order !== index) {
        "workouts" in parent
          ? mutationReorderWorkout.mutate({
              workoutId: item.id,
              newOrder: index,
            })
          : mutationReorderExercise.mutate({
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
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <Group position="apart"> */}
                <div
                  {...provided.dragHandleProps}
                  className={classes.dragHandle}
                >
                  <IconGripVertical size={18} stroke={1.5} />
                  <Text>
                    {"name" in sectionItem
                      ? sectionItem.name
                      : sectionItem.movement.name}
                  </Text>
                </div>

                <SectionItemOptionMenu
                  section={"workouts" in parent ? "Workout" : "Exercise"}
                  parentId={sectionItem.id}
                  refetch={refetch}
                />
              </div>
              {/* </Group> */}
            </div>
          )}
        </Draggable>
      ))
    : null;

  return (
    <ScrollArea>
      <LoadingOverlay
        visible={
          mutationReorderExercise.isLoading || mutationReorderWorkout.isLoading
        }
        overlayBlur={2}
      />

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
            {`Add ${"workouts" in parent ? "Workout" : "Exercise"}`}
          </Button>
        </div>
      </div>
      {"workouts" in parent ? (
        <CreateWorkoutModal
          isCreateWorkoutModalOpen={isCreateSectionItemModalOpen}
          setIsCreateWorkoutModalOpen={setIsCreateSectionItemModalOpen}
          parentId={parent.id}
          refetch={refetch}
        />
      ) : null}
      {"exercises" in parent && "workoutSections" in grandparent ? (
        <CreateExerciseModal
          grandparent={grandparent}
          isCreateExerciseModalOpen={isCreateSectionItemModalOpen}
          setIsCreateExerciseModalOpen={setIsCreateSectionItemModalOpen}
          parent={parent}
          refetch={refetch}
        />
      ) : null}
    </ScrollArea>
  );
};
export default SectionItemsDnd;
