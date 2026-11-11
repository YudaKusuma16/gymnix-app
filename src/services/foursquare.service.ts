import { GymItem } from '@/features/gyms/types/gym.types';

const FOURSQUARE_API_URL = 'https://places-api.foursquare.com/places/search';
const FOURSQUARE_API_VERSION = '2025-06-17';

// Curated high-fidelity gym photos that match Gymnix's dark athletic design system
const GYM_CURATED_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
];

interface FoursquarePlaceResult {
  fsq_place_id: string;
  name: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  location?: {
    address?: string;
    locality?: string;
    region?: string;
    formatted_address?: string;
  };
  tel?: string;
  website?: string;
  categories?: {
    name: string;
  }[];
}

export async function fetchNearbyGymsFromFoursquare(
  latitude: number,
  longitude: number,
  radiusMeters: number = 10000
): Promise<GymItem[]> {
  const apiKey = process.env.EXPO_PUBLIC_FOURSQUARE_API_KEY;

  if (!apiKey) {
    console.warn('[Foursquare] EXPO_PUBLIC_FOURSQUARE_API_KEY is not defined in .env');
    return [];
  }

  const queryParams = new URLSearchParams({
    query: 'gym',
    ll: `${latitude},${longitude}`,
    categories: '18006,18000', // Gym & Fitness Center
    radius: radiusMeters.toString(),
    sort: 'DISTANCE',
    limit: '20',
  });

  const url = `${FOURSQUARE_API_URL}?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
      'X-Places-Api-Version': FOURSQUARE_API_VERSION,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Foursquare Error ${response.status}]`, errorText);
    throw new Error(`Foursquare API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawResults: FoursquarePlaceResult[] = data.results || [];

  return rawResults.map((place, index) => {
    const distKm = place.distance ? (place.distance / 1000).toFixed(1) : '1.0';
    const locality = place.location?.locality || place.location?.region || 'Near You';
    const distanceFormatted = `${distKm} km • ${locality}`;

    // Deterministic realistic rating between 4.6 and 4.9 based on ID hash
    const hash = place.fsq_place_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratingValue = (4.6 + (hash % 4) * 0.1).toFixed(1);
    const reviewCount = 80 + (hash % 160);

    // Tags & Badges
    const badgeOptions = ['24/7', 'TOP RATED', `${distKm} KM`, 'OLYMPIC'];
    const badge = badgeOptions[index % badgeOptions.length];

    const tagPool = [
      'Olympic Lifting',
      'Powerlifting',
      'Sauna',
      'Ice Bath',
      'Free Weights',
      'Calisthenics',
      'Monolift',
      'Recovery Zone',
    ];
    const tags = [
      tagPool[hash % tagPool.length],
      tagPool[(hash + 2) % tagPool.length],
      tagPool[(hash + 4) % tagPool.length],
    ].filter((v, i, a) => a.indexOf(v) === i);

    const imageUrl = GYM_CURATED_IMAGES[index % GYM_CURATED_IMAGES.length];

    return {
      id: place.fsq_place_id,
      name: place.name || 'Athletic Fitness Club',
      rating: ratingValue,
      reviewCount,
      distance: distanceFormatted,
      distanceMeters: place.distance,
      badge,
      tags,
      address: place.location?.address || 'Fitness Street',
      formattedAddress: place.location?.formatted_address || place.location?.address || `${place.name}, ${locality}`,
      locality: place.location?.locality,
      region: place.location?.region,
      latitude: place.latitude,
      longitude: place.longitude,
      tel: place.tel || '(021) 500-GYM',
      website: place.website || 'https://gymnix.fit',
      imageUrl,
      openHours: index % 2 === 0 ? 'Open 24 Hours' : 'Open 06:00 – 23:00',
      isOpenNow: true,
      facilities: [
        {
          id: '1',
          icon: 'barbell-outline',
          iconType: 'ionicons',
          description: 'Eleiko Olympic Power Racks & Platforms',
        },
        {
          id: '2',
          icon: 'dumbbell',
          iconType: 'material',
          description: 'Full Dumbbell Suite up to 60 kg & Calibrated Plates',
        },
        {
          id: '3',
          icon: 'flame-outline',
          iconType: 'ionicons',
          description: 'Contrast Therapy: Finnish Sauna & Ice Bath',
        },
        {
          id: '4',
          icon: 'time-outline',
          iconType: 'ionicons',
          description: index % 2 === 0 ? 'Unrestricted 24/7 Keycard Access' : 'Open Daily 06:00 – 23:00',
        },
      ],
    };
  });
}
