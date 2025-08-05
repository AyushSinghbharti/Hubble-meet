// components/loaders/ChatCardSkeleton.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Easing } from "react-native-reanimated";
import colourPalette from "@/src/theme/darkPaletter";

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
            colors={["#1E1E1E", "#000", "#121212"]}
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
    backgroundColor: "#1E1E1E",
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
    backgroundColor: colourPalette.textDescription,
    marginBottom: 6,
  },
  messageLine: {
    width: "80%",
    backgroundColor: colourPalette.textPlaceholder,
    height: 10,
    borderRadius: 6,
  },
});
