import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  StatusBar,
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

// Global Variable
let aspectRatio = 3 / 4;

const FlipCardWrapper = ({ item }: { item: UserProfile }) => {
  const imageUri = item.image;
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Image.getSize(imageUri, (width, height) => {
  //     aspectRatio = width / height;
  //   });
  // }, []);

  return (
    <View style={styles.root}>

      {/* STATIC background image */}
      <Image
        source={{ uri: item.image }}
        style={[styles.backgroundImage, { aspectRatio, flex: 1, width: "100%" }]}
        resizeMode="cover"
        // resizeMode="contain"
      />

      {/* White fade over the lower half of the image */}
      <LinearGradient
        colors={[
          "transparent",
          "transparent",
          "transparent",
          "rgba(255,255,255, 0.75)",
          "#ffffff"
        ]}
        style={styles.gradient}
        pointerEvents="none"
      />

      {/* FOREGROUND, fully scrollable */}
      <Animated.ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255, 0.75)",
            "rgba(255,255,255, 0.85)",
            "rgba(255,255,255, 0.95)",
            "rgba(255,255,255, 1)",
            "rgba(255,255,255, 1)",
            "#ffffff",
          ]}
          style={{width: "100%", flex: 1, height: "100%", paddingTop: 50, paddingHorizontal: 12}}
          pointerEvents="none"
        >
          {/* Header text overlays the image */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.position}>{item.position}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>

          {/* ABOUT */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.paragraph}>{item.about}</Text>

          {/* INDUSTRIES WORK */}
          <Text style={styles.sectionTitle}>Industries work</Text>
          <View style={styles.chipRow}>
            {item.industries.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>

          {/* AREA OF INTEREST */}
          <Text style={styles.sectionTitle}>Area of Interest</Text>
          <View style={styles.chipRow}>
            {item.interests.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
        {/* Add more subsections below as needed */}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 18,
    backgroundColor: "#fff",
  },

  /* ===== BACKGROUND IMAGE & GRADIENT ===== */
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
    aspectRatio: aspectRatio,
  },

  contentContainer: {
    paddingTop: 280,
    paddingBottom: 50,
  },

  headerTextBlock: {
    // marginBottom: 32, //Give margin accordingly
  },
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

  /* ===== CHIPS ===== */
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
