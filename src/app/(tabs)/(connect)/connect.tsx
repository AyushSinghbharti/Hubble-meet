import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Dimensions,
  FlatList,

} from "react-native";
import { useRouter } from "expo-router";
import AlertModal from "../../../components/Alerts/AlertModal";
import Header from "../../../components/Search/ConnectHeader";
import logo from "../../../../assets/logo/logo.png";
import styles from "./Styles/Styles";
import ProfilePrompt from "../../../components/Modal/ProfilePromptModal";
import { useAuthStore } from "@/src/store/auth";
import { UserProfile } from "@/src/interfaces/profileInterface";
import ErrorAlert from "@/src/components/errorAlert";
import { useConnectionStore } from "@/src/store/connectionStore";
import { fetchUserProfile } from "@/src/api/profile";
import { usePitchStore } from "@/src/store/pitchStore";
import { AxiosError } from "axios";
import { useAppState } from "@/src/store/appState"; // Import the updated store
import ConnectCard from "@/src/components/skeletons/connectCard";
import ProfileCard from "./ProfileCard";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;
const UNDO_DURATION = 2000; // 2 seconds for undo window

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
  console.log(JSON.stringify(recommendations, null, 2));

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
            onRejectSwipe={handleProfileRejectSwipe}
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
        name={rejectedStack[0]?.full_name ?? ""}
        label="Rejected"
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