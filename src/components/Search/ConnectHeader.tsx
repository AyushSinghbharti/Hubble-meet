import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  Keyboard,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const MAX_WIDTH = 330;
const MIN_WIDTH = 40;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Header = ({ logoSource, onSearch, onBagPress }) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);

  const handleSearchToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!searchActive) {
      setSearchActive(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    } else {
      setSearchActive(false);
      setSearchText('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.header}>
      {!searchActive && (
        <View style={styles.logoWrapper}>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </View>
      )}

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={handleSearchToggle}
          activeOpacity={0.9}
          style={[
            styles.searchContainer,
            {
              width: searchActive ? MAX_WIDTH : MIN_WIDTH,
              borderColor: searchActive ? '#BBCF8D' : '#ccc',
              shadowColor: searchActive ? '#BBCF8D' : 'transparent',
              shadowOpacity: searchActive ? 0.8 : 0,
              shadowRadius: searchActive ? 6 : 0,
              elevation: searchActive ? 8 : 0,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search..."
            placeholderTextColor="#888"
            editable={searchActive}
            onSubmitEditing={() => onSearch && onSearch(searchText)}
          />

          <Feather
            name={searchActive ? 'x' : 'search'}
            size={20}
            style={{ marginRight: 10 ,right:6}}
            color="#000"
          />
        </TouchableOpacity>

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
    marginRight: 10,
    borderWidth: 2,
    overflow: 'hidden',
    zIndex:1,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: '#000',
        zIndex:0,
  },
  bagBtn: {
    padding: 6,
  },
});
