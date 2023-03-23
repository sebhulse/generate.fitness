import React, { useState, useEffect } from "react";
import {
  createStyles,
  ScrollArea,
  Button,
  LoadingOverlay,
  Text,
  Group,
  Badge,
  Stack,
  MediaQuery,
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
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
    paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  name: {
    fontSize: theme.fontSizes.md,
    // marginLeft: theme.spacing.md,
    textTransform: "capitalize",
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    width: "100%",
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
                <div
                  {...provided.dragHandleProps}
                  className={classes.dragHandle}
                >
                  <Group style={{ flexWrap: "nowrap", marginRight: "0.5rem" }}>
                    <div style={{ width: "18px", height: "18px" }}>
                      <IconGripVertical stroke={1.5} height={18} width={18} />
                    </div>
                    <MediaQuery
                      largerThan="sm"
                      styles={{
                        fontSize: 20,
                        "&:hover": { backgroundColor: "silver" },
                      }}
                    >
                      {"name" in sectionItem ? (
                        <Stack style={{ display: "inline" }}>
                          <Text className={classes.name}>
                            {sectionItem.name}
                          </Text>
                          {sectionItem.duration ? (
                            <Badge
                              mt="xs"
                              color="blue"
                              variant="filled"
                              size="lg"
                              style={{
                                textTransform: "capitalize",
                              }}
                            >
                              {`${sectionItem.duration / 60} mins`}
                            </Badge>
                          ) : null}
                        </Stack>
                      ) : (
                        <Text className={classes.name}>
                          {sectionItem.movement.name}
                        </Text>
                      )}
                    </MediaQuery>
                  </Group>
                  {"movement" in sectionItem ? (
                    <Group style={{ justifyContent: "end" }}>
                      <Text>{sectionItem.duration}s</Text>
                      {sectionItem.rest ? (
                        <Text style={{ whiteSpace: "nowrap" }}>
                          Rest {sectionItem.rest}s
                        </Text>
                      ) : null}
                    </Group>
                  ) : null}
                </div>

                <SectionItemOptionMenu
                  section={"workouts" in parent ? "Workout" : "Exercise"}
                  parentId={sectionItem.id}
                  refetch={refetch}
                />
              </div>
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
      <div className={cx(classes.item, {})} style={{ border: "0px" }}>
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
