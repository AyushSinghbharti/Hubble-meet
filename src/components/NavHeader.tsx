import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type NavHeaderProps = {
  title: string;
  style?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

export default function NavHeader({ title, showBackButton = true, onBackPress, style }: NavHeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress || (() => router.back())}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}

        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
     paddingTop: Platform.OS === 'android' ? 5:30,
     width:"100%"
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderBottomColor: '#eee',
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },
  backButtonPlaceholder: {
    width: 32,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "InterBold",
  },
  rightPlaceholder: {
    width: 32,
  },
});
