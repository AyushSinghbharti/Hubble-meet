import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import MatchModal from "../../../components/Alerts/RequestModalAlert";
import AlertModal from "../../../components/Alerts/AlertModal";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = 120;

interface Profile {
  id: string;
  image: any;
  name: string;
  title: string;
  location: string;
}

interface ProfileCardProps {
  profile: Profile;
  onSwipeComplete: (id: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipeComplete }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const [isSwiped, setIsSwiped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: isSwiped ? 0 : translateX.value === 0 ? 1 : 0.8,
  }));

  const handleSwipe = useCallback((direction: string) => {
    if (direction === "left") {
      setAlertVisible(true);
      setTimeout(() => {
        setIsSwiped(true);
        onSwipeComplete(profile.id);
      }, 1000);
    } else if (direction === "right") {
      setModalVisible(true);
    }
  }, [profile.id, onSwipeComplete]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .activeOffsetY([-1000, 1000])
    .onUpdate((event) => {
      if (!isSwiped) {
        translateX.value = event.translationX;
        rotate.value = (event.translationX / width) * 15;
      }
    })
    .onEnd(() => {
      if (isSwiped) return;
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width * 2);
        rotate.value = withSpring(-30);
        runOnJS(handleSwipe)("left");
      } else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width * 2);
        rotate.value = withSpring(30);
        runOnJS(handleSwipe)("right");
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const handleSendMessage = () => {
    setModalVisible(false);
    setIsSwiped(true);
    onSwipeComplete(profile.id);
  };

  const handleBackToRequest = () => {
    setModalVisible(false);
    setIsSwiped(true);
    onSwipeComplete(profile.id);
  };

  if (isSwiped) return null;

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Orbit Background Circles */}
          <View style={styles.orbitContainer}>
            <View style={styles.orbitCircleLarge} />
            <View style={styles.orbitCircleMedium} />
            <View style={styles.orbitCircleSmall} />
          </View>

          {/* Profile Image */}
          <Image source={profile.image} style={styles.image} resizeMode="cover" />

          {/* Thumbnail with Expand Icon */}
          <TouchableOpacity style={styles.expandThumb}>
            <Image source={profile.image} style={styles.thumbImage} />
            <AntDesign name="arrowsalt" size={16} color="#fff" style={styles.expandIcon} />
          </TouchableOpacity>

          {/* Gradient with Info */}
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.9)", "#fff"]}
            style={styles.gradient}
          >
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.title}>{profile.title}</Text>
            <Text style={styles.location}>{profile.location}</Text>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>

      {/* Alert Modal */}
      <AlertModal
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        imageSource={require("../../../../assets/icons/Cross.png")}
        label="Request Rejected"
        positionBottom
      />

      {/* Match Modal */}
      <MatchModal
        visible={modalVisible}
        onClose={handleBackToRequest}
        onSendMessage={handleSendMessage}
        user1Image={Image.resolveAssetSource(profile.image).uri}
        user2Image={Image.resolveAssetSource(profile.image).uri}
      />
    </>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: CARD_HEIGHT * 1.9,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 10,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  expandThumb: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 10,
    overflow: "hidden",
    width: 80,
    height: 120,
    backgroundColor: "#00000020",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  expandIcon: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    alignItems: "flex-start",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  // 🌌 Orbit Circles
  orbitContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  orbitCircleLarge: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    position: "absolute",
  },
  orbitCircleMedium: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "#c0c0c0",
    position: "absolute",
  },
  orbitCircleSmall: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#b0b0b0",
    position: "absolute",
  },
});
