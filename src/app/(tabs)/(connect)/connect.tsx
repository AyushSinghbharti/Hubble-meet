import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
  interpolate,
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
import ProfilePrompt from "../../../components/Modal/ProfilePromptModal";
import ShareModal from "../../../components/Share/ShareBottomSheet";
import {
  useAcceptConnection,
  useSendConnection,
} from "@/src/hooks/useConnection";
import { useAuthStore } from "@/src/store/auth";
import { UserProfile } from "@/src/interfaces/profileInterface";
import ErrorAlert from "@/src/components/errorAlert";
import { useConnectionStore } from "@/src/store/connectionStore";
import { useInAppNotify } from "@/src/hooks/useInAppNotify";
import { fetchUserProfile } from "@/src/api/profile";
import { usePitchStore } from "@/src/store/pitchStore";
import { AxiosError } from "axios";
import { useAppState } from "@/src/store/appState"; // Import the updated store
import { MotiView } from "moti";
import ConnectCard from "@/src/components/skeletons/connectCard";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;
const UNDO_DURATION = 2000; // 2 seconds for undo window

const ProfileCard = ({
  profile,
  onSwipeComplete,
  onRejectSwipe, // New prop to notify parent of reject swipe
  rightSwipeCount,
  persistentSwipeCount,
  isExpanded,
  onToggleDetails,
  setError,
  isProfileCompleted,
  isPromptVisible,
}: {
  profile: UserProfile;
  onSwipeComplete: any;
  onRejectSwipe: (profile: UserProfile) => void; // Define the new prop
  rightSwipeCount: number;
  persistentSwipeCount: number;
  isExpanded: boolean;
  onToggleDetails: any;
  setError: any;
  isProfileCompleted: boolean;
  isPromptVisible: boolean;
}) => {

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);


  // const [undoVisible, setUndoVisible] = useState(false); // Remove this local state
  const [requestSentVisible, setRequestSentVisible] = useState(false);
  const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);
  const [shareAlertVisible, setShareAlertVisible] = useState(false);
  const [blockAlertVisible, setBlockAlertVisible] = useState(false);
  const [thumbImageAlertVisible, setThumbImageAlertVisible] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const rotationY = useSharedValue(0); // 0 for front, 180 for back
  const recommendations = useConnectionStore((s) => s.recommendations);
  const userId = useAuthStore((state) => state.userId);
  const { mutate: sendConnection } = useSendConnection();


  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const route = useRouter();


  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { perspective: 1000 },
      {
        rotateY: `${interpolate(
          rotationY.value,
          [0, 1],
          [0, 180]
        )}deg`,
      },
    ],
    opacity: opacity.value,
  }));


  const backCardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      {
        rotateY: `${interpolate(
          rotationY.value,
          [0, 1],
          [180, 360]
        )}deg`,
      },
    ],
    opacity: interpolate(rotationY.value, [0.5, 1], [0, 1]),
  }));


  const frontCardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      {
        rotateY: `${interpolate(
          rotationY.value,
          [0, 1],
          [0, -180]
        )}deg`,
      },
    ],
    opacity: interpolate(rotationY.value, [0, 0.5], [1, 0]), // Visible when not rotated
  }));

  const handleUndoLocal = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    translateX.value = withSpring(0);
    rotate.value = withSpring(0);
    opacity.value = withTiming(1);
    // setUndoVisible(false); // This is now managed by the parent
  }, [translateX, rotate, opacity]);

  // Show various modals/alerts handlers
  // const showUndoModal = useCallback(() => { // Remove this
  //   setUndoVisible(true);
  // }, []);
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

  // Called after swipe animations finish
  const completeSwipe = useCallback(
    (profileId: string, direction: string) => {
      onSwipeComplete(profileId, direction);
    },
    [onSwipeComplete]
  );

  // Undo timer starts countdown to finalize reject after undo window
  // This timer logic will now be handled in the parent `Connect` component
  // to ensure the alert appears on the *next* card.
  // const startUndoTimer = useCallback( // Remove this or adapt if local visual feedback is desired
  //   (profileId) => {
  //     undoTimeoutRef.current = setTimeout(() => {
  //       // setUndoVisible(false); // No longer managed locally
  //       onSwipeComplete(profileId, "left"); // left means reject
  //     }, UNDO_DURATION);
  //   },
  //   [onSwipeComplete]
  // );

  // Sends connection (right swipe)
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
    (event, userId) => {
      event.stopPropagation();
      const { setCurrentPitchUser } = usePitchStore.getState();
      const userProfile = recommendations.find(
        (user) => user.user_id === userId
      );
      if (userProfile) {
        setCurrentPitchUser(userProfile);
        showThumbImageAlert && showThumbImageAlert();
        route.push({
          pathname: "/pitch",
          params: { focusUserId: userId },
        });
      } else {
        console.warn("⚠️ User profile not found for user_id:", userId);
      }
    },
    [recommendations, showThumbImageAlert, route]
  );







  const handleImageTap = useCallback(() => {

    if (!isPromptVisible) {
      rotationY.value = withTiming(isExpanded ? 0 : 1, { duration: 400 }); // Animate 0 to 1 for flip
      onToggleDetails(profile);
    }
  }, [onToggleDetails, profile, isExpanded, rotationY, isPromptVisible]);// Pass the whole profile object, not just ID


  const panGesture = Gesture.Pan()
    .enabled(!isPromptVisible && !isExpanded)
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
        runOnJS(onRejectSwipe)(profile); // Notify parent about rejection
        translateX.value = withSpring(-width);
        rotate.value = withSpring(-ROTATION_DEGREE);
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          "worklet";
          if (finished) {
            runOnJS(completeSwipe)(profile.user_id, "left");
          }
        });
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

  const imageTapGesture = Gesture.Tap().onEnd(() => {
    "worklet";
    runOnJS(handleImageTap)();
  });




  return (
    <>
      {!isExpanded ? (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, cardStyle]}>
            <GestureDetector gesture={imageTapGesture}>
              <Animated.Image
                source={{ uri: profile.profile_picture_url }}
                style={styles.image}
                resizeMode="cover"
              />
            </GestureDetector>

            <TouchableOpacity
              style={styles.expandThumb}
              onPress={(e) => handleThumbImagePress(e, profile.user_id)}

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
              <Text style={styles.title}>{profile.job_title || ""}</Text>
              <Text style={styles.location}>{profile.city || ""}</Text>
            </LinearGradient>

            <View style={styles.bottomActions}>
              <TouchableOpacity
                onPress={handleShareButtonPress}
                activeOpacity={0.7}
                accessibilityLabel={`Share ${profile?.full_name || "user"
                  }'s profile`}
                accessibilityRole="button"
              >
                <Animated.View style={[styles.actionButton,]}>
                  <Image
                    source={require("../../../../assets/icons/share1.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRestartButtonPress}
                activeOpacity={0.7}
                accessibilityLabel={`Block ${profile?.full_name || "user"}`}
                accessibilityRole="button"
              >
                <Animated.View style={[styles.actionButton,]}>
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
        // When expanded, the whole card view should be tappable to toggle back
        <GestureDetector gesture={imageTapGesture}>
          <Animated.View style={[styles.detailContent]}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={styles.backCardScroll}
              contentContainerStyle={[styles.card, cardStyle]}
            >
              <ImageBackground
                source={{ uri: profile.profile_picture_url }}
                style={styles.backCardContent}
                resizeMode="cover"
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
                        {(profile.current_industry || []).map(
                          (industry, index) => (
                            <View key={index} style={styles.tagBox}>
                              <Text style={styles.tagText}>{industry}</Text>
                            </View>
                          )
                        )}
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


      <AlertModal
        visible={rightSwipeAlertVisible}
        onClose={() => setRightSwipeAlertVisible(false)}
        imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
        label={`Daily right swipe limit reached (${MAX_RIGHT_SWIPES}/${MAX_RIGHT_SWIPES})`}
        buttonText="OK"
        viewButton
        onButtonPress={() => setRightSwipeAlertVisible(false)}
        positionBottom
      />


      <AlertModal
        visible={requestSentVisible}
        onClose={() => setRequestSentVisible(false)}
        imageSource={require("../../../../assets/icons/tick1.png")}
        label="Request Sent"
        onButtonPress={() => setRequestSentVisible(false)}
        positionTop
      />


      <ShareModal
        visible={shareAlertVisible}
        onClose={() => setShareAlertVisible(false)}
        cardProfile={profile}
      />

      <BlockUserModal
        visible={blockAlertVisible}
        onClose={() => setBlockAlertVisible(false)}
        userName={profile?.full_name || "This user"}
        blockedUserId={profile?.user_id}
        onBlockSuccess={() => {

          translateX.value = withSpring(-width);
          rotate.value = withSpring(-ROTATION_DEGREE);
          opacity.value = withTiming(0, { duration: 300 }, (finished) => {
            if (finished) runOnJS(completeSwipe)(profile.user_id, "blocked");
          });
        }}
      />
    </>
  );
};

const Connect = () => {
  const [rightSwipeCount, setRightSwipeCount] = useState(0);
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false); // Manage undo alert here
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null); // New ref for undo timer in Connect

  const [rejectedStack, setRejectedStack] = useState<UserProfile[]>([]);

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = useAuthStore((s) => s.user?.user_id);
  const recommendations = useConnectionStore((s) => s.recommendations);
  const addRecommendation = useConnectionStore((s) => s.addRecommendation);
  const recommendationsId = useConnectionStore((s) => s.recommendationsId);
  const { currentPitchUser, clearCurrentPitchUser } = usePitchStore();

  const {
    isProfileComplete,
    swipeCount: persistentSwipeCount,
    swipedProfileIds,
    hasShownProfilePrompt,
    incrementSwipeCount,
    addSwipedProfileId,
    setProfileComplete,
    setProfilePromptShown,
    initializeAppState,
  } = useAppState();

  useEffect(() => {
    initializeAppState();
  }, [initializeAppState]);


  useEffect(() => {
    if (!user || typeof user !== "object") {
      setProfileComplete(false);
      return;
    }
    const hasIncompleteFields = Object.values(user).some(
      (value) => value === undefined || value === null || value === ""
    );
    const isComplete = !hasIncompleteFields;

    setProfileComplete((prev) => {
      if (prev !== isComplete) return isComplete;
      return prev;
    });

    if (!isComplete && !hasShownProfilePrompt) {
      setShowLimitModal(true);
      setProfilePromptShown(true);
    }
  }, [user, hasShownProfilePrompt, setProfileComplete, setProfilePromptShown]);


  useEffect(() => {
    const fetchAndStore = async () => {
      const existingIds = new Set(recommendations.map((rec) => rec.user_id));
      for (const id of recommendationsId) {
        if (id === userId || existingIds.has(id)) continue;
        try {
          const profile = await fetchUserProfile(id);
          addRecommendation(profile);
        } catch (err) {
          const axiosError = err as AxiosError<any>;
          const status = axiosError.response?.status;

          if (status !== 404) {
            console.warn(
              "Failed to fetch recommendation profile:",
              id,
              axiosError
            );
          }
        }
      }
    };
    fetchAndStore();
  }, [recommendationsId]);

  // New handler for when a profile is rejected (left swipe)
  const handleProfileRejectSwipe = useCallback(
    (profile: UserProfile) => {
      setRejectedStack((prev) => [profile, ...prev]);
      setUndoVisible(true); // Show the undo alert for the *next* profile
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      undoTimeoutRef.current = setTimeout(() => {
        setUndoVisible(false); // Hide after UNDO_DURATION
        // No need to call onSwipeComplete here, as it's already called when the card fully animates off
      }, UNDO_DURATION);
    },
    []
  );

  // Called when a swipe completes.
  const handleSwipeComplete = useCallback(
    async (user_id: string, direction: string) => {
      clearCurrentPitchUser();

      // Find profile details for the swiped user_id
      const swipedProfile = recommendations.find((p) => p.user_id === user_id);

      if (direction === "right") {
        setRightSwipeCount((prev) => prev + 1);
      } else if (direction === "left") {

      }

      await addSwipedProfileId(user_id);
      const newSwipeCount = await incrementSwipeCount();

      if (newSwipeCount >= 5 && !isProfileComplete && !hasShownProfilePrompt) {
        setShowLimitModal(true);
        setProfilePromptShown(true);
      }

      setExpandedProfileId(null);
    },
    [
      clearCurrentPitchUser,
      addSwipedProfileId,
      incrementSwipeCount,
      isProfileComplete,
      hasShownProfilePrompt,
      setProfilePromptShown,
      recommendations,
    ]
  );

  const handleUndoReject = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    if (rejectedStack.length === 0) return;

    const [lastRejected, ...rest] = rejectedStack;
    setRejectedStack(rest); // Remove from rejected stack

    const updatedSwipedProfileIds = swipedProfileIds.filter(
      (id) => id !== lastRejected.user_id
    );

    setExpandedProfileId(null); // Ensure it's not expanded when brought back
    setUndoVisible(false); // Hide the undo alert
  }, [rejectedStack, swipedProfileIds]);

  // Toggle flip/details view
  const handleToggleDetails = useCallback((profile: UserProfile) => {
    const profileId = profile.user_id;
    setExpandedProfileId((prev) => (prev === profileId ? null : profileId));
  }, []);

  // Prepare the visible profiles for display
  const visibleProfileData = useMemo(() => {
    if (currentPitchUser) return [currentPitchUser];
    if (!recommendations?.length) return [];

    const filteredRecommendations = recommendations.filter(
      (item) =>
        !swipedProfileIds.includes(item.user_id) &&
        !rejectedStack.some((p) => p.user_id === item.user_id)
    );

    if (expandedProfileId) {
      // Show expanded profile only if it's in the filtered list
      const expanded = filteredRecommendations.find(
        (item) => item.user_id === expandedProfileId
      );
      return expanded ? [expanded] : [];
    }

    // Otherwise, show the first available profile
    return filteredRecommendations.slice(0, 1);
  }, [
    currentPitchUser,
    recommendations,
    expandedProfileId,
    swipedProfileIds,
    rejectedStack, // Include rejectedStack in dependency array
  ]);

  return (
    <View style={styles.container}>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <Header logoSource={logo} onSearch={() => { }} />

      <FlatList
        data={visibleProfileData}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            onSwipeComplete={handleSwipeComplete}
            onRejectSwipe={handleProfileRejectSwipe} // Pass the new handler
            rightSwipeCount={rightSwipeCount}
            persistentSwipeCount={persistentSwipeCount}
            isExpanded={expandedProfileId === item.user_id}
            onToggleDetails={handleToggleDetails}
            setError={setError}
            isProfileCompleted={isProfileComplete}
            isPromptVisible={showLimitModal}
          />
        )}
        keyExtractor={(item, index) => `${item.user_id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={{ flex: 1, height: "100%", marginTop: 12 }}>
            <ConnectCard />
          </View>
        }
      />

      <AlertModal
        visible={undoVisible && rejectedStack.length > 0}
        onClose={() => {
          setUndoVisible(false);

        }}
        imageSource={require("../../../../assets/icons/cross.png")}
        label="Profile Rejected"
        buttonText="Undo"
        viewButton
        onButtonPress={handleUndoReject}
        positionTop
      />
      <ProfilePrompt
        visible={showLimitModal && !isProfileComplete}
        onCancel={() => setShowLimitModal(false)}
        onProceed={() => {
          router.push("/Profile1");
          setShowLimitModal(false);
        }}
      />
    </View>
  );
};

export default Connect;