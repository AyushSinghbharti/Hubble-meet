// // App.tsx  (or any screen file)
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraType, CameraView, CameraViewProps } from "expo-camera";
import { useVideoPlayer, VideoView } from "expo-video";

const MAX_DURATION = 30;
const MAX_SIZE = 5 * 1024 * 1024;

export default function RecordPitch() {
  const cameraRef = useRef<CameraView>(null);

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [error, setError] = useState("");

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    (async () => {
      const { status: cam } = await Camera.requestCameraPermissionsAsync();
      const { status: mic } = await Camera.requestMicrophonePermissionsAsync();
      setPermissionsGranted(cam === "granted" && mic === "granted");
    })();
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return;
    try {
      setError("");
      setIsRecording(true);

      const result = await cameraRef.current.recordAsync({
        quality: "480p", 
        maxDuration: MAX_DURATION,
        maxFileSize: MAX_SIZE,
        mute: false,
      });
      setVideoUri(result?.uri ?? null);
    } catch (e: any) {
      setError(e.message);
      console.log(e);
    } finally {
      setIsRecording(false);
    }
  };

  let stopRecording = () => {
    if (!cameraRef.current) return;
    setIsRecording(false);
    console.log("stopped working");
    cameraRef.current.stopRecording();
  };

  if (!permissionsGranted) {
    return (
      <View style={styles.center}>
        <Text>Waiting for camera & mic permission…</Text>
      </View>
    );
  }

  if (videoUri) {
    return (
      <View style={styles.container}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setVideoUri(null)}
        >
          <Text style={styles.buttonText}>Record Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <CameraView ref={cameraRef} style={styles.container} mode="video">
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.stopButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>{isRecording ? "STOP" : "REC"}</Text>
        </TouchableOpacity>
      </CameraView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* Recorder button */
  recordButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: { backgroundColor: "rgba(0,0,0,0.85)" },

  buttonText: { color: "#fff", fontWeight: "600" },

  /* Playback */
  video: { flex: 1, alignSelf: "stretch", backgroundColor: "#000" },

  /* Error banner */
  error: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(255,0,0,0.75)",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  /* Retake button on playback screen */
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
