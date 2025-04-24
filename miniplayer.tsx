import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';

export default function MiniPlayer() {
  const { currentSong, isPlaying, togglePlay, next } = usePlayerStore();
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const router = useRouter();

  if (!currentSong) return null;

  // Handle navigation to player screen
  const navigateToPlayer = () => {
    router.push('/(tabs)/');
  };

  // Different implementation for web vs native to avoid CSS issues
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={navigateToPlayer}
    >
      <Image
        source={{ uri: currentSong.coverArt }}
        style={styles.coverArt}
        contentFit="cover"
      />

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{currentSong.title}</Text>
        <Text style={[styles.artist, { color: colors.secondaryText }]} numberOfLines={1}>{currentSong.artist}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: 'rgba(150, 150, 150, 0.1)' }]}
          onPress={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause size={20} color={colors.text} />
          ) : (
            <Play size={20} color={colors.text} fill={colors.text} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: 'rgba(150, 150, 150, 0.1)' }]}
          onPress={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <SkipForward size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  coverArt: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  artist: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  nextButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
