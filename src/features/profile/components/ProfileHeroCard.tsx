import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { AthleteProfile } from '../types/profile.types';

interface ProfileHeroCardProps {
  profile: AthleteProfile;
  isAuthenticated?: boolean;
  onEditPress: () => void;
  onGymPress: () => void;
  onSharePress?: () => void;
  onSignInPress?: () => void;
}

export const ProfileHeroCard = React.memo(function ProfileHeroCard({
  profile,
  isAuthenticated,
  onEditPress,
  onGymPress,
  onSharePress,
  onSignInPress,
}: ProfileHeroCardProps) {
  const avatarUri = profile.avatarUrl;
  const isAuth = isAuthenticated ?? Boolean(profile.id);

  return (
    <View style={styles.cardContainer}>
      {/* Background Subtle Gradient Accent */}
      <LinearGradient
        colors={['rgba(190, 49, 68, 0.16)', 'rgba(190, 49, 68, 0.03)', 'transparent']}
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
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <LinearGradient
              colors={['#24242A', '#121214']}
              style={styles.avatarBackground}>
              <Text style={styles.avatarInitials}>{profile.initials}</Text>
            </LinearGradient>
          )}
          <View style={styles.activeStatusDot} />
        </View>

        {/* Name and Handle Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameBadgeRow}>
            <Text style={styles.athleteName}>{profile.fullName || 'User'}</Text>
            {profile.memberSince ? (
              <View style={styles.sinceBadge}>
                <Text style={styles.sinceBadgeText}>SINCE {profile.memberSince}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.usernameText}>{profile.username || '@user'}</Text>

          {/* Home Gym Tag */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onGymPress}
            style={styles.gymChip}>
            <Ionicons name="location-sharp" size={12} color="#BE3144" />
            <Text style={styles.gymName} numberOfLines={1}>
              {profile.homeGym?.name || 'No Gym Selected'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Guest Mode: Sign In to Sync CTA */}
      {!isAuth && onSignInPress && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSignInPress}
          style={styles.signInSyncBtn}
          accessibilityRole="button"
          accessibilityLabel="Sign In to Sync">
          <LinearGradient
            colors={['#BE3144', '#991B28']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signInSyncGradient}>
            <View style={styles.syncIconWrap}>
              <Ionicons name="cloud-upload-outline" size={17} color="#FFFFFF" />
            </View>
            <View style={styles.syncTextWrap}>
              <Text style={styles.syncTitle}>Sign In to Sync</Text>
              <Text style={styles.syncSubtitle}>Save workouts & track personal records</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Action Buttons Row: Edit Profile & Share Passport */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onEditPress}
          style={styles.editBtn}>
          <Ionicons name="create-outline" size={14} color="#FFFFFF" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        {onSharePress && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSharePress}
            style={styles.shareBtn}>
            <Ionicons name="share-outline" size={14} color="#BE3144" />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#141414',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#222226',
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2E2E36',
    borderCurve: 'continuous',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18.5,
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
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#141414',
    zIndex: 2,
  },
  infoCol: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  athleteName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sinceBadge: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#26262E',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
  },
  sinceBadgeText: {
    color: '#A1A1AA',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  usernameText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  gymChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    marginTop: 5,
  },
  gymName: {
    color: '#D4D4D8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  signInSyncBtn: {
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 12,
  },
  signInSyncGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  syncIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncTextWrap: {
    flex: 1,
  },
  syncTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  syncSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10.5,
    fontWeight: '500',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1F1F24',
    borderWidth: 1,
    borderColor: '#2C2C34',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 9,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'rgba(190, 49, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.28)',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
