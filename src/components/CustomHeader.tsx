import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
  onBackPress?: () => void;
  showBack?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ onBackPress, showBack = false }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.side}>
          {showBack && (
            <TouchableOpacity onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.center}>
          <Image
            source={require('../../assets/logo/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.side} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 30,

  },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: "#121212",
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
});

export default CustomHeader;
