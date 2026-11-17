import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from '@/utils/haptics';
import { profileService } from '@/features/profile/services/profileService';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form states
  const [fullName, setFullName] = useState('User');
  const [username, setUsername] = useState('@user');
  const [homeGym, setHomeGym] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [frequency, setFrequency] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Modals for Goal, Experience, Frequency
  const [activePicker, setActivePicker] = useState<'goal' | 'experience' | 'frequency' | null>(null);

  const goalOptions = [
    'Build Muscle',
    'Increase Strength',
    'Lose Fat / Cut',
    'Endurance',
  ];

  const experienceOptions = [
    'Beginner (< 1 yr)',
    'Intermediate (1–3 yrs)',
    'Advanced (3–5 yrs)',
    'Athlete (5+ yrs)',
  ];

  const frequencyOptions = [
    '3 Days / Week',
    '4 Days / Week',
    '5 Days / Week',
    '6 Days / Week',
  ];

  useEffect(() => {
    (async () => {
      try {
        const p = await profileService.getProfile();
        if (p.fullName) setFullName(p.fullName);
        if (p.username) setUsername(p.username);
        if (p.homeGym?.name && p.homeGym.name !== 'No Gym Selected') setHomeGym(p.homeGym.name);
        if (p.vitals.heightCm > 0) setHeight(p.vitals.heightCm.toString());
        if (p.vitals.weightKg > 0) setWeight(p.vitals.weightKg.toString());
        if (p.trainingProgram.primaryObjective && p.trainingProgram.primaryObjective !== '-') {
          setGoal(p.trainingProgram.primaryObjective);
        }
        if (p.trainingProgram.experienceLevel && p.trainingProgram.experienceLevel !== '-') {
          setExperience(p.trainingProgram.experienceLevel);
        }
        if (p.trainingProgram.frequency && p.trainingProgram.frequency !== '-') {
          setFrequency(p.trainingProgram.frequency);
        }
        if (p.avatarUrl) {
          setAvatarUri(p.avatarUrl);
        }
      } catch (e) {
        console.warn('[EditProfile] Error loading profile:', e);
      }
    })();
  }, []);

  const handlePickAvatar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error('[EditProfile] Error picking image:', e);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalAvatarPath: string | undefined = undefined;

      // If user selected a local file, upload it to Supabase Storage 'avatars'
      if (avatarUri && !avatarUri.startsWith('http')) {
        const publicUrl = await profileService.uploadProfileAvatar(avatarUri);
        if (publicUrl) {
          finalAvatarPath = publicUrl;
        }
      }

      await profileService.updateProfile({
        fullName,
        username,
        homeGym,
        bio,
        gender,
        height: parseFloat(height) || undefined,
        weight: parseFloat(weight) || undefined,
        goal,
        experience,
        frequency,
        avatarPath: finalAvatarPath,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      console.error('[EditProfile] Save error:', e);
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      {/* 1. Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#18181A] bg-black">
        <View className="flex-row items-center gap-2.5">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-9 h-9 items-center justify-center">
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-[17px] font-extrabold tracking-tight">
            Edit Profile
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.7}
          className="px-2 py-1">
          {isSaving ? (
            <ActivityIndicator size="small" color="#BE3144" />
          ) : (
            <Text className="text-[#BE3144] text-[15px] font-extrabold tracking-wide">
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 18,
            paddingBottom: insets.bottom + 40,
          }}
          className="flex-1">
          {/* Avatar Hub */}
          <View className="items-center py-2 mb-4">
            <View className="relative w-20 h-20 mb-2">
              <View
                className="w-full h-full rounded-2xl bg-[#141416] border-2 border-[#2E2E36] items-center justify-center overflow-hidden"
                style={styles.cardBorder}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                ) : (
                  <Text className="text-white text-2xl font-black">
                    {fullName.slice(0, 2).toUpperCase()}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePickAvatar}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#BE3144] border-2 border-black items-center justify-center">
                <Ionicons name="camera" size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickAvatar}>
              <Text className="text-[#BE3144] text-xs font-bold">
                Edit Picture
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section 1: Account & Bio */}
          <View className="mb-5">
            <Text className="text-[#71717A] text-[11px] font-extrabold tracking-wider uppercase mb-1.5 pl-1">
              ACCOUNT & BIO
            </Text>
            <View
              className="bg-[#121214] border border-[#1E1E22] rounded-2xl overflow-hidden"
              style={styles.cardBorder}>
              {/* Full Name */}
              <View className="flex-row items-center justify-between px-4 py-3 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold w-24">Full Name</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Name"
                  placeholderTextColor="#52525B"
                  className="flex-1 text-[#D4D4D8] text-[13.5px] text-right p-0"
                  selectionColor="#BE3144"
                />
              </View>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Username */}
              <View className="flex-row items-center justify-between px-4 py-3 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold w-24">Username</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="@username"
                  placeholderTextColor="#52525B"
                  className="flex-1 text-[#D4D4D8] text-[13.5px] text-right p-0"
                  selectionColor="#BE3144"
                  autoCapitalize="none"
                />
              </View>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Home Gym */}
              <View className="flex-row items-center justify-between px-4 py-3 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold w-24">Home Gym</Text>
                <TextInput
                  value={homeGym}
                  onChangeText={setHomeGym}
                  placeholder="Gym name"
                  placeholderTextColor="#52525B"
                  className="flex-1 text-[#D4D4D8] text-[13.5px] text-right p-0"
                  selectionColor="#BE3144"
                />
              </View>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Bio */}
              <View className="px-4 py-3">
                <Text className="text-white text-[13.5px] font-semibold mb-1">Bio</Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Describe your workout split and focus..."
                  placeholderTextColor="#52525B"
                  multiline
                  numberOfLines={2}
                  className="text-[#D4D4D8] text-xs leading-5 p-0"
                  selectionColor="#BE3144"
                />
              </View>
            </View>
          </View>

          {/* Section 2: Body Vitals */}
          <View className="mb-5">
            <Text className="text-[#71717A] text-[11px] font-extrabold tracking-wider uppercase mb-1.5 pl-1">
              BODY VITALS
            </Text>
            <View
              className="bg-[#121214] border border-[#1E1E22] rounded-2xl overflow-hidden"
              style={styles.cardBorder}>
              {/* Gender */}
              <View className="flex-row items-center justify-between px-4 py-2.5 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold">Gender</Text>
                <View className="flex-row bg-[#18181C] p-1 rounded-xl border border-[#26262B]">
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.selectionAsync();
                      setGender('Male');
                    }}
                    className={`px-3 py-1 rounded-lg ${gender === 'Male' ? 'bg-[#BE3144]' : 'bg-transparent'}`}>
                    <Text className={`text-xs font-bold ${gender === 'Male' ? 'text-white' : 'text-[#71717A]'}`}>
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Haptics.selectionAsync();
                      setGender('Female');
                    }}
                    className={`px-3 py-1 rounded-lg ${gender === 'Female' ? 'bg-[#BE3144]' : 'bg-transparent'}`}>
                    <Text className={`text-xs font-bold ${gender === 'Female' ? 'text-white' : 'text-[#71717A]'}`}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Age */}
              <View className="flex-row items-center justify-between px-4 py-3 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold">Age</Text>
                <View className="flex-row items-center gap-1.5">
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#52525B"
                    className="text-[#D4D4D8] text-[13.5px] text-right w-16 p-0"
                    style={styles.tabularNums}
                    selectionColor="#BE3144"
                  />
                  <Text className="text-[#71717A] text-xs font-semibold">yrs</Text>
                </View>
              </View>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Height */}
              <View className="flex-row items-center justify-between px-4 py-3 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold">Height</Text>
                <View className="flex-row items-center gap-1.5">
                  <TextInput
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#52525B"
                    className="text-[#D4D4D8] text-[13.5px] text-right w-16 p-0"
                    style={styles.tabularNums}
                    selectionColor="#BE3144"
                  />
                  <Text className="text-[#71717A] text-xs font-semibold">cm</Text>
                </View>
              </View>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Weight */}
              <View className="flex-row items-center justify-between px-4 py-3 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold">Current Weight</Text>
                <View className="flex-row items-center gap-1.5">
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                    placeholderTextColor="#52525B"
                    className="text-[#D4D4D8] text-[13.5px] text-right w-16 p-0"
                    style={styles.tabularNums}
                    selectionColor="#BE3144"
                  />
                  <Text className="text-[#71717A] text-xs font-semibold">kg</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section 3: Training Setup */}
          <View className="mb-6">
            <Text className="text-[#71717A] text-[11px] font-extrabold tracking-wider uppercase mb-1.5 pl-1">
              TRAINING SETUP
            </Text>
            <View
              className="bg-[#121214] border border-[#1E1E22] rounded-2xl overflow-hidden"
              style={styles.cardBorder}>
              {/* Primary Goal */}
              <TouchableOpacity
                onPress={() => setActivePicker('goal')}
                activeOpacity={0.7}
                className="flex-row items-center justify-between px-4 py-3.5 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold">Primary Goal</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[#A1A1AA] text-xs font-medium">{goal}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#71717A" />
                </View>
              </TouchableOpacity>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Experience */}
              <TouchableOpacity
                onPress={() => setActivePicker('experience')}
                activeOpacity={0.7}
                className="flex-row items-center justify-between px-4 py-3.5 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold">Experience</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[#A1A1AA] text-xs font-medium">{experience}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#71717A" />
                </View>
              </TouchableOpacity>

              <View className="h-[1px] bg-[#1A1A1E] ml-4" />

              {/* Frequency */}
              <TouchableOpacity
                onPress={() => setActivePicker('frequency')}
                activeOpacity={0.7}
                className="flex-row items-center justify-between px-4 py-3.5 min-h-[48px]">
                <Text className="text-white text-[13.5px] font-semibold">Frequency</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[#A1A1AA] text-xs font-medium">{frequency}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#71717A" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Options Picker Sheet */}
      {activePicker && (
        <View className="absolute inset-0 bg-black/70 justify-end z-50">
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setActivePicker(null)}
          />
          <View className="bg-[#121214] border-t border-[#26262A] rounded-t-3xl p-5 pb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-base font-bold capitalize">
                Select {activePicker}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <Ionicons name="close-circle" size={22} color="#71717A" />
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              {(activePicker === 'goal'
                ? goalOptions
                : activePicker === 'experience'
                ? experienceOptions
                : frequencyOptions
              ).map((opt) => {
                const isSelected =
                  activePicker === 'goal'
                    ? goal === opt
                    : activePicker === 'experience'
                    ? experience === opt
                    : frequency === opt;

                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.75}
                    onPress={() => {
                      Haptics.selectionAsync();
                      if (activePicker === 'goal') setGoal(opt);
                      if (activePicker === 'experience') setExperience(opt);
                      if (activePicker === 'frequency') setFrequency(opt);
                      setActivePicker(null);
                    }}
                    className={`p-3.5 rounded-xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-[#BE3144]/15 border-[#BE3144]'
                        : 'bg-[#18181B] border-[#27272A]'
                    }`}
                    style={styles.pillBorder}>
                    <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-[#A1A1AA]'}`}>
                      {opt}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color="#BE3144" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardBorder: {
    borderCurve: 'continuous',
  },
  pillBorder: {
    borderCurve: 'continuous',
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
});
