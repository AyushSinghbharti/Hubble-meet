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
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const MAX_WIDTH = Platform.OS === 'ios' ? 330 : 310;
const MIN_WIDTH = 40;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Header = ({ logoSource, onSearch }) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();

  const onBagPress = () => {
    router.push('notification');
  };

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              style={{right:6}}
              color="#94A3B8"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onBagPress} style={styles.bagBtn}>
            <Image
              style={{ height: 25, width: 25 }}
              source={require('../../../assets/icons/briefcase.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    overflow: 'hidden',
    paddingHorizontal: 8,
    height: 35,
    backgroundColor: '#fff',
    zIndex: 5,
  },
  input: {
    flex: 1,
    height: 35,
    color: '#0f172a',
  },
  bagBtn: {
    padding: 6,
    zIndex: 10,
  },
});
