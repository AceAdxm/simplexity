import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Platform, TextInput } from 'react-native';
import { X, Check, AlertCircle, FileMusic, Upload, Image as ImageIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { usePlayerStore } from '@/store/player-store';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { useThemeStore } from '@/store/theme-store';

interface ImportMusicModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ImportMusicModal({ visible, onClose }: ImportMusicModalProps) {
  const [status, setStatus] = useState<'idle' | 'picking' | 'importing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [customCoverArt, setCustomCoverArt] = useState<string | null>(null);
  const { addImportedSongs } = usePlayerStore();
  const { theme } = useThemeStore();
  const colors = Colors[theme];

  const handleImport = async () => {
    try {
      setStatus('picking');

      // Use document picker to select audio files
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'audio/mpeg', 'audio/mp3'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setStatus('idle');
        return;
      }

      setSelectedFiles(result.assets);
      setStatus('importing');

      // Process the imported files
      const importedSongs = await Promise.all(result.assets.map(async (file, index) => {
        // Extract filename without extension for title
        const title = file.name.replace(/\.[^/.]+$/, "") || 'Unknown Title';

        // For a real app, you would extract metadata from the audio file here
        // For this demo, we'll use placeholder data

        // Generate a random duration between 2-5 minutes
        const duration = Math.floor(Math.random() * (300 - 120 + 1)) + 120;

        // Use custom cover art if provided, otherwise use a random one
        let coverArt = customCoverArt;
        if (!coverArt) {
          const coverImages = [
            'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=500&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=500&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=500&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop',
          ];
          const randomCoverIndex = Math.floor(Math.random() * coverImages.length);
          coverArt = coverImages[randomCoverIndex];
        }

        return {
          id: `imported-${Date.now()}-${index}`,
          title,
          artist: 'Your Music',
          album: 'Imported Music',
          duration,
          coverArt,
          uri: file.uri,
        };
      }));

      // Add the imported songs to the store
      addImportedSongs(importedSongs);

      setStatus('success');
    } catch (error) {
      console.error('Error importing music:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to import music');
    }
  };

  const handlePickCoverArt = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCustomCoverArt(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const resetAndClose = () => {
    setStatus('idle');
    setErrorMessage(null);
    setSelectedFiles([]);
    setCustomCoverArt(null);
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
            <Text style={[styles.title, { color: colors.text }]}>Import Music</Text>
            <TouchableOpacity style={styles.closeButton} onPress={resetAndClose}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {status === 'idle' && (
              <>
                <View style={styles.iconContainer}>
                  <FileMusic size={48} color={Colors.brand.primary} />
                </View>
                <Text style={[styles.description, { color: colors.text }]}>
                  Select MP3 files from your device to import into your library.
                </Text>
                <Text style={[styles.note, { color: colors.secondaryText }]}>
                  Supported formats: MP3, WAV, AAC
                </Text>

                {/* Custom Cover Art Section */}
                <View style={styles.coverArtSection}>
                  <Text style={[styles.coverArtTitle, { color: colors.text }]}>Custom Album Cover (Optional)</Text>

                  <View style={styles.coverArtContainer}>
                    {customCoverArt ? (
                      <Image
                        source={{ uri: customCoverArt }}
                        style={styles.coverArtPreview}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={[styles.coverArtPlaceholder, { backgroundColor: colors.background }]}>
                        <ImageIcon size={24} color={colors.secondaryText} />
                      </View>
                    )}

                    <TouchableOpacity
                      style={[styles.coverArtButton, { backgroundColor: colors.background }]}
                      onPress={handlePickCoverArt}
                    >
                      <Text style={[styles.coverArtButtonText, { color: colors.text }]}>
                        {customCoverArt ? 'Change Cover' : 'Select Cover'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.importButton, { backgroundColor: Colors.brand.primary }]}
                  onPress={handleImport}
                >
                  <Text style={styles.importButtonText}>Select Files</Text>
                </TouchableOpacity>

                <Text style={[styles.permissionNote, { color: colors.secondaryText }]}>
                  {Platform.OS === 'ios' || Platform.OS === 'android'
                    ? "This will request permission to access your files."
                    : "Select files from your computer."}
                </Text>
              </>
            )}

            {status === 'picking' && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brand.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Opening file picker...</Text>
              </View>
            )}

            {status === 'importing' && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brand.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>
                  Importing {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}...
                </Text>
                <Text style={[styles.processingText, { color: colors.secondaryText }]}>Processing audio files</Text>
              </View>
            )}

            {status === 'success' && (
              <View style={styles.resultContainer}>
                <View style={[styles.iconContainer, styles.successIconContainer]}>
                  <Check size={48} color={Colors.dark.background} />
                </View>
                <Text style={[styles.successText, { color: colors.text }]}>
                  Successfully imported {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.doneButton, { backgroundColor: Colors.brand.primary }]}
                  onPress={resetAndClose}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {status === 'error' && (
              <View style={styles.resultContainer}>
                <View style={[styles.iconContainer, styles.errorIconContainer]}>
                  <AlertCircle size={48} color={Colors.dark.background} />
                </View>
                <Text style={[styles.errorText, { color: '#ef4444' }]}>Import Failed</Text>
                <Text style={[styles.errorMessage, { color: colors.secondaryText }]}>
                  {errorMessage || 'An unexpected error occurred'}
                </Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: colors.background }]}
                  onPress={handleImport}
                >
                  <Text style={[styles.retryButtonText, { color: colors.text }]}>Try Again</Text>
                </TouchableOpacity>
              </View>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  coverArtSection: {
    width: '100%',
    marginBottom: 24,
  },
  coverArtTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  coverArtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverArtPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  coverArtPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  coverArtButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  coverArtButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  importButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.background,
  },
  permissionNote: {
    fontSize: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  processingText: {
    fontSize: 14,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconContainer: {
    backgroundColor: Colors.brand.primary,
  },
  errorIconContainer: {
    backgroundColor: '#ef4444',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.background,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
