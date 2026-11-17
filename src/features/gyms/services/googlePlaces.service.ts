import { GymFacility, GymItem } from '@/features/gyms/types/gym.types';

const GOOGLE_PLACES_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby';

// Curated dark athletic gym photos for fallback if a place doesn't provide photos
const GYM_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
];

interface GooglePlaceLocation {
  latitude: number;
  longitude: number;
}

interface GooglePlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions?: {
    displayName: string;
    uri: string;
    photoUri: string;
  }[];
}

interface GooglePlaceOpeningHours {
  openNow?: boolean;
  weekdayDescriptions?: string[];
}

interface GooglePlace {
  id: string;
  displayName?: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: GooglePlaceLocation;
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: GooglePlaceOpeningHours;
  regularOpeningHours?: GooglePlaceOpeningHours;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  photos?: GooglePlacePhoto[];
  types?: string[];
}

/**
 * Calculates straight-line distance in meters using Haversine formula
 */
function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Fetch nearby gyms from Google Places API (New)
 */
export async function fetchNearbyGymsFromGooglePlaces(
  latitude: number,
  longitude: number,
  radiusMeters: number = 8000
): Promise<GymItem[]> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY?.trim();

  if (!apiKey) {
    console.warn('[Google Places] EXPO_PUBLIC_GOOGLE_PLACES_API_KEY is missing in .env');
    return [];
  }

  const payload = {
    includedTypes: ['gym', 'fitness_center'],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude,
          longitude,
        },
        radius: radiusMeters,
      },
    },
    rankPreference: 'DISTANCE',
  };

  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.rating',
    'places.userRatingCount',
    'places.currentOpeningHours',
    'places.regularOpeningHours',
    'places.nationalPhoneNumber',
    'places.internationalPhoneNumber',
    'places.websiteUri',
    'places.photos',
    'places.types',
  ].join(',');

  try {
    const response = await fetch(GOOGLE_PLACES_NEARBY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Google Places Error ${response.status}]`, errorText);
      throw new Error(`Google Places API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawPlaces: GooglePlace[] = data.places || [];

    return rawPlaces.map((place, index) => {
      const placeLat = place.location?.latitude;
      const placeLng = place.location?.longitude;

      // Calculate distance from user
      let distanceMeters = 0;
      if (placeLat !== undefined && placeLng !== undefined) {
        distanceMeters = calculateHaversineDistanceMeters(latitude, longitude, placeLat, placeLng);
      }
      const distKm = (distanceMeters / 1000).toFixed(1);

      // Extract photo URL if available
      let imageUrl = GYM_FALLBACK_IMAGES[index % GYM_FALLBACK_IMAGES.length];
      if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].name; // e.g. "places/{PLACE_ID}/photos/{PHOTO_ID}"
        imageUrl = `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=600&maxWidthPx=800&key=${apiKey}`;
      }

      // Rating & Reviews
      const rating = place.rating !== undefined ? place.rating.toFixed(1) : '4.5';
      const reviewCount = place.userRatingCount || 0;

      // Status Buka / Tutup
      const isOpenNow = place.currentOpeningHours?.openNow;
      let openHoursText = 'Hours not specified';
      if (isOpenNow === true) {
        openHoursText = 'Open Now';
      } else if (isOpenNow === false) {
        openHoursText = 'Closed';
      }

      // Check if open 24 hours
      const weekdayDescs =
        place.currentOpeningHours?.weekdayDescriptions ||
        place.regularOpeningHours?.weekdayDescriptions ||
        [];
      const is24Hours = weekdayDescs.some((desc) => desc.toLowerCase().includes('open 24 hours'));
      if (is24Hours) {
        openHoursText = 'Open 24 Hours';
      }

      // Deterministic badge
      let badge = `${distKm} KM`;
      if (is24Hours) {
        badge = '24/7';
      } else if (place.rating && place.rating >= 4.7) {
        badge = 'TOP RATED';
      } else if (index === 0) {
        badge = 'CLOSEST';
      }

      // Feature tags
      const tags: string[] = ['Gym', 'Free Weights'];
      if (is24Hours) tags.push('24/7 Access');
      if (place.rating && place.rating >= 4.6) tags.push('Top Rated');
      if (place.types?.includes('health')) tags.push('Recovery');

      // Facilities
      const facilities: GymFacility[] = [
        {
          id: '1',
          icon: 'barbell-outline',
          iconType: 'ionicons',
          description: 'Free Weights & Strength Equipment Area',
        },
        {
          id: '2',
          icon: 'dumbbell',
          iconType: 'material',
          description: 'Full Dumbbell & Resistance Machine Suite',
        },
        {
          id: '3',
          icon: 'time-outline',
          iconType: 'ionicons',
          description: is24Hours ? 'Open 24 Hours Access' : openHoursText,
        },
      ];

      if (place.formattedAddress) {
        facilities.push({
          id: '4',
          icon: 'location-outline',
          iconType: 'ionicons',
          description: place.formattedAddress,
        });
      }

      const formattedAddress = place.formattedAddress || 'Location available on map';

      return {
        id: place.id,
        name: place.displayName?.text || 'Fitness Center',
        rating,
        reviewCount,
        distance: `${distKm} km away`,
        distanceMeters,
        badge,
        tags,
        address: formattedAddress,
        formattedAddress,
        latitude: placeLat,
        longitude: placeLng,
        tel: place.nationalPhoneNumber || place.internationalPhoneNumber || '',
        website: place.websiteUri || '',
        imageUrl,
        facilities,
        openHours: openHoursText,
        isOpenNow: isOpenNow ?? true,
      };
    });
  } catch (error) {
    console.error('[fetchNearbyGymsFromGooglePlaces] Network error:', error);
    throw error;
  }
}

