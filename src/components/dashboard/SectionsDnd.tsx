import { useEffect, useState } from "react";
import { createStyles, Text, Card, Button, Flex } from "@mantine/core";
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
  sections: Plan & {
    planSections: (PlanSection & {
      workouts: Workout[];
    })[];
  };
};

const SectionsDnd = (props: Props) => {
  const { sections } = props;
  const { classes, cx } = useStyles();
  const [isCreatePlanSectionModalOpen, setIsCreatePlanSectionModalOpen] =
    useState(false);
  const [sectionsData, setSectionsData] = useListState<
    PlanSection & {
      workouts: Workout[];
    }
  >(sections.planSections);

  useEffect(() => {
    console.log("I should reload now");
    console.log(sectionsData);
  }, [sectionsData]);

  const {
    data: plan,
    isLoading: isPlanLoading,
    refetch,
  } = api.plan.getById.useQuery(sections.id, {
    onSuccess(data) {
      console.log(sectionsData);
      data ? setSectionsData.setState(data?.planSections) : null;
      console.log(sectionsData);
    },
  });

  const refetchPlan = () => {
    refetch();
  };

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
              <div {...provided.dragHandleProps} className={classes.dragHandle}>
                <IconGripVertical size={18} stroke={1.5} />
              </div>
              <Text className={classes.name}>{section.name}</Text>
              <div>
                <SectionItemsDnd
                  sectionItems={section.workouts}
                ></SectionItemsDnd>
              </div>
            </div>
          )}
        </Draggable>
      ))
    : null;

  return (
    <Card mt="md">
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          setSectionsData.reorder({
            from: source.index,
            to: destination?.index || 0,
          })
        }
      >
        <StrictModeDroppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sectionsComponents}
              <Draggable
                key={"addItem"}
                index={sectionsData.length}
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
                    <Text className={classes.name}>
                      Week {sections.planSections.length + 1}
                    </Text>
                    <Button
                      onClick={() => setIsCreatePlanSectionModalOpen(true)}
                    >
                      Add section
                    </Button>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <CreatePlanSectionModal
        isCreatePlanSectionModalOpen={isCreatePlanSectionModalOpen}
        setIsCreatePlanSectionModalOpen={setIsCreatePlanSectionModalOpen}
        planId={sections.id}
        nameSuggestion={`Week ${sections.planSections.length + 1}`}
        refetch={refetchPlan}
      />
    </Card>
  );
};

export default SectionsDnd;
