import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 12, stiffness: 90 });

    const timer = setTimeout(() => {
      router.replace('/(auth)/sign-in');
    }, 2000);

    return () => clearTimeout(timer);
  }, [opacity, scale, router]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleSkip = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <Pressable
      onPress={handleSkip}
      style={styles.container}
      className="flex-1 bg-black items-center justify-center">
      <Animated.View style={[animatedStyle, styles.center]}>
        <Image
          source={require('@/assets/images/gymnix-logo.png')}
          style={{ width: 234, height: 234 }}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
