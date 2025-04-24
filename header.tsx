import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, User, Import } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';

interface HeaderProps {
  onSearchPress?: () => void;
  showImport?: boolean;
  hideIcons?: boolean;
}

export default function Header({ onSearchPress, showImport = false, hideIcons = false }: HeaderProps) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme];

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.logoContainer}>
        <Text style={[styles.logo, { color: colors.tint }]}>Simplexity</Text>
        <Text style={styles.creator}>@aceadxm</Text>
      </View>
      {!hideIcons && (
        <View style={styles.actions}>
          {showImport && (
            <TouchableOpacity style={styles.iconButton}>
              <Import size={22} color={colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <Search size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
            <User size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
  },
  creator: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: -2,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});
