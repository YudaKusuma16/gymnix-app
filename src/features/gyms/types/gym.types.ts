export interface GymFacility {
  id: string;
  icon: string;
  iconType: 'ionicons' | 'material';
  description: string;
}

export interface GymItem {
  id: string;
  name: string;
  rating: string;
  reviewCount?: number;
  distance: string;
  distanceMeters?: number;
  badge: string;
  tags: string[];
  address: string;
  formattedAddress: string;
  locality?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  tel?: string;
  website?: string;
  imageUrl?: string;
  facilities?: GymFacility[];
  openHours?: string;
  isOpenNow?: boolean;
}
