import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RequestsCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>Requests Card Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E0EAF3",
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
