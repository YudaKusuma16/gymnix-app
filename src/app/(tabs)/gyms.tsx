import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
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
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from '@/utils/haptics';
import { useGymList } from '@/features/gyms/hooks/useGymList';
import { GymItem } from '@/features/gyms/types/gym.types';

const defaultGymImage = require('@/assets/images/gym-images.png');

export default function GymsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    selectedFilter,
    selectFilter,
    searchQuery,
    setSearchQuery,
    filterChips,
    filteredGyms,
    loading,
    refreshing,
    onRefresh,
    locationName,
  } = useGymList();

  const handleGymPress = (gym: GymItem) => {
    Haptics.selectionAsync();
    router.push({
      pathname: '/gym-detail',
      params: {
        id: gym.id,
        name: gym.name,
        rating: gym.rating,
        reviewCount: gym.reviewCount?.toString() || '120',
        distance: gym.distance,
        address: gym.formattedAddress || gym.address,
        latitude: gym.latitude?.toString() || '',
        longitude: gym.longitude?.toString() || '',
        openHours: gym.openHours || 'Open 06:00 – 23:00',
        tel: gym.tel || '',
        website: gym.website || '',
        imageUrl: gym.imageUrl || '',
        tags: JSON.stringify(gym.tags || []),
        facilities: JSON.stringify(gym.facilities || []),
      },
    });
  };

  const featuredGym = filteredGyms.length > 0 ? filteredGyms[0] : null;
  const nearbyGymsList = filteredGyms.length > 1 ? filteredGyms.slice(1) : filteredGyms;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gyms</Text>
          <Text style={styles.headerSubtitle}>NEARBY ATHLETIC CENTERS</Text>
        </View>

        {/* Live Location Indicator */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onRefresh}
          style={styles.locationPill}>
          <Ionicons name="location-sharp" size={13} color="#BE3144" />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationName}
          </Text>
          <Ionicons name="refresh" size={12} color="#71717A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#BE3144"
            colors={['#BE3144']}
          />
        }
        contentContainerStyle={[
          styles.scrollBody,
          { paddingBottom: insets.bottom + 88 },
        ]}>
        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color="#71717A" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search gym by name, brand, or area..."
            placeholderTextColor="#52525B"
            style={styles.searchInput}
            selectionColor="#BE3144"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#71717A" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}>
          {filterChips.map((chip) => {
            const isSelected = selectedFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                onPress={() => selectFilter(chip)}
                activeOpacity={0.7}
                style={[
                  styles.filterChip,
                  isSelected ? styles.filterChipActive : styles.filterChipInactive,
                ]}>
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected ? styles.filterChipTextActive : styles.filterChipTextInactive,
                  ]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Loading Spinner */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#BE3144" />
            <Text style={styles.loadingText}>Locating nearby fitness centers...</Text>
          </View>
        ) : filteredGyms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={44} color="#3F3F46" />
            <Text style={styles.emptyTitle}>No gyms found nearby</Text>
            <Text style={styles.emptyDesc}>
              Try adjusting your search query, clearing filters, or pulling down to refresh GPS location.
            </Text>
          </View>
        ) : (
          <>
            {/* Featured Gym Banner (Top closest result) */}
            {featuredGym && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleGymPress(featuredGym)}
                style={styles.featuredCard}>
                <View style={styles.featuredImageSlot}>
                  <Image
                    source={featuredGym.imageUrl ? { uri: featuredGym.imageUrl } : defaultGymImage}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    transition={250}
                  />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.25)', 'transparent', 'rgba(10,10,10,0.96)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>CLOSEST GYM</Text>
                  </View>
                  <View style={styles.featuredOpenBadge}>
                    <Text style={styles.featuredOpenText}>Live FSQ</Text>
                  </View>
                </View>

                <View style={styles.featuredBody}>
                  <View style={styles.featuredTitleRow}>
                    <Text style={styles.featuredName} numberOfLines={1}>
                      {featuredGym.name}
                    </Text>
                    <Text style={styles.featuredDistance}>{featuredGym.distance}</Text>
                  </View>

                  <Text style={styles.featuredAddress} numberOfLines={1}>
                    {featuredGym.formattedAddress || featuredGym.address}
                  </Text>

                  <View style={styles.tagsRow}>
                    {featuredGym.tags.map((amenity, i) => (
                      <View key={i} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.featuredCta}>
                    <Text style={styles.featuredCtaText}>View Gym Profile & Facilities</Text>
                    <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* Nearby Gyms Section Header */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Nearby Gyms</Text>
              <View style={styles.resultsBadge}>
                <Text style={styles.resultsBadgeText}>
                  {nearbyGymsList.length} Found
                </Text>
              </View>
            </View>

            {/* Gyms List */}
            <View style={styles.gymList}>
              {nearbyGymsList.map((gym) => (
                <TouchableOpacity
                  key={gym.id}
                  activeOpacity={0.8}
                  onPress={() => handleGymPress(gym)}
                  style={styles.gymCard}>
                  {/* Left: Thumbnail Photo with Badge */}
                  <View style={styles.thumbSlot}>
                    <Image
                      source={gym.imageUrl ? { uri: gym.imageUrl } : defaultGymImage}
                      style={StyleSheet.absoluteFill}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={styles.thumbBadge}>
                      <Text style={styles.thumbBadgeText}>{gym.badge}</Text>
                    </View>
                  </View>

                  {/* Right: Gym Information */}
                  <View style={styles.gymInfoCol}>
                    <View>
                      {/* Name & Star Rating */}
                      <View style={styles.gymNameRow}>
                        <Text style={styles.gymName} numberOfLines={1}>
                          {gym.name}
                        </Text>
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={12} color="#BE3144" />
                          <Text style={styles.ratingText}>{gym.rating}</Text>
                        </View>
                      </View>

                      {/* Distance & Address */}
                      <Text style={styles.gymSubline} numberOfLines={1}>
                        {gym.distance}
                      </Text>

                      {/* Feature Tags */}
                      <View style={styles.tagsRow}>
                        {gym.tags.slice(0, 2).map((tag, idx) => (
                          <View key={idx} style={styles.tagBadge}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Details Action Button */}
                    <View style={styles.detailsRow}>
                      <Text style={styles.openHoursText}>{gym.openHours}</Text>
                      <View style={styles.detailsBtn}>
                        <Text style={styles.detailsBtnText}>Details</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#18181A',
    backgroundColor: '#000000',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    color: '#71717A',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#24242A',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    gap: 6,
    maxWidth: 160,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
    flexShrink: 1,
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1E1E22',
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    padding: 0,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterScrollContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#BE3144',
    borderColor: '#BE3144',
  },
  filterChipInactive: {
    backgroundColor: '#0A0A0A',
    borderColor: '#1E1E22',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextInactive: {
    color: '#71717A',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#71717A',
    fontSize: 12.5,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  emptyDesc: {
    color: '#71717A',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
  featuredCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1E1E22',
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: 20,
  },
  featuredImageSlot: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#141416',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#BE3144',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  featuredOpenBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  featuredOpenText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  featuredBody: {
    padding: 16,
  },
  featuredTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  featuredName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  featuredDistance: {
    color: '#BE3144',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredAddress: {
    color: '#71717A',
    fontSize: 12,
    marginBottom: 12,
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
  featuredCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BE3144',
    paddingVertical: 12,
    borderRadius: 12,
    borderCurve: 'continuous',
    gap: 6,
  },
  featuredCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  resultsBadge: {
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#24242A',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  resultsBadgeText: {
    color: '#71717A',
    fontSize: 10.5,
    fontWeight: '700',
  },
  gymList: {
    gap: 12,
  },
  gymCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1E1E22',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 12,
    flexDirection: 'row',
  },
  thumbSlot: {
    width: 95,
    height: 95,
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#141416',
  },
  thumbBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  thumbBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  gymInfoCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  gymNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  gymName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  gymSubline: {
    color: '#71717A',
    fontSize: 11.5,
    fontWeight: '500',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  openHoursText: {
    color: '#52525B',
    fontSize: 10.5,
    fontWeight: '500',
  },
  detailsBtn: {
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#24242A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  detailsBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
