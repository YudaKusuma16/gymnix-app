export interface ExerciseItem {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  target: string;
  secondary_muscles: string[];
  instructions: string[];
  description?: string;
  difficulty?: string;
  category?: string;
  gif_url?: string;
  created_at?: string;
}

export type ExerciseSortOrder = 'asc' | 'desc';

export interface ExerciseFilters {
  equipment: string;
  muscle: string;
  searchQuery: string;
  sortAsc: boolean;
}

export interface ExerciseDetailParams {
  name?: string;
  muscle?: string;
  equipment?: string;
  bodyPart?: string;
  description?: string;
  instructions?: string;
  secondaryMuscles?: string;
  difficulty?: string;
  category?: string;
  gifUrl?: string;
  mode?: string;
  [key: string]: string | string[] | undefined;
}
