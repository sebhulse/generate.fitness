import { PrismaClient } from "@prisma/client";
// import { workoutType, workoutTargetArea } from "./data.js";

const prisma = new PrismaClient();

const workoutTargetAreas = ["Full Body", "Upper Body", "Lower Body", "Core"];
const workoutIntensitys = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
];
const workoutSectionTypes = ["Warmup", "Main", "Cooldown"];

async function main() {
  await prisma.workoutType.deleteMany();
  console.log("Deleted records in workoutType table");

  await prisma.movement.deleteMany();
  console.log("Deleted records in movement table");

  await prisma.workoutIntensity.deleteMany();
  console.log("Deleted records in workoutIntensity table");

  await prisma.workoutTargetArea.deleteMany();
  console.log("Deleted records in workoutTargetArea table");

  await prisma.workoutSectionType.deleteMany();
  console.log("Deleted records in workoutSectionType table");

  await prisma.movement.create({
    data: {
      name: "Leg Kicks",
      combinationMovement: false,
      workoutTargetArea: {
        connectOrCreate: workoutTargetAreas.map((workoutTargetArea) => ({
          where: { name: workoutTargetArea },
          create: { name: workoutTargetArea },
        })),
      },
      workoutIntensity: {
        connectOrCreate: workoutIntensitys.map((workoutIntensity) => ({
          where: { name: workoutIntensity },
          create: { name: workoutIntensity },
        })),
      },
      workoutSectionType: {
        connectOrCreate: workoutSectionTypes.map((workoutSectionType) => ({
          where: { name: workoutSectionType },
          create: { name: workoutSectionType },
        })),
      },
    },
  });
  await prisma.movement.create({
    data: {
      name: "Sit Ups",
      combinationMovement: false,
      workoutTargetArea: {
        connectOrCreate: workoutTargetAreas.map((workoutTargetArea) => ({
          where: { name: workoutTargetArea },
          create: { name: workoutTargetArea },
        })),
      },
      workoutIntensity: {
        connectOrCreate: workoutIntensitys.map((workoutIntensity) => ({
          where: { name: workoutIntensity },
          create: { name: workoutIntensity },
        })),
      },
      workoutSectionType: {
        connectOrCreate: workoutSectionTypes.map((workoutSectionType) => ({
          where: { name: workoutSectionType },
          create: { name: workoutSectionType },
        })),
      },
    },
  });
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
