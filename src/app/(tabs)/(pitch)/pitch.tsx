import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import FlipCardWrapper from "../../../components/pitchScreenComps/flipCardWrapper";
import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";
import { Dimensions } from "react-native";
import { usePitchStore } from "@/src/store/pitchStore";
import { useConnectionStore } from "@/src/store/connectionStore";
import { getUserPitch } from "@/src/api/pitch";
import { useQueries } from "@tanstack/react-query";
import { Pitch } from "@/src/interfaces/pitchInterface";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { FONT } from "@/assets/constants/fonts";
import PitchScreenLoader from "@/src/components/skeletons/pitchCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 100;
const TOP_PADDING = 15;
const SAFE_MARGIN = 36;
const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - TOP_PADDING - SAFE_MARGIN;

export default function PitchScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pitch = usePitchStore((state) => state.pitch);

  const recommendations = useConnectionStore((s) => s.recommendations);
  const recommendationsId = useConnectionStore((s) => s.recommendationsId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setCurrentPitchUser = usePitchStore((s) => s.setCurrentPitchUser);

  useEffect(() => {
    console.log("🎬 Valid Pitches:");
    validPitches.forEach((item, index) => {
      console.log(`--- Pitch ${index + 1} ---`);
      console.log("Pitch ID:", item.pitch.id);
      console.log("User Name:", item.profile.full_name);
      console.log("Video URL:", item.pitch.videoUri);
      console.log("Tagline:", item.pitch.user.tagline);
    });
  }, [validPitches]);

  const handleProfilePress = (user: any) => {
    setCurrentPitchUser(user);
    router.push("/connect");
  };

  const pitchQueries = useQueries({
    queries: recommendationsId.map((userId) => ({
      queryKey: ["pitch", userId],
      queryFn: () => getUserPitch(userId),
      enabled: !!userId,
    })),
  });

  const validPitches = useMemo(() => {
    if (!pitchQueries.length) return [];
    return recommendations
      .map((profile) => {
        const pitch: Pitch = pitchQueries.find(
          (q) => q.data?.user_id === profile.user_id
        )?.data;
        if (!pitch) return null;
        return {
          pitch: {
            id: pitch.id,
            thumbnail: "",
            videoUri: pitch.url,
            user: {
              id: profile.user_id,
              name: profile.full_name,
              avatar: profile.profile_picture_url,
              tagline: pitch.pitch_caption || "",
            },
            likes: 0,
          },
          profile,
        };
      })
      .filter(Boolean);
  }, [pitchQueries, recommendations]);

  const [currentPitch, setCurrentPitch] = useState(
    validPitches[0]?.pitch || null
  );
  const [currentProfile, setCurrentProfile] = useState(
    validPitches[0]?.profile || null
  );

  useEffect(() => {
    const target = validPitches[currentIndex];
    if (target) {
      setCurrentPitch(target.pitch);
      setCurrentProfile(target.profile);
    }
  }, [currentIndex]);

  const handleFlip = () => {
    Animated.timing(rotateAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const navigateToMyPitch = () => {
    if (pitch) router.push("/pitchStack/myPitch");
    else
      router.push({
        pathname: "/pitchStack/createPitch",
        params: {
          item: JSON.stringify({
            name: null,
            desc: null,
            format: "Upload",
            pitchType: "Individual",
            duration: 30,
            videoUrl: null,
          }),
        },
      });
  };

  const frontRotation = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = rotateAnim.interpolate({
    inputRange: [0, 90],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const backOpacity = rotateAnim.interpolate({
    inputRange: [90, 180],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToMyPitch}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../../../assets/icons/pitch2.png")}
              style={styles.pitchIcon}
            />
            <Text style={styles.headerText}>My Pitch</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Card View */}
      <View style={styles.cardArea}>
        {/* Front Side */}
        <Animated.View
          style={[
            styles.flipCard,
            {
              transform: [{ rotateY: frontRotation }],
              opacity: frontOpacity,
              zIndex: flipped ? 0 : 1,
            },
          ]}
        >
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={validPitches}
            keyExtractor={(item, index) => item.pitch.id + index}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <PitchScreenLoader />
                </View>
              );
            }}
            onMomentumScrollEnd={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              const newIndex = Math.round(offsetY / ITEM_HEIGHT);
              if (newIndex !== currentIndex) setCurrentIndex(newIndex);
            }}
            renderItem={({ item, index }) => {
              const isVisible = Math.abs(index - currentIndex) <= 1;
              const scale = index === currentIndex ? 1 : 0.97;
              const opacity = index === currentIndex ? 1 : 0.5;

              return (
                <Animated.View
                  style={{
                    transform: [{ scale }],
                    opacity,
                    height: ITEM_HEIGHT,
                    marginVertical: 18,
                  }}
                >
                  {isVisible && (
                    <MainCardWrapper
                      pitch={item.pitch}
                      onPress={() => handleProfilePress(item?.profile)}
                      isActive={index === currentIndex && !flipped}
                    />
                  )}
                </Animated.View>
              );
            }}
          />
        </Animated.View>

        {/* Back Side */}
        {/* <Animated.View
          style={[
            styles.flipCard,
            styles.absoluteFill,
            { transform: [{ rotateY: backRotation }], opacity: backOpacity, zIndex: flipped ? 1 : 0 },
          ]}
        >
          {currentProfile && <FlipCardWrapper item={currentProfile} onPress={handleFlip} />}
        </Animated.View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    top: 70,
    zIndex: 2,
  },
  cardWrapper: {
    // flex: 1,
    height: "95%",
    marginTop: 18,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  pitchIcon: {
    height: 24,
    aspectRatio: 1,
  },
  headerText: {
    fontSize: 10,
    color: "#64748B",
  },
  cardArea: {
    flex: 1,
    position: "relative",
  },
  flipCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: "hidden",
  },
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
