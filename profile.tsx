import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import {
  User,
  Settings,
  LogOut,
  Heart,
  Clock,
  Download,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  Music,
  Link,
  RefreshCw,
  Trash
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { useSpotifyStore, mockSpotifyData } from '@/store/spotify-store';
import { useThemeStore } from '@/store/theme-store';
import { useNotificationStore } from '@/store/notification-store';
import SpotifyConnectModal from '@/components/SpotifyConnectModal';
import SpotifyImportModal from '@/components/SpotifyImportModal';

export default function ProfileScreen() {
  const { favorites, addImportedSongs, createPlaylist, addToPlaylist, resetStats, clearLibrary } = usePlayerStore();
  const { isConnected, username, connect, disconnect } = useSpotifyStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notificationsEnabled, toggleNotifications } = useNotificationStore();
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

  const colors = Colors[theme];

  const handleConnectSpotify = () => {
    if (!isConnected) {
      setConnectModalVisible(true);
    } else {
      setImportModalVisible(true);
    }
  };

  const handleDisconnectSpotify = () => {
    disconnect();
  };

  const handleImportSpotifyData = () => {
    // Import songs
    addImportedSongs(mockSpotifyData.songs);

    // Import playlists
    mockSpotifyData.playlists.forEach(playlist => {
      const playlistId = createPlaylist(playlist.name, playlist.coverArt);
      playlist.songs.forEach(songId => {
        addToPlaylist(playlistId, songId);
      });
    });

    setImportModalVisible(false);
  };

  const handleHelpPress = () => {
    Linking.openURL('https://github.com/AceAdxm/simplexity/issues');
  };

  const handleAboutUsPress = () => {
    Linking.openURL('https://github.com/AceAdxm/simplexity');
  };

  const handleResetStats = () => {
    Alert.alert(
      "Reset Stats",
      "This will reset your favorites and playlists. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetStats()
        }
      ]
    );
  };

  const handleClearLibrary = () => {
    Alert.alert(
      "Clear Library",
      "This will remove all imported songs, playlists, and favorites. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearLibrary()
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: colors.surface }]}>
              <User size={40} color={colors.secondaryText} />
            </View>
          </View>

          <Text style={[styles.profileName, { color: colors.text }]}>Music Lover</Text>
          <Text style={[styles.profileEmail, { color: colors.secondaryText }]}>music@example.com</Text>

          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.surface }]}>
            <Text style={[styles.editButtonText, { color: Colors.brand.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Heart size={24} color={Colors.brand.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{favorites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Favorites</Text>
          </View>

          <View style={styles.statItem}>
            <Clock size={24} color={Colors.brand.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>0h</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Listened</Text>
          </View>

          <View style={styles.statItem}>
            <Download size={24} color={Colors.brand.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Downloads</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Integrations</Text>

          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(29, 185, 84, 0.15)' }]}>
              <Music size={20} color="#1DB954" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Spotify Integration</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                {isConnected
                  ? `Connected as ${username}`
                  : 'Import your Spotify playlists and songs'}
              </Text>
            </View>
            <Switch
              value={isConnected}
              onValueChange={isConnected ? handleDisconnectSpotify : handleConnectSpotify}
              trackColor={{ false: '#767577', true: '#1DB954' }}
              thumbColor={colors.text}
            />
          </View>

          {isConnected && (
            <View style={styles.spotifyContainer}>
              <View style={styles.spotifyStatusContainer}>
                <View style={styles.spotifyStatusIndicator} />
                <Text style={styles.spotifyStatusText}>Connected to Spotify</Text>
              </View>

              <TouchableOpacity
                style={styles.spotifySyncButton}
                onPress={handleConnectSpotify}
              >
                <RefreshCw size={18} color={colors.text} />
                <Text style={[styles.spotifySyncText, { color: colors.text }]}>Sync Spotify Library</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: colors.surface }]}>
              <Moon size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: Colors.brand.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: colors.surface }]}>
              <Bell size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Receive updates and alerts</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: Colors.brand.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: colors.surface }]}>
              <Shield size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Manage your data and privacy</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.settingAction}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: colors.surface }]}>
              <HelpCircle size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Help & Support</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Get assistance and FAQs</Text>
            </View>
            <TouchableOpacity onPress={handleHelpPress}>
              <Text style={styles.settingAction}>Open</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: colors.surface }]}>
              <Trash size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Reset Stats</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Clear favorites and playlists</Text>
            </View>
            <TouchableOpacity onPress={handleResetStats}>
              <Text style={[styles.settingAction, { color: '#ef4444' }]}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: colors.surface }]}>
              <Trash size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Clear Library</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Remove all imported songs</Text>
            </View>
            <TouchableOpacity onPress={handleClearLibrary}>
              <Text style={[styles.settingAction, { color: '#ef4444' }]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.surface }]}
          onPress={isConnected ? handleDisconnectSpotify : undefined}
        >
          <LogOut size={20} color={colors.text} />
          <Text style={[styles.logoutText, { color: colors.text }]}>
            {isConnected ? 'Log Out from Spotify' : 'Log Out'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.secondaryText }]}>Version 1.0.0</Text>

        <TouchableOpacity onPress={handleAboutUsPress}>
          <Text style={[styles.aboutUsText, { color: colors.secondaryText }]}>
            Simplexity so far is a one man company made by @aceadxm ready to make listening to music free and advanced. For more updates click here
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SpotifyConnectModal
        visible={connectModalVisible}
        onClose={() => setConnectModalVisible(false)}
        onConnect={(username) => {
          connect(username);
          setConnectModalVisible(false);
          setImportModalVisible(true);
        }}
      />

      <SpotifyImportModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onImport={handleImportSpotifyData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
  settingAction: {
    fontSize: 14,
    color: Colors.brand.primary,
  },
  spotifyContainer: {
    marginTop: 8,
    marginBottom: 16,
    paddingLeft: 52, // Align with the text in the setting item
  },
  spotifyStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  spotifyStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1DB954',
    marginRight: 8,
  },
  spotifyStatusText: {
    color: '#1DB954',
    fontSize: 14,
  },
  spotifySyncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  spotifySyncText: {
    fontWeight: '500',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 8,
  },
  aboutUsText: {
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
});
