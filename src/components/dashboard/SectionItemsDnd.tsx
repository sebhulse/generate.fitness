import React, { useState } from "react";
import { createStyles, Table, ScrollArea, Button } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { IconGripVertical } from "@tabler/icons";
import StrictModeDroppable from "../react-dnd/StrictModeDroppable";
import { Workout } from "@prisma/client";
import CreatePlanSectionItemModal from "./CreatePlanSectionItemModal";

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
  sectionItems: Workout[];
};

const SectionItemsDnd = (props: Props) => {
  const { sectionItems } = props;
  const { classes, cx } = useStyles();
  const [
    isCreatePlanSectionItemModalOpen,
    setIsCreatePlanSectionItemModalOpen,
  ] = useState(false);
  const [sectionItemsData, setSectionItemsData] =
    useListState<Workout>(sectionItems);

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
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          setSectionItemsData.reorder({
            from: source.index,
            to: destination?.index || 0,
          })
        }
      >
        <StrictModeDroppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              <Draggable
                key={"addItem"}
                index={sectionItemsData.length}
                draggableId={"addItem"}
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
                      {...provided.dragHandleProps}
                      className={classes.dragHandle}
                    >
                      <IconGripVertical size={18} stroke={1.5} />
                    </div>

                    <Button
                      onClick={() => setIsCreatePlanSectionItemModalOpen(true)}
                    >
                      Add workout
                    </Button>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <CreatePlanSectionItemModal
        isCreatePlanSectionModalOpen={isCreatePlanSectionItemModalOpen}
        setIsCreatePlanSectionModalOpen={setIsCreatePlanSectionItemModalOpen}
        planId={"fasfds"}
        nameSuggestion={`Workout 1}`}
        refetch={() => undefined}
      />
    </ScrollArea>
  );
};
export default SectionItemsDnd;
