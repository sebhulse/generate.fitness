import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface bodyWeightMovementType {
  warmup: [
    {
      id: number;
      name: string;
      description: string;
      area: ["core", "upper", "lower", "full"];
    }
  ];
  workout: [
    {
      id: number;
      name: string;
      description: string;
      type: ["strength", "cardio"];
      level: ["beginner", "intermediate", "advanced"];
      area: ["core", "upper", "lower", "full"];
    }
  ];
  cooldown: [
    {
      id: number;
      name: string;
      description: string;
      area: ["core", "upper", "lower", "full"];
    }
  ];
}

const workoutTargetAreas = ["Full Body", "Upper Body", "Lower Body", "Core"];
const workoutIntensitys = ["Beginner", "Intermediate", "Advanced"];
const workoutSectionTypes = ["Warmup", "Main", "Cooldown"];
const workoutTypes = ["Strength", "Cardio"];

const WorkoutTargetAreasToVariant = {
  ["full"]: "Full Body",
  ["upper"]: "Upper Body",
  ["lower"]: "Lower Body",
  ["core"]: "Core",
} as const;

const WorkoutIntensitysToVariant = {
  ["beginner"]: "Beginner",
  ["intermediate"]: "Intermediate",
  ["advanced"]: "Advanced",
} as const;

const WorkoutTypesToVariant = {
  ["strength"]: "Strength",
  ["cardio"]: "Cardio",
};

const convertAreaToConnect = (
  movement: bodyWeightMovementType["warmup"][0]
) => {
  const array: { name: string }[] = [];
  movement.area.map((area) => {
    array.push({ name: WorkoutTargetAreasToVariant[area] });
  });
  return array;
};
const convertTypeToConnect = (
  movement: bodyWeightMovementType["workout"][0]
) => {
  const array: { name: string }[] = [];
  movement.type.map((type) => {
    array.push({ name: WorkoutTypesToVariant[type] });
  });
  return array;
};
const convertLevelToConnect = (
  movement: bodyWeightMovementType["workout"][0]
) => {
  const array: { name: string }[] = [];
  movement.level.map((level) => {
    array.push({ name: WorkoutIntensitysToVariant[level] });
  });
  return array;
};

const deleteRecords = async () => {
  await prisma.workout.deleteMany();
  console.log("Deleted records in workout table");

  await prisma.workoutType.deleteMany();
  console.log("Deleted records in workoutType table");

  await prisma.movement.deleteMany();
  console.log("Deleted records in movement table");

  await prisma.exercise.deleteMany();
  console.log("Deleted records in exercise table");

  await prisma.workoutIntensity.deleteMany();
  console.log("Deleted records in workoutIntensity table");

  await prisma.workoutTargetArea.deleteMany();
  console.log("Deleted records in workoutTargetArea table");

  await prisma.workoutSectionType.deleteMany();
  console.log("Deleted records in workoutSectionType table");
};

const createWorkoutBaseRecords = async () => {
  const promise1 = Promise.all(
    workoutTargetAreas.map(async (workoutTargetArea) => {
      const workoutTargetAreaResponse = await prisma.workoutTargetArea.create({
        data: {
          name: workoutTargetArea,
        },
      });
      console.log(
        `created workoutTargetArea with name: ${workoutTargetAreaResponse.name} and ID: ${workoutTargetAreaResponse.id}`
      );
      return workoutTargetAreaResponse;
    })
  );

  const promise2 = Promise.all(
    workoutIntensitys.map(async (workoutIntensity) => {
      const workoutIntensityResponse = await prisma.workoutIntensity.create({
        data: {
          name: workoutIntensity,
        },
      });
      console.log(
        `created workoutIntensity with name: ${workoutIntensityResponse.name} and ID: ${workoutIntensityResponse.id}`
      );
      return workoutIntensityResponse;
    })
  );
  const promise3 = Promise.all(
    workoutSectionTypes.map(async (workoutSectionType) => {
      const workoutSectionTypeResponse = await prisma.workoutSectionType.create(
        {
          data: {
            name: workoutSectionType,
          },
        }
      );
      console.log(
        `created workoutSectionType with name: ${workoutSectionTypeResponse.name} and ID: ${workoutSectionTypeResponse.id}`
      );
      return workoutSectionTypeResponse;
    })
  );
  const promise4 = Promise.all(
    workoutTypes.map(async (workoutType) => {
      const workoutTypeResponse = await prisma.workoutType.create({
        data: {
          name: workoutType,
        },
      });
      console.log(
        `created workoutType with name: ${workoutTypeResponse.name} and ID: ${workoutTypeResponse.id}`
      );
      return workoutTypeResponse;
    })
  );
  return Promise.all([promise1, promise2, promise3, promise4]);
};

const getBodyWeightMovements = async () => {
  const bodyWeightMovements = await fetch(
    "https://fitness.sebhulse.com/data/bodyweight-exercises.json"
  );
  return (await bodyWeightMovements.json()) as bodyWeightMovementType;
};

const createBodyweightMovementRecords = async () => {
  const bodyWeightMovementsJson = await getBodyWeightMovements();
  let count = 0;
  const promise1 = await Promise.all(
    bodyWeightMovementsJson.warmup.map(async (movement) => {
      const createMovementResponse = await prisma.movement.upsert({
        where: { name: movement.name },
        update: {
          name: movement.name,
          combinationMovement: false,
          workoutTargetArea: {
            connect: convertAreaToConnect(movement),
          },
          workoutSectionType: {
            connect: { name: "Warmup" },
          },
        },
        create: {
          name: movement.name,
          combinationMovement: false,
          workoutTargetArea: {
            connect: convertAreaToConnect(movement),
          },
          workoutSectionType: {
            connect: { name: "Warmup" },
          },
        },
      });
      console.log(
        `created Warmup Movement with name: ${createMovementResponse.name} and ID: ${createMovementResponse.id}`
      );
      count++;
      return createMovementResponse;
    })
  );
  const promise2 = await Promise.all(
    bodyWeightMovementsJson.workout.map(async (movement) => {
      const createMovementResponse = await prisma.movement.upsert({
        where: { name: movement.name },
        update: {
          name: movement.name,
          combinationMovement: false,
          workoutTargetArea: {
            connect: convertAreaToConnect(movement),
          },
          workoutIntensity: {
            connect: convertLevelToConnect(movement),
          },
          workoutSectionType: {
            connect: { name: "Main" },
          },
          workoutType: {
            connect: convertTypeToConnect(movement),
          },
        },
        create: {
          name: movement.name,
          combinationMovement: false,
          workoutTargetArea: {
            connect: convertAreaToConnect(movement),
          },
          workoutIntensity: {
            connect: convertLevelToConnect(movement),
          },
          workoutSectionType: {
            connect: { name: "Main" },
          },
          workoutType: {
            connect: convertTypeToConnect(movement),
          },
        },
      });
      console.log(
        `created Main Movement with name: ${createMovementResponse.name} and ID: ${createMovementResponse.id}`
      );
      count++;
      return createMovementResponse;
    })
  );
  const promise3 = await Promise.all(
    bodyWeightMovementsJson.cooldown.map(async (movement) => {
      const createMovementResponse = await prisma.movement.upsert({
        where: { name: movement.name },
        update: {
          name: movement.name,
          combinationMovement: false,
          workoutTargetArea: {
            connect: convertAreaToConnect(movement),
          },
          workoutSectionType: {
            connect: { name: "Cooldown" },
          },
        },
        create: {
          name: movement.name,
          combinationMovement: false,
          workoutTargetArea: {
            connect: convertAreaToConnect(movement),
          },
          workoutSectionType: {
            connect: { name: "Cooldown" },
          },
        },
      });
      console.log(
        `created Cooldown Movement with name: ${createMovementResponse.name} and ID: ${createMovementResponse.id}`
      );
      count++;
      return createMovementResponse;
    })
  );
  console.log(`Upserted ${count} movements to database in total`);
  return Promise.all([promise1, promise2, promise3]);
};

async function main() {
  await deleteRecords();
  await createWorkoutBaseRecords();
  await createBodyweightMovementRecords();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
