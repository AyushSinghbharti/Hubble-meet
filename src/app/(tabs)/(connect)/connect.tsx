import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AlertModal from "../../../components/Alerts/AlertModal";
import Header from "../../../components/Search/ConnectHeader";
import logo from '../../../../assets/logo/logo.png';
import profileData from "../../../dummyData/profileData";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 20;
const MAX_RIGHT_SWIPES = 10;
const UNDO_DURATION = 2500; // 2.5 seconds for undo window

const ProfileCard = ({ profile, onSwipeComplete, disabled, rightSwipeCount, isFirstCard, onFirstCardInteract }) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [showDetails, setShowDetails] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const [requestSentVisible, setRequestSentVisible] = useState(false);
  const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);

  const undoTimeoutRef = useRef(null);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  // Regular JS functions - no need for worklet directive
  const handleUndo = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    translateX.value = withSpring(0);
    rotate.value = withSpring(0);
    opacity.value = withTiming(1);
    setUndoVisible(false);
  }, [translateX, rotate, opacity]);

  const showUndoModal = useCallback(() => {
    setUndoVisible(true);
  }, []);

  const hideUndoModal = useCallback(() => {
    setUndoVisible(false);
  }, []);

  const showRequestSentModal = useCallback(() => {
    setRequestSentVisible(true);
  }, []);

  const showRightSwipeAlert = useCallback(() => {
    setRightSwipeAlertVisible(true);
  }, []);

  const completeSwipe = useCallback((profileId, direction) => {
    onSwipeComplete(profileId, direction);
  }, [onSwipeComplete]);

  const startUndoTimer = useCallback((profileId) => {
    undoTimeoutRef.current = setTimeout(() => {
      setUndoVisible(false);
      onSwipeComplete(profileId, 'left');
    }, UNDO_DURATION);
  }, [onSwipeComplete]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      'worklet';
      translateX.value = e.translationX;
      rotate.value = (e.translationX / width) * ROTATION_DEGREE;
    })
    .onEnd(() => {
      'worklet';
      
      const swipedLeft = translateX.value < -SWIPE_THRESHOLD;
      const swipedRight = translateX.value > SWIPE_THRESHOLD;

      if (swipedLeft) {
        translateX.value = withSpring(-width);
        rotate.value = withSpring(-ROTATION_DEGREE);

        runOnJS(showUndoModal)();
        runOnJS(startUndoTimer)(profile.id);

      } else if (swipedRight) {
        if (rightSwipeCount >= MAX_RIGHT_SWIPES) {
          runOnJS(showRightSwipeAlert)();
          translateX.value = withSpring(0);
          rotate.value = withSpring(0);
          return;
        }

        runOnJS(showRequestSentModal)();
        translateX.value = withSpring(width);
        rotate.value = withSpring(ROTATION_DEGREE);

        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          'worklet';
          if (finished) {
            runOnJS(completeSwipe)(profile.id, 'right');
          }
        });

      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const handleCardTap = useCallback(() => {
    if (isFirstCard) {
      onFirstCardInteract();
    }
    setShowDetails(prev => !prev);
  }, [isFirstCard, onFirstCardInteract]);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onEnd(() => {
      'worklet';
      runOnJS(handleCardTap)();
    });

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {!showDetails ? (
            <>
              <Image source={profile.image} style={styles.image} resizeMode="cover" />
              <TouchableOpacity style={styles.expandThumb}>
                <Image source={profile.image} style={styles.thumbImage} />
                <AntDesign name="arrowsalt" size={16} color="#fff" style={styles.expandIcon} />
              </TouchableOpacity>
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
                style={styles.gradient}
              >
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.title}>{profile.title}</Text>
                <Text style={styles.location}>{profile.location}</Text>
              </LinearGradient>
              <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Image source={require("../../../../assets/icons/share1.png")} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Image source={require("../../../../assets/icons/restart.png")} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Image source={require("../../../../assets/icons/block.png")} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ScrollView style={styles.backCardScroll}>
              <View style={styles.backCardContent}>
                <Text style={styles.backText}>{profile.backText}</Text>
              </View>
            </ScrollView>
          )}
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
        visible={requestSentVisible}
        onClose={() => setRequestSentVisible(false)}
        imageSource={require("../../../../assets/icons/tick1.png")}
        label="Request Sent"
        onButtonPress={() => setRequestSentVisible(false)}
        positionBottom
      />
    </>
  );
};

const Connect = () => {
  const [swipedIds, setSwipedIds] = useState([]);
  const [rightSwipeCount, setRightSwipeCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [firstCardInteracted, setFirstCardInteracted] = useState(false);

  const handleSwipeComplete = useCallback((id, direction) => {
    setSwipedIds((prev) => {
      const updated = [...prev, id];
      if (updated.length >= 5 && !showLimitModal) {
        setShowLimitModal(true);
      }
      return updated;
    });
    if (direction === "right") {
      setRightSwipeCount((prev) => prev + 1);
    }
  }, [showLimitModal]);

  const handleFirstCardInteraction = useCallback(() => {
    setFirstCardInteracted(true);
  }, []);

  const renderItem = useCallback(({ item, index }) => {
    return (
      <ProfileCard
        profile={item}
        onSwipeComplete={handleSwipeComplete}
        disabled={false}
        rightSwipeCount={rightSwipeCount}
        isFirstCard={index === 0 && !firstCardInteracted}
        onFirstCardInteract={handleFirstCardInteraction}
      />
    );
  }, [rightSwipeCount, firstCardInteracted, handleSwipeComplete, handleFirstCardInteraction]);

  const visibleProfileData = profileData.filter(item => !swipedIds.includes(item.id));

  return (
    <View style={styles.container}>
      <Header
        logoSource={logo}
        onSearch={(text) => console.log('Search:', text)}
        onBagPress={() => console.log('Bag pressed')}
      />
      <FlatList
        data={visibleProfileData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no profiles left to connect with!</Text>
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
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
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
  name: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  title: { fontSize: 16, color: "#f0f0f0", marginTop: 4 },
  location: { fontSize: 14, color: "#e0e0e0", marginTop: 2 },
  backCardScroll: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  backCardContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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