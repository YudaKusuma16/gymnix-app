import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function RanksScreen() {
  const [scope, setScope] = useState<'Global' | 'Local'>('Global');
  const [selectedTier, setSelectedTier] = useState('Diamond');

  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

  const leaderboardData = [
    { rank: 4, name: 'Elena Rostova', gym: 'Titan Strength', volume: '53,420', trend: '+2', trendUp: true },
    { rank: 5, name: 'Liam Gallagher', gym: "Gold's Gym City", volume: '52,180', trend: '-1', trendUp: false },
    { rank: 6, name: 'Maya Lin', gym: 'Barbell Republic', volume: '51,900', trend: '+4', trendUp: true },
    { rank: 7, name: 'Tariq Thorne', gym: 'Krypton Fitness', volume: '50,850', trend: '-1', trendUp: false },
    { rank: 8, name: 'Chloe Dupont', gym: 'Metro Iron Club', volume: '49,700', trend: '+1', trendUp: true },
    { rank: 14, name: 'Alex Pratama (You)', gym: 'Iron District Metro Gym', volume: '48,250', trend: '+3', trendUp: true, isUser: true },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#000000' }}
      className="flex-1 bg-black">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#1F1F1F]">
        <Text className="text-white text-2xl font-bold tracking-tight">Ranks</Text>
        <View className="flex-row items-center bg-[#141414] px-3 py-1.5 rounded-full border border-[#27272A] gap-1.5">
          <Ionicons name="shield-checkmark" size={14} color="#BE3144" />
          <Text className="text-white text-xs font-bold">Diamond II</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 }}
        className="flex-1">
        
        {/* 1. User Pinned Rank Card */}
        <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#BE3144] relative overflow-hidden mb-5">
          <View className="absolute inset-0 bg-[#BE3144]/5" pointerEvents="none" />
          
          <View className="flex-row items-start justify-between mb-4">
            <View>
              <Text className="text-white text-lg font-bold">Alex Pratama</Text>
              <Text className="text-[#71717A] text-xs">Iron District Metro Gym</Text>
            </View>
            <View className="items-end">
              <Text className="text-[#BE3144] text-base font-extrabold">Diamond II</Text>
              <Text className="text-[#71717A] text-xs font-semibold">2,840 pts</Text>
            </View>
          </View>

          {/* Stats 3 Columns */}
          <View className="flex-row justify-between py-3 border-y border-[#1F1F1F] mb-4">
            <View>
              <Text className="text-[#71717A] text-[10px] font-bold uppercase">Current Rank</Text>
              <View className="flex-row items-baseline gap-1 mt-0.5">
                <Text className="text-white text-xl font-extrabold">#14</Text>
                <Text className="text-[#71717A] text-xs">/ 1.4k</Text>
              </View>
              <Text className="text-emerald-400 text-[10px] font-bold mt-0.5">+3 ranks</Text>
            </View>

            <View>
              <Text className="text-[#71717A] text-[10px] font-bold uppercase">Lifted Volume</Text>
              <View className="flex-row items-baseline gap-1 mt-0.5">
                <Text className="text-white text-xl font-extrabold">48.2k</Text>
                <Text className="text-[#71717A] text-xs">kg</Text>
              </View>
              <Text className="text-[#71717A] text-[10px] mt-0.5">5 sessions</Text>
            </View>

            <View>
              <Text className="text-[#71717A] text-[10px] font-bold uppercase">Zone Status</Text>
              <Text className="text-emerald-400 text-base font-extrabold mt-0.5">Active</Text>
              <Text className="text-emerald-400 text-[10px] font-bold mt-0.5">Safe (+4 spots)</Text>
            </View>
          </View>

          {/* Progress to next tier */}
          <View>
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-[#A1A1AA] text-xs font-medium">
                Progress to Diamond III
              </Text>
              <Text className="text-[#BE3144] text-xs font-bold">
                84% (360 pts away)
              </Text>
            </View>
            <View className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <View style={{ width: '84%' }} className="h-full bg-[#BE3144] rounded-full" />
            </View>
          </View>
        </View>

        {/* 2. Scope & Division Tier Chips */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row bg-[#0A0A0A] p-0.5 rounded-lg border border-[#1F1F1F]">
            <TouchableOpacity
              onPress={() => setScope('Global')}
              className={`px-3 py-1 rounded-md ${
                scope === 'Global' ? 'bg-[#BE3144]' : 'bg-transparent'
              }`}>
              <Text
                className={`text-xs font-bold ${
                  scope === 'Global' ? 'text-white' : 'text-[#71717A]'
                }`}>
                Global
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setScope('Local')}
              className={`px-3 py-1 rounded-md ${
                scope === 'Local' ? 'bg-[#BE3144]' : 'bg-transparent'
              }`}>
              <Text
                className={`text-xs font-bold ${
                  scope === 'Local' ? 'text-white' : 'text-[#71717A]'
                }`}>
                Local Gym
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-[#71717A] text-[11px] font-semibold">
            Bracket: 2,500 – 2,999 pts
          </Text>
        </View>

        {/* Tier Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-6">
          {tiers.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedTier(t)}
              className={`px-3 py-1.5 rounded-lg border mr-2 ${
                selectedTier === t
                  ? 'bg-[#141414] border-[#BE3144]'
                  : 'bg-[#0A0A0A] border-[#1F1F1F]'
              }`}>
              <Text
                className={`text-xs font-bold ${
                  selectedTier === t ? 'text-[#BE3144]' : 'text-[#71717A]'
                }`}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 3. Top 3 Podium */}
        <View className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1F1F1F] mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-base font-bold">Top 3 Podium</Text>
            <Text className="text-[#71717A] text-xs">Updated 12m ago</Text>
          </View>

          <View className="flex-row items-end justify-center gap-3 pt-4 pb-2">
            {/* Rank 2 (Left) */}
            <View className="flex-1 items-center">
              <View className="w-12 h-12 rounded-full bg-[#1E1E1E] border-2 border-zinc-400 items-center justify-center mb-2">
                <Text className="text-white text-sm font-black">2</Text>
              </View>
              <Text className="text-white text-xs font-bold" numberOfLines={1}>
                Sarah J.
              </Text>
              <Text className="text-[#71717A] text-[10px]" numberOfLines={1}>
                Apex Athletic
              </Text>
              <View className="h-24 w-full bg-[#141414] border border-[#27272A] rounded-t-xl mt-3 items-center justify-center">
                <Text className="text-white text-xs font-bold">58.1k</Text>
                <Text className="text-[#71717A] text-[9px] font-bold uppercase">KG VOL</Text>
              </View>
            </View>

            {/* Rank 1 (Center) */}
            <View className="flex-1 items-center -mt-4">
              <View className="w-14 h-14 rounded-full bg-[#BE3144]/20 border-2 border-[#BE3144] items-center justify-center mb-2 relative">
                <Ionicons name="trophy" size={24} color="#BE3144" />
                <View className="absolute -top-2 bg-[#BE3144] px-1.5 py-0.2 rounded-full">
                  <Text className="text-white text-[9px] font-black">#1</Text>
                </View>
              </View>
              <Text className="text-white text-xs font-extrabold" numberOfLines={1}>
                Marcus V.
              </Text>
              <Text className="text-[#71717A] text-[10px]" numberOfLines={1}>
                Olympus Club
              </Text>
              <View className="h-32 w-full bg-[#BE3144]/15 border border-[#BE3144] rounded-t-xl mt-3 items-center justify-center">
                <Text className="text-white text-sm font-extrabold">62.4k</Text>
                <Text className="text-[#BE3144] text-[9px] font-bold uppercase">3,450 PTS</Text>
              </View>
            </View>

            {/* Rank 3 (Right) */}
            <View className="flex-1 items-center">
              <View className="w-12 h-12 rounded-full bg-[#1E1E1E] border-2 border-amber-700 items-center justify-center mb-2">
                <Text className="text-white text-sm font-black">3</Text>
              </View>
              <Text className="text-white text-xs font-bold" numberOfLines={1}>
                David Chen
              </Text>
              <Text className="text-[#71717A] text-[10px]" numberOfLines={1}>
                Iron Vault
              </Text>
              <View className="h-20 w-full bg-[#141414] border border-[#27272A] rounded-t-xl mt-3 items-center justify-center">
                <Text className="text-white text-xs font-bold">54.9k</Text>
                <Text className="text-[#71717A] text-[9px] font-bold uppercase">KG VOL</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Full Leaderboard Table (Ranks 4 - 14) */}
        <View className="bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F] overflow-hidden">
          {/* Table Header */}
          <View className="flex-row items-center justify-between px-4 py-3 bg-[#121212] border-b border-[#1F1F1F]">
            <Text className="text-[#71717A] text-[10px] font-bold uppercase w-12">RANK</Text>
            <Text className="text-[#71717A] text-[10px] font-bold uppercase flex-1">ATHLETE</Text>
            <Text className="text-[#71717A] text-[10px] font-bold uppercase w-20 text-right">VOL (KG)</Text>
            <Text className="text-[#71717A] text-[10px] font-bold uppercase w-12 text-right">TREND</Text>
          </View>

          {/* Rows */}
          {leaderboardData.map((row) => (
            <View
              key={row.rank}
              className={`flex-row items-center justify-between px-4 py-3.5 border-b border-[#141414] ${
                row.isUser ? 'bg-[#BE3144]/10 border-l-2 border-l-[#BE3144]' : ''
              }`}>
              <Text
                className={`text-sm font-bold w-12 ${
                  row.isUser ? 'text-[#BE3144]' : 'text-white'
                }`}>
                #{row.rank}
              </Text>

              <View className="flex-1 pr-2">
                <Text
                  className={`text-xs font-bold ${
                    row.isUser ? 'text-[#BE3144]' : 'text-white'
                  }`}
                  numberOfLines={1}>
                  {row.name}
                </Text>
                <Text className="text-[#71717A] text-[10px]" numberOfLines={1}>
                  {row.gym}
                </Text>
              </View>

              <Text className="text-white text-xs font-bold w-20 text-right">
                {row.volume}
              </Text>

              <Text
                className={`text-xs font-bold w-12 text-right ${
                  row.trendUp ? 'text-emerald-400' : 'text-red-400'
                }`}>
                {row.trend}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
