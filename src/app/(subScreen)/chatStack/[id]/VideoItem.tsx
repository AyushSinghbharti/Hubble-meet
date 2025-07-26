// components/VideoItem.tsx
import React, { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const { width, height } = Dimensions.get("window");

const VideoItem = ({ uri, shouldPlay }: { uri: string; shouldPlay: boolean }) => {
  const player = useVideoPlayer({ uri }, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (player) {
      shouldPlay ? player.play() : player.pause();
    }
  }, [shouldPlay]);

  if (!player) return null;

  return (
    <VideoView
      player={player}
      allowsFullscreen
      nativeControls
      style={{
        width: width * 0.9,
        height: height * 0.8,
      }}
    />
  );
};

export default VideoItem;
