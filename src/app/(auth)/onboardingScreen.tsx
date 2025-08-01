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
import { PanGestureHandler, State } from "react-native-gesture-handler";
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

  const handleNext = () => {
    if (currentIndex < screenInfo.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      // User is on last slide and pressed next
      router.replace("/login");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleSwipeNext = () => {
    if (currentIndex === screenInfo.length - 1) {
      // User swiped right on last slide
      router.replace("/login");
    } else {
      handleNext();
    }
  };

  const handleSwipePrevious = () => {
    handlePrevious();
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
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
            onSwipeNext={handleSwipeNext}
            onSwipePrevious={handleSwipePrevious}
            index={index}
            currentIndex={currentIndex}
            totalSlides={screenInfo.length}
            isLastSlide={index === screenInfo.length - 1}
          />
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
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
