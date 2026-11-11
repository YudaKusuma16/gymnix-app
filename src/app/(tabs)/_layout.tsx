
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from '@/utils/haptics';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 6;
  const tabHeight = 54 + (insets.bottom > 0 ? insets.bottom : 6);

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync();
        },
      }}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#000000' },
        tabBarActiveTintColor: '#BE3144',
        tabBarInactiveTintColor: '#8A8F9E',

        tabBarBackground: () => (
          <BlurView
            intensity={80}
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
          backgroundColor: 'rgba(18, 20, 26, 0.85)',

          borderWidth: 0,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 0,

          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
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
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
          lineHeight: 12,
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={21}
              color={focused ? '#BE3144' : '#8A8F9E'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'barbell' : 'barbell-outline'}
              size={22}
              color={focused ? '#BE3144' : '#8A8F9E'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Assistant',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
              size={21}
              color={focused ? '#BE3144' : '#8A8F9E'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="gyms"
        options={{
          title: 'Gyms',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'location' : 'location-outline'}
              size={21}
              color={focused ? '#BE3144' : '#8A8F9E'}
            />
          ),
        }}
      />



      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={21}
              color={focused ? '#BE3144' : '#8A8F9E'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
