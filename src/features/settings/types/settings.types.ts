export type WeightUnit = 'KG' | 'LBS';
export type HeightUnit = 'CM' | 'FT';
export type DistanceUnit = 'KM' | 'MI';

export interface UserSettings {
  autoStartTimer: boolean;
  hapticCues: boolean;
  shareToFeed: boolean;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  distanceUnit: DistanceUnit;
}
