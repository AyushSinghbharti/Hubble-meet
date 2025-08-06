import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { FONT } from "@/assets/constants/fonts";

type IntroCardProps = {
  backgroundImage: any;
  heading: string;
  description: string;
  onNext: () => void;
  onSwipeNext: () => void;
  onSwipePrevious: () => void;
  index: number;
  currentIndex: number;
  totalSlides: number;
  isLastSlide: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const IntroCard: React.FC<IntroCardProps> = ({
  backgroundImage,
  heading,
  description,
  index,
  currentIndex,
  totalSlides,
  onNext,
  onSwipeNext,
  onSwipePrevious,
  isLastSlide,
}) => {
  const handleGestureEvent = (event: any) => {
    const { translationX, velocityX, state } = event.nativeEvent;

    // Only handle swipe if this is the active slide
    if (index !== currentIndex) return;

    // Handle swipe gestures when user releases
    if (state === State.END) {
      // Swipe right (negative translationX means swipe right)
      if (translationX < -50 || velocityX < -500) {
        onSwipeNext();
      }
      // Swipe left (positive translationX means swipe left)
      else if (translationX > 50 || velocityX > 500) {
        onSwipePrevious();
      }
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleGestureEvent}>
      <View style={{ width: SCREEN_WIDTH }}>
        <ImageBackground
          source={backgroundImage}
          style={styles.background}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "#000000B3", "#000000"]}
            style={{ flex: 1, width: "100%" }}
          >
            <View style={styles.gradientOverlay}>
              <View style={styles.card}>
                <Text style={styles.heading}>{heading}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.footer}>
                  <View style={styles.pagination}>
                    {Array.from({ length: totalSlides }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          currentIndex === i && styles.activeDot,
                        ]}
                      />
                    ))}
                  </View>
                  <View style={styles.swipeHint}>
                    <Image
                      source={require("../../assets/icons/swipe.png")}
                      style={{ height: 24, width: 24 }}
                    />
                    <Text style={styles.swipeText}>
                      {isLastSlide ? "Swipe to Start" : "Swipe"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </PanGestureHandler>
  );
};

export default IntroCard;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  card: {
    width: "90%",
    height: 288,
    marginBottom: 45,
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 12,
  },
  heading: {
    fontSize: 24,
    fontFamily: FONT.MONSERRATBOLD,
    color: "#BBCF8D",
    marginBottom: 10,
  },
  description: {
    fontFamily: FONT.MONSERRATMEDIUM,
    fontSize: 13,
    color: "#FFFFFF80",
  },
  swipeText: {
    fontSize: 15,
    marginLeft: 3,
    color: "#BBCF8D",
    fontFamily: FONT.MONSERRATMEDIUM,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 30,
    backgroundColor: "#BBCF8D",
  },
  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
