import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
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
import { useRouter } from "expo-router";

import AlertModal from "../../../components/Alerts/AlertModal";
import Header from "../../../components/Search/ConnectHeader";
import logo from "../../../../assets/logo/logo.png";
import { FONT } from "../../../../assets/constants/fonts";
import styles from "./Styles/Styles";
import BlockUserModal from "../../../components/Modal/BlockUserModal";
import ProfilePromptModal from "../../../components/Modal/ProfilePromptModal";
import ProfilePrompt from "../../../components/Modal/ProfilePromptModal";
import ShareModal from "../../../components/Share/ShareBottomSheet";
import UploadErrorModal from "../../../components/pitchScreenComps/popUpNotification";
import {
  useAcceptConnection,
  useSendConnection,
  useUserConnections,
} from "@/src/hooks/useConnection";
import { useAuthStore } from "@/src/store/auth";
import { UserProfile } from "@/src/interfaces/profileInterface";
import ErrorAlert from "@/src/components/errorAlert";
import { useConnectionStore } from "@/src/store/connectionStore";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;
const UNDO_DURATION = 2000; // 2 seconds for undo window

const ProfileCard = ({
  profile,
  onSwipeComplete,
  rightSwipeCount,
  isExpanded,
  onToggleDetails,
  hasFlipped,
  setError,
}: {
  profile: UserProfile;
  onSwipeComplete: any;
  rightSwipeCount: any;
  isExpanded: boolean;
  onToggleDetails: any;
  hasFlipped: boolean;
  setError: any;
}) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const [undoVisible, setUndoVisible] = useState(false);
  const [requestSentVisible, setRequestSentVisible] = useState(false);
  const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);
  const [shareAlertVisible, setShareAlertVisible] = useState(false);
  const [blockAlertVisible, setBlockAlertVisible] = useState(false);
  const [thumbImageAlertVisible, setThumbImageAlertVisible] = useState(false);
  const [flippedProfiles, setFlippedProfiles] = useState({});
  const [showShare, setShowShare] = useState(false);

  //Store data
  const userId = useAuthStore((state) => state.userId);
  const connections = useAuthStore((state) => state.userId);
  //Backend Testing
  const { mutate: sendConnection } = useSendConnection();
  const { mutate: acceptConnection } = useAcceptConnection();
  const handleSendConnection = () => {
    if (!userId || !profile?.user_id) {
      console.warn("Missing user or receiver id");
      return;
    }

    sendConnection(
      {
        user_id: userId,
        receiver_id: profile.user_id,
      },
      {
        onSuccess: (res) => console.log(res),
        onError: (error) => {
          const message =
            error?.response?.data?.message ?? "Something went wrong";
          setError(message);
        },
      }
    );
  };

  const undoTimeoutRef = useRef(null);

  const route = useRouter();

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

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

  const showRequestSentModal = useCallback(() => {
    setRequestSentVisible(true);
  }, []);

  const showRightSwipeAlert = useCallback(() => {
    setRightSwipeAlertVisible(true);
  }, []);

  const showShareAlert = useCallback(() => {
    setShareAlertVisible(true);
  }, []);

  const showBlockAlert = useCallback(() => {
    setBlockAlertVisible(true);
  }, []);

  const showThumbImageAlert = useCallback(() => {
    setThumbImageAlertVisible(true);
  }, []);

  const completeSwipe = useCallback(
    (profileId: string, direction: string) => {
      onSwipeComplete(profileId, direction);
    },
    [onSwipeComplete]
  );

  const startUndoTimer = useCallback(
    (profileId) => {
      undoTimeoutRef.current = setTimeout(() => {
        setUndoVisible(false);
        onSwipeComplete(profileId, "left");
      }, UNDO_DURATION);
    },
    [onSwipeComplete]
  );

  const handleButtonPress = useCallback(() => {
    buttonOpacity.value = withTiming(0.5, { duration: 100 }, () => {
      buttonOpacity.value = withTiming(1, { duration: 100 });
    });
  }, [buttonOpacity]);

  const handleShareButtonPress = useCallback(
    (event) => {
      event.stopPropagation();
      handleButtonPress();
      showShareAlert();
      setShowShare(true);
    },
    [handleButtonPress, showShareAlert]
  );

  const handleRestartButtonPress = useCallback(
    (event) => {
      event.stopPropagation();
      handleButtonPress();
      showBlockAlert();
    },
    [handleButtonPress, showBlockAlert]
  );

  const handleThumbImagePress = useCallback(
    (event) => {
      event.stopPropagation();
      showThumbImageAlert();
      route.push("/(pitch)/pitch"); // ✅ placed correctly
    },
    [showThumbImageAlert, route] // ✅ dependency array
  );

  const handleImageTap = useCallback(() => {
    onToggleDetails(profile);
  }, [onToggleDetails, profile.user_id]);

  // Pan gesture for swiping
  const panGesture = Gesture.Pan()
    .enabled(hasFlipped) // only allow swipe after flip
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      "worklet";
      translateX.value = e.translationX;
      rotate.value = (e.translationX / width) * ROTATION_DEGREE;
    })
    .onEnd(() => {
      "worklet";
      const swipedLeft = translateX.value < -SWIPE_THRESHOLD;
      const swipedRight = translateX.value > SWIPE_THRESHOLD;

      if (swipedLeft) {
        translateX.value = withSpring(-width);
        rotate.value = withSpring(-ROTATION_DEGREE);
        runOnJS(showUndoModal)();
        runOnJS(startUndoTimer)(profile.user_id);
      } else if (swipedRight) {
        if (rightSwipeCount >= MAX_RIGHT_SWIPES) {
          runOnJS(showRightSwipeAlert)();
          translateX.value = withSpring(0);
          rotate.value = withSpring(0);
          return;
        }
        runOnJS(handleSendConnection)();
        runOnJS(showRequestSentModal)();
        translateX.value = withSpring(width);
        rotate.value = withSpring(ROTATION_DEGREE);
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          "worklet";
          if (finished) {
            runOnJS(completeSwipe)(profile.user_id, "right");
          }
        });
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  // Tap gesture for the image in compact view and detailed view
  const imageTapGesture = Gesture.Tap().onEnd(() => {
    "worklet";
    runOnJS(handleImageTap)();
  });

  // Combine gestures: pan for the entire card, tap for the image
  const cardGesture = Gesture.Simultaneous(panGesture);
  const detailGesture = Gesture.Simultaneous(imageTapGesture);
  return (
    <>
      {!isExpanded ? (
        <GestureDetector gesture={cardGesture}>
          <Animated.View style={[styles.card, cardStyle]}>
            <GestureDetector gesture={imageTapGesture}>
              <Image
                source={{ uri: profile.profile_picture_url }}
                style={styles.image}
                resizeMode="cover"
              />
            </GestureDetector>

            <TouchableOpacity
              style={styles.expandThumb}
              onPress={handleThumbImagePress}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: profile.profile_picture_url }}
                style={styles.thumbImage}
              />
              <AntDesign
                name="arrowsalt"
                size={16}
                color="#fff"
                style={styles.expandIcon}
              />
            </TouchableOpacity>

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
              style={styles.gradient}
            >
              <Text style={styles.name}>{profile.full_name}</Text>
              <Text style={styles.title}>{profile.job_title}</Text>
              <Text style={styles.location}>{profile.city}</Text>
            </LinearGradient>

            <View style={styles.bottomActions}>
              <TouchableOpacity
                onPress={handleShareButtonPress}
                activeOpacity={0.7}
              >
                <Animated.View style={[styles.actionButton, buttonStyle]}>
                  <Image
                    source={require("../../../../assets/icons/share1.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRestartButtonPress}
                activeOpacity={0.7}
              >
                <Animated.View style={[styles.actionButton, buttonStyle]}>
                  <Image
                    source={require("../../../../assets/icons/block2.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
      ) : (
        <GestureDetector gesture={detailGesture}>
          <Animated.View style={[styles.detailContent]}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={styles.backCardScroll}
              contentContainerStyle={styles.backCardScrollContent}
            >
              <ImageBackground
                source={{ uri: profile.profile_picture_url }}
                style={styles.backCardContent}
              >
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.03)",
                    "#fff",
                    "#fff",
                    "#fff",
                    "#fff",
                  ]}
                  style={styles.gradientOverlay}
                >
                  <View style={styles.detailContent}>
                    <Text
                      style={[
                        styles.name,
                        { color: "#000", fontFamily: FONT.BOLD },
                      ]}
                    >
                      {profile.full_name}
                    </Text>
                    <Text
                      style={[
                        styles.title,
                        { color: "#000", fontFamily: FONT.SEMIBOLD },
                      ]}
                    >
                      {profile.job_title}
                    </Text>
                    <Text
                      style={[
                        styles.location,
                        { color: "#000", fontFamily: FONT.BOLD },
                      ]}
                    >
                      {profile.city}
                    </Text>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>About</Text>
                      <Text
                        style={[styles.backText, { fontFamily: FONT.MEDIUM }]}
                      >
                        {profile.bio}
                      </Text>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Industries</Text>
                      <View style={styles.tagsContainer}>
                        {profile.current_industry?.map((industry, index) => (
                          <View key={index} style={styles.tagBox}>
                            <Text style={styles.tagText}>{industry}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Areas of Interest</Text>
                      <View style={styles.tagsContainer}>
                        {profile.industries_of_interest?.map(
                          (interest, index) => (
                            <View key={index} style={styles.tagBox}>
                              <Text style={styles.tagText}>{interest}</Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      )}

      <View>
        <AlertModal
          visible={undoVisible}
          onClose={handleUndo}
          imageSource={require("../../../../assets/icons/cross.png")}
          label="Profile Rejected"
          buttonText="Undo"
          viewButton
          onButtonPress={handleUndo}
          positionTop
        />
      </View>

      <View>
        <AlertModal
          visible={rightSwipeAlertVisible}
          onClose={() => setRightSwipeAlertVisible(false)}
          imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
          label="Daily right swipe limit reached (10/10)"
          buttonText="OK"
          viewButton
          onButtonPress={() => setRightSwipeAlertVisible(false)}
          positionBottom
        />
      </View>

      <View>
        <AlertModal
          visible={requestSentVisible}
          onClose={() => setRequestSentVisible(false)}
          imageSource={require("../../../../assets/icons/tick1.png")}
          label="Request Sent"
          onButtonPress={() => setRequestSentVisible(false)}
          positionTop
        />
      </View>

      <View>
        <ShareModal
          visible={shareAlertVisible}
          onClose={() => setShareAlertVisible(false)}
        />
      </View>

      <View>
        <BlockUserModal
          visible={blockAlertVisible}
          onClose={() => setBlockAlertVisible(false)}
          onSubmit={() => setBlockAlertVisible(false)}
          label="Profile Blocked"
          buttonText="OK"
          userName={profile?.full_name || "This user"}
        />
      </View>
    </>
  );
};

const Connect = () => {
  const [swipedIds, setSwipedIds] = useState([]);
  const [rightSwipeCount, setRightSwipeCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [expandedProfileId, setExpandedProfileId] = useState(null);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recommendations = useConnectionStore((state) => state.recommendations);


  const handleSwipeComplete = useCallback(
    (id, direction) => {
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

      setHasFlipped(false);
      setExpandedProfileId(null);
    },
    [showLimitModal]
  );

  const handleToggleDetails = useCallback((profile) => {
    const profileId = profile.user_id;
    setExpandedProfileId((prev) => (prev === profileId ? null : profileId));
    if (profileId) setHasFlipped(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: UserProfile }) => {
      return (
        <ProfileCard
          profile={item}
          onSwipeComplete={handleSwipeComplete}
          rightSwipeCount={rightSwipeCount}
          isExpanded={expandedProfileId === item.user_id}
          onToggleDetails={handleToggleDetails}
          hasFlipped={hasFlipped}
          setError={setError}
        />
      );
    },
    [rightSwipeCount, handleSwipeComplete, expandedProfileId]
  );

  const visibleProfileData = expandedProfileId
    ? recommendations.filter((item) => item.user_id === expandedProfileId)
    : recommendations
        .filter((item) => !swipedIds.includes(item.user_id))
        .slice(0, 1);

  return (
    <View style={styles.container}>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <Header
        logoSource={logo}
        onSearch={(text) => console.log("Search:", text)}
      />
      <FlatList
        data={visibleProfileData}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You have no profiles left to connect with!
            </Text>
          </View>
        }
      />

      <View>
        <ProfilePrompt
          visible={showLimitModal}
          onCancel={() => setShowLimitModal(false)}
          onProceed={() => setShowLimitModal(false)}
        />
      </View>
    </View>
  );
};

export default Connect;
