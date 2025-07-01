import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface UserProfile {
  name: string;
  position: string;
  location: string;
  about: string;
  industries: string[];
  interests: string[];
  image: string;
}

const aspectRatio = 3 / 4;

const FlipCardWrapper = ({
  item,
  onPress,
}: {
  item: UserProfile;
  onPress: () => void;
}) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.root}>
      {/* Background Image */}
      <Image
        source={{ uri: item.image }}
        style={[styles.backgroundImage, { aspectRatio, flex: 1, width: "100%" }]}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={[
          "transparent",
          "transparent",
          "transparent",
          "rgba(255,255,255, 0.75)",
          "#ffffff",
        ]}
        style={styles.gradient}
        pointerEvents="none"
      />

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* This invisible pressable layer captures tap gestures without blocking scroll */}
        <Pressable onPress={onPress} style={styles.pressOverlay} />

        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255, 0.75)",
            "rgba(255,255,255, 0.85)",
            "rgba(255,255,255, 0.95)",
            "rgba(255,255,255, 1)",
            "#ffffff",
          ]}
          style={styles.innerGradient}
        >
          {/* HEADER */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.position}>{item.position}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.paragraph}>{item.about}</Text>

          <Text style={styles.sectionTitle}>Industries work</Text>
          <View style={styles.chipRow}>
            {item.industries.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Area of Interest</Text>
          <View style={styles.chipRow}>
            {item.interests.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 18,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    borderRadius: 20,
  },
  gradient: {
    position: "absolute",
    left: 0,
    width: "100%",
    aspectRatio,
  },
  contentContainer: {
    paddingTop: 280,
    paddingBottom: 50,
  },
  pressOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // ensures it stays on top
  },
  innerGradient: {
    width: "100%",
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  headerTextBlock: {},
  name: {
    fontFamily: "InterBold",
    fontSize: 28,
    color: "#000",
  },
  position: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#000",
  },
  location: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#000",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 26,
    marginBottom: 8,
    color: "#000",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: "#444",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginRight: 10,
    marginBottom: 12,
    backgroundColor: "#f7f7f7",
  },
  chipText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
});

export default FlipCardWrapper;
