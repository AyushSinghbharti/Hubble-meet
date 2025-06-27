// components/ErrorAlert.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ErrorAlertProps {
  message: string | String;
  onClose: () => void;
}

const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onClose}>
        <MaterialIcons name="close" size={20} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    minHeight: 57,
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
    marginBottom: 40,
    borderLeftColor: "#d32f2f",
    borderLeftWidth: 5
  },
  message: {
    flex: 1,
    color: "#E53935",
    fontSize: 14,
  },
});

export default ErrorAlert;
