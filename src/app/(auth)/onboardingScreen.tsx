import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  Touchable,
  TouchableOpacity,
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
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const router = useRouter();

  const translateX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < screenInfo.length - 1) {
      setNextIndex(currentIndex + 1);

      translateX.setValue(width);

      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currentIndex + 1);
        setNextIndex(null);
      });
    } else {
      router.replace("/login");
    }
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Current Card */}
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill}>
        {currentIndex < 3 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        <IntroCard
          backgroundImage={screenInfo[currentIndex].backgroundImage}
          heading={screenInfo[currentIndex].heading}
          description={screenInfo[currentIndex].description}
          onNext={handleNext}
        />
      </View>

      {/* Next Card Sliding In */}
      {nextIndex !== null && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <IntroCard
            backgroundImage={screenInfo[nextIndex].backgroundImage}
            heading={screenInfo[nextIndex].heading}
            description={screenInfo[nextIndex].description}
            onNext={handleNext}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: { position: "absolute", top: 45, zIndex: 2, right: 24 },
  skipText: {
    color: "#fff",
    fontFamily: "InterSemiBold",
    fontSize: 16,
  },
});
