import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AthleteProfile } from '../types/profile.types';

interface ProfileHeroCardProps {
  profile: AthleteProfile;
  onEditPress: () => void;
  onGymPress: () => void;
}

export const ProfileHeroCard = React.memo(function ProfileHeroCard({
  profile,
  onEditPress,
  onGymPress,
}: ProfileHeroCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Background Subtle Gradient Accent */}
      <LinearGradient
        colors={['rgba(190, 49, 68, 0.15)', 'rgba(190, 49, 68, 0.03)', 'transparent']}
        locations={[0, 0.35, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.8 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Athlete Identity Row */}
      <View style={styles.identityRow}>
        {/* Avatar Ring */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#24242A', '#121214']}
            style={styles.avatarBackground}>
            <Text style={styles.avatarInitials}>{profile.initials}</Text>
          </LinearGradient>
          <View style={styles.activeStatusDot} />
        </View>

        {/* Name and Handle Info */}
        <View style={styles.infoCol}>
          <Text style={styles.athleteName}>{profile.fullName}</Text>
          <Text style={styles.usernameText}>{profile.username}</Text>

          {/* Home Gym Tag */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onGymPress}
            style={styles.gymChip}>
            <Ionicons name="location-sharp" size={12} color="#BE3144" />
            <Text style={styles.gymName} numberOfLines={1}>
              {profile.homeGym.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Action: Edit Profile */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onEditPress}
        style={styles.editBtn}>
        <Ionicons name="create-outline" size={15} color="#FFFFFF" />
        <Text style={styles.editBtnText}>Edit Profile & Vitals</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E22',
    borderCurve: 'continuous',
    padding: 18,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2E2E36',
    borderCurve: 'continuous',
    position: 'relative',
  },
  avatarBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 18.5,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  activeStatusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#0A0A0A',
  },
  infoCol: {
    flex: 1,
  },
  athleteName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  usernameText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  gymChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  gymName: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 11,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
