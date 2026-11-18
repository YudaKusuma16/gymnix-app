import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from '@/utils/haptics';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActiveWorkoutFloatingBar } from '@/features/workout/components/ActiveWorkoutFloatingBar';

function TabIcon({
  name,
  focused,
  size = 20,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  size?: number;
}) {
  return (
    <View style={[styles.iconPill, focused ? styles.iconPillActive : null]}>
      <Ionicons
        name={name}
        size={size}
        color={focused ? '#E63950' : '#71717A'}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 8;
  const tabHeight = 58 + bottomPadding;

  return (
      <View style={styles.rootContainer}>
      <Tabs
        screenListeners={{
          tabPress: () => {
            Haptics.selectionAsync();
          },
        }}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: '#000000' },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#71717A',

          tabBarBackground: () => (
            <BlurView
              intensity={85}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ),

          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: tabHeight,
            paddingTop: 6,
            paddingBottom: bottomPadding,
            backgroundColor: 'rgba(10, 10, 13, 0.92)',
            borderWidth: 0,
            borderTopWidth: 1,
            borderTopColor: '#1C1C22',
            elevation: 16,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.45,
            shadowRadius: 12,
          },

          tabBarItemStyle: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 2,
          },

          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 0.2,
            marginTop: 3,
            lineHeight: 12,
            marginBottom: 0,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? 'home' : 'home-outline'}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? 'barbell' : 'barbell-outline'}
                focused={focused}
                size={21}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="assistant"
          options={{
            title: 'Assistant',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={
                  focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'
                }
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="gyms"
          options={{
            title: 'Gyms',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? 'location' : 'location-outline'}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? 'person' : 'person-outline'}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <ActiveWorkoutFloatingBar bottomOffset={tabHeight + 10} />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  iconPill: {
    width: 38,
    height: 26,
    borderRadius: 9,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    backgroundColor: 'rgba(190, 49, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.32)',
  },
});
