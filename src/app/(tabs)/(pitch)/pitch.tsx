import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import FlipCardWrapper from "../../../components/pitchScreenComps/flipCardWrapper";
import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";

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

import { Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 70;
const TAB_BAR_HEIGHT = 55;
const ITEM_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - TAB_BAR_HEIGHT;

export default function PitchScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFlip = () => {
    Animated.timing(rotateAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
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

  const RenderCard = ({ pitch, dummyUser, isActive }) => {
    return (
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
          <MainCardWrapper
            pitch={pitch}
            onPress={handleFlip}
            isActive={isActive}
            isFlipped={flipped}
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
          <FlipCardWrapper item={dummyUser} onPress={handleFlip} />
        </Animated.View>
      </View>
    );
  };

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
      <FlatList
        ref={flatListRef}
        data={pitches}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <RenderCard
            pitch={item.pitch}
            dummyUser={item.dummyUser}
            isActive={index === currentIndex}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        onViewableItemsChanged={
          useRef(({ viewableItems }) => {
            if (viewableItems.length > 0) {
              setCurrentIndex(viewableItems[0].index);
            }
          }).current
        }
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={{ height: ITEM_HEIGHT }}
        snapToInterval={ITEM_HEIGHT}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 32,
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
    height: ITEM_HEIGHT,
    width: "100%",
  },
  flipCard: {
    flex: 1,
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
