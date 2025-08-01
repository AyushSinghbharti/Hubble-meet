import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import IntroCard from "../../components/introCard";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const screenInfo = [
  {
    backgroundImage: require("../../../assets/images/LoginPageBG.jpg"),
    heading: "Make Real Connections, that Matters",
    description:
      "Join a world where conversations flow, friendship grow, and moments shine. Connect, share and vibe with your people - your way.",
  },
  {
    backgroundImage: require("../../../assets/images/IntroCardBG1.jpg"),
    heading: "Your Pitch, On Point. Every Time.",
    description:
      "Record a 30-second video to showcase who you are. Promote your personality, passion, and purpose — beyond your resume.",
  },
  {
    backgroundImage: require("../../../assets/images/IntroCardBG2.jpg"),
    heading: "Your Brand,\nIn Every Tap.",
    description:
      "View and share your VBC (Virtual Business card) in seconds. With our app, your VBC is always ready to share.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleSkip = () => {
    router.replace("/login");
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < screenInfo.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentIndex < screenInfo.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={screenInfo}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <IntroCard
            backgroundImage={item.backgroundImage}
            heading={item.heading}
            description={item.description}
            onNext={handleNext}
            index={index}
            currentIndex={currentIndex}
            totalSlides={screenInfo.length}
          />
        )}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 45,
    zIndex: 2,
    right: 24,
  },
  skipText: {
    color: "#fff",
    fontFamily: "InterSemiBold",
    fontSize: 16,
  },
});
