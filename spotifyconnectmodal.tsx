import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { X, Check, Music } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface SpotifyConnectModalProps {
  visible: boolean;
  onClose: () => void;
  onConnect: (username: string) => void;
}

export default function SpotifyConnectModal({ visible, onClose, onConnect }: SpotifyConnectModalProps) {
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { theme } = useThemeStore();
  const colors = Colors[theme];

  const handleConnect = async () => {
    if (!username.trim()) return;

    setIsConnecting(true);

    // Simulate connection delay
    setTimeout(() => {
      onConnect(username.trim());
      setIsConnecting(false);
      setUsername('');
    }, 1500);
  };

  const resetAndClose = () => {
    setUsername('');
    setIsConnecting(false);
    onClose();
  };

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
            <Text style={[styles.title, { color: colors.text }]}>Connect to Spotify</Text>
            <TouchableOpacity style={styles.closeButton} onPress={resetAndClose}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.spotifyIconContainer}>
              <Music size={48} color="#1DB954" />
            </View>

            <Text style={[styles.description, { color: colors.text }]}>
              Connect your Spotify account to import your playlists and liked songs
            </Text>

            <Text style={[styles.label, { color: colors.text }]}>Spotify Username</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your Spotify username"
              placeholderTextColor={colors.secondaryText}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[
                styles.connectButton,
                !username.trim() && styles.disabledButton
              ]}
              onPress={handleConnect}
              disabled={!username.trim() || isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.connectButtonText}>Connect Account</Text>
              )}
            </TouchableOpacity>

            <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>
              This is a demo app. No actual Spotify connection will be made.
            </Text>
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
    alignItems: 'center',
  },
  spotifyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(29, 185, 84, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
  },
});
