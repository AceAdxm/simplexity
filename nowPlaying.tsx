import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { useThemeStore } from '@/store/theme-store';

export default function NowPlaying() {
  const { currentSong, favorites, toggleFavorite, isLoading } = usePlayerStore();
  const { theme } = useThemeStore();
  const colors = Colors[theme];

  if (!currentSong) return null;

  const isFavorite = favorites.includes(currentSong.id);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={[styles.artist, { color: colors.secondaryText }]} numberOfLines={1}>{currentSong.artist}</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.brand.primary} />
        ) : (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(currentSong.id)}
          >
            <Heart
              size={22}
              color={isFavorite ? Colors.brand.primary : colors.secondaryText}
              fill={isFavorite ? Colors.brand.primary : 'transparent'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
  },
  favoriteButton: {
    padding: 8,
  },
});
