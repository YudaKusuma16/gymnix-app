import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from '@/utils/haptics';
import React, { useEffect, useRef, useState } from 'react';
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
import { profileService } from '@/features/profile/services/profileService';
import { workoutService } from '@/features/workout/services/workoutService';
import { exerciseService } from '@/features/exercises/services/exerciseService';
import type { ExerciseItem } from '@/features/exercises/types/exercise.types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendation?: string;
  timestamp: string;
  isError?: boolean;
}

let nextId = 10;
function createId() {
  nextId += 1;
  return `msg_${Date.now()}_${nextId}`;
}

function getCurrentTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(fallback);
      });
  });
}

function isOffTopicOrMathQuery(query: string): boolean {
  const lower = query.toLowerCase().trim();
  const fitnessKeywords =
    /\b(set|rep|repetisi|kg|lbs|bench|squat|deadlift|press|curl|row|pull|push|leg|back|chest|shoulder|bicep|tricep|abs|perut|dada|punggung|bahu|kaki|lengan|otot|muscle|gym|workout|latihan|kalori|kcal|protein|diet|cutting|bulking|berat|tinggi|bmi|pr|1rm|rpe|rest|istirahat|cardio|lari|plank|dumbbell|barbell|cable|machine|gymnix|profil|jadwal|split|hypertrophy|strength)\b/i;

  if (fitnessKeywords.test(lower)) {
    return false;
  }

  if (/(?:^|\s)\d+\s*[x*+/:-]\s*\d+(?:\s|$|\?)/i.test(lower)) {
    return true;
  }

  if (
    /\b(matematika|matremitka|mtk|aljabar|kalkulus|trigonometri|fisika|kimia|sejarah|politik|presiden|ibu kota|ibukota|coding|pemrograman|javascript|python|html|css|resep kue|puisi|cerpen)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  return false;
}

let cachedExercisesMemory: ExerciseItem[] = [];
let cachedBaseContextMemory = '';
let lastContextFetchTime = 0;

async function buildDatabaseContext(userQuery: string): Promise<string> {
  const now = Date.now();

  try {
    if (!cachedBaseContextMemory || now - lastContextFetchTime > 20000) {
      const [profile, milestones, history, plans, allExercises] =
        await Promise.all([
          withTimeout(
            profileService.getProfile(),
            2500,
            profileService as any
          ),
          withTimeout(
            profileService.getLifetimeMilestones(),
            2000,
            { totalTonnageTon: 0, totalWorkouts: 0, totalHours: 0 }
          ),
          withTimeout(workoutService.getWorkoutHistory(10), 2000, []),
          withTimeout(workoutService.getWorkoutPlans(), 2000, []),
          cachedExercisesMemory.length > 0
            ? Promise.resolve(cachedExercisesMemory)
            : withTimeout(
                exerciseService.getAll(),
                2500,
                exerciseService.getCachedSync()
              ),
        ]);

      if (Array.isArray(allExercises) && allExercises.length > 0) {
        cachedExercisesMemory = allExercises;
      }

      const sections: string[] = [];

      if (profile && profile.vitals) {
        const bmi =
          profile.vitals.heightCm > 0 && profile.vitals.weightKg > 0
            ? (
                profile.vitals.weightKg /
                Math.pow(profile.vitals.heightCm / 100, 2)
              ).toFixed(1)
            : '-';

        sections.push(
          [
            '=== ATHLETE PROFILE (FROM DATABASE) ===',
            `- Name: ${profile.fullName || 'Athlete'} (${profile.username || '@user'})`,
            `- Height: ${profile.vitals.heightCm ? `${profile.vitals.heightCm} cm` : 'Not set'}`,
            `- Weight: ${profile.vitals.weightKg ? `${profile.vitals.weightKg} kg` : 'Not set'} (BMI: ${bmi})`,
            `- Primary Goal / Objective: ${profile.trainingProgram?.primaryObjective || 'Not set'}`,
            `- Experience Level: ${profile.trainingProgram?.experienceLevel || 'Not set'}`,
            `- Training Frequency Target: ${profile.trainingProgram?.frequency || 'Not set'}`,
            `- Home Gym: ${profile.homeGym?.name || 'Not set'}`,
          ].join('\n')
        );

        const prLines: string[] = [];
        if (profile.personalRecords?.squatKg > 0) {
          prLines.push(`- Squat PR: ${profile.personalRecords.squatKg} kg`);
        }
        if (profile.personalRecords?.benchKg > 0) {
          prLines.push(`- Bench Press PR: ${profile.personalRecords.benchKg} kg`);
        }
        if (profile.personalRecords?.deadliftKg > 0) {
          prLines.push(`- Deadlift PR: ${profile.personalRecords.deadliftKg} kg`);
        }

        sections.push(
          [
            '=== PERSONAL RECORDS (FROM DATABASE) ===',
            prLines.length > 0
              ? prLines.join('\n')
              : '- No personal records logged yet.',
          ].join('\n')
        );
      }

      const activeSession = workoutService.getActiveSession();
      const historyLines: string[] = [
        `- Total Completed Workouts: ${milestones.totalWorkouts}`,
        `- Lifetime Volume Lifted: ${milestones.totalTonnageTon} tons (${milestones.totalHours} hours)`,
      ];

      if (activeSession) {
        const activeSets = workoutService.getSessionSets(activeSession.id);
        const setDesc =
          activeSets.length > 0
            ? activeSets
                .map((s) => {
                  const exName = s.logId.split('_log_')[1] || 'Exercise';
                  return `${exName} Set #${s.setNumber}: ${s.weightKg}kg x ${s.reps} (${s.completed ? 'done' : 'pending'})`;
                })
                .join('; ')
            : 'No sets logged yet';
        historyLines.push(
          `- Currently Active Session: "${activeSession.title || 'Workout'}" | Sets: ${setDesc}`
        );
      }

      if (history && history.length > 0) {
        historyLines.push('- Recent Completed Sessions:');
        for (const sess of history.slice(0, 6)) {
          const dateStr = sess.started_at
            ? new Date(sess.started_at).toISOString().split('T')[0]
            : '-';
          const durMin = Math.max(
            1,
            Math.round((Number(sess.duration_seconds) || 0) / 60)
          );
          const volKg = Number(sess.total_volume_kg) || 0;
          historyLines.push(
            `  • [${dateStr}] "${sess.title || 'Workout'}" — ${durMin} min, Volume: ${volKg} kg${sess.notes ? ` (${sess.notes})` : ''}`
          );
        }
      } else {
        historyLines.push('- No completed workout sessions recorded yet.');
      }

      if (plans && plans.length > 0) {
        historyLines.push(
          `- Saved Workout Plans: ${plans.map((p: any) => p.name).join(', ')}`
        );
      }

      sections.push(
        ['=== WORKOUT HISTORY & STATS (FROM DATABASE) ===', ...historyLines].join(
          '\n'
        )
      );

      cachedBaseContextMemory = sections.join('\n\n');
      lastContextFetchTime = now;
    }

    const exercises =
      cachedExercisesMemory.length > 0
        ? cachedExercisesMemory
        : exerciseService.getCachedSync();

    let catalogSection = '';
    if (exercises.length > 0) {
      const muscleAliasMap: Record<string, string[]> = {
        perut: ['abdominals', 'abs', 'core'],
        abs: ['abdominals', 'core'],
        core: ['abdominals', 'lower back'],
        punggung: ['lats', 'middle back', 'lower back', 'traps', 'back'],
        back: ['lats', 'middle back', 'lower back', 'traps'],
        dada: ['chest', 'pectorals'],
        chest: ['chest'],
        bahu: ['shoulders', 'delts', 'neck'],
        shoulder: ['shoulders'],
        kaki: ['quadriceps', 'hamstrings', 'calves', 'glutes', 'abductors', 'adductors'],
        leg: ['quadriceps', 'hamstrings', 'calves', 'glutes'],
        lengan: ['biceps', 'triceps', 'forearms'],
        tangan: ['biceps', 'triceps', 'forearms'],
        bicep: ['biceps'],
        tricep: ['triceps'],
        bokong: ['glutes'],
        betis: ['calves'],
      };

      const qLower = userQuery.toLowerCase();
      const targetSearchTerms = new Set<string>();
      for (const [key, mapped] of Object.entries(muscleAliasMap)) {
        if (qLower.includes(key)) {
          mapped.forEach((m) => targetSearchTerms.add(m));
        }
      }

      qLower
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length >= 3)
        .forEach((w) => targetSearchTerms.add(w));

      const termsArr = Array.from(targetSearchTerms);
      const matched =
        termsArr.length > 0
          ? exercises.filter((ex) => {
              const hay = `${ex.name} ${ex.category || ''} ${ex.equipment || ''} ${(ex.primary_muscles || []).join(' ')}`.toLowerCase();
              return termsArr.some((t) => hay.includes(t));
            })
          : [];

      const byMuscle = new Map<string, string[]>();
      for (const ex of exercises) {
        const m = ex.primary_muscles?.[0] || ex.category || 'general';
        const list = byMuscle.get(m) || [];
        if (list.length < 5) {
          list.push(`${ex.name} (${ex.equipment || 'bodyweight'})`);
          byMuscle.set(m, list);
        }
      }

      const catalogLines: string[] = [
        `=== GYMNIX EXERCISE DATABASE CATALOG (Total: ${exercises.length} exercises) ===`,
      ];

      if (matched.length > 0) {
        catalogLines.push(
          'Matching Exercises in Database for this request:',
          ...matched.slice(0, 20).map(
            (ex) =>
              `  • ${ex.name} [Equipment: ${ex.equipment || 'bodyweight'} | Target Muscles: ${(ex.primary_muscles || []).join(', ') || ex.category || '-'}]`
          )
        );
      }

      catalogLines.push('Sample Exercises by Muscle Group in Database:');
      for (const [muscle, items] of byMuscle.entries()) {
        catalogLines.push(`  • ${muscle}: ${items.join(', ')}`);
      }

      catalogSection = catalogLines.join('\n');
    }

    return [cachedBaseContextMemory, catalogSection].filter(Boolean).join('\n\n');
  } catch {
    return cachedBaseContextMemory || '';
  }
}

function renderFormattedText(rawText: string) {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((line, i) => {
    const numberedMatch = line.match(/^(\d+)[.)]\s+(.*)$/);
    const bulletMatch = line.match(/^[-•*]\s+(.*)$/);

    if (numberedMatch) {
      return (
        <View key={i} style={styles.listRow}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberBadgeText}>{numberedMatch[1]}</Text>
          </View>
          <Text style={styles.listRowText}>{numberedMatch[2]}</Text>
        </View>
      );
    }

    if (bulletMatch) {
      return (
        <View key={i} style={styles.listRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.listRowText}>{bulletMatch[1]}</Text>
        </View>
      );
    }

    return (
      <Text
        key={i}
        style={[
          styles.messageText,
          i < lines.length - 1 ? styles.paragraphSpacing : null,
        ]}>
        {line}
      </Text>
    );
  });
}

const DEFAULT_GREETING: Message = {
  id: '1',
  sender: 'ai',
  text: 'Halo! Saya siap membantu menyusun program latihan, memilih gerakan dari katalog database, dan mengevaluasi progres kamu.',
  recommendation:
    'Pilih topik di bawah atau ketik target otot yang ingin kamu latih hari ini.',
  timestamp: 'Now',
};

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const initialGreetingRef = useRef<Message>(DEFAULT_GREETING);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const tabHeight = 54 + (insets.bottom > 0 ? insets.bottom : 6);

  const [messages, setMessages] = useState<Message[]>([DEFAULT_GREETING]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        buildDatabaseContext('').catch(() => {});

        const [profile, history, milestones] = await Promise.all([
          profileService.getProfile(),
          workoutService.getWorkoutHistory(5),
          profileService.getLifetimeMilestones(),
        ]);
        if (!mounted) return;

        const name =
          profile.fullName &&
          profile.fullName !== 'User' &&
          profile.fullName !== 'Athlete'
            ? profile.fullName.split(' ')[0]
            : profileService.getCachedAthleteName() || 'Athlete';

        const vitalsInfo =
          profile.vitals.weightKg > 0 && profile.vitals.heightCm > 0
            ? `${profile.vitals.weightKg} kg • ${profile.vitals.heightCm} cm`
            : '';

        const goalInfo =
          profile.trainingProgram.primaryObjective &&
          profile.trainingProgram.primaryObjective !== '-'
            ? profile.trainingProgram.primaryObjective
            : '';

        const metaParts = [vitalsInfo, goalInfo].filter(Boolean).join(' • ');

        let workoutSummary = '';
        let initialRec =
          'Minta rekomendasi latihan hari ini sesuai profil dan peralatan yang tersedia.';

        if (history && history.length > 0) {
          const last = history[0];
          const lastVol = Number(last.total_volume_kg) || 0;
          workoutSummary = `\nSesi terakhir: ${last.title || 'Workout'} (${lastVol.toLocaleString()} kg • ${milestones.totalWorkouts} total sesi).`;
          initialRec = `Tanyakan menu latihan lanjutan setelah sesi ${last.title || 'Workout'} terakhir kamu.`;
        }

        const personalizedGreeting: Message = {
          id: '1',
          sender: 'ai',
          text: `Halo, ${name}.${metaParts ? ` [${metaParts}]` : ''}${workoutSummary}\n\nOtot atau program apa yang ingin kamu fokuskan hari ini?`,
          recommendation: initialRec,
          timestamp: getCurrentTime(),
        };

        initialGreetingRef.current = personalizedGreeting;

        setMessages((prev) => {
          if (prev.length !== 1 || prev[0].id !== '1') return prev;
          return [personalizedGreeting];
        });
      } catch {
        // keep default greeting
      }
    })();
    return () => {
      mounted = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const quickPrompts = [
    {
      id: 'today-split',
      label: 'Latihan Hari Ini',
      prompt: 'Rekomendasikan latihan hari ini sesuai data profil & riwayat saya',
    },
    {
      id: 'back-hypertrophy',
      label: 'Program Otot Back',
      prompt: 'Rekomendasikan latihan otot punggung (back) dari database untuk saya',
    },
    {
      id: 'abs-core',
      label: 'Latihan Otot Perut',
      prompt: 'Rekomendasikan latihan otot perut (abs) dari database untuk saya',
    },
    {
      id: 'chest-push',
      label: 'Program Chest',
      prompt: 'Rekomendasikan latihan otot dada (chest) dari database untuk saya',
    },
    {
      id: 'eval-progress',
      label: 'Evaluasi Progres',
      prompt: 'Evaluasi progres, volume latihan, dan PR saya dari database',
    },
  ];

  const handleResetChat = () => {
    Haptics.selectionAsync();
    abortControllerRef.current?.abort();
    requestIdRef.current += 1;
    setIsTyping(false);
    setMessages([
      {
        ...initialGreetingRef.current,
        timestamp: getCurrentTime(),
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    abortControllerRef.current?.abort();
    const currentReqId = ++requestIdRef.current;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: createId(),
      sender: 'user',
      text,
      timestamp: getCurrentTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);

    if (isOffTopicOrMathQuery(text)) {
      setIsTyping(false);
      const refusalMsg: Message = {
        id: createId(),
        sender: 'ai',
        text: 'Saya khusus membantu seputar program latihan gym, pemilihan gerakan, nutrisi kebugaran, dan fitur di aplikasi Gymnix. Pertanyaan matematika atau topik umum di luar kebugaran tidak dapat diproses.',
        recommendation:
          'Pilih salah satu topik latihan di bawah atau sebutkan target otot yang ingin kamu latih.',
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, refusalMsg]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 80);
      return;
    }

    setIsTyping(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
      if (!apiKey) {
        throw new Error('EXPO_PUBLIC_GEMINI_API_KEY belum diatur di file .env');
      }

      const dbContext = await withTimeout(
        buildDatabaseContext(text),
        3000,
        cachedBaseContextMemory
      );

      const recentSlice = updatedMessages.slice(-8);
      const normalizedHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      for (const msg of recentSlice) {
        const role = msg.sender === 'user' ? 'user' : 'model';
        const fullText = msg.recommendation
          ? `${msg.text}\nRekomendasi: ${msg.recommendation}`
          : msg.text;

        if (normalizedHistory.length === 0 && role === 'model') {
          continue;
        }

        const prevTurn = normalizedHistory[normalizedHistory.length - 1];
        if (prevTurn && prevTurn.role === role) {
          prevTurn.parts[0].text += `\n${fullText}`;
        } else {
          normalizedHistory.push({
            role,
            parts: [{ text: fullText }],
          });
        }
      }

      if (normalizedHistory.length === 0) {
        normalizedHistory.push({
          role: 'user',
          parts: [{ text }],
        });
      }

      const systemPrompt = [
        'You are Gymnix Coach, a direct, no-nonsense strength and hypertrophy coach built into the Gymnix app.',
        '',
        'STRICT DOMAIN GUARDRAILS (NON-NEGOTIABLE):',
        '1. ONLY answer questions directly related to gym workouts, exercises, strength, hypertrophy, calisthenics, mobility, recovery, body metrics/BMI, sports nutrition, or Gymnix app features.',
        '2. NEVER answer, solve, calculate, or explain ANY off-topic questions (such as math problems like "2x3", homework, coding, trivia, politics, or general topics). Do NOT answer first and pivot, and do NOT analogize math problems into sets/reps. Refuse immediately in 1 short sentence.',
        '',
        'GYMNIX APP FEATURES REFERENCE:',
        '- Home Tab: Weekly Volume bar chart, active workout resume banner, today’s recommended session.',
        '- Workout Tab: Start New Workout, browse Exercise Library (filter by muscle & equipment with Muscle Highlighter), log sets/kg/reps with rest timer.',
        '- Gyms Tab: GPS nearby gyms finder (Google Places & Foursquare).',
        '- Profile Tab: Athlete bio, Body Vitals (height, weight, BMI), Personal Records (SBD), Lifetime Stats, 12-week Consistency Heatmap, Settings.',
        '',
        'STYLE & FORMATTING RULES:',
        '1. Base all recommendations strictly on the user’s real database profile, PRs, workout history, and the "GYMNIX EXERCISE DATABASE CATALOG" below.',
        '2. When recommending exercises, ONLY pick exercise names from the "GYMNIX EXERCISE DATABASE CATALOG" below. Format exercise lists as numbered lines: "1. Exercise Name — 3 set x 8-12 rep (target/tip)".',
        '3. Write in clean, concise, direct language matching the user’s language (Indonesian or English). Do NOT use markdown bold (**), headers (#), or cheesy filler phrases.',
        '4. At the very end of your response, always include one separate final line starting with "Rekomendasi: " (or "Recommendation: ") containing one specific next action.',
        '',
        dbContext,
      ].join('\n');

      const candidateModels = [
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3.8-flash',
      ];

      let data: any = null;
      let lastErrorMsg = '';

      for (const modelName of candidateModels) {
        if (currentReqId !== requestIdRef.current) return;

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: normalizedHistory,
                generationConfig: {
                  temperature: 0.5,
                },
              }),
            }
          );

          clearTimeout(timeoutId);
          const json = await response.json();
          if (response.ok && json?.candidates?.length > 0) {
            data = json;
            break;
          }

          lastErrorMsg = json?.error?.message || `HTTP ${response.status}`;
        } catch (modelErr: any) {
          clearTimeout(timeoutId);
          lastErrorMsg =
            modelErr?.name === 'AbortError'
              ? 'Request timeout'
              : modelErr?.message || 'Network error';
        }
      }

      if (currentReqId !== requestIdRef.current) return;

      if (!data) {
        throw new Error(
          lastErrorMsg ||
            'Server sedang padat, silakan coba kirim ulang.'
        );
      }

      const parts: { text?: string; thought?: boolean }[] =
        data?.candidates?.[0]?.content?.parts || [];
      const rawReply =
        parts
          .filter((p) => !p.thought && typeof p.text === 'string')
          .map((p) => p.text)
          .join('\n')
          .trim() ||
        parts.find((p) => typeof p.text === 'string')?.text?.trim() ||
        'Maaf, belum dapat memproses permintaan tersebut.';

      const cleaned = rawReply.replace(/\*\*/g, '').replace(/^#+\s*/gm, '');
      const recMatch = cleaned.match(
        /\n*(?:Recommendation|Rekomendasi)\s*:\s*([^\n]+)$/i
      );

      const aiReply = recMatch
        ? cleaned.slice(0, recMatch.index).trim()
        : cleaned;
      const recommendation = recMatch ? recMatch[1].trim() : undefined;

      const aiMsg: Message = {
        id: createId(),
        sender: 'ai',
        text: aiReply || cleaned,
        recommendation,
        timestamp: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      if (currentReqId !== requestIdRef.current) return;
      const errMsg: Message = {
        id: createId(),
        sender: 'ai',
        text: `Koneksi terputus: ${err?.message || 'Silakan coba kirim ulang.'}`,
        timestamp: getCurrentTime(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      if (currentReqId === requestIdRef.current) {
        setIsTyping(false);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Cohesive Header (Matches Gyms / Profile / Workout) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Assistant</Text>
          <Text style={styles.headerSubtitle}>TRAINING INTELLIGENCE</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleResetChat}
          style={styles.resetButton}
          accessibilityRole="button"
          accessibilityLabel="Reset conversation">
          <Ionicons name="refresh-outline" size={16} color="#A1A1AA" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
        style={styles.flexOne}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabHeight + 124 },
          ]}
          style={styles.flexOne}>
          {messages.map((item, idx) => {
            if (item.sender === 'ai') {
              return (
                <View key={`${item.id}_${idx}`} style={styles.aiMessageGroup}>
                  <View style={styles.aiMetaRow}>
                    <View style={styles.coachBadgeDot} />
                    <Text style={styles.aiSenderLabel}>GYMNIX COACH</Text>
                    <Text style={styles.timestampText}>{item.timestamp}</Text>
                  </View>

                  <View
                    style={[
                      styles.aiCard,
                      item.isError ? styles.aiCardError : null,
                    ]}>
                    <LinearGradient
                      colors={[
                        'rgba(190, 49, 68, 0.1)',
                        'rgba(190, 49, 68, 0.02)',
                        'transparent',
                      ]}
                      locations={[0, 0.4, 1]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0.1, y: 0.9 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />
                    <View style={styles.aiBodyContent}>
                      {renderFormattedText(item.text)}
                    </View>

                    {item.recommendation ? (
                      <View style={styles.recommendationBox}>
                        <View style={styles.recommendationHeader}>
                          <Ionicons
                            name="arrow-forward-circle"
                            size={13}
                            color="#BE3144"
                          />
                          <Text style={styles.recommendationLabel}>
                            NEXT STEP
                          </Text>
                        </View>
                        <Text style={styles.recommendationText}>
                          {item.recommendation}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            }

            return (
              <View key={`${item.id}_${idx}`} style={styles.userMessageGroup}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{item.text}</Text>
                </View>
                <Text style={styles.userTimestamp}>{item.timestamp}</Text>
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.aiMessageGroup}>
              <View style={styles.aiMetaRow}>
                <View style={styles.coachBadgeDot} />
                <Text style={styles.aiSenderLabel}>GYMNIX COACH</Text>
              </View>
              <View style={styles.typingCard}>
                <ActivityIndicator size="small" color="#BE3144" />
                <Text style={styles.typingText}>
                  Menyusun rekomendasi dari data latihan...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Dock: Quick Prompt Chips + Input Composer */}
        <View style={[styles.composerDock, { bottom: tabHeight }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.chipsScrollContent}
            style={styles.chipsScroll}>
            {quickPrompts.map((chip) => (
              <TouchableOpacity
                key={chip.id}
                activeOpacity={0.75}
                onPress={() => handleSend(chip.prompt)}
                style={styles.promptChip}>
                <Text style={styles.promptChipText}>{chip.label}</Text>
                <Ionicons name="arrow-up-outline" size={11} color="#71717A" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.composerRow}>
            <View style={styles.inputContainer}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Tanya program otot, alternatif gerakan, atau PR..."
                placeholderTextColor="#52525B"
                style={styles.textInput}
                returnKeyType="send"
                onSubmitEditing={() => handleSend()}
                selectionColor="#BE3144"
              />
              {inputText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setInputText('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={16} color="#52525B" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
              activeOpacity={0.8}
              style={[
                styles.sendButton,
                !inputText.trim() ? styles.sendButtonDisabled : null,
              ]}>
              <Ionicons
                name="arrow-up"
                size={18}
                color={inputText.trim() ? '#FFFFFF' : '#52525B'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flexOne: {
    flex: 1,
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
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#121214',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#222226',
  },
  resetButtonText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  aiMessageGroup: {
    marginBottom: 18,
    maxWidth: '94%',
  },
  aiMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    paddingLeft: 2,
  },
  coachBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BE3144',
  },
  aiSenderLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  timestampText: {
    color: '#52525B',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
    fontVariant: ['tabular-nums'],
  },
  aiCard: {
    backgroundColor: '#0A0A0C',
    borderWidth: 1,
    borderColor: '#1C1C20',
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  aiCardError: {
    borderColor: 'rgba(190, 49, 68, 0.4)',
  },
  aiBodyContent: {
    padding: 15,
  },
  messageText: {
    color: '#E4E4E7',
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '400',
  },
  paragraphSpacing: {
    marginBottom: 8,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 6,
    marginBottom: 4,
    backgroundColor: '#111114',
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#1C1C21',
  },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(190, 49, 68, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(190, 49, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberBadgeText: {
    color: '#E63950',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#BE3144',
    marginTop: 7,
    marginLeft: 2,
  },
  listRowText: {
    flex: 1,
    color: '#F4F4F5',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  recommendationBox: {
    backgroundColor: '#111114',
    borderTopWidth: 1,
    borderTopColor: '#1C1C20',
    borderLeftWidth: 3,
    borderLeftColor: '#BE3144',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  recommendationLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  recommendationText: {
    color: '#F4F4F5',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '600',
  },
  userMessageGroup: {
    marginBottom: 18,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '82%',
  },
  userBubble: {
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: '#27272C',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '500',
  },
  userTimestamp: {
    color: '#52525B',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    paddingRight: 2,
    fontVariant: ['tabular-nums'],
  },
  typingCard: {
    backgroundColor: '#0A0A0C',
    borderWidth: 1,
    borderColor: '#1C1C20',
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#8E8E93',
    fontSize: 12.5,
    fontWeight: '500',
  },
  composerDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    borderTopWidth: 1,
    borderTopColor: '#18181A',
    paddingTop: 10,
    paddingBottom: 10,
  },
  chipsScroll: {
    marginBottom: 10,
  },
  chipsScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0E0E11',
    borderWidth: 1,
    borderColor: '#222226',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    borderCurve: 'continuous',
  },
  promptChipText: {
    color: '#D4D4D8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: '#242429',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#BE3144',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: '#222226',
  },
});
