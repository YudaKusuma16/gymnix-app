import React, { useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { GymFacility } from '@/features/gyms/types/gym.types';

const defaultGymImage = require('@/assets/images/gym-images.png');

export default function GymDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    rating?: string;
    reviewCount?: string;
    distance?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    openHours?: string;
    tel?: string;
    website?: string;
    imageUrl?: string;
    tags?: string;
    facilities?: string;
  }>();

  const [isSaved, setIsSaved] = useState(false);

  const gymName = params.name || "Gold's Gym - Sudirman";
  const gymRating = params.rating || '4.9';
  const gymReviews = params.reviewCount || '280';
  const gymDistance = params.distance || '0.8 km away';
  const gymAddress = params.address || 'Thamrin City, Jakarta Pusat';
  const gymHours = params.openHours || 'Open daily until 23:00';
  const gymTel = params.tel || '';
  const gymWebsite = params.website || '';
  const gymImage = params.imageUrl || '';

  let parsedTags: string[] = [];
  try {
    if (params.tags) {
      parsedTags = JSON.parse(params.tags);
    }
  } catch {
    parsedTags = ['Olympic Lifting', 'Sauna', 'Powerlifting'];
  }

  let parsedFacilities: GymFacility[] = [];
  try {
    if (params.facilities) {
      parsedFacilities = JSON.parse(params.facilities);
    }
  } catch {
    parsedFacilities = [];
  }

  const defaultFacilities: GymFacility[] = [
    {
      id: '1',
      icon: 'barbell-outline',
      iconType: 'ionicons',
      description: 'Eleiko Olympic Power Racks & Deadlift Platforms',
    },
    {
      id: '2',
      icon: 'dumbbell',
      iconType: 'material',
      description: 'Full Dumbbell Suite up to 60 kg & Calibrated Steel Plates',
    },
    {
      id: '3',
      icon: 'flame-outline',
      iconType: 'ionicons',
      description: 'Contrast Recovery Zone: Finnish Sauna & Ice Bath',
    },
    {
      id: '4',
      icon: 'time-outline',
      iconType: 'ionicons',
      description: gymHours,
    },
  ];

  const facilitiesList = parsedFacilities.length > 0 ? parsedFacilities : defaultFacilities;

  const toggleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSaved(!isSaved);
  };

  const handleGetDirections = () => {
    Haptics.selectionAsync();
    const destination =
      params.latitude && params.longitude
        ? `${params.latitude},${params.longitude}`
        : encodeURIComponent(gymAddress);

    const url = Platform.select({
      ios: `maps://app?daddr=${destination}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const handleCall = () => {
    if (!gymTel) return;
    Haptics.selectionAsync();
    const cleanTel = gymTel.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanTel}`).catch(() => {});
  };

  const handleOpenWebsite = () => {
    if (!gymWebsite) return;
    Haptics.selectionAsync();
    let url = gymWebsite;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {gymName}
          </Text>
        </View>

        {/* Favorite / Save Gym Heart */}
        <TouchableOpacity
          onPress={toggleSave}
          activeOpacity={0.7}
          style={styles.saveButton}>
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={20}
            color={isSaved ? '#BE3144' : '#71717A'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollBody,
          { paddingBottom: insets.bottom + 90 },
        ]}>
        {/* 2. Gym Overview Card */}
        <View style={styles.overviewCard}>
          {/* Hero Interior Image */}
          <View style={styles.heroImageSlot}>
            <Image
              source={gymImage ? { uri: gymImage } : defaultGymImage}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* Details below image */}
          <View style={styles.overviewBody}>
            <Text style={styles.gymTitle}>{gymName}</Text>

            <View style={styles.sublineRow}>
              <Text style={styles.hoursText}>{gymHours}</Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={13} color="#BE3144" />
                <Text style={styles.ratingPillText}>
                  {gymRating} ({gymReviews})
                </Text>
              </View>
            </View>

            <Text style={styles.addressText}>{gymAddress}</Text>

            {/* Amenity / Category Tags */}
            {parsedTags.length > 0 && (
              <View style={styles.tagsRow}>
                {parsedTags.map((tag, idx) => (
                  <View key={idx} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Quick Action Buttons (Call / Website) */}
            <View style={styles.quickActionsRow}>
              {gymTel ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={handleCall}
                  style={styles.quickActionBtn}>
                  <Ionicons name="call-outline" size={15} color="#BE3144" />
                  <Text style={styles.quickActionText}>Call</Text>
                </TouchableOpacity>
              ) : null}

              {gymWebsite ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={handleOpenWebsite}
                  style={styles.quickActionBtn}>
                  <Ionicons name="globe-outline" size={15} color="#BE3144" />
                  <Text style={styles.quickActionText}>Website</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleGetDirections}
                style={styles.quickActionBtn}>
                <Ionicons name="navigate-outline" size={15} color="#BE3144" />
                <Text style={styles.quickActionText}>Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Location Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>LOCATION & VICINITY</Text>

          {/* Stylized Map View Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleGetDirections}
            style={styles.mapCard}>
            <Image
              source={require('@/assets/images/gym-map.png')}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />

            {/* Pulsing Pin Overlay */}
            <View style={styles.mapPin}>
              <Ionicons name="location" size={22} color="#FFFFFF" />
            </View>

            {/* Bottom Address Pill */}
            <View style={styles.mapAddressPill}>
              <Ionicons name="navigate-outline" size={12} color="#A1A1AA" />
              <Text style={styles.mapAddressText} numberOfLines={1}>
                {gymAddress}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Facilities & Equipment Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>FACILITIES & EQUIPMENT</Text>

          <View style={styles.facilitiesCard}>
            {facilitiesList.map((fac, idx) => (
              <View
                key={fac.id || idx}
                style={[
                  styles.facilityRow,
                  idx === facilitiesList.length - 1 && styles.lastFacilityRow,
                ]}>
                <View style={styles.facilityIconBox}>
                  {fac.iconType === 'material' ? (
                    <MaterialCommunityIcons
                      name={fac.icon as any}
                      size={18}
                      color="#BE3144"
                    />
                  ) : (
                    <Ionicons name={fac.icon as any} size={18} color="#BE3144" />
                  )}
                </View>
                <Text style={styles.facilityDesc}>{fac.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 5. Sticky Bottom Action Button */}
      <View
        style={[
          styles.bottomDock,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 16 },
        ]}>
        <TouchableOpacity
          onPress={handleGetDirections}
          activeOpacity={0.88}
          style={styles.directionsCta}>
          <Ionicons name="map-outline" size={18} color="#FFFFFF" />
          <Text style={styles.directionsCtaText}>
            Get Directions ({gymDistance})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181A',
    backgroundColor: '#000000',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
  },
  saveButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  overviewCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1E1E22',
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroImageSlot: {
    width: '100%',
    height: 180,
    backgroundColor: '#141416',
    position: 'relative',
  },
  overviewBody: {
    padding: 16,
  },
  gymTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  sublineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hoursText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '500',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  ratingPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addressText: {
    color: '#71717A',
    fontSize: 12.5,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tagBadge: {
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#24242A',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 7,
    borderCurve: 'continuous',
  },
  tagText: {
    color: '#A1A1AA',
    fontSize: 10.5,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1E',
    paddingTop: 12,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 9,
    borderRadius: 10,
    borderCurve: 'continuous',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  mapCard: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#1E1E22',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#BE3144',
    borderWidth: 3,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#BE3144',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  mapAddressPill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(10, 10, 12, 0.92)',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapAddressText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  facilitiesCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1E1E22',
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#141416',
  },
  lastFacilityRow: {
    borderBottomWidth: 0,
  },
  facilityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityDesc: {
    color: '#D4D4D8',
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    borderTopWidth: 1,
    borderTopColor: '#18181A',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  directionsCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BE3144',
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingVertical: 14,
    gap: 8,
  },
  directionsCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
