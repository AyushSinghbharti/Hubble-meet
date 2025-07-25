import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Easing } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.75;

export default function ConnectCard() {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        {/* ✅ Animated shimmer bar */}
        <MotiView
          from={{ translateX: -width }}
          animate={{ translateX: width }}
          transition={{
            loop: true,
            type: "timing",
            duration: 1500,
            easing: Easing.linear,
          }}
          style={StyleSheet.absoluteFillObject}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmer}
          />
        </MotiView>
      </View>

      <View style={styles.footer}>
        <View style={styles.nameBlock} />
        <View style={styles.subBlock} />
        <View style={styles.subBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    height: CARD_HEIGHT,
    backgroundColor: "#DDD",
    borderRadius: 20,
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: 20,
  },
  imagePlaceholder: {
    flex: 1.2,
    backgroundColor: "#D7D7D7",
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
  },
  footer: {
    flex: 0.6,
    padding: 16,
    justifyContent: "space-evenly",
  },
  nameBlock: {
    height: 16,
    width: "60%",
    borderRadius: 6,
    backgroundColor: "#bdbdbd",
    marginBottom: 8,
  },
  subBlock: {
    height: 12,
    width: "40%",
    borderRadius: 6,
    backgroundColor: "#c4c4c4",
  },
});
