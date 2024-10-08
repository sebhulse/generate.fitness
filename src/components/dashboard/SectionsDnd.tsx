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
import type {
  PlanSection,
  Plan,
  Workout,
  Exercise,
  WorkoutSection,
  Movement,
} from "@prisma/client";
import CreatePlanSectionModal from "./CreatePlanSectionModal";
import CreateWorkoutSectionModal from "./CreateWorkoutSectionModal";
import { api } from "../../utils/api";
import SectionOptionMenu from "./SectionOptionMenu";

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex-column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]
    }`,
    padding: theme.spacing.sm,
    paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  name: {
    fontSize: 30,
    fontWeight: 700,
    marginLeft: theme.spacing.md,
    textTransform: "capitalize",
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));

export type WorkoutType = Workout & {
  workoutSections: (WorkoutSection & {
    workoutSectionType: {
      name: string;
    };
    exercises: (Exercise & {
      movement: Movement;
    })[];
  })[];
};

export type PlanType = Plan & {
  planSections: (PlanSection & {
    workouts: Workout[];
  })[];
};

export type WorkoutSectionType = WorkoutSection & {
  workoutSectionType: {
    name: string;
  };
  exercises: (Exercise & {
    movement: Movement;
  })[];
};

export type PlanSectionType = PlanSection & {
  workouts: Workout[];
};

type Props = {
  parent: WorkoutType | PlanType;
};

const SectionsDnd = (props: Props) => {
  const { parent } = props;
  const { classes, cx } = useStyles();
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] =
    useState(false);

  const parentSections =
    "planSections" in parent ? parent.planSections : parent.workoutSections;

  const [sectionsData, setSectionsData] = useListState<
    WorkoutSectionType | PlanSectionType
  >(parentSections.sort((a, b) => (a.order < b.order ? -1 : 1)));

  const { refetch: refetch } =
    "planSections" in parent
      ? api.plan.getById.useQuery(parent.id, {
          onSuccess(data) {
            data
              ? setSectionsData.setState(
                  data.planSections.sort((a, b) => (a.order < b.order ? -1 : 1))
                )
              : null;
          },
        })
      : api.workout.getById.useQuery(parent.id, {
          onSuccess(data) {
            data
              ? setSectionsData.setState(
                  data.workoutSections.sort((a, b) =>
                    a.order < b.order ? -1 : 1
                  )
                )
              : null;
          },
        });

  const mutationReorderPlan = api.planSection.reorder.useMutation();
  const mutationReorderWorkout = api.workoutSection.reorder.useMutation();

  useEffect(() => {
    sectionsData.map((item, index) => {
      if (item.order !== index) {
        "planSections" in parent
          ? mutationReorderPlan.mutate({
              planSectionId: item.id,
              newOrder: index,
            })
          : mutationReorderWorkout.mutate({
              workoutSectionId: item.id,
              newOrder: index,
            });
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
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  {...provided.dragHandleProps}
                  className={classes.dragHandle}
                >
                  <IconGripVertical size={18} stroke={1.5} />
                  <Text className={classes.name}>{section.name}</Text>
                </div>

                <SectionOptionMenu
                  section={"planSections" in parent ? "Plan" : "Workout"}
                  parentId={section.id}
                  refetch={refetch}
                />
              </div>
              <SectionItemsDnd
                grandparent={parent}
                parent={section}
              ></SectionItemsDnd>
            </div>
          )}
        </Draggable>
      ))
    : null;

  return (
    <Card mt="md">
      <LoadingOverlay
        visible={
          mutationReorderWorkout.isLoading || mutationReorderPlan.isLoading
        }
        overlayBlur={2}
      />

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
      <div className={cx(classes.item, {})} style={{ border: "0px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => {
              setIsCreateSectionModalOpen(true);
            }}
          >
            {`Add ${"planSections" in parent ? "Plan" : "Workout"} section`}
          </Button>
        </div>
      </div>
      {"planSections" in parent ? (
        <CreatePlanSectionModal
          isCreateSectionModalOpen={isCreateSectionModalOpen}
          setIsCreateSectionModalOpen={setIsCreateSectionModalOpen}
          parent={parent}
          refetch={refetch}
        />
      ) : (
        <CreateWorkoutSectionModal
          isCreateSectionModalOpen={isCreateSectionModalOpen}
          setIsCreateSectionModalOpen={setIsCreateSectionModalOpen}
          parent={parent}
          refetch={refetch}
        />
      )}
    </Card>
  );
};

export default SectionsDnd;
