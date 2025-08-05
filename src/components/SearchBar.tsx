import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

const SearchBar: React.FC<CustomSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFilterPress,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.container}>
        <Ionicons name="search" size={20} color="#BBCF8D" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#898989"
        />
      </View>


      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Image style={{ height: 25, width: 25 }} source={require('../../assets/mage_filter.png')} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 30,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'InterMedium',
    color: '#FFFFFF',
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#121212',
    padding: 10,
    borderRadius: 30,

  },
});

export default SearchBar;
