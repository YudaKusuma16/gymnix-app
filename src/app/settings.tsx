import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { useSettings } from '@/features/settings/hooks/useSettings';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    autoStartTimer,
    setAutoStartTimer,
    hapticCues,
    setHapticCues,
    shareToFeed,
    setShareToFeed,
    weightUnit,
    setWeightUnit,
    heightUnit,
    setHeightUnit,
    distanceUnit,
    setDistanceUnit,
    handleSignOut,
    goBack,
  } = useSettings();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Header (matches z-Html screen-header) */}
      <View style={styles.screenHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      {/* 2. Scrollable Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}>

        {/* Top Profile Snapshot Card */}
        <View style={styles.profileSnapshotCard}>
          <View style={styles.profileSnapshotLeft}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarText}>AP</Text>
            </View>
            <View>
              <Text style={styles.userNameLine}>Alex Pratama</Text>
              <Text style={styles.userSubline}>Iron District Metro Gym</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/edit-profile');
            }}
            activeOpacity={0.75}
            style={styles.editPillBtn}>
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* WORKOUT EXPERIENCE */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupHeader}>WORKOUT EXPERIENCE</Text>
          <View style={styles.settingsCardBox}>
            {/* Auto-Start Rest Timer */}
            <View style={styles.settingItemRow}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="timer-outline" size={18} color="#A1A1AA" />
                <View>
                  <Text style={styles.settingLabel}>Auto-Start Rest Timer</Text>
                  <Text style={styles.settingDesc}>
                    Counts down when a set is checked
                  </Text>
                </View>
              </View>
              <Switch
                value={autoStartTimer}
                onValueChange={(val) => {
                  Haptics.selectionAsync();
                  setAutoStartTimer(val);
                }}
                trackColor={{ false: '#27272A', true: '#BE3144' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Haptic & Beep Cues */}
            <View style={styles.settingItemRow}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="volume-high-outline" size={18} color="#A1A1AA" />
                <View>
                  <Text style={styles.settingLabel}>Haptic & Beep Cues</Text>
                  <Text style={styles.settingDesc}>
                    Vibrate on timer completion
                  </Text>
                </View>
              </View>
              <Switch
                value={hapticCues}
                onValueChange={(val) => {
                  Haptics.selectionAsync();
                  setHapticCues(val);
                }}
                trackColor={{ false: '#27272A', true: '#BE3144' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Share to Public Feed */}
            <View style={[styles.settingItemRow, styles.lastRow]}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="share-social-outline" size={18} color="#A1A1AA" />
                <View>
                  <Text style={styles.settingLabel}>Share to Public Feed</Text>
                  <Text style={styles.settingDesc}>
                    Let followers cheer on PRs
                  </Text>
                </View>
              </View>
              <Switch
                value={shareToFeed}
                onValueChange={(val) => {
                  Haptics.selectionAsync();
                  setShareToFeed(val);
                }}
                trackColor={{ false: '#27272A', true: '#BE3144' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* UNITS & MEASUREMENTS */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupHeader}>UNITS & MEASUREMENTS</Text>
          <View style={styles.settingsCardBox}>
            {/* Weight Unit */}
            <View style={styles.settingItemRow}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="scale-outline" size={18} color="#A1A1AA" />
                <Text style={styles.settingLabel}>Weight</Text>
              </View>
              <View style={styles.unitPillGroup}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setWeightUnit('KG');
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.unitPillBtn,
                    weightUnit === 'KG' && styles.unitPillBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.unitPillText,
                      weightUnit === 'KG' && styles.unitPillTextActive,
                    ]}>
                    KG
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setWeightUnit('LBS');
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.unitPillBtn,
                    weightUnit === 'LBS' && styles.unitPillBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.unitPillText,
                      weightUnit === 'LBS' && styles.unitPillTextActive,
                    ]}>
                    LBS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Height Unit */}
            <View style={styles.settingItemRow}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="resize-outline" size={18} color="#A1A1AA" />
                <Text style={styles.settingLabel}>Height</Text>
              </View>
              <View style={styles.unitPillGroup}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setHeightUnit('CM');
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.unitPillBtn,
                    heightUnit === 'CM' && styles.unitPillBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.unitPillText,
                      heightUnit === 'CM' && styles.unitPillTextActive,
                    ]}>
                    CM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setHeightUnit('FT');
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.unitPillBtn,
                    heightUnit === 'FT' && styles.unitPillBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.unitPillText,
                      heightUnit === 'FT' && styles.unitPillTextActive,
                    ]}>
                    FT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Distance Unit */}
            <View style={[styles.settingItemRow, styles.lastRow]}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="map-outline" size={18} color="#A1A1AA" />
                <Text style={styles.settingLabel}>Cardio Distance</Text>
              </View>
              <View style={styles.unitPillGroup}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setDistanceUnit('KM');
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.unitPillBtn,
                    distanceUnit === 'KM' && styles.unitPillBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.unitPillText,
                      distanceUnit === 'KM' && styles.unitPillTextActive,
                    ]}>
                    KM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setDistanceUnit('MI');
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.unitPillBtn,
                    distanceUnit === 'MI' && styles.unitPillBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.unitPillText,
                      distanceUnit === 'MI' && styles.unitPillTextActive,
                    ]}>
                    MI
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* ACCOUNT & SECURITY */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupHeader}>ACCOUNT & SECURITY</Text>
          <View style={styles.settingsCardBox}>
            {/* Notifications */}
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                Alert.alert('Notifications', 'Notification preferences configured.');
              }}
              activeOpacity={0.7}
              style={styles.settingItemRow}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="notifications-outline" size={18} color="#A1A1AA" />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
            </TouchableOpacity>

            {/* Connected Apps */}
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                Alert.alert('Connected Apps', 'Apple Health, Strava connected.');
              }}
              activeOpacity={0.7}
              style={styles.settingItemRow}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="link-outline" size={18} color="#A1A1AA" />
                <Text style={styles.settingLabel}>Connected Apps</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
            </TouchableOpacity>

            {/* Privacy & Security */}
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                Alert.alert('Privacy & Data', 'Your telemetry and biometric logs are securely encrypted on device.');
              }}
              activeOpacity={0.7}
              style={[styles.settingItemRow, styles.lastRow]}>
              <View style={styles.settingInfoLeft}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#A1A1AA" />
                <Text style={styles.settingLabel}>Privacy & Security</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version & Sign Out Button */}
        <View style={styles.footerSection}>
          <Text style={styles.versionText}>
            Gymnix v1.0.4 (Build 88) • Progressive Overload Engine
          </Text>

          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.8}
            style={styles.signOutBtn}>
            <Ionicons name="log-out-outline" size={18} color="#BE3144" />
            <Text style={styles.signOutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  profileSnapshotCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSnapshotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarMini: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: '#141416',
    borderWidth: 1.5,
    borderColor: '#2E2E36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userNameLine: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userSubline: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  editPillBtn: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  editPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsGroup: {
    flexDirection: 'column',
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 4,
  },
  settingsCardBox: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#161618',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingDesc: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 1,
  },
  unitPillGroup: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 999,
    padding: 2,
  },
  unitPillBtn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  unitPillBtnActive: {
    backgroundColor: '#BE3144',
  },
  unitPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
  },
  unitPillTextActive: {
    color: '#FFFFFF',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  versionText: {
    fontSize: 11,
    color: '#52525B',
  },
  signOutBtn: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(190, 49, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.35)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  signOutBtnText: {
    color: '#BE3144',
    fontSize: 14,
    fontWeight: '700',
  },
});
