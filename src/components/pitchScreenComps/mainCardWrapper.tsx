import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Feather,
} from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useFocusEffect } from "expo-router";

//Dummy data
let VideoUri =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const MainCardWrapper = ({ pitch, onPress }) => {
  const player = useVideoPlayer(VideoUri, (player) => {
    player.loop = true;
    player.play();
  });

  
  useFocusEffect(
    useCallback(() => {
      player?.play?.();

      return () => {
        // Only attempt to pause if player is valid and not already released
        if (player?.pause && typeof player.pause === "function") {
          try {
            player.pause();
          } catch (error) {
            console.warn("Video cleanup error:", error);
          }
        }
        // Removed player.dispose() as it does not exist on VideoPlayer
      };
    }, [player])
  );

  const [isLiked, setLiked] = useState(false);

  return (
    <View style={styles.cardWrapper}>
      {/* Thumb / video */}
      <VideoView
        style={StyleSheet.absoluteFillObject}
        player={player}
        nativeControls={false}
        startsPictureInPictureAutomatically={false}
        allowsPictureInPicture={false}
      />

      <LinearGradient
        colors={[
          "transparent",
          "transparent",
          "rgba(0,0,0,0.15)",
          "rgba(0,0,0,0.95)",
        ]}
        style={StyleSheet.absoluteFillObject}
      >
        <Pressable onPress={onPress} style={StyleSheet.absoluteFillObject} />
      </LinearGradient>

      {/* right‑hand vertical action rail (à‑la TikTok) */}
      <View style={styles.actionRail}>
        <TouchableOpacity style={styles.actionBtn}>
          <Image
            source={require("../../../assets/icons/logo.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.likeSection}
          onPress={() => setLiked(!isLiked)}
        >
          {isLiked ? (
            <Image
              source={require("../../../assets/icons/like.png")}
              style={{ height: 40, width: 32 }}
            />
          ) : (
            <Image
              source={require("../../../assets/icons/unlike.png")}
              style={{ height: 40, width: 22 }}
            />
          )}
          <Text style={styles.likeCount}>
            {Intl.NumberFormat().format(pitch.likes + isLiked)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* bottom user row */}
      <View style={[styles.userRow]}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginTop: 18,
    marginBottom: 10,
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
    flexDirection: "row",
    alignItems: "flex-start",
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
    textShadowColor: "#B2B2B2",
    textShadowOffset: { height: 2, width: 2 },
    color: "#fff",
    fontSize: 12,
    fontFamily: "InterSemiBold",
  },
});

export default MainCardWrapper;
