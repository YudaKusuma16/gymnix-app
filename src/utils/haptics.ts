import * as ExpoHaptics from 'expo-haptics';
import { Platform } from 'react-native';

export const NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;
export const ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;

export async function notificationAsync(
  type: ExpoHaptics.NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType.Success
): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      // notificationAsync can throw UnavailabilityError on certain Android versions/emulators
      await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      return;
    }
    await ExpoHaptics.notificationAsync(type).catch(async () => {
      await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium).catch(() => {});
    });
  } catch {
    // Fail silently on unsupported hardware
  }
}

export async function impactAsync(
  style: ExpoHaptics.ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle.Medium
): Promise<void> {
  try {
    await ExpoHaptics.impactAsync(style).catch(() => {});
  } catch {
    // Fail silently
  }
}

export async function selectionAsync(): Promise<void> {
  try {
    await ExpoHaptics.selectionAsync().catch(() => {});
  } catch {
    // Fail silently
  }
}

export const Haptics = {
  notificationAsync,
  impactAsync,
  selectionAsync,
  NotificationFeedbackType,
  ImpactFeedbackStyle,
};

export default Haptics;
