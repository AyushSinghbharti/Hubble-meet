import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useQueries } from "@tanstack/react-query";
import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";
import { usePitchStore } from "@/src/store/pitchStore";
import { useConnectionStore } from "@/src/store/connectionStore";
import { getUserPitch } from "@/src/api/pitch";
import PitchScreenLoader from "@/src/components/skeletons/pitchCard";
import axios from "axios";
import { FONT } from "@/assets/constants/fonts";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 70; // was 100 → decreased
const TOP_PADDING = 60; // was 71 → decreased
const SAFE_MARGIN = 30; // was 46 → decreased
const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - TOP_PADDING - SAFE_MARGIN;

const fetchPitchById = async (id: string) => {
  const response = await axios.get(
    `https://d2aks9kyhua4na.cloudfront.net/api/pitch/getDetails/${id}`
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch pitch");
  }
  return response.data.data;
};

export default function PitchScreen() {
  const router = useRouter();
  const { pitchId, focusUserId } = useLocalSearchParams();

  // Use focusUserId if available, else fallback to pitchId
  const targetId = focusUserId || pitchId;
  // console.log("target id (focusUserId or pitchId):", targetId);

  const [flipped, setFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const pitch = usePitchStore((state) => state.pitch);
  const setCurrentPitchUser = usePitchStore((s) => s.setCurrentPitchUser);

  const recommendations = useConnectionStore((s) => s.recommendations);
  const recommendationsId = useConnectionStore((s) => s.recommendationsId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // To ensure initial scroll happens only once
  const initialScrollDone = useRef(false);

  // Fetch selected pitch by targetId
  const {
    data: selectedPitch,
    isLoading: isPitchLoading,
    error: pitchError,
  } = useQuery({
    queryKey: ["pitch", targetId],
    queryFn: () => fetchPitchById(targetId as string),
    enabled: !!targetId,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recommended users' pitches
  const pitchQueries = useQueries({
    queries: recommendationsId.map((userId) => ({
      queryKey: ["pitch", userId],
      queryFn: () => getUserPitch(userId),
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    })),
  });

  // Combine selected pitch and recommended pitches, selected pitch on top
  const validPitches = useMemo(() => {
    const pitches = recommendations
      .map((profile) => {
        const pitchData = pitchQueries.find(
          (q) => q.data?.user_id === profile.user_id
        )?.data;
        if (!pitchData) return null;
        return {
          pitch: {
            id: pitchData.id,
            thumbnail: "",
            videoUri: pitchData.url,
            user: {
              id: profile.user_id,
              name: profile.full_name || "Unknown",
              avatar: profile.profile_picture_url || "",
              tagline: pitchData.pitch_caption || "",
            },
            likes: pitchData.likeCount || 0,
          },
          profile,
        };
      })
      .filter(Boolean);

    if (selectedPitch && targetId) {
      const profile = recommendations.find(
        (r) => r.user_id === selectedPitch.user_id
      ) || {
        user_id: selectedPitch.user_id,
        full_name: selectedPitch.display_name || "Unknown",
        profile_picture_url: "",
      };
      const selectedPitchItem = {
        pitch: {
          id: selectedPitch.id,
          thumbnail: "",
          videoUri: selectedPitch.url,
          user: {
            id: selectedPitch.user_id,
            name: profile.full_name,
            avatar: profile.profile_picture_url,
            tagline: selectedPitch.pitch_caption || "",
          },
          likes: selectedPitch.likeCount || 0,
        },
        profile,
      };

      const filteredPitches = pitches.filter(
        (p) => p.pitch.id !== selectedPitch.id
      );
      filteredPitches.unshift(selectedPitchItem);
      return filteredPitches;
    }

    return pitches as {
      pitch: {
        id: string;
        thumbnail: string;
        videoUri: string;
        user: {
          id: string;
          name: string;
          avatar: string;
          tagline: string;
        };
        likes: number;
      };
      profile: (typeof recommendations)[number];
    }[];
  }, [pitchQueries, recommendations, selectedPitch, targetId]);

  // Scroll FlatList to initial pitch only once, then user can scroll freely
  useEffect(() => {
    if (!initialScrollDone.current && targetId && validPitches.length) {
      const idx = validPitches.findIndex(
        (item) =>
          item.pitch.id === targetId ||
          item.pitch.user.id === targetId ||
          item.profile.user_id === targetId
      );

      if (idx >= 0) {
        setCurrentIndex(idx);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index: idx, animated: false });
          initialScrollDone.current = true;
        }, 100);
      } else {
        console.warn("⚠️ No pitch found for targetId:", targetId);
        initialScrollDone.current = true; // prevent retrying on missing pitch
      }
    }
  }, [targetId, validPitches]);

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    console.warn("Scroll to index failed:", info);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: info.highestMeasuredFrameIndex,
        animated: false,
      });
    }, 200);
  };

  // Update current pitch user when currentIndex changes
  useEffect(() => {
    const target = validPitches[currentIndex];
    if (target) {
      setCurrentPitchUser(target.profile);
    }
  }, [currentIndex, validPitches, setCurrentPitchUser]);

  const handleFlip = () => {
    Animated.timing(rotateAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const handleProfilePress = (user: any) => {
    setCurrentPitchUser(user);
    router.push("/connect");
  };

  const navigateToMyPitch = () => {
    if (pitch) router.push("/pitchStack/myPitch");
    else
      router.push({
        pathname: "/pitchStack/myPitch",
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

  const frontOpacity = rotateAnim.interpolate({
    inputRange: [0, 90],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToMyPitch} style={styles.pitchWrapper}>
          <View style={styles.iconCircle}>
            <Image
              source={require("../../../../assets/myPitch.png")}
              style={styles.pitchIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerText}>My Pitch</Text>
        </TouchableOpacity>
      </View>


      {/* Card View */}
      <View style={styles.cardArea}>
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
            ref={flatListRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={validPitches}
            keyExtractor={(item, index) => item.pitch.id + index}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            onScrollToIndexFailed={handleScrollToIndexFailed}
            onMomentumScrollEnd={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              const newIndex = Math.round(offsetY / ITEM_HEIGHT);
              if (newIndex !== currentIndex) setCurrentIndex(newIndex);
            }}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: "center" }}>
                {isPitchLoading ? (
                  <PitchScreenLoader />
                ) : (
                  <Text style={{ textAlign: "center", color: "#999" }}>
                    {pitchError
                      ? "Failed to load pitch: " + pitchError.message
                      : "No pitches available"}
                  </Text>
                )}
              </View>
            )}
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
                      onPress={() => handleProfilePress(item.profile)}
                      isActive={index === currentIndex && !flipped}
                    />
                  )}
                </Animated.View>
              );
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 36,
    paddingBottom: 100,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end", // 👈 pushes it to the right
    paddingHorizontal: 20,
    position: "absolute", // 👈 ensure it's floating
    top: 50, // 👈 distance from top of screen
    right: 0, // 👈 stick to right
    zIndex: 1000, // 👈 very high to stay on top
    marginTop: 20
  },


  pitchWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  iconCircle: {
    backgroundColor: "#323231",
    borderRadius: 25, // half of width/height
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5, // spacing between icon and text
  },

  pitchIcon: {
    height: 24,
    width: 24,
  },

  headerText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },

  headerText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: FONT.MONSERRATSEMIBOLD,
    top: 10

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
});
