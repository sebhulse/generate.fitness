export class WorkoutBuilder {
  private name: string;
  private duration: number;
  private workoutType: string;
  private workoutTargetArea: string;
  private workoutIntensity: string;
  private warmupMovements: string[] = [];
  private mainMovements: string[] = [];
  private cooldownMovements: string[] = [];
  private usedMainMovements: string[] = [];
  private usedCooldownMovements: string[] = [];
  private usedWarmupMovements: string[] = [];
  private exerciseRest = 0;
  private exerciseDuration = 0;
  private exerciseTransitionRest = 0;
  private numberOfSections = 0;

  public constructor(
    name: string,
    duration: number,
    workoutType: string,
    workoutTargetArea: string,
    workoutIntensity: string,
    warmupMovements: string[],
    mainMovements: string[],
    cooldownMovements: string[]
  ) {
    this.name = name;
    this.duration = duration;
    this.workoutType = workoutType;
    this.workoutTargetArea = workoutTargetArea;
    this.workoutIntensity = workoutIntensity;
    this.warmupMovements = warmupMovements;
    this.mainMovements = mainMovements;
    this.cooldownMovements = cooldownMovements;
  }

  private setNumberOfSections() {
    if (this.duration < 840) {
      this.numberOfSections = 2;
    } else if (this.duration >= 840 && this.duration < 1260) {
      this.numberOfSections = this.getRandomInt(2, 4);
    } else if (this.duration >= 1260 && this.duration < 1800) {
      this.numberOfSections = this.getRandomInt(3, 5);
    } else if (this.duration >= 1800) {
      this.numberOfSections = this.getRandomInt(6, 8);
    }
  }

  private getRandomInt(max: number, min: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  private roundToNearestFive(number: number) {
    return Math.round(number / 5) * 5;
  }
  private setRestPeriods() {
    if (this.workoutType === "Cardio" && this.workoutIntensity === "Beginner") {
      this.exerciseRest = 15;
      this.exerciseDuration = 30;
      this.exerciseTransitionRest = 40;
    } else if (
      this.workoutType === "Cardio" &&
      this.workoutIntensity === "Intermediate"
    ) {
      this.exerciseRest = 10;
      this.exerciseDuration = 30;
      this.exerciseTransitionRest = 40;
    } else if (
      this.workoutType === "Cardio" &&
      this.workoutIntensity === "Advanced"
    ) {
      this.exerciseRest = 5;
      this.exerciseDuration = 40;
      this.exerciseTransitionRest = 30;
    } else if (
      this.workoutType === "Strength" &&
      this.workoutIntensity === "Beginner"
    ) {
      this.exerciseRest = 20;
      this.exerciseDuration = 30;
      this.exerciseTransitionRest = 40;
    } else if (
      this.workoutType === "Strength" &&
      this.workoutIntensity === "Intermediate"
    ) {
      this.exerciseRest = 15;
      this.exerciseDuration = 35;
      this.exerciseTransitionRest = 40;
    } else if (
      this.workoutType === "Strength" &&
      this.workoutIntensity === "Advanced"
    ) {
      this.exerciseRest = 10;
      this.exerciseDuration = 40;
      this.exerciseTransitionRest = 40;
    } else {
      this.exerciseRest = 15;
      this.exerciseDuration = 30;
      this.exerciseTransitionRest = 60;
    }
  }
  private getNewUniqueExercise(
    sectionMovements: string[],
    section: "Warmup" | "Main" | "Cooldown"
  ): string {
    let movement: string | undefined, randomInt;
    let usedSectionMovements = this.usedWarmupMovements;
    if (section === "Main") {
      usedSectionMovements = this.usedMainMovements;
    } else if (section === "Cooldown") {
      usedSectionMovements = this.usedCooldownMovements;
    }
    if (usedSectionMovements.length >= sectionMovements.length) {
      randomInt = this.getRandomInt(0, usedSectionMovements.length - 1);
      movement = usedSectionMovements[randomInt];
      if (movement === undefined) {
        throw new Error("No movements found");
      }
      return movement;
    } else {
      do {
        randomInt = this.getRandomInt(0, sectionMovements.length - 1);
        movement = sectionMovements[randomInt];
        console.log(movement);
        if (movement === undefined) {
          throw new Error("No movements found");
        }
      } while (usedSectionMovements.indexOf(movement) >= 0);
    }
    usedSectionMovements.push(movement);
    console.log("returning: ", movement);
    return movement;
  }

  private generateFunWorkoutSection(sectionNumber: number) {
    const exercises = [];
    const funSectionLength = (this.duration * 0.7) / this.numberOfSections;
    const exerciseSectionDuration = this.exerciseDuration + this.exerciseRest;
    let currentFunSectionDuration = 0;
    let exerciseNumber = 0;

    do {
      const activityBody = {
        duration: this.exerciseDuration,
        rest: this.exerciseRest,
        order: exerciseNumber,
        movement: {
          connect: {
            id: this.getNewUniqueExercise(this.mainMovements, "Main"),
          },
        },
      };
      exerciseNumber++;
      currentFunSectionDuration += exerciseSectionDuration;
      if (currentFunSectionDuration >= funSectionLength) {
        activityBody.rest = 0;
        exercises.push(activityBody);
      } else {
        exercises.push(activityBody);
      }
    } while (currentFunSectionDuration < funSectionLength);
    // transitionBody = {
    //   ex: "transition",
    //   du: transiDur,
    // };
    // activitySection.push(transitionBody);
    return {
      name: `Fun ${sectionNumber}`,
      workoutSectionType: { connect: { name: "Main" } },
      order: sectionNumber,
      exercises: {
        create: exercises,
      },
    };
  }

  private generateFinisherWorkoutSection(sectionNumber: number) {
    const exercises = [];
    const finisherSectionLength = this.duration * 0.1;
    const exerciseSectionDuration = this.exerciseDuration + this.exerciseRest;
    let currentFinisherSectionDuration = 0;
    let exerciseNumber = 0;

    do {
      const activityBody = {
        duration: this.exerciseDuration,
        rest: this.exerciseRest,
        order: exerciseNumber,
        movement: {
          connect: {
            id: this.getNewUniqueExercise(this.usedMainMovements, "Main"),
          },
        },
      };
      exerciseNumber++;
      currentFinisherSectionDuration += exerciseSectionDuration;
      if (currentFinisherSectionDuration >= finisherSectionLength) {
        activityBody.rest = 0;
        exercises.push(activityBody);
      } else {
        exercises.push(activityBody);
      }
    } while (currentFinisherSectionDuration < finisherSectionLength);
    // transitionBody = {
    //   ex: "transition",
    //   du: transiDur,
    // };
    // activitySection.push(transitionBody);
    return {
      name: "Finisher",
      workoutSectionType: { connect: { name: "Main" } },
      order: sectionNumber,
      exercises: {
        create: exercises,
      },
    };
  }

  private generateWarmupCooldownWorkoutSection(
    movements: string[],
    type: "Warmup" | "Main" | "Cooldown",
    sectionNumber: number
  ) {
    const exercises = [];
    const warmupCooldownSectionLength = this.duration * 0.1;
    let currentFunSectionDuration = 0;
    let exerciseNumber = 0;

    do {
      const activityBody = {
        duration: this.exerciseDuration,
        rest: 0,
        order: exerciseNumber,
        movement: {
          connect: {
            id: this.getNewUniqueExercise(movements, type),
          },
        },
      };
      exerciseNumber++;
      currentFunSectionDuration += this.exerciseDuration;
      if (currentFunSectionDuration >= warmupCooldownSectionLength) {
        activityBody.rest = 0;
        exercises.push(activityBody);
      } else {
        exercises.push(activityBody);
      }
    } while (currentFunSectionDuration < warmupCooldownSectionLength);

    return {
      name: type,
      workoutSectionType: { connect: { name: type } },
      order: sectionNumber,
      exercises: {
        create: exercises,
      },
    };
  }
  private generateMainWorkoutSection() {
    const mainWorkoutSections = [];

    for (let i = 0; i < this.numberOfSections; i++) {
      mainWorkoutSections.push(this.generateFunWorkoutSection(i + 1));
    }

    return mainWorkoutSections;
  }
  //   private generateCooldownWorkoutSection() {}
  public generate() {
    this.setNumberOfSections();
    this.setRestPeriods();
    const workoutSections = [];

    const mainWorkoutSection = this.generateMainWorkoutSection();
    const finisherWorkoutSection = this.generateFinisherWorkoutSection(
      mainWorkoutSection.length + 1
    );
    const warmupWorkoutSection = this.generateWarmupCooldownWorkoutSection(
      this.warmupMovements,
      "Warmup",
      0
    );
    workoutSections.push(
      warmupWorkoutSection,
      ...mainWorkoutSection,
      finisherWorkoutSection
    );
    const cooldownWorkoutSection = this.generateWarmupCooldownWorkoutSection(
      this.cooldownMovements,
      "Cooldown",
      workoutSections.length + 1
    );
    workoutSections.push(cooldownWorkoutSection);
    const workoutSectionsBody = {
      create: workoutSections,
    };
    return workoutSectionsBody;
  }
}
