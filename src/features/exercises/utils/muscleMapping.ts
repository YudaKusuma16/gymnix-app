import { Slug } from 'react-native-body-highlighter';

/**
 * Mapping all 17 unique muscles from Free Exercise DB to react-native-body-highlighter Slugs
 */
export const MUSCLE_TO_SLUG_MAP: Record<string, Slug> = {
  abdominals: 'abs',
  abductors: 'adductors',
  adductors: 'adductors',
  biceps: 'biceps',
  calves: 'calves',
  chest: 'chest',
  forearms: 'forearm',
  glutes: 'gluteal',
  hamstrings: 'hamstring',
  lats: 'upper-back',
  'lower back': 'lower-back',
  'middle back': 'upper-back',
  neck: 'neck',
  quadriceps: 'quadriceps',
  shoulders: 'deltoids',
  traps: 'trapezius',
  triceps: 'triceps',
};

/**
 * Muscles that are primarily located on the posterior (back) of the human body
 */
export const BACK_DOMINANT_MUSCLES = new Set([
  'glutes',
  'hamstrings',
  'lats',
  'lower back',
  'middle back',
  'traps',
  'triceps',
]);

export interface HighlightedMusclePart {
  slug: Slug;
  intensity: number;
}

/**
 * Maps primary and secondary muscles array from Free Exercise DB to body highlighter parts
 */
export function mapMusclesToBodyData(
  primaryMuscles: string[] = [],
  secondaryMuscles: string[] = []
): {
  highlightData: HighlightedMusclePart[];
  defaultSide: 'front' | 'back';
} {
  const partsMap = new Map<Slug, number>();

  // Primary muscles get intensity 2 (accent color, e.g. #BE3144)
  primaryMuscles.forEach((muscle) => {
    const slug = MUSCLE_TO_SLUG_MAP[muscle.toLowerCase().trim()];
    if (slug) {
      partsMap.set(slug, 2);
    }
  });

  // Secondary muscles get intensity 1 (secondary accent, e.g. #E04D60)
  secondaryMuscles.forEach((muscle) => {
    const slug = MUSCLE_TO_SLUG_MAP[muscle.toLowerCase().trim()];
    if (slug && !partsMap.has(slug)) {
      partsMap.set(slug, 1);
    }
  });

  const highlightData: HighlightedMusclePart[] = Array.from(
    partsMap.entries()
  ).map(([slug, intensity]) => ({
    slug,
    intensity,
  }));

  // Detect whether to default to posterior ('back') or anterior ('front')
  const isBackDominant = primaryMuscles.some((m) =>
    BACK_DOMINANT_MUSCLES.has(m.toLowerCase().trim())
  );

  return {
    highlightData,
    defaultSide: isBackDominant ? 'back' : 'front',
  };
}

/**
 * Returns full CDN URL for Free Exercise DB demonstration images
 */
export function getExerciseImageUrl(imagePath?: string): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Free Exercise DB images via fast jsDelivr CDN
  return `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/${imagePath}`;
}
