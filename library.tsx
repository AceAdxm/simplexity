import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ListMusic, Heart, Import, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import SongItem from '@/components/SongItem';
import { usePlayerStore } from '@/store/player-store';
import Header from '@/components/Header';
import ImportMusicModal from '@/components/ImportMusicModal';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';
import { Image } from 'expo-image';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'playlists'>('all');
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [createPlaylistModalVisible, setCreatePlaylistModalVisible] = useState(false);
  const { currentSong, favorites, importedSongs, playlists } = usePlayerStore();

  const displaySongs = activeTab === 'all'
    ? importedSongs
    : importedSongs.filter(song => favorites.includes(song.id));

  const handleImportPress = () => {
    setImportModalVisible(true);
  };

  const handleCreatePlaylistPress = () => {
    setCreatePlaylistModalVisible(true);
  };

  const renderEmptyLibrary = () => (
    <View style={styles.emptyContainer}>
      <Import size={48} color={Colors.dark.secondaryText} />
      <Text style={styles.emptyTitle}>Your Library is Empty</Text>
      <Text style={styles.emptyText}>Import your music to get started</Text>
      <TouchableOpacity
        style={styles.importButtonLarge}
        onPress={handleImportPress}
      >
        <Import size={20} color={Colors.dark.background} />
        <Text style={styles.importButtonLargeText}>Import Music</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyPlaylists = () => (
    <View style={styles.emptyContainer}>
      <ListMusic size={48} color={Colors.dark.secondaryText} />
      <Text style={styles.emptyTitle}>No Playlists Yet</Text>
      <Text style={styles.emptyText}>Create your first playlist</Text>
      <TouchableOpacity
        style={styles.importButtonLarge}
        onPress={handleCreatePlaylistPress}
      >
        <Plus size={20} color={Colors.dark.background} />
        <Text style={styles.importButtonLargeText}>Create Playlist</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity style={styles.playlistItem}>
      <Image
        source={{ uri: item.coverArt }}
        style={styles.playlistCover}
        contentFit="cover"
      />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistSongs}>{item.songs.length} songs</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Header showImport={true} />

      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <ListMusic
            size={18}
            color={activeTab === 'all' ? Colors.dark.text : Colors.dark.secondaryText}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText
            ]}
          >
            All Songs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Heart
            size={18}
            color={activeTab === 'favorites' ? Colors.dark.text : Colors.dark.secondaryText}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'favorites' && styles.activeTabText
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'playlists' && styles.activeTab]}
          onPress={() => setActiveTab('playlists')}
        >
          <ListMusic
            size={18}
            color={activeTab === 'playlists' ? Colors.dark.text : Colors.dark.secondaryText}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'playlists' && styles.activeTabText
            ]}
          >
            Playlists
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab !== 'playlists' ? (
        <FlatList
          data={displaySongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongItem
              song={item}
              isActive={currentSong?.id === item.id}
            />
          )}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.importButton}
              onPress={handleImportPress}
            >
              <Import size={20} color={Colors.dark.text} />
              <Text style={styles.importText}>Import Music</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={renderEmptyLibrary}
        />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={renderPlaylistItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.importButton}
              onPress={handleCreatePlaylistPress}
            >
              <Plus size={20} color={Colors.dark.text} />
              <Text style={styles.importText}>Create Playlist</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={renderEmptyPlaylists}
        />
      )}

      <ImportMusicModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
      />

      <CreatePlaylistModal
        visible={createPlaylistModalVisible}
        onClose={() => setCreatePlaylistModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: Colors.dark.surface,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.secondaryText,
    marginLeft: 6,
  },
  activeTabText: {
    color: Colors.dark.text,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  importText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.dark.secondaryText,
    marginBottom: 24,
  },
  importButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  importButtonLargeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.background,
    marginLeft: 8,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  playlistCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.dark.surface,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  playlistSongs: {
    fontSize: 14,
    color: Colors.dark.secondaryText,
  },
});
