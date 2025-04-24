import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useThemeStore } from '@/store/theme-store';

export default function Controls() {
  const {
    isPlaying,
    togglePlay,
    next,
    previous,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isLoading
  } = usePlayerStore();

  const { theme } = useThemeStore();
  const colors = Colors[theme];

  const handlePress = async (callback: () => Promise<void>) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await callback();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconButton, isShuffled && styles.activeButton]}
          onPress={() => toggleShuffle()}
        >
          <Shuffle
            size={20}
            color={isShuffled ? Colors.brand.primary : colors.secondaryText}
          />
        </TouchableOpacity>

        <View style={styles.mainControls}>
          <TouchableOpacity
            style={[styles.sideButton, { backgroundColor: colors.surface }]}
            onPress={() => handlePress(previous)}
            disabled={isLoading}
          >
            <SkipBack size={24} color={colors.text} />
          </TouchableOpacity>

    alignItems: 'center',
  },
  sideButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
  },
});
