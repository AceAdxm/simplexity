import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import NowPlaying from '@/components/NowPlaying';
import ProgressBar from '@/components/ProgressBar';
import Controls from '@/components/Controls';
import VolumeControl from '@/components/VolumeControl';
import { usePlayerStore } from '@/store/player-store';
import { Image } from 'expo-image';
import { useThemeStore } from '@/store/theme-store';
import { Bluetooth, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function PlayerScreen() {
  const { currentSong, isPlaying, lastPlayedSong } = usePlayerStore();
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const router = useRouter();

  // Simulate detecting playback device
  useEffect(() => {
    if (isPlaying) {
      // Simulate detecting a Bluetooth device or speaker
      const devices = ['iPhone Speaker', 'AirPods Pro', 'Bluetooth Speaker', 'Car Stereo'];
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      setDeviceName(randomDevice);
    } else {
      setDeviceName(null);
    }
  }, [isPlaying]);

  const displaySong = currentSong || lastPlayedSong;

  const handleBackPress = () => {
    router.back();
  };

  if (!displaySong) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ChevronDown size={24} color={colors.text} />
          </TouchableOpacity>
          <Header />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Music Found</Text>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Import music from your library or connect Spotify
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <LinearGradient
        colors={[
          theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(248,248,248,0.8)',
          colors.background
        ]}
        style={styles.gradient}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ChevronDown size={24} color={colors.text} />
          </TouchableOpacity>
          <Header />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Large Album Art */}
          <View style={styles.albumArtContainer}>
            <Image
              source={{ uri: displaySong.coverArt }}
              style={[
                styles.albumArt,
                { width: windowWidth * 0.85, height: windowWidth * 0.85 }
              ]}
              contentFit="cover"
              transition={500}
            />
          </View>

          {/* Song Info */}
          <NowPlaying />

          {/* Device Info */}
          {deviceName && isPlaying && (
            <View style={styles.deviceContainer}>
              <Bluetooth size={16} color={Colors.brand.primary} />
              <Text style={styles.deviceText}>Playing on {deviceName}</Text>
            </View>
          )}

          {/* Progress Bar */}
          <ProgressBar />

          {/* Volume Control */}
          <VolumeControl />

          {/* Controls */}
          <Controls />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  albumArtContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  albumArt: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 20,
  },
  deviceText: {
    fontSize: 14,
    color: Colors.brand.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
