import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X, Check, ListMusic } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreatePlaylistModal({ visible, onClose }: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState('');
  const { createPlaylist } = usePlayerStore();

  const handleCreate = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName.trim());
      setPlaylistName('');
      onClose();
    }
  };

  const resetAndClose = () => {
    setPlaylistName('');
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
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Playlist</Text>
            <TouchableOpacity style={styles.closeButton} onPress={resetAndClose}>
              <X size={20} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <ListMusic size={48} color={Colors.brand.primary} />
            </View>

            <Text style={styles.label}>Playlist Name</Text>
            <TextInput
              style={styles.input}
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder="My Awesome Playlist"
              placeholderTextColor={Colors.dark.secondaryText}
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.createButton,
                !playlistName.trim() && styles.disabledButton
              ]}
              onPress={handleCreate}
              disabled={!playlistName.trim()}
            >
              <Text style={styles.createButtonText}>Create Playlist</Text>
            </TouchableOpacity>
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
    backgroundColor: Colors.dark.surface,
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.brand.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.background,
  },
});
