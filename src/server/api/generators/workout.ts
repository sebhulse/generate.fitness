export class WorkoutBuilder {
  private name: string;
  private duration: number;
  private workoutType: string;
  private workoutTargetArea: string;
  private workoutIntensity: string;
  private warmupMovements: string[] = [];
  private mainMovements: string[] = [];
  private cooldownMovements: string[] = [];
  private usedWorkoutMovements: string[] = [];
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
  private getNewUniqueExercise(sectionMovements: string[]): string {
    let movement: string | undefined, randomInt;
    if (this.usedWorkoutMovements.length >= sectionMovements.length) {
      randomInt = this.getRandomInt(0, this.usedWorkoutMovements.length - 1);
      movement = this.usedWorkoutMovements[randomInt];
      if (movement === undefined) {
        throw new Error("No movements found");
      }
      return movement;
    } else {
      do {
        randomInt = this.getRandomInt(0, sectionMovements.length - 1);
        movement = sectionMovements[randomInt];
        if (movement === undefined) {
          throw new Error("No movements found");
        }
      } while (this.usedWorkoutMovements.indexOf(movement) >= 0);
    }
    this.usedWorkoutMovements.push(movement);
    return movement;
  }
  //   private generateWarmupWorkoutSection() {}
  private generateMainFunWorkoutSection() {
    // const sectionDuration = this.getDuration() / this.getNumberOfSections();
    return {
      name: "Fun 1",
      workoutSectionType: { connect: { name: "Main" } },
      order: 0,
      exercises: {
        create: [
          {
            duration: this.roundToNearestFive(this.getRandomInt(5, 60)),
            order: 0,
            movement: {
              connect: {
                id: this.getNewUniqueExercise(this.mainMovements),
              },
            },
          },
          {
            duration: this.roundToNearestFive(this.getRandomInt(5, 60)),
            order: 0,
            movement: {
              connect: {
                id: this.getNewUniqueExercise(this.mainMovements),
              },
            },
          },
        ],
      },
    };
  }
  //   private generateCooldownWorkoutSection() {}
  public generate() {
    console.log("before setup");
    try {
      this.setNumberOfSections();
      this.setRestPeriods();
    } catch (error) {
      console.log(error);
    }
    console.log("after setup");

    const workoutSections = [];
    workoutSections.push(this.generateMainFunWorkoutSection());
    const workoutSectionsBody = {
      create: workoutSections,
    };
    return workoutSectionsBody;
  }
}
