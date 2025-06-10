// components/ErrorAlert.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorAlertProps {
    message: string;
    onClose: () => void;
}

const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftBar} />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onClose}>
        <MaterialIcons name="close" size={20} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  leftBar: {
    width: 4,
    backgroundColor: '#d32f2f',
    borderRadius: 2,
    height: '100%',
    marginRight: 10,
  },
  message: {
    flex: 1,
    color: '#d32f2f',
    fontSize: 14,
  },
});

export default ErrorAlert;
