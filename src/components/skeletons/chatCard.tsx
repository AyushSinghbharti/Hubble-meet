// components/loaders/ChatCardSkeleton.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Easing } from "react-native-reanimated";

export default function ChatCardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Avatar Placeholder */}
      <View style={styles.avatar}>
        <MotiView
          from={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            loop: true,
            duration: 1000,
            type: "timing",
          }}
          style={StyleSheet.absoluteFill}
        >
          <LinearGradient
            colors={["#ddd", "#f1f1f1", "#ddd"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmer}
          />
        </MotiView>
      </View>

      {/* Text Lines */}
      <View style={styles.textBlock}>
        <View style={styles.nameLine} />
        <View style={styles.messageLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e1e1e1",
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
  },
  textBlock: {
    flex: 1,
    justifyContent: "center",
  },
  nameLine: {
    width: "50%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginBottom: 6,
  },
  messageLine: {
    width: "80%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
});
