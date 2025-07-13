import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import FlipCardWrapper from "../../../components/pitchScreenComps/flipCardWrapper";
import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";

import { Dimensions } from "react-native";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TAB_BAR_HEIGHT = 100; // your custom tab bar height
const TOP_PADDING = 15; // from your container paddingTop
const SAFE_MARGIN = 18 * 2; // you want 18 top and bottom spacing

const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - TOP_PADDING - SAFE_MARGIN;

// Dummy pitch and user
const pitch = {
  id: "1",
  thumbnail:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2F9%253A16&psig=AOvVaw292RLKOhdyyYphWZibBzPd&ust=1750270110186000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCIu7OG-Y0DFQAAAAAdAAAAABAE",
  user: {
    name: "Hellen Whilliams",
    avatar: "https://randomuser.me/api/portraits/women/76.jpg",
    tagline: "Lorem ipsum dolor sit amet",
  },
  likes: 1580,
};

const dummyUser = {
  name: "Ashley Joe",
  position: "Head of Product at Amazon",
  location: "Bengaluru, India",
  about:
    "I am a passionate and details oriented Product designer with a strong focus on creating user-centric designs that enhances usability and deliver seamless digital experiences",
  industries: [
    "Computers & Electronics",
    "Government",
    "Manufacturing",
    "Marketing & Advertising",
  ],
  interests: ["UI Design", "Leadership", "Product Strategy", "Research"],
  image:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
};

const pitches = [
  { pitch, dummyUser },
  { pitch, dummyUser },
  { pitch, dummyUser },
];

export default function PitchScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [currentPitch, setCurrentPitch] = useState(pitches[0].pitch);
  const [currentProfile, setCurrentProfile] = useState(pitches[0].dummyUser);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const current = pitches[currentIndex];
    setCurrentPitch(current.pitch);
    setCurrentProfile(current.dummyUser);
  }, [currentIndex]);

  const handleFlip = () => {
    Animated.timing(rotateAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const onScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    // index === 0 => user swiped up (to go to previous pitch)
    // index === 2 => user swiped down (to go to next pitch)
    if (index === 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (index === 2 && currentIndex < pitches.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const navigateToMyPitch = () => {
    router.push("/pitchStack/myPitch");
  };

  // Animations
  const frontRotation = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = rotateAnim.interpolate({
    inputRange: [0, 90],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const backOpacity = rotateAnim.interpolate({
    inputRange: [90, 180],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToMyPitch}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../../../assets/icons/pitch2.png")}
              style={styles.pitchIcon}
            />
            <Text style={styles.headerText}>My Pitch</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Flip Card Area */}
      <View style={styles.cardArea}>
        {/* Front Card */}
        <Animated.View
          style={[
            styles.flipCard,
            {
              transform: [{ rotateY: frontRotation }],
              opacity: frontOpacity,
              zIndex: flipped ? 0 : 1,
            },
          ]}
        >
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={pitches}
            keyExtractor={(_, i) => i.toString()}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              const newIndex = Math.round(offsetY / ITEM_HEIGHT);
              if (newIndex !== currentIndex) setCurrentIndex(newIndex);
            }}
            renderItem={({ item, index }) => {
              const isVisible = Math.abs(index - currentIndex) <= 1;
              const scale = index === currentIndex ? 1 : 0.97;
              const opacity = index === currentIndex ? 1 : 0.5;

              return (
                <Animated.View
                  style={{ transform: [{scale}], opacity, height: ITEM_HEIGHT, marginVertical: 18 }}
                >
                  {isVisible ? (
                    <MainCardWrapper
                      pitch={item.pitch}
                      onPress={handleFlip}
                      // isActive={index === currentIndex}
                      isActive={index === currentIndex && !flipped}
                    />
                  ) : null}
                </Animated.View>
              );
            }}
          />
        </Animated.View>

        {/* Back Card */}
        <Animated.View
          style={[
            styles.flipCard,
            styles.absoluteFill,
            {
              transform: [{ rotateY: backRotation }],
              opacity: backOpacity,
              zIndex: flipped ? 1 : 0,
            },
          ]}
        >
          <FlipCardWrapper item={currentProfile} onPress={handleFlip} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    top: 70,
    zIndex: 2,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  pitchIcon: {
    height: 24,
    aspectRatio: 1,
  },
  headerText: {
    fontSize: 10,
    color: "#64748B",
  },
  cardArea: {
    flex: 1,
    position: "relative",
  },
  flipCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: "hidden",
  },
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
