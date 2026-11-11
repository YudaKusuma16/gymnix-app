export interface SetRecord {
  setNumber: number;
  prev: string;
  weight: string;
  reps: string;
  completed: boolean;
}

export interface NextExerciseItem {
  id: number;
  name: string;
  target: string;
  setsCount: string;
  note: string;
}

export interface WorkoutSessionSummary {
  id?: string;
  durationSeconds: number;
  totalVolumeKg?: number;
  completedSetsCount: number;
  finishedAt?: string;
}
