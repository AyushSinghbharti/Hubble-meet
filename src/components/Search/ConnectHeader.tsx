import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const MAX_WIDTH = screenWidth * 0.9;
const MIN_WIDTH = 40;

const Header = ({ logoSource, onSearch, onBagPress }) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);

  const inputWidth = useRef(new Animated.Value(MIN_WIDTH)).current;
  const borderColor = useRef(new Animated.Value(0)).current;

  const handleSearchToggle = () => {
    if (!searchActive) {
      setSearchActive(true);
      Animated.parallel([
        Animated.timing(inputWidth, {
          toValue: MAX_WIDTH,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(borderColor, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (inputRef.current) inputRef.current.focus();
      });
    } else {
      setSearchActive(false);
      setSearchText('');
      Animated.parallel([
        Animated.timing(inputWidth, {
          toValue: MIN_WIDTH,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(borderColor, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const interpolatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#BBCF8D'],
  });

  return (
    <View style={styles.header}>
      {/* Center Logo */}
      {!searchActive && (
        <View style={styles.logoWrapper}>
          <Image
            source={logoSource}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.rightSection}>
        <Animated.View
          style={[
            styles.searchContainer,
            {
              width: inputWidth,
              borderColor: interpolatedBorderColor,
              shadowColor: searchActive ? '#BBCF8D' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: searchActive ? 0.8 : 0,
              shadowRadius: searchActive ? 6 : 0,
              elevation: searchActive ? 8 : 0,
            },
          ]}
        >
          <Feather name="search" size={18} color="#000" style={styles.searchIconInside} />

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search..."
            placeholderTextColor="#888"
            onSubmitEditing={() => onSearch && onSearch(searchText)}
            editable={searchActive}
            pointerEvents={searchActive ? 'auto' : 'none'}
          />

          {searchActive && (
            <TouchableOpacity onPress={handleSearchToggle}>
              <Feather name="x" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Bag Icon */}
        <TouchableOpacity onPress={onBagPress} style={styles.bagBtn}>
          <Ionicons name="bag-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 60,
    marginTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    position: 'relative',
  },
  logoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logo: {
    height: 30,
    width: 100,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 2,
  },
  searchIconInside: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: '#000',
  },
  bagBtn: {
    padding: 6,
  },
});
