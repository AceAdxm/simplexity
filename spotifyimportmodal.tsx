import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { X, Check, Music, Download, Link as LinkIcon, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { mockSpotifyData } from '@/store/spotify-store';
import { Image } from 'expo-image';

interface SpotifyImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function SpotifyImportModal({ visible, onClose, onImport }: SpotifyImportModalProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { theme } = useThemeStore();
  const colors = Colors[theme];

  const handleImport = async () => {
    setIsImporting(true);

    // Simulate import delay
    setTimeout(() => {
      onImport();
      setIsImporting(false);
      setImportComplete(true);

      // Close modal after showing success
      setTimeout(() => {
        resetAndClose();
      }, 2000);
    }, 2000);
  };

  const handlePlaylistSearch = () => {
    if (!playlistUrl.trim()) return;

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      // In a real app, this would fetch the playlist data
      // For now, we'll just pretend it worked
      setPlaylistUrl('');
    }, 1500);
  };

  const resetAndClose = () => {
    setIsImporting(false);
    setImportComplete(false);
    setPlaylistUrl('');
    onClose();
  };

  const renderPlaylistItem = ({ item }) => (
    <View style={[styles.playlistItem, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: item.coverArt }}
        style={styles.playlistCover}
        contentFit="cover"
      />
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.playlistSongs, { color: colors.secondaryText }]}>
          {item.songs.length} songs
        </Text>
      </View>
    </View>
  );

  const renderSongItem = ({ item }) => (
    <View style={[styles.songItem, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: item.coverArt }}
        style={styles.songCover}
        contentFit="cover"
      />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.songArtist, { color: colors.secondaryText }]} numberOfLines={1}>{item.artist}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={resetAndClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: 'rgba(150, 150, 150, 0.1)' }]}>
            <Text style={[styles.title, { color: colors.text }]}>Import from Spotify</Text>
            <TouchableOpacity style={styles.closeButton} onPress={resetAndClose}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isImporting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1DB954" />
                <Text style={[styles.loadingText, { color: colors.text }]}>
                  Importing your Spotify library...
                </Text>
                <Text style={[styles.processingText, { color: colors.secondaryText }]}>
                  This may take a moment
                </Text>
              </View>
            ) : importComplete ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Check size={48} color="#000" />
                </View>
                <Text style={[styles.successText, { color: colors.text }]}>
                  Import Complete!
                </Text>
                <Text style={[styles.successSubtext, { color: colors.secondaryText }]}>
                  Your Spotify library has been imported successfully
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.spotifyIconContainer}>
                  <Music size={36} color="#1DB954" />
                </View>

                <Text style={[styles.description, { color: colors.text }]}>
                  We found the following content in your Spotify library:
                </Text>

                {/* Playlist URL Import */}
                <View style={styles.urlImportContainer}>
                  <Text style={[styles.urlImportTitle, { color: colors.text }]}>
                    Import Playlist by URL
                  </Text>

                  <View style={styles.urlInputContainer}>
                    <View style={[styles.urlInput, { backgroundColor: colors.background }]}>
                      <LinkIcon size={18} color={colors.secondaryText} style={styles.urlInputIcon} />
                      <TextInput
                        style={[styles.urlInputText, { color: colors.text }]}
                        placeholder="Paste Spotify playlist URL"
                        placeholderTextColor={colors.secondaryText}
                        value={playlistUrl}
                        onChangeText={setPlaylistUrl}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.urlSearchButton,
                        { opacity: playlistUrl.trim() ? 1 : 0.5 }
                      ]}
                      onPress={handlePlaylistSearch}
                      disabled={!playlistUrl.trim() || isSearching}
                    >
                      {isSearching ? (
                        <ActivityIndicator size="small" color="#000" />
                      ) : (
                        <Search size={20} color="#000" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Playlists</Text>
                  <FlatList
                    data={mockSpotifyData.playlists}
                    renderItem={renderPlaylistItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.playlistsContainer}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Liked Songs</Text>
                  <FlatList
                    data={mockSpotifyData.songs}
                    renderItem={renderSongItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={styles.songsList}
                    contentContainerStyle={styles.songsContainer}
                  />
                </View>

                <TouchableOpacity
                  style={styles.importButton}
                  onPress={handleImport}
                >
                  <Download size={20} color="#000" />
                  <Text style={styles.importButtonText}>Import All</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  spotifyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(29, 185, 84, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  urlImportContainer: {
    width: '100%',
    marginBottom: 24,
  },
  urlImportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  urlInputIcon: {
    marginRight: 8,
  },
  urlInputText: {
    flex: 1,
    fontSize: 14,
  },
  urlSearchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  playlistsContainer: {
    paddingRight: 16,
  },
  playlistItem: {
    width: 140,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  playlistCover: {
    width: '100%',
    height: 140,
  },
  playlistInfo: {
    padding: 8,
  },
  playlistName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  playlistSongs: {
    fontSize: 12,
  },
  songsList: {
    maxHeight: 200,
  },
  songsContainer: {
    paddingBottom: 8,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  songCover: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  songInfo: {
    marginLeft: 12,
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 12,
  },
  importButton: {
    backgroundColor: '#1DB954',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  processingText: {
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});
