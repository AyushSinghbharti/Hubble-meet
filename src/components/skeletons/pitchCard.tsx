// components/loaders/PitchScreenLoader.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Easing } from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 120;
const TOP_PADDING = 15;
const SAFE_MARGIN = 36;
const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - TOP_PADDING - SAFE_MARGIN;

export default function PitchScreenLoader() {
  return (
    <View style={styles.wrapper}>
      {/* Main card container shimmer */}
      <View style={styles.card}>
        <MotiView
          from={{ translateX: -400 }}
          animate={{ translateX: 400 }}
          transition={{
            loop: true,
            type: "timing",
            duration: 1200,
            easing: Easing.linear,
          }}
          style={StyleSheet.absoluteFill}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmer}
          />
        </MotiView>

        <View style={styles.footer}>
          <View style={styles.lineLarge} />
          <View style={styles.lineMedium} />
          <View style={styles.lineSmall} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: ITEM_HEIGHT,
    marginVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  shimmer: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    gap: 10,
  },
  lineLarge: {
    height: 16,
    width: "60%",
    backgroundColor: "#D1D5DB",
    borderRadius: 8,
  },
  lineMedium: {
    height: 14,
    width: "40%",
    backgroundColor: "#D1D5DB",
    borderRadius: 8,
  },
  lineSmall: {
    height: 12,
    width: "30%",
    backgroundColor: "#D1D5DB",
    borderRadius: 8,
  },
});
