import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ContactCardProps {
  name: string;
  image: any;
  onPress?: () => void;
  backgroundColor: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, image, onPress, backgroundColor }) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress} activeOpacity={0.9}>
      <Image source={image} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default ContactCard;
