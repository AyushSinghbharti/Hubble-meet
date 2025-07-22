import React, { useState, useCallback, useEffect } from "react";
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
import { UserProfile } from "@/src/interfaces/profileInterface";
import profileData from "@/src/dummyData/dummyProfiles";
import {
  useAcceptConnection,
  useRejectConnection,
} from "@/src/hooks/useConnection";
import { useAuthStore } from "@/src/store/auth";
import { useConnectionStore } from "@/src/store/connectionStore";
import { ConnectionRequest } from "@/src/interfaces/connectionInterface";
import { useRouter } from "expo-router";
import { resolveChatAndNavigate } from "@/src/utility/resolveChatAndNavigate";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = 120;

interface ProfileCardProps {
  profile: ConnectionRequest;
  setError: any;
  onSwipeComplete: (id: string) => void;
  onAcceptSuccess: (receiverProfileImage: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  setError,
  onSwipeComplete,
  onAcceptSuccess,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const [isSwiped, setIsSwiped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const router = useRouter();

  //Backend Integration
  const { mutate: acceptConnection } = useAcceptConnection();
  const { mutate: rejectConnection } = useRejectConnection();
  const userId = useAuthStore((state) => state.userId);

  const handleAcceptConnection = () => {
    // setModalVisible(false); // optional

    acceptConnection(
      {
        user_id: userId || "",
        sender_id: profile.user_id,
      },
      {
        onSuccess: () => {
          onAcceptSuccess(profile.profile_picture_url); // ✅ Tell parent to show modal
          setIsSwiped(true);
          onSwipeComplete(profile.user_id);
        },
        onError: (error: any) => {
          const status = error?.response?.status;
          setError(error?.response?.data?.message || "Something went wrong");
          translateX.value = withSpring(0);
          rotate.value = withSpring(0);
        },
      }
    );
  };

  const handleRejectConnection = () => {
    setAlertVisible(false);

    rejectConnection(
      {
        user_id: userId || "",
        receiver_id: profile.user_id,
      },
      {
        onSuccess: () => {
          // ✅ show alert first, swipe later
          setAlertVisible(true);

          setTimeout(() => {
            setIsSwiped(true);
            onSwipeComplete(profile.user_id);
          }, 1000); // give user time to see alert
        },
        onError: (error: any) => {
          const status = error?.response?.status;

          if (status === 500) {
            console.warn("Error status", status, "treated as success");

            setAlertVisible(true); // ✅ show alert first

            setTimeout(() => {
              setIsSwiped(true);
              onSwipeComplete(profile.user_id);
            }, 1000);
          } else {
            setError(error?.response?.data?.message || "Something went wrong");
            translateX.value = withSpring(0);
            rotate.value = withSpring(0);
          }
        },
      }
    );
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: isSwiped ? 0 : translateX.value === 0 ? 1 : 0.8,
  }));

  const handleSwipe = useCallback(
    (direction: string) => {
      if (direction === "left") {
        handleRejectConnection();
      } else if (direction === "right") {
        handleAcceptConnection();
      }
    },
    [profile.user_id, onSwipeComplete]
  );

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
    onSwipeComplete(profile.user_id);
    router.push("/chatStack/connection");
  };

  const handleBackToRequest = () => {
    setModalVisible(false);
    setIsSwiped(true);
    onSwipeComplete(profile.user_id);
  };

  if (isSwiped) return null;

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Image
            source={{ uri: profile.profile_picture_url }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.expandThumb}>
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
            colors={["transparent", "rgba(255,255,255,0.9)", "#fff"]}
            style={styles.gradient}
          >
            <Text style={styles.name}>{profile.full_name}</Text>
            <Text style={styles.title}>{profile.job_title}</Text>
            <Text style={styles.location}>{profile.bio}</Text>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>

      <AlertModal
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        imageSource={require("../../../../assets/icons/cross.png")}
        label="Request Rejected"
        positionTop
        positionBottom
      />
    </>
  );
};

const ProfileList = ({}) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [matchUserPair, setMatchUserPair] = useState<{
    user1: string;
    user2: string;
  } | null>(null);
  const requests = useConnectionStore((state) => state.requests);
  const currentUser = useAuthStore((state) => state.user);
  const handleShowMatchModal = (receiverProfileUrl: string) => {
    setMatchUserPair({
      user1: user?.profile_picture_url ?? "",
      user2: receiverProfileUrl,
    });
    setSelectedProfile(receiverProfileUrl);
    setMatchModalVisible(true);
  };

  const handleSendMessage = async() => {
    console.log(selectedProfile);
    setMatchModalVisible(false);
    await resolveChatAndNavigate({ currentUser, targetUser: selectedProfile,isRoutingEnable:true });
  };


  const handleBackToRequest = () => {
    setMatchModalVisible(false);
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Failed to perform operation",
        text2: error,
      });
      setError(null);
    }
  }, [error]);

  const handleSwipeComplete = useCallback((id: string) => {
    setSwipedIds((prev) => [...prev, id]);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ConnectionRequest }) => {
      if (swipedIds.includes(item.user_id)) return null;
      return (
        <ProfileCard
          profile={item}
          setError={setError}
          onSwipeComplete={handleSwipeComplete}
          onAcceptSuccess={handleShowMatchModal}
        />
      );
    },
    [swipedIds, handleSwipeComplete]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        removeClippedSubviews
        windowSize={5}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no Request yet</Text>
          </View>
        }
      />
      <MatchModal
        visible={matchModalVisible}
        onClose={handleBackToRequest}
        onSendMessage={handleSendMessage()}
        user1Image={matchUserPair?.user1}
        user2Image={matchUserPair?.user2}
      />
      <Toast />
    </View>
  );
};

export default ProfileList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  card: {
    width: width * 0.9,
    height: CARD_HEIGHT * 1.8,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#596C2D",
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#BBCF8D",
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BBCF8D",
  },
  modalButtonText: {
    color: "#191919",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
});
