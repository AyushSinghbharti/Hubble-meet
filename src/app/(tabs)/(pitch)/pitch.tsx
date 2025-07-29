import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
import { useRouter } from "expo-router";
import FlipCardWrapper from "../../../components/pitchScreenComps/flipCardWrapper";
import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";
import { usePitchStore } from "@/src/store/pitchStore";
import { useConnectionStore } from "@/src/store/connectionStore";
import { getUserPitch } from "@/src/api/pitch";
import { useQueries } from "@tanstack/react-query";
import PitchScreenLoader from "@/src/components/skeletons/pitchCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 100;
const TOP_PADDING = 15;
const SAFE_MARGIN = 36;
const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - TOP_PADDING - SAFE_MARGIN;

export default function PitchScreen() {
  // State & refs
  const router = useRouter();
  const focusUserId = usePitchStore((state) => state.focusUserId);
  const pitch = usePitchStore((state) => state.pitch);
  const recommendations = useConnectionStore((s) => s.recommendations);
  const recommendationsId = useConnectionStore((s) => s.recommendationsId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList | null>(null);

  const setCurrentPitchUser = usePitchStore((s) => s.setCurrentPitchUser);

  // Flip animation states
  const [flipped, setFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Fetch pitches using pitchQueries
  const pitchQueries = useQueries({
    queries: recommendationsId.map((userId) => ({
      queryKey: ["pitch", userId],
      queryFn: () => getUserPitch(userId),
      enabled: !!userId,
    })),
  });

  // Prepare valid pitches - memoized
  const validPitches = useMemo(() => {
    if (!pitchQueries.length) return [];

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
              name: profile.full_name,
              avatar: profile.profile_picture_url,
              tagline: pitchData.pitch_caption || "",
            },
            likes: 0,
          },
          profile,
        };
      })
      .filter(Boolean);

    // if (__DEV__) {
    //   console.log(
    //     "Pitch Queries (raw):",
    //     JSON.stringify(pitchQueries.map((q) => q.data), null, 2)
    //   );
    //   console.log("Valid Pitches:", JSON.stringify(pitches, null, 2));
    // }

    return pitches;
  }, [pitchQueries, recommendations]);

  // Current item derived from validPitches & currentIndex
  const currentItem = useMemo(() => {
    return validPitches[currentIndex] || null;
  }, [validPitches, currentIndex]);

  // Scroll FlatList to focusUserId when focusUserId or pitches change
  useEffect(() => {
    if (!focusUserId || !validPitches.length || !flatListRef.current) return;

    const idx = validPitches.findIndex(
      (item) => item.pitch.user.id === focusUserId
    );
    if (idx >= 0) {
      setCurrentIndex(idx);
      flatListRef.current.scrollToOffset({
        offset: idx * (ITEM_HEIGHT + 36),
        animated: true,
      });
    }
  }, [focusUserId, validPitches]);

  // Handle profile press navigation
  const handleProfilePress = useCallback(
    (user: any) => {
      setCurrentPitchUser(user);
      router.push("/connect");
    },
    [router, setCurrentPitchUser]
  );

  // Handle flip animation
  const handleFlip = useCallback(() => {
    Animated.timing(rotateAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setFlipped((prev) => !prev));
  }, [flipped, rotateAnim]);

  // Navigate to MyPitch or CreatePitch screen
  const navigateToMyPitch = useCallback(() => {
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
  }, [pitch, router]);

  // Animated styles for flip card
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

  // FlatList helpers
  const keyExtractor = useCallback(
    (item, index) => item.pitch.id + "_" + index,
    []
  );

  // pre-calculate height + margin for getItemLayout
  const ITEM_FULL_HEIGHT = ITEM_HEIGHT + 36; // 18 top + 18 bottom margins

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: ITEM_FULL_HEIGHT,
      offset: ITEM_FULL_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToMyPitch} activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../../../assets/icons/pitch2.png")}
              style={styles.pitchIcon}
              priority="high"
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
            ref={flatListRef}
            data={validPitches}
            keyExtractor={keyExtractor}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            initialNumToRender={3}
            windowSize={5}
            getItemLayout={getItemLayout}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <PitchScreenLoader />
              </View>
            )}
            onMomentumScrollEnd={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              const newIndex = Math.round(offsetY / ITEM_FULL_HEIGHT);
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
                      onPress={() => handleProfilePress(item.profile)}
                      isActive={index === currentIndex && !flipped}
                    />
                  )}
                </Animated.View>
              );
            }}
          />
        </Animated.View>

        {/* Back Side - Uncomment this section if you want to enable flip back card */}
        {/*
        <Animated.View
          style={[
            styles.flipCard,
            styles.absoluteFill,
            {
              transform: [{ rotateY: backRotation }],
              opacity: backOpacity,
              zIndex: flipped ? 1 : 0,
            },
          ]}
        >
          {currentItem?.profile && (
            <FlipCardWrapper item={currentItem.profile} onPress={handleFlip} />
          )}
        </Animated.View>
        */}
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
