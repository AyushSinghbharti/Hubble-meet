import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useFocusEffect } from "expo-router";
import { useReactToPitch, useReportPitch } from "@/src/hooks/usePitch";
import { useAuthStore } from "@/src/store/auth";

const MainCardWrapper = ({
  pitch,
  onPress,
  isActive,
}: {
  pitch: any;
  onPress: () => void;
  isActive: boolean;
}) => {
  const [options, setOptions] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const VideoUri = pitch.videoUri;
  const { mutate: reactToPitch } = useReactToPitch();
  const { mutate: reportPitch } = useReportPitch();
  const user = useAuthStore((s) => s.user);

  const isMounted = useRef(true);
  const handleReactPitch = () => {
    if (!pitch?.id || !user?.user_id) return;

    reactToPitch(
      { pitch_id: pitch.id, user_id: user.user_id },
      {
        onSuccess: (res) => {
          console.log("reacted to pitch successfull");
        },
      }
    );

    setLiked((prev) => !prev);
  };

  const handleReportPitch = () => {
    if (!pitch?.id || !user?.user_id) return;

    reportPitch({
      pitch_id: pitch.id,
      owner_id: pitch.user.id,
      user_id: user.user_id,
    }, {
      onSuccess: (res) => {
        console.log("report pitch successfull");
      }
    });
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const player = useVideoPlayer(VideoUri, (p) => {
    p.loop = true;
  });

  // Control play/pause based on focus + isActive
  useFocusEffect(
    useCallback(() => {
      if (!player || typeof player.play !== "function") return;

      if (isActive) {
        try {
          player.play?.();
          setIsPaused(false);
        } catch (err) {
          console.warn("Play error:", err.message);
        }
      } else {
        try {
          player.pause?.();
          setIsPaused(true);
        } catch (err) {
          console.warn("Pause error (inactive):", err.message);
        }
      }

      return () => {
        if (!isMounted.current || !player || typeof player.pause !== "function")
          return;
        try {
          player.pause();
        } catch (err) {
          console.warn("Safe cleanup error:", err.message);
        }
      };
    }, [player, isActive])
  );

  const togglePlayPause = () => {
    if (
      !player ||
      typeof player.play !== "function" ||
      typeof player.pause !== "function"
    )
      return;

    try {
      if (isPaused) {
        player.play?.();
      } else {
        player.pause?.();
      }
      setIsPaused(!isPaused);
    } catch (err) {
      console.warn("Video toggle error:", err.message);
    }
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Video */}
      <VideoView
        style={StyleSheet.absoluteFillObject}
        player={player}
        nativeControls={false}
        contentFit="contain"
        startsPictureInPictureAutomatically={false}
        allowsPictureInPicture={false}
      />

      {/* Tap to pause/play with overlay */}
      <Pressable
        onPress={togglePlayPause}
        style={StyleSheet.absoluteFillObject}
      >
        <LinearGradient
          colors={[
            "transparent",
            "transparent",
            "rgba(0,0,0,0.15)",
            "rgba(0,0,0,0.95)",
          ]}
          style={StyleSheet.absoluteFillObject}
        />
      </Pressable>

      {isPaused && (
        <View style={styles.pauseIconContainer}>
          <View style={styles.playButton}>
            <FontAwesome5 name="play" size={22} color="#fff" />
          </View>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionRail}>
        <TouchableOpacity style={styles.likeSection} onPress={handleReactPitch}>
          <Image
            source={
              isLiked
                ? require("../../../assets/icons/like.png")
                : require("../../../assets/icons/unlike.png")
            }
            style={{ height: 40, width: isLiked ? 32 : 22 }}
          />
          <Text style={styles.likeCount}>
            {Intl.NumberFormat().format(pitch.likes + (isLiked ? 1 : 0))}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => setOptions(!options)}
        >
          <Feather name="more-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userRow}>
        <View style={styles.typeShown}>
          <Text style={styles.typeText}>Individual:</Text>
          <Text style={styles.pitchTitleText}>
            {pitch.user?.name || "Unknown"}
          </Text>
        </View>

        <TouchableOpacity style={{ flexDirection: "row" }} onPress={onPress}>
          <Image
            source={{ uri: pitch.user.avatar }}
            style={styles.avatar}
            transition={300}
          />
          <View style={{ marginLeft: 10, justifyContent: "center" }}>
            <Text numberOfLines={1} style={styles.userName}>
              {pitch.user?.name || "Unknown User"}
            </Text>
            <Text numberOfLines={1} style={styles.tagline}>
              {pitch.user?.tagline || "No tagline provided"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Options Menu */}
      {options && (
        <View style={styles.optionsBox}>
          <Text style={styles.optionText} onPress={handleReportPitch}>Report Pitch</Text>
          <View style={styles.optionDivider} />
          <Text style={styles.optionText}>Not Interested</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginTop: 18,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
  actionRail: {
    position: "absolute",
    right: 26,
    bottom: 40,
    alignItems: "center",
    gap: 24,
  },
  likeSection: {
    alignItems: "center",
    gap: 2,
  },
  likeCount: {
    color: "#fff",
    fontFamily: "InterSemiBold",
    fontSize: 12,
  },
  userRow: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    alignItems: "flex-start",
    gap: 13,
  },
  typeShown: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#F1F0F0",
    backgroundColor: "#FFFFFF15",
    flexDirection: "row",
    gap: 4,
  },
  pitchTitleText: {
    fontFamily: "InterBold",
    color: "#fff",
  },
  typeText: {
    fontFamily: "InterMedium",
    color: "#fff",
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "InterBold",
    textShadowColor: "#B2B2B2",
    textShadowOffset: { height: 2, width: 2 },
  },
  tagline: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "InterSemiBold",
    textShadowColor: "#B2B2B2",
    textShadowOffset: { height: 2, width: 2 },
  },
  optionsBox: {
    position: "absolute",
    bottom: 10,
    right: 60,
    backgroundColor: "#000",
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    gap: 5,
  },
  optionText: {
    fontFamily: "InterSemiBold",
    fontSize: 12,
    color: "#fff",
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderColor: "#fff",
    width: "100%",
  },
  pauseIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    height: 55,
    width: 55,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainCardWrapper;
