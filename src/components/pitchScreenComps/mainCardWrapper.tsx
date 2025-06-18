import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

const MainCardWrapper = ({ pitch }) => {
  const [isLiked, setLiked] = useState(false);
  return (
    <Pressable style={styles.cardWrapper}>
      {/* Thumb / video */}
      <ImageBackground
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMoT_TFoX8xrY-Ud0_K4Ktnafy-Xa0v50Cw&s",
        }}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
      {/* subtle dark overlay so text is readable */}
      <LinearGradient
        colors={[
          "transparent",
          "transparent",
          "rgba(0,0,0,0.15)",
          "rgba(0,0,0,0.95)",
        ]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* right‑hand vertical action rail (à‑la TikTok) */}
      <View style={styles.actionRail}>
        <TouchableOpacity style={styles.actionBtn}>
          <Image
            source={require("../../../assets/icons/logo.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>

        <View style={styles.likeSection}>
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
            {Intl.NumberFormat().format(pitch.likes)}
          </Text>
        </View>

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
    </Pressable>
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
  /* --- right‑hand vertical buttons --- */
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
