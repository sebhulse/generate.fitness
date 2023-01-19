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
import { type Workout, type PlanSection } from "@prisma/client";
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

type Props = {
  parent: PlanSection & {
    workouts: Workout[];
  };
};

const SectionItemsDnd = (props: Props) => {
  const { parent } = props;
  const { classes, cx } = useStyles();
  const [isCreateSectionItemModalOpen, setIsCreateSectionItemModalOpen] =
    useState(false);

  const isFirstRender = useRef(true);

  const [sectionItemsData, setSectionItemsData] = useListState<Workout>(
    parent.workouts.sort((a, b) => (a.order < b.order ? -1 : 1))
  );

  const [newSectionItemOrder, setNewSectionItemOrder] = useState(
    parent.workouts.length
  );

  const { refetch: refetchParent } = api.planSection.getById.useQuery(
    parent.id,
    {
      onSuccess(data) {
        data
          ? setSectionItemsData.setState(
              parent.workouts.sort((a, b) => (a.order < b.order ? -1 : 1))
            )
          : null;
        data ? setNewSectionItemOrder(data.workouts.length) : null;
      },
    }
  );

  useEffect(() => {
    sectionItemsData.map((item, index) => {
      if (index !== item.order) {
        mutationWorkoutReorder.mutate({
          workoutId: item.id,
          newOrder: index,
        });
      }
    });
  }, [sectionItemsData]);

  const mutationWorkoutReorder = api.workout.reorder.useMutation({});

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
              {sectionItem.name}
            </div>
          )}
        </Draggable>
      ))
    : null;

  return (
    <ScrollArea>
      <LoadingOverlay
        visible={mutationWorkoutReorder.isLoading}
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
            Add workout
          </Button>
        </div>
      </div>
      <CreatePlanSectionItemModal
        isCreateSectionItemModalOpen={isCreateSectionItemModalOpen}
        setIsCreateSectionItemModalOpen={setIsCreateSectionItemModalOpen}
        parentId={parent.id}
        refetch={refetchParent}
        order={newSectionItemOrder}
      />
    </ScrollArea>
  );
};
export default SectionItemsDnd;
