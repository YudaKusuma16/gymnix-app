export interface AthleteProfile {
  id: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  initials: string;
  memberSince: string;
  tier: 'Athlete' | 'Pro Athlete' | 'Coach';
  homeGym: {
    id: string;
    name: string;
    distance?: string;
  };
  vitals: {
    heightCm: number;
    weightKg: number;
    weightDeltaWk: number;
    bmi: number;
    bmiStatus: string;
    calorieCap: number;
    calorieMode: string;
    currentStreakDays: number;
    bestStreakDays: number;
  };
  personalRecords: {
    wilksScore: number;
    totalVolumeKg: number;
    squatKg: number;
    squatDate: string;
    benchKg: number;
    benchDate: string;
    isBenchPr: boolean;
    deadliftKg: number;
    deadliftDate: string;
  };
  trainingProgram: {
    primaryObjective: string;
    frequency: string;
    splitType: string;
    experienceLevel: string;
  };
}
