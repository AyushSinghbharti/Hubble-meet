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
import profileData from "../../../dummyData/profileData";

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
      }, 1000); // delay swipe completion
    } else if (direction === "right") {
      setModalVisible(true);
    }
  }, [profile.id, onSwipeComplete]);

const panGesture = Gesture.Pan()
  .activeOffsetX([-10, 10])       // Enable horizontal pan
  .activeOffsetY([-1000, 1000])   // Disable vertical pan
.onUpdate((event) => {
  if (!isSwiped) {
    translateX.value = event.translationX;
    // Lock vertical movement by not updating translateY
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
        </Animated.View>
      </GestureDetector>


      <View>
            <AlertModal
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        imageSource={require("../../../../assets/icons/Cross.png")}
        label="Request Rejected"
        positionBottom
      />

      </View>


      <View>
           <MatchModal
        visible={modalVisible}
        onClose={handleBackToRequest}
        onSendMessage={handleSendMessage}
        user1Image={Image.resolveAssetSource(profile.image).uri}
        user2Image={Image.resolveAssetSource(profile.image).uri}
      />

      </View>

  
   
    </>
  );
};

const ProfileList: React.FC = () => {
  const [swipedIds, setSwipedIds] = useState<string[]>([]);

  const handleSwipeComplete = useCallback((id: string) => {
    setSwipedIds((prev) => [...prev, id]);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Profile }) => {
      if (swipedIds.includes(item.id)) return null;
      return <ProfileCard profile={item} onSwipeComplete={handleSwipeComplete} />;
    },
    [swipedIds, handleSwipeComplete]
  );

  return (
    <View style={styles.container}>
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
      <Toast />
    </View>
  );
};

export default ProfileList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatList: {
    flex: 1,
  },
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
    borderWidth:1,
    borderColor:"#BBCF8D"
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