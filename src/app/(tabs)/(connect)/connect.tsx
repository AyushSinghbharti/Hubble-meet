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
import logo from '../../../../assets/logo/logo.png';
import profileData from "../../../dummyData/profileData";
import { FONT } from "../../../../assets/constants/fonts";
import styles from "./Styles/Styles";
import BlockUserModal from "../../../components/Modal/BlockUserModal";
import ProfilePromptModal from "../../../components/Modal/ProfilePromptModal";
import ProfilePrompt from "../../../components/Modal/ProfilePromptModal";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;
const UNDO_DURATION = 2000; // 2 seconds for undo window

const ProfileCard = ({ profile, onSwipeComplete, rightSwipeCount, isExpanded, onToggleDetails }) => {
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

  const undoTimeoutRef = useRef(null);

  const route = useRouter()

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
    (profileId, direction) => {
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
      route.push('/(pitch)/pitch'); // ✅ placed correctly
    },
    [showThumbImageAlert, route] // ✅ dependency array
  );


  const handleImageTap = useCallback(() => {
    onToggleDetails(profile.id);
  }, [onToggleDetails, profile.id]);

  // Pan gesture for swiping
  const panGesture = Gesture.Pan()
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
          "worklet";
          if (finished) {
            runOnJS(completeSwipe)(profile.id, "right");
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
          source={profile.image}
          style={styles.image}
          resizeMode="cover"
        />
      </GestureDetector>

      <TouchableOpacity
        style={styles.expandThumb}
        onPress={handleThumbImagePress}
        activeOpacity={0.7}
      >
        <Image source={profile.image} style={styles.thumbImage} />
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
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.title}>{profile.title}</Text>
        <Text style={styles.location}>{profile.location}</Text>
      </LinearGradient>

      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={handleShareButtonPress} activeOpacity={0.7}>
          <Animated.View style={[styles.actionButton, buttonStyle]}>
            <Image
              source={require("../../../../assets/icons/share1.png")}
              style={{ width: 18, height: 18 }}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRestartButtonPress} activeOpacity={0.7}>
          <Animated.View style={[styles.actionButton, buttonStyle]}>
            <Image
              source={require("../../../../assets/icons/block.png")}
              style={{ width: 18, height: 18 }}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </GestureDetector>
) : (
  <GestureDetector gesture={detailGesture}>
    <Animated.View style={[styles.detailContent, ]}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.backCardScroll}
        contentContainerStyle={styles.backCardScrollContent}
      >
        <ImageBackground source={profile.image} style={styles.backCardContent}>
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
              <Text style={[styles.name, { color: "#000", fontFamily: FONT.BOLD }]}>
                {profile.name}
              </Text>
              <Text style={[styles.title, { color: "#000", fontFamily: FONT.SEMIBOLD }]}>
                {profile.title}
              </Text>
              <Text
                style={[styles.location, { color: "#000", fontFamily: FONT.BOLD }]}
              >
                {profile.location}
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={[styles.backText, { fontFamily: FONT.MEDIUM }]}>
                  {profile.about}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Industries</Text>
                <View style={styles.tagsContainer}>
                  {profile.industries?.map((industry, index) => (
                    <View key={index} style={styles.tagBox}>
                      <Text style={styles.tagText}>{industry}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Areas of Interest</Text>
                <View style={styles.tagsContainer}>
                  {profile.areasOfInterest?.map((interest, index) => (
                    <View key={index} style={styles.tagBox}>
                      <Text style={styles.tagText}>{interest}</Text>
                    </View>
                  ))}
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
        imageSource={require("../../../../assets/icons/undo.png")}
        label="Undo the Reject"
        buttonText="Undo"
        onButtonPress={handleUndo}
        positionBottom
      />

        </View>


    <View>
         <AlertModal
        visible={rightSwipeAlertVisible}
        onClose={() => setRightSwipeAlertVisible(false)}
        imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
        label="Daily right swipe limit reached (10/10)"
        buttonText="OK"
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
        positionBottom
      />

</View>
   
    

    <View>
       <AlertModal
        visible={shareAlertVisible}
        onClose={() => setShareAlertVisible(false)}
        imageSource={require("../../../../assets/icons/share1.png")}
        label="Profile Shared"
        buttonText="OK"
        onButtonPress={() => setShareAlertVisible(false)}
        positionBottom
      />

    </View>


<View>

      <BlockUserModal
        visible={blockAlertVisible}
        onClose={() => setBlockAlertVisible(false)}
        onSubmit={() => setBlockAlertVisible(false)}
        label="Profile Blocked"
        buttonText="OK"
        userName={profile?.name || "This user"}
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
    },
    [showLimitModal]
  );

  const handleToggleDetails = useCallback((profileId) => {
    setExpandedProfileId((prev) => (prev === profileId ? null : profileId));
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <ProfileCard
          profile={item}
          onSwipeComplete={handleSwipeComplete}
          rightSwipeCount={rightSwipeCount}
          isExpanded={expandedProfileId === item.id}
          onToggleDetails={handleToggleDetails}
        />
      );
    },
    [rightSwipeCount, handleSwipeComplete, expandedProfileId]
  );

  const visibleProfileData = profileData.filter(
    (item) => !swipedIds.includes(item.id) && (expandedProfileId === null || expandedProfileId === item.id)
  );

  return (
    <View style={styles.container}>
      <Header
        logoSource={logo}
        onSearch={(text) => console.log("Search:", text)}
        onBagPress={() => console.log("Bag pressed")}
      />
      <FlatList
        data={visibleProfileData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
      {/* <AlertModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
        label="We need a bit more info before you can swipe further. Finish your profile to continue."
        buttonText="Complete Profile"
        onButtonPress={() => setShowLimitModal(false)}
      /> */}

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