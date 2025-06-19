import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
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
import Toast from "react-native-toast-message";
import MatchModal from "../../../components/Alerts/RequestModalAlert";
import AlertModal from "../../../components/Alerts/AlertModal";
import Header from "../../../components/Search/ConnectHeader";
import logo from '../../../../assets/logo/logo.png';
import ProfilePromptModal from "../../../components/Modal/ProfilePromptModal";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = 120;
const MAX_RIGHT_SWIPES = 10;

const profileData = [
  {
    id: "1",
    image: require("../../../../assets/images/p1.jpg"),
    name: "Vikram Roy",
    title: "Head of Product at Amazon",
    location: "Bengaluru, India",
    backText: "Passionate about building innovative products.",
  },
  {
    id: "2",
    image: require("../../../../assets/images/p1.jpg"),
    name: "Vikram Roy",
    title: "Head of Product at Amazon",
    location: "Bengaluru, India",
    backText: "Passionate about building innovative products.",
  },
  {
    id: "3",
    image: require("../../../../assets/images/p1.jpg"),
    name: "Vikram Roy",
    title: "Head of Product at Amazon",
    location: "Bengaluru, India",
    backText: "Passionate about building innovative products.",
  },
  {
    id: "4",
    image: require("../../../../assets/images/p1.jpg"),
    name: "Vikram Roy",
    title: "Head of Product at Amazon",
    location: "Bengaluru, India",
    backText: "Passionate about building innovative products.",
  },
  {
    id: "5",
    image: require("../../../../assets/images/p1.jpg"),
    name: "Vikram Roy",
    title: "Head of Product at Amazon",
    location: "Bengaluru, India",
    backText: "Passionate about building innovative products.",
  },
];

const ProfileCard = ({ profile, onSwipeComplete, disabled, rightSwipeCount }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const flipY = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { rotateY: `${flipY.value}deg` },
    ],
    opacity: isSwiped ? 0 : translateX.value === 0 ? 1 : 0.8,
    backfaceVisibility: 'hidden',
  }));

  const backCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { rotateY: `${flipY.value + 180}deg` },
    ],
    opacity: isSwiped ? 0 : translateX.value === 0 ? 1 : 0.8,
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
  }));

  const handleFlip = useCallback(() => {
    if (!isFlipped) {
      flipY.value = withSpring(180);
      setIsFlipped(true);
    } else {
      flipY.value = withSpring(0);
      setIsFlipped(false);
    }
  }, [isFlipped]);

  const handleSwipe = useCallback((direction) => {
    if (direction === "left") {
      setUndoVisible(true);
      setTimeout(() => {
        setUndoVisible(false);
        setIsSwiped(true);
        runOnJS(onSwipeComplete)(profile.id, "left");
      }, 2000);
    } else if (direction === "right") {
      if (rightSwipeCount >= MAX_RIGHT_SWIPES) {
        setRightSwipeAlertVisible(true);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
        return;
      }
      setModalVisible(true);
    }
  }, [profile.id, onSwipeComplete, rightSwipeCount]);

  const handleUndo = useCallback(() => {
    setUndoVisible(false);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  }, []);

  const panGesture = Gesture.Pan()
    .enabled(!isSwiped && !disabled && isFlipped)
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = (event.translationX / width) * 15;
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width * 2);
        translateY.value = withSpring(-100);
        rotate.value = withSpring(-30);
        runOnJS(handleSwipe)("left");
      } else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width * 2);
        translateY.value = withSpring(-100);
        rotate.value = withSpring(30);
        runOnJS(handleSwipe)("right");
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const tapGesture = Gesture.Tap()
    .enabled(!isSwiped && !disabled)
    .onEnd(() => {
      runOnJS(handleFlip)();
    });

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  const handleSendMessage = () => {
    setModalVisible(false);
    setIsSwiped(true);
    onSwipeComplete(profile.id, "right");
    Toast.show({
      type: 'success',
      text1: 'Request Sent',
      text2: `Connection request sent to ${profile.name}`,
    });
  };

  const handleBackToRequest = () => {
    setModalVisible(false);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  };

  if (isSwiped) return null;

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Image source={profile.image} style={styles.image} resizeMode="cover" />
          <TouchableOpacity style={styles.expandThumb}>
            <Image source={profile.image} style={styles.thumbImage} />
            <AntDesign name="arrowsalt" size={16} color="#fff" style={styles.expandIcon} />
          </TouchableOpacity>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.9)", "#fff"]}
            style={styles.gradient}
          >
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.title}>{profile.title}</Text>
            <Text style={styles.location}>{profile.location}</Text>
          </LinearGradient>
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log("Share", profile.id)}
            >
              <Image style={{ height: 18, width: 18 }} source={require("../../../../assets/icons/share1.png")} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log("Restart", profile.id)}
            >
              <Image style={{ height: 18, width: 18 }} source={require("../../../../assets/icons/restart.png")} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log("Block", profile.id)}
            >
              <Image style={{ height: 18, width: 18 }} source={require("../../../../assets/icons/block.png")} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.card, backCardStyle]}>
          <View style={styles.backCard}>
                      <Image source={profile.image} style={styles.image} resizeMode="cover" />

            <Text style={styles.backText}>{profile.backText}</Text>
          </View>
          <View style={styles.bottomActions}>
          </View>
        </Animated.View>
      </GestureDetector>
      <AlertModal
        visible={undoVisible}
        onClose={handleUndo}
        imageSource={require("../../../../assets/icons/undo.png")}
        label="Undo the Reject"
        buttonText="Undo"
        onButtonPress={handleUndo}
        positionBottom
      />
      {/* <ProfilePromptModal
        visible={modalVisible}
        onClose={handleBackToRequest}
        onSendMessage={handleSendMessage}
      /> */}
      <AlertModal
        visible={rightSwipeAlertVisible}
        onClose={() => setRightSwipeAlertVisible(false)}
        imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
        label="Daily right swipe limit reached (10/10)"
        buttonText="OK"
        onButtonPress={() => setRightSwipeAlertVisible(false)}
        positionBottom
      />
      <AlertModal
        visible={modalVisible}
        onClose={handleBackToRequest}
        imageSource={require("../../../../assets/icons/tick1.png")}
        label="Request Sent"
        onButtonPress={handleSendMessage}
        positionBottom
      />
    </>
  );
};

const Connect = () => {
  const [swipedIds, setSwipedIds] = useState([]);
  const [rightSwipeCount, setRightSwipeCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleSwipeComplete = useCallback((id, direction) => {
    setSwipedIds((prev) => {
      const updated = [...prev, id];
      if (updated.length >= 5) setShowLimitModal(true);
      return updated;
    });
    if (direction === "right") {
      setRightSwipeCount((prev) => prev + 1);
    }
  }, []);

  const renderItem = useCallback(({ item }) => {
    if (swipedIds.includes(item.id)) return null;
    return (
      <ProfileCard
        profile={item}
        onSwipeComplete={handleSwipeComplete}
        disabled={swipedIds.length >= 5}
        rightSwipeCount={rightSwipeCount}
      />
    );
  }, [swipedIds, rightSwipeCount]);

  return (
    <View style={styles.container}>
      <Header
        logoSource={logo}
        onSearch={(text) => console.log('Search:', text)}
        onBagPress={() => console.log('Bag pressed')}
      />
      <FlatList
        data={profileData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no Request yet</Text>
          </View>
        }
      />
      <AlertModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
        label="You need to complete the profile\nto swipe on more profiles"
        buttonText="Complete Profile"
        onButtonPress={() => setShowLimitModal(false)}
      />
      <Toast />
    </View>
  );
};

export default Connect;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
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
  image: { width: "100%", height: "100%", position: "absolute" },
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
  expandIcon: { position: "absolute", top: 4, right: 4 },
  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    alignItems: "flex-start",
  },
  name: { fontSize: 24, fontWeight: "bold", color: "#000" },
  title: { fontSize: 16, color: "#444", marginTop: 4 },
  location: { fontSize: 14, color: "#666", marginTop: 2 },
  backCard: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.5,
  },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#666" },
  bottomActions: {
    position: "absolute",
    bottom: 20,
    right: 16,
    flexDirection: "column",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#BBCF8D",
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    width: 48,
    height: 48,
    justifyContent: "center",
  },
});