import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT } from '@/assets/constants/fonts';

type SettingsCardProps = {
  section: String,
  items: { label: string; onPress?: () => void; color?: string; showArrow?: boolean }[];
  cardStyle?: object;
};

const SettingsCard = ({ items, cardStyle = {}, section }: SettingsCardProps) => {
  return (
    <View style={[styles.card, cardStyle]}>

      <Text style={styles.section}>{section}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          activeOpacity={0.7}
          style={styles.row}
        >
          <Text style={[styles.label, { color: item.color || '#fff' }]}>{item.label}</Text>
          {item.showArrow !== false && (
            <Ionicons name="chevron-forward" size={20} color="#BBCF8D" />
          )}
          {index < items.length - 1 && <View style={styles.separator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SettingsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingVertical: 4,
    marginBottom: 16,
    overflow: 'hidden',
    marginHorizontal: 1
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 16,
    color: "#fff"
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: '#353535',
  },
  section: {
    fontSize: 20,
    color: '#BBCF8D',
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: FONT.MONSERRATMEDIUM,
    lineHeight: 24
  },

});
