import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from '@/utils/haptics';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendation?: string;
  timestamp: string;
}

let nextId = 10;
function createId() {
  nextId += 1;
  return String(nextId);
}

function getCurrentTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const tabHeight = 54 + (insets.bottom > 0 ? insets.bottom : 6);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hey Alex! Great job on your Push Day session yesterday. Barbell bench velocity was consistent across all 3 sets.',
      recommendation: 'Recommendation: Add +2.5 kg to top set.',
      timestamp: '10:42 AM',
    },
    {
      id: '2',
      sender: 'user',
      text: 'Should I increase weight on Incline Dumbbell Press next session?',
      timestamp: '10:45 AM',
    },
    {
      id: '3',
      sender: 'ai',
      text: 'Yes! Based on your RPE 7 last session, recovery score is 94%. Increase each DB by +2 kg (from 28 kg to 30 kg).',
      recommendation: 'Target 3 sets of 8 reps before overload.',
      timestamp: '10:46 AM',
    },
  ]);

  const suggestedActions = [
    {
      id: 'alt-db',
      icon: 'bulb-outline' as const,
      iconType: 'ionicons' as const,
      prompt: 'Suggest alternative for DB Press',
    },
    {
      id: 'chest-volume',
      icon: 'bar-chart-2' as const,
      iconType: 'feather' as const,
      prompt: 'Analyze my weekly chest volume',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: createId(),
      sender: 'user',
      text,
      timestamp: `${getCurrentTime()} • Read`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulated contextual AI response
    setTimeout(() => {
      let aiReply = "I've analyzed your question based on your recent lifting history and muscular fatigue metrics.";
      let recommendation = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('alternative') || lower.includes('db press')) {
        aiReply = "Top alternatives for Incline DB Press to target the clavicular head:\n1. 30° Incline Smith Machine Press (great stability)\n2. Low-to-High Cable Flyes (continuous tension)\n3. Landmine Chest Press (shoulder-friendly).";
        recommendation = "Recommendation: Try 30° Incline Smith Press next session.";
      } else if (lower.includes('volume') || lower.includes('chest')) {
        aiReply = "Your current weekly chest volume is 14 direct sets across 2 sessions (Bench Press: 6 sets, Incline DB: 4 sets, Dips/Flyes: 4 sets). Hypertrophy stimulus is optimal with 0 recovery deficit.";
        recommendation = "Recommendation: Maintain 14 sets; add volume only if stall lasts >2 weeks.";
      } else if (lower.includes('1rm') || lower.includes('bench')) {
        aiReply = "Estimated 1RM for Barbell Flat Bench Press is currently 104 kg based on 82.5 kg × 8 reps at RPE 8.5.";
        recommendation = "Recommendation: Test new top set at 85 kg next week.";
      }

      const aiMsg: Message = {
        id: createId(),
        sender: 'ai',
        text: aiReply,
        recommendation,
        timestamp: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 850);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      {/* 1. Header (matches Figma) */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1F1F1F]">
        <View>
          <Text className="text-white text-xl font-bold tracking-tight">Gym Assistant</Text>
          <Text className="text-[#71717A] text-xs mt-0.5">Your personal training assistant</Text>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Notifications Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-[#121212] border border-[#27272A] items-center justify-center">
            <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>

        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: tabHeight + 85,
          }}
          className="flex-1">
          {/* Messages Stream */}
          {messages.map((item) => {
            if (item.sender === 'ai') {
              return (
                <View key={item.id} className="mb-4 max-w-[92%]">
                  {/* Coach Identity Header */}
                  <View className="flex-row items-center gap-1.5 mb-1.5">
                    <Ionicons name="sparkles" size={14} color="#BE3144" />
                    <Text className="text-white text-xs font-bold tracking-tight">
                      Gymnix AI Coach
                    </Text>
                  </View>

                  {/* Coach Message Card */}
                  <View className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-4">
                    <Text className="text-[#E2E2E2] text-sm leading-5">
                      {item.text}
                    </Text>

                    {/* Recommendation text without separate box */}
                    {item.recommendation && (
                      <Text className="text-[#BE3144] text-sm leading-5 mt-2 font-medium">
                        {item.recommendation}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }

            // User Message
            return (
              <View key={item.id} className="mb-4 items-end self-end max-w-[85%]">
                <View className="bg-[#121212] border border-[#27272A] rounded-2xl px-4 py-3">
                  <Text className="text-white text-sm leading-5">{item.text}</Text>
                </View>
                <Text className="text-[#71717A] text-[10px] mt-1 pr-1 font-medium">
                  {item.timestamp.replace(/ • Read|Read/g, '').trim()}
                </Text>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <View className="mb-4 max-w-[90%]">
              <View className="flex-row items-center gap-1.5 mb-1.5">
                <MaterialCommunityIcons name="brain" size={14} color="#BE3144" />
                <Text className="text-white text-xs font-bold">Gymnix AI Coach</Text>
              </View>
              <View className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl px-4 py-3 flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-[#BE3144] animate-pulse" />
                <Text className="text-[#71717A] text-xs">Analyzing training telemetry...</Text>
              </View>
            </View>
          )}

          {/* SUGGESTED ACTIONS (matches Figma) */}
          <View className="mt-4 mb-2">
            <Text className="text-[#71717A] text-xs font-semibold tracking-wider uppercase mb-2.5">
              SUGGESTED ACTIONS
            </Text>

            <View className="gap-2">
              {suggestedActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  activeOpacity={0.7}
                  onPress={() => handleSend(action.prompt)}
                  className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3.5 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <View className="w-8 h-8 rounded-lg bg-[#121212] border border-[#1F1F1F] items-center justify-center">
                      {action.iconType === 'ionicons' ? (
                        <Ionicons name={action.icon as any} size={16} color="#BE3144" />
                      ) : (
                        <Feather name={action.icon as any} size={15} color="#BE3144" />
                      )}
                    </View>
                    <Text className="text-white text-xs font-medium flex-1">
                      {action.prompt}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#71717A" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Message Composer (matches Figma) */}
        <View
          style={{
            bottom: tabHeight,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 10,
          }}
          className="absolute left-0 right-0 bg-[#000000]/95 border-t border-[#1F1F1F] px-4 py-2.5 flex-row items-center gap-2.5 backdrop-blur-md">
          <View className="flex-1 bg-[#0A0A0A] border border-[#1F1F1F] rounded-full px-4 py-2.5 flex-row items-center">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask AI Coach about exercises, PRs..."
              placeholderTextColor="#71717A"
              className="flex-1 text-white text-xs"
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
            />
          </View>

          <TouchableOpacity
            onPress={() => handleSend()}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-[#BE3144] items-center justify-center shadow-md">
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
