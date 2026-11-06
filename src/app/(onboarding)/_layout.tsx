import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="gender" />
      <Stack.Screen name="measurements" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="experience" />
    </Stack>
  );
}
