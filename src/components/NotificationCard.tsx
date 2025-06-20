// components/NotificationCard.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NotificationCard = ({ image, name, status, date }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.imageWrapper}>
          <Image source={image} style={styles.image} />
          <View style={styles.statusDot} />
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#0f172a',
  },
  status: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 2,
  },
  date: {
    fontSize: 13,
    color: '#a0a0a0',
    alignSelf: 'flex-start',
  },
});
