export interface ExerciseItem {
  id: string;
  name: string;
  force?: string | null;
  level?: string | null;
  mechanic?: string | null;
  equipment?: string | null;
  primary_muscles: string[];
  secondary_muscles: string[];
  instructions: string[];
  category?: string | null;
  images: string[];
  source?: string;
  source_version?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;

  // Optional fields for backward compatibility
  body_part?: string;
  target?: string;
  description?: string;
  difficulty?: string;
  gif_url?: string;
}

export type ExerciseSortOrder = 'asc' | 'desc';

export interface ExerciseFilters {
  equipment: string;
  muscle: string;
  searchQuery: string;
  sortAsc: boolean;
}

export interface ExerciseDetailParams {
  id?: string;
  name?: string;
  muscle?: string;
  equipment?: string;
  level?: string;
  category?: string;
  force?: string;
  mechanic?: string;
  instructions?: string;
  primaryMuscles?: string;
  secondaryMuscles?: string;
  images?: string;
  mode?: string;

  // Backward compatibility
  bodyPart?: string;
  description?: string;
  difficulty?: string;
  gifUrl?: string;
  [key: string]: string | string[] | undefined;
}
