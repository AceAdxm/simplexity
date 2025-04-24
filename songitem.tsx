import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MoreVertical } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePlayerStore, Song } from '@/store/player-store';
import { formatTime } from '@/utils/format';
import { useThemeStore } from '@/store/theme-store';

interface SongItemProps {
  song: Song;
  isActive?: boolean;
}

export default function SongItem({ song, isActive = false }: SongItemProps) {
  const { playSong, favorites, toggleFavorite, isLoading, currentSong } = usePlayerStore();
  const { theme } = useThemeStore();
  const colors = Colors[theme];

  const isFavorite = favorites.includes(song.id);
  const isCurrentlyLoading = isLoading && currentSong?.id === song.id;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && [styles.activeContainer, { backgroundColor: 'rgba(74, 222, 128, 0.1)' }]
      ]}
      onPress={() => playSong(song)}
      disabled={isCurrentlyLoading}
    >
      <Image
        source={{ uri: song.coverArt }}
        style={styles.coverArt}
        contentFit="cover"
      />

      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: isActive ? Colors.brand.primary : colors.text }
          ]}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text style={[styles.artist, { color: colors.secondaryText }]} numberOfLines={1}>{song.artist}</Text>
      </View>

      <View style={styles.actions}>
        {isCurrentlyLoading ? (
          <ActivityIndicator size="small" color={Colors.brand.primary} />
        ) : (
          <>
            <Text style={[styles.duration, { color: colors.secondaryText }]}>{formatTime(song.duration)}</Text>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(song.id)}
            >
              <Heart
                size={18}
                color={isFavorite ? Colors.brand.primary : colors.secondaryText}
                fill={isFavorite ? Colors.brand.primary : 'transparent'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeContainer: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  coverArt: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    fontSize: 14,
    marginRight: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  moreButton: {
    padding: 4,
  },
});
