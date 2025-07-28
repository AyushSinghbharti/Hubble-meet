import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function ChatBodyLoader() {
  const shimmer = (
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
        colors={["#e1e1e1", "#f2f2f2", "#e1e1e1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </MotiView>
  );

  return (
    <View style={styles.container}>
      {/* Left Bubbles */}
      {[0, 1, 2].map((_, index) => (
        <View key={`left-${index}`} style={styles.leftBubble}>
          {shimmer}
        </View>
      ))}

      {/* Right Bubbles */}
      {[0, 1].map((_, index) => (
        <View key={`right-${index}`} style={styles.rightBubble}>
          {shimmer}
        </View>
      ))}

      {/* Center Message */}
      <View style={styles.leftBubbleSmall}>{shimmer}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
    paddingBottom: 12,
    gap: 12,
  },
  leftBubble: {
    width: width * 0.55,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#e1e1e1",
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  rightBubble: {
    width: width * 0.45,
    height: 40,
    borderRadius: 18,
    backgroundColor: "#e1e1e1",
    overflow: "hidden",
    alignSelf: "flex-end",
  },
  leftBubbleSmall: {
    width: width * 0.3,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e1e1e1",
    overflow: "hidden",
    alignSelf: "flex-start",
  },
});
