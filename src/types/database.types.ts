/**
 * Gymnix Database Types for Supabase PostgreSQL
 * Reference: arsitektur_full_fitness_tracking_expo_supabase.md (Section 5, 6, 16.3)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // uuid PK, FK to auth.users
          display_name: string;
          username: string | null;
          avatar_path: string | null;
          bio: string | null;
          gender: string | null;
          date_of_birth: string | null; // ISO date YYYY-MM-DD
          height_cm: number | null;
          weight_kg: number | null;
          home_gym_name: string | null;
          fitness_goal: string | null;
          experience_level: string | null;
          training_frequency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          username?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          gender?: string | null;
          date_of_birth?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          home_gym_name?: string | null;
          fitness_goal?: string | null;
          experience_level?: string | null;
          training_frequency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          username?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          gender?: string | null;
          date_of_birth?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          home_gym_name?: string | null;
          fitness_goal?: string | null;
          experience_level?: string | null;
          training_frequency?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      user_settings: {
        Row: {
          user_id: string;
          preferred_units: 'metric' | 'imperial';
          timezone: string;
          week_starts_on: number; // 0-6 (0 = Sunday, 1 = Monday)
          notifications_enabled: boolean;
          sound_effects_enabled: boolean;
          haptic_feedback_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          preferred_units?: 'metric' | 'imperial';
          timezone?: string;
          week_starts_on?: number;
          notifications_enabled?: boolean;
          sound_effects_enabled?: boolean;
          haptic_feedback_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          preferred_units?: 'metric' | 'imperial';
          timezone?: string;
          week_starts_on?: number;
          notifications_enabled?: boolean;
          sound_effects_enabled?: boolean;
          haptic_feedback_enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      exercises: {
        Row: {
          id: string;
          name: string;
          force: string | null;
          level: string | null;
          mechanic: string | null;
          equipment: string | null;
          primary_muscles: string[];
          secondary_muscles: string[];
          instructions: Json;
          category: string | null;
          images: Json;
          source: string;
          source_version: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          force?: string | null;
          level?: string | null;
          mechanic?: string | null;
          equipment?: string | null;
          primary_muscles?: string[];
          secondary_muscles?: string[];
          instructions?: Json;
          category?: string | null;
          images?: Json;
          source?: string;
          source_version?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          force?: string | null;
          level?: string | null;
          mechanic?: string | null;
          equipment?: string | null;
          primary_muscles?: string[];
          secondary_muscles?: string[];
          instructions?: Json;
          category?: string | null;
          images?: Json;
          source?: string;
          source_version?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      exercise_favorites: {
        Row: {
          user_id: string;
          exercise_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          exercise_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          exercise_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      workout_plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          is_archived?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      workout_plan_items: {
        Row: {
          id: string;
          plan_id: string;
          exercise_id: string;
          day_number: number | null;
          order_index: number;
          target_sets: number | null;
          target_reps_min: number | null;
          target_reps_max: number | null;
          rest_seconds: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          plan_id: string;
          exercise_id: string;
          day_number?: number | null;
          order_index: number;
          target_sets?: number | null;
          target_reps_min?: number | null;
          target_reps_max?: number | null;
          rest_seconds?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          plan_id?: string;
          exercise_id?: string;
          day_number?: number | null;
          order_index?: number;
          target_sets?: number | null;
          target_reps_min?: number | null;
          target_reps_max?: number | null;
          rest_seconds?: number | null;
          notes?: string | null;
        };
        Relationships: [];
      };

      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          title: string | null;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          status: 'in_progress' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          title?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          status?: 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          title?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          status?: 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      workout_logs: {
        Row: {
          id: string;
          session_id: string;
          exercise_id: string;
          order_index: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          exercise_id: string;
          order_index: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          exercise_id?: string;
          order_index?: number;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      workout_sets: {
        Row: {
          id: string;
          workout_log_id: string;
          set_number: number;
          reps: number | null;
          weight_kg: number | null;
          duration_seconds: number | null;
          distance_meters: number | null;
          completed: boolean;
          rpe: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workout_log_id: string;
          set_number: number;
          reps?: number | null;
          weight_kg?: number | null;
          duration_seconds?: number | null;
          distance_meters?: number | null;
          completed?: boolean;
          rpe?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workout_log_id?: string;
          set_number?: number;
          reps?: number | null;
          weight_kg?: number | null;
          duration_seconds?: number | null;
          distance_meters?: number | null;
          completed?: boolean;
          rpe?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      body_measurements: {
        Row: {
          id: string;
          user_id: string;
          measured_at: string;
          weight_kg: number | null;
          body_fat_pct: number | null;
          waist_cm: number | null;
          chest_cm: number | null;
          hips_cm: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          measured_at?: string;
          weight_kg?: number | null;
          body_fat_pct?: number | null;
          waist_cm?: number | null;
          chest_cm?: number | null;
          hips_cm?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          measured_at?: string;
          weight_kg?: number | null;
          body_fat_pct?: number | null;
          waist_cm?: number | null;
          chest_cm?: number | null;
          hips_cm?: number | null;
          notes?: string | null;
        };
        Relationships: [];
      };

      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          storage_path: string;
          captured_at: string;
          photo_type: string | null; // 'front' | 'side' | 'back'
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          storage_path: string;
          captured_at?: string;
          photo_type?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          storage_path?: string;
          captured_at?: string;
          photo_type?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };

      personal_records: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          record_type: string; // 'max_weight' | 'max_reps' | 'estimated_1rm'
          record_value: number;
          unit: string;
          achieved_at: string;
          source_workout_set_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          record_type: string;
          record_value: number;
          unit?: string;
          achieved_at?: string;
          source_workout_set_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          record_type?: string;
          record_value?: number;
          unit?: string;
          achieved_at?: string;
          source_workout_set_id?: string | null;
        };
        Relationships: [];
      };

      water_logs: {
        Row: {
          id: string;
          user_id: string;
          amount_ml: number;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_ml: number;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount_ml?: number;
          logged_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
