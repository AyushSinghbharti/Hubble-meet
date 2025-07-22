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
  persistentSwipeCount, // Use persistent swipe count instead
  isExpanded,
  onToggleDetails,
  setError,
  isProfileCompleted,
}: {
  profile: UserProfile;
  onSwipeComplete: any;
  rightSwipeCount: number;
  persistentSwipeCount: number; // Updated prop name
  isExpanded: boolean;
  onToggleDetails: any;
  setError: any;
  isProfileCompleted: boolean;
}) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);
  const [undoVisible, setUndoVisible] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [requestSentVisible, setRequestSentVisible] = useState(false);
  const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);
  const [shareAlertVisible, setShareAlertVisible] = useState(false);
  const [blockAlertVisible, setBlockAlertVisible] = useState(false);
  const [thumbImageAlertVisible, setThumbImageAlertVisible] = useState(false);
  const [flippedProfiles, setFlippedProfiles] = useState({});
  const [showShare, setShowShare] = useState(false);


  // Update flipped
  useEffect(() => {
    setHasFlipped(false);
  }, [profile.user_id]);


  // Store data
  const userId = useAuthStore((state) => state.userId);


  // Backend Testing
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
      route.push("/(pitch)/pitch");
    },
    [showThumbImageAlert, route]
  );




  const handleImageTap = useCallback(() => {
    setHasFlipped(true);
    onToggleDetails(profile);
  }, [onToggleDetails, profile.user_id]);


  const handleBlockSuccess = useCallback(() => {
    console.log("handleBlockSuccess triggered for profile:", profile.user_id);
    translateX.value = withSpring(-width);
    rotate.value = withSpring(-ROTATION_DEGREE);
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(completeSwipe)(profile.user_id, "blocked");
      }
    });
  }, [translateX, rotate, opacity, completeSwipe, profile.user_id]);


  const panGesture = Gesture.Pan()
    .enabled(hasFlipped && (persistentSwipeCount < 5 || isProfileCompleted))


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


  const imageTapGesture = Gesture.Tap().onEnd(() => {
    "worklet";
    runOnJS(handleImageTap)();
  });


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
                accessibilityLabel={`Block ${profile?.full_name || "user"}`}
                accessibilityRole="button"
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
        visible={undoVisible}
        onClose={handleUndo}
        imageSource={require("../../../../assets/icons/cross.png")}
        label="Profile Rejected"
        buttonText="Undo"
        viewButton
        onButtonPress={handleUndo}
        positionTop
      />
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
      />
      <BlockUserModal
        visible={blockAlertVisible}
        onClose={() => setBlockAlertVisible(false)}
        userName={profile?.full_name || "This user"}
        blockedUserId={profile?.user_id}
        onBlockSuccess={handleBlockSuccess}
      />
    </>
  );
};


const Connect = () => {
  const [redactedProfileIds, setRedactedProfileIds] = useState([]);
  const [rightSwipeCount, setUserrightSwipeCount] = useState(0);
  const [expandedProfileId, setExpandedProfileId] = useState(null);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [error, setError] = useState<string | null>(null);


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


  const [showLimitModal, setShowLimitModal] = useState(false);



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
    setProfileComplete(isComplete);
  }, [user, setProfileComplete]);



  useEffect(() => {
    const fetchAndStore = async () => {
      const existingIds = new Set(recommendations.map((rec) => rec.user_id));
      console.log(existingIds);
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


  const handleSwipeComplete = useCallback(
    async (user_id: string, direction: string) => {
      clearCurrentPitchUser();



      await addSwipedProfileId(user_id);

      const newSwipeCount = await incrementSwipeCount();



      if (newSwipeCount >= 5 && !isProfileComplete && !hasShownProfilePrompt) {
        setShowLimitModal(true);
        setProfilePromptShown(true);
      }


      if (direction === "right") {
        setUserrightSwipeCount((prev) => prev + 1);
      }

      setHasFlipped(false);
      setExpandedProfileId(null);
    },
    [
      clearCurrentPitchUser,
      addSwipedProfileId,
      incrementSwipeCount,
      isProfileComplete,
      hasShownProfilePrompt,
      setProfilePromptShown,
    ]
  );


  useEffect(() => {
    if (!user || typeof user !== "object") {
      setProfileComplete(false);
      return;
    }
    const hasIncompleteFields = Object.values(user).some(
      (value) => value === undefined || value === null || value === ""
    );
    const isComplete = !hasIncompleteFields;


    setProfileComplete(isComplete);



    if (!isComplete && !hasShownProfilePrompt) {
      showLimitModal(true);
      setProfilePromptShown(true);
    }
  }, [user, setProfileComplete, hasShownProfilePrompt, setProfilePromptShown]);



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
          persistentSwipeCount={persistentSwipeCount}
          setError={setError}
          isProfileCompleted={isProfileComplete}
        />
      );
    },
    [
      rightSwipeCount,
      handleSwipeComplete,
      expandedProfileId,
      persistentSwipeCount,
      isProfileComplete,
    ]
  );


  const visibleProfileData = useMemo(() => {
    if (currentPitchUser) return [currentPitchUser];
    if (!recommendations?.length) return [];
    const filtered = expandedProfileId
      ? recommendations.filter((item) => item.user_id === expandedProfileId)
      : recommendations
        .filter((item) => !swipedProfileIds.includes(item.user_id))
        .slice(0, 1);
    console.log("visibleProfileData:", filtered);
    return filtered;
  }, [currentPitchUser, recommendations, expandedProfileId, swipedProfileIds]);


  return (
    <View style={styles.container}>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <Header logoSource={logo} onSearch={() => { }} />
      <FlatList
        data={visibleProfileData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.user_id}-${index}`}
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