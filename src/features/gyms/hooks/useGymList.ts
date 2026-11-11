import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import * as Haptics from '@/utils/haptics';
import { GymItem } from '../types/gym.types';
import { fetchNearbyGymsFromFoursquare } from '@/services/foursquare.service';

const DEFAULT_LATITUDE = -6.2088;
const DEFAULT_LONGITUDE = 106.8456;

export const GYM_FILTER_CHIPS = [
  'All',
  'Nearest (< 3 km)',
  'Open Now',
  'Free Weights',
  '24/7 Access',
];

export function useGymList() {
  const [gyms, setGyms] = useState<GymItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState<string>('Central Jakarta');
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  // Helper to resolve coordinates safely without crashing if emulator GPS is unavailable
  const resolveCoordinates = async (): Promise<{ lat: number; lng: number; name: string }> => {
    let lat = DEFAULT_LATITUDE;
    let lng = DEFAULT_LONGITUDE;
    let name = 'Central Jakarta';

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermissionDenied(false);

        // Try getting last known position first (fastest and most reliable on emulators)
        const lastKnown = await Location.getLastKnownPositionAsync().catch(() => null);
        if (lastKnown) {
          lat = lastKnown.coords.latitude;
          lng = lastKnown.coords.longitude;
        } else {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          }).catch(() => null);

          if (current) {
            lat = current.coords.latitude;
            lng = current.coords.longitude;
          }
        }

        try {
          const geocoded = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: lng,
          });
          if (geocoded && geocoded.length > 0) {
            const first = geocoded[0];
            name = first.city || first.subregion || first.region || 'Nearby Area';
          }
        } catch {
          name = 'Current Location';
        }
      } else {
        setPermissionDenied(true);
        name = 'Jakarta Pusat (Default)';
      }
    } catch (locErr) {
      console.warn('[useGymList] GPS reading failed, falling back to default:', locErr);
      name = 'Jakarta Pusat';
    }

    return { lat, lng, name };
  };

  const fetchLiveGyms = useCallback(async () => {
    try {
      const { lat, lng, name } = await resolveCoordinates();
      setLocationName(name);

      const liveGyms = await fetchNearbyGymsFromFoursquare(lat, lng, 10000);
      setGyms(liveGyms);
    } catch (error) {
      console.error('[useGymList] Error loading gyms:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      try {
        const { lat, lng, name } = await resolveCoordinates();
        const liveGyms = await fetchNearbyGymsFromFoursquare(lat, lng, 10000);

        if (!ignore) {
          setLocationName(name);
          setGyms(liveGyms);
        }
      } catch (err) {
        console.error('[useGymList] Init error:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, []);

  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    fetchLiveGyms();
  }, [fetchLiveGyms]);

  const selectFilter = (chip: string) => {
    Haptics.selectionAsync();
    setSelectedFilter(chip);
  };

  const filteredGyms = useMemo(() => {
    let list = [...gyms];

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.address.toLowerCase().includes(q) ||
          g.formattedAddress.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedFilter !== 'All') {
      if (selectedFilter === '24/7 Access') {
        list = list.filter((g) => g.badge === '24/7' || g.openHours?.includes('24'));
      } else if (selectedFilter === 'Nearest (< 3 km)') {
        list = list.filter((g) => {
          if (g.distanceMeters !== undefined) {
            return g.distanceMeters <= 3000;
          }
          const num = parseFloat(g.distance);
          return !isNaN(num) && num < 3.0;
        });
      } else if (selectedFilter === 'Open Now') {
        list = list.filter((g) => g.isOpenNow !== false);
      } else if (selectedFilter === 'Free Weights') {
        list = list.filter((g) =>
          g.tags.some((t) =>
            ['free weights', 'powerlifting', 'olympic lifting', 'monolift'].includes(t.toLowerCase())
          )
        );
      }
    }

    return list;
  }, [gyms, searchQuery, selectedFilter]);

  return {
    gyms,
    filteredGyms,
    loading,
    refreshing,
    onRefresh,
    selectedFilter,
    selectFilter,
    searchQuery,
    setSearchQuery,
    filterChips: GYM_FILTER_CHIPS,
    locationName,
    permissionDenied,
    refreshGyms: fetchLiveGyms,
  };
}
