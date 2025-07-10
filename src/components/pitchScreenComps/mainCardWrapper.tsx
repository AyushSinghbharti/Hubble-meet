import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useIsFocused } from "@react-navigation/native";

// Dummy video
const VideoUri =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const MainCardWrapper = ({ pitch, onPress, isActive, isFlipped }) => {
  const [options, setOptions] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const isFocused = useIsFocused();

  const player = useVideoPlayer(VideoUri, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (!player) return;

    if (isActive && !isFlipped && isFocused) {
      player.play();
      setIsPaused(false);
    } else {
      player.pause();
      setIsPaused(true);
    }
  }, [isActive, isFlipped, isFocused, player]);

  const togglePlayPause = () => {
    if (!player) return;
    if (isPaused) {
      player.play();
    } else {
      player.pause();
    }
    setIsPaused(!isPaused);
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Video layer */}
      {isActive && !isFlipped && (
        <VideoView
          style={StyleSheet.absoluteFillObject}
          player={player}
          nativeControls={false}
          startsPictureInPictureAutomatically={false}
          allowsPictureInPicture={false}
        />
      )}

      {/* Overlay gradient and global tap handler */}
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

      {/* Pause Icon */}
      {isPaused && (
        <View style={styles.pauseIconContainer}>
          <View
            style={{
              height: 55,
              width: 55,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome5 name="play" size={22} color="#fff" />
          </View>
        </View>
      )}

      {/* Action rail */}
      <View style={styles.actionRail}>
        {/* <TouchableOpacity style={styles.actionBtn}>
          <Image
            source={require("../../../assets/icons/logo.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.likeSection}
          onPress={() => setLiked(!isLiked)}
        >
          <Image
            source={
              isLiked
                ? require("../../../assets/icons/like.png")
                : require("../../../assets/icons/unlike.png")
            }
            style={{ height: 40, width: isLiked ? 32 : 22 }}
          />
          <Text style={styles.likeCount}>
            {Intl.NumberFormat().format(pitch.likes + isLiked)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => setOptions(!options)}
        >
          <Feather name="more-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Profile Section (tap triggers onPress only here) */}
      <View style={styles.userRow}>
        <View style={styles.typeShown}>
          <Text style={styles.typeText}>Individual:</Text>
          <Text style={styles.pitchTitleText}>John William</Text>
        </View>

        <TouchableOpacity style={{ flexDirection: "row" }} onPress={onPress}>
          <Image
            source={{ uri: pitch.user.avatar }}
            style={styles.avatar}
            transition={300}
          />
          <View style={{ marginLeft: 10, justifyContent: "center" }}>
            <Text numberOfLines={1} style={styles.userName}>
              {pitch.user.name}
            </Text>
            <Text numberOfLines={1} style={styles.tagline}>
              {pitch.user.tagline}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Options Popup */}
      {options && (
        <View style={styles.optionsBox}>
          <Text style={styles.optionText}>Report Pitch</Text>
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
    marginBottom: 18,
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
  actionBtn: {},
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
});

export default React.memo(MainCardWrapper);
