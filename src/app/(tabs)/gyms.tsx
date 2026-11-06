import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function GymsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterChips = [
    'All',
    'Nearest (< 3 km)',
    'Open Now',
    'Free Weights',
    '24/7 Access',
  ];

  const gymsList = [
    {
      id: '1',
      name: 'Pandawa Gym',
      rating: '4.9',
      distance: '1.4 km • Kuningan',
      badge: '24/7',
      tags: ['Olympic Lifting', 'Sauna', 'Ice Bath'],
    },
    {
      id: '2',
      name: 'Olympus Gym',
      rating: '4.8',
      distance: 'Sudirman • Open until 22:00',
      badge: '2.1 KM',
      tags: ['Calisthenics', 'Powerlifting', 'Monolift'],
    },
    {
      id: '3',
      name: 'Apex Athletic Club',
      rating: '4.7',
      distance: 'Senopati • Open until 23:30',
      badge: '3.5 KM',
      tags: ['CrossFit', 'Recovery Zone'],
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000000' }}
      className="flex-1 bg-black">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#1F1F1F]">
        <Text className="text-white text-2xl font-bold tracking-tight">Gyms</Text>

        {/* Location Selector */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center bg-[#141414] px-3 py-1.5 rounded-full border border-[#27272A] gap-1.5">
          <Ionicons name="location-sharp" size={14} color="#BE3144" />
          <Text className="text-white text-xs font-semibold">Central Jakarta</Text>
          <Text className="text-[#BE3144] text-[10px] font-bold">• Change</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 }}
        className="flex-1">
        
        {/* Search Input Bar */}
        <View className="flex-row items-center bg-[#0A0A0A] rounded-xl px-4 py-3 border border-[#1F1F1F] mb-4">
          <Ionicons name="search-outline" size={18} color="#71717A" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search gym, brand, or area..."
            placeholderTextColor="#52525B"
            className="flex-1 text-white text-sm ml-2.5 p-0"
            selectionColor="#BE3144"
          />
        </View>

        {/* Filter Chips Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-6">
          {filterChips.map((chip) => (
            <TouchableOpacity
              key={chip}
              onPress={() => setSelectedFilter(chip)}
              className={`px-3.5 py-1.5 rounded-lg border mr-2 ${
                selectedFilter === chip
                  ? 'bg-[#BE3144] border-[#BE3144]'
                  : 'bg-[#0A0A0A] border-[#1F1F1F]'
              }`}>
              <Text
                className={`text-xs font-bold ${
                  selectedFilter === chip ? 'text-white' : 'text-[#71717A]'
                }`}>
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Gym Banner */}
        <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1F1F1F] relative overflow-hidden mb-6">
          <View className="absolute inset-0 bg-[#BE3144]/5" pointerEvents="none" />
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-xl font-extrabold">{"Gold's Gym"}</Text>
              <View className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Text className="text-emerald-400 text-[10px] font-bold">Open</Text>
              </View>
            </View>
            <Text className="text-[#BE3144] text-xs font-bold">0.8 km away</Text>
          </View>

          <Text className="text-[#71717A] text-xs mb-4">
            0.8 km away • Open until 23:00
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {['Eleiko Plates', 'Dumbbells up to 60kg', 'Power Racks (x6)'].map(
              (amenity, i) => (
                <View
                  key={i}
                  className="bg-[#141414] px-2.5 py-1.5 rounded-lg border border-[#27272A]">
                  <Text className="text-[#A1A1AA] text-xs font-medium">{amenity}</Text>
                </View>
              )
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row items-center justify-center bg-[#BE3144] py-3 rounded-xl gap-2 active:bg-[#A32837]">
            <Text className="text-white font-bold text-sm">View Gym Profile</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Nearby Gyms Section */}
        <View className="mb-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-bold">Nearby Gyms</Text>
            <Text className="text-[#71717A] text-xs font-semibold">3 Closest</Text>
          </View>

          {/* Gyms List */}
          <View className="gap-3.5">
            {gymsList.map((gym) => (
              <View
                key={gym.id}
                className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#1F1F1F]">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 pr-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-white text-base font-bold">
                        {gym.name}
                      </Text>
                      <View className="flex-row items-center gap-0.5">
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text className="text-white text-xs font-bold">
                          {gym.rating}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-[#71717A] text-xs mt-0.5">
                      {gym.distance}
                    </Text>
                  </View>

                  <View className="bg-[#141414] px-2.5 py-1 rounded-lg border border-[#27272A]">
                    <Text className="text-[#BE3144] text-[10px] font-bold">
                      {gym.badge}
                    </Text>
                  </View>
                </View>

                {/* Tags */}
                <View className="flex-row flex-wrap gap-1.5 my-2">
                  {gym.tags.map((tag, idx) => (
                    <View
                      key={idx}
                      className="bg-[#141414] px-2 py-0.5 rounded-md border border-[#27272A]">
                      <Text className="text-[#71717A] text-[10px]">{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Footer Action */}
                <View className="flex-row items-center justify-end mt-2 pt-2 border-t border-[#141414]">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1">
                    <Text className="text-[#BE3144] text-xs font-bold">Details</Text>
                    <Ionicons name="chevron-forward" size={14} color="#BE3144" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
