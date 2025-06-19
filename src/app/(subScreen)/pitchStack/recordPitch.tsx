import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useVideoPlayer, VideoView } from "expo-video";
import Entypo from "@expo/vector-icons/Entypo";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

//Global Variable
interface Item {
  name: string;
  desc: string;
  format: string;
  pitchType: string;
  duration: number;
  videoUrl: string | null;
}

const MAX_DURATION = 30;
const MAX_SIZE = 5 * 1024 * 1000;

export default function RecordPitch() {
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const item: Item = JSON.parse(params.item as string);
  const [timer, useTimer] = useState<number>(30);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [error, setError] = useState("");

  //Hide Error after 3 sec
  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 3000);
  }, [error]);

  useEffect(() => {
    (async () => {
      const { status: cam } = await Camera.requestCameraPermissionsAsync();
      const { status: mic } = await Camera.requestMicrophonePermissionsAsync();
      setPermissionGranted(cam === "granted" && mic === "granted");
    })();
  }, []);

  //Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        useTimer((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval!);
            stopRecording();
            return 0;
          }
        });
      }, 1000);
    } else {
      useTimer(30);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setError("");
      setIsRecording(true);

      const result = await cameraRef.current.recordAsync({
        quality: "144p", ///Need to fix this in future
        maxDuration: MAX_DURATION,
        maxFileSize: MAX_SIZE,
        mute: false,
      });

      setVideoUri(result?.uri ?? null);
    } catch (e: any) {
      setError(e.message ?? "Recording failed");
    } finally {
      setIsRecording(false);
    }
  };

  const handleRestart = async () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setVideoUri(null);
    }
    setVideoUri(null);
    setTimeout(() => {
      startRecording();
    }, 100);
  };

  const handlePause = () => {};

  const handleContinue = () => {
    router.push({
      pathname: "/pitchStack/uploadPitch",
      params: {
        item: JSON.stringify({ ...item, videoUrl: videoUri }),
      },
    });
    setVideoUri(null);
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    p.play();
  });

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.crossButton, { marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <Entypo name="cross" size={30} color="#000" />
        </TouchableOpacity>
        <Text>Waiting for camera & mic permission…</Text>
      </View>
    );
  }

  if (videoUri) {
    return (
      <View style={[styles.container]}>
        <View
          style={[
            styles.cameraView,
            {
              aspectRatio: 9 / 16,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <VideoView
            style={[styles.cameraContainer, { aspectRatio: 9 / 16 }]}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={false}
          />
          <View style={[styles.bottomBar, { bottom: 35 }]}>
            <TouchableOpacity
              style={styles.restartIcon}
              onPress={() => setVideoUri(null)}
            >
              <MaterialIcons name="restart-alt" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.recordButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.cameraContainer]}>
        <CameraView
          ref={cameraRef}
          style={[styles.cameraView]}
          mode="video"
          facing="front"
        ></CameraView>

        {/* Absolute Items */}
        <TouchableOpacity
          style={styles.crossButton}
          onPress={() => router.back()}
        >
          <Entypo name="cross" size={30} color="#000" />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timer} s</Text>
        </View>

        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            flex: 1,
            width: "100%",
            overflow: "hidden",
            // padding: 10,
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#7A8957",
              width: `${((MAX_DURATION - timer) / MAX_DURATION) * 100}%`,
              paddingVertical: 10,
            }}
          ></View>
        </View>

        {/* Pause */}
        {isRecording && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.restartIcon}
              onPress={handleRestart}
            >
              <MaterialIcons name="restart-alt" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pauseIcon} onPress={handlePause}>
              <MaterialIcons name="pause" size={24} color="black" />
            </TouchableOpacity>
            <View style={{ width: 45 }} />
          </View>
        )}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.stopButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flex: 1,
    height: 645,
    width: 343,
    borderRadius: 20,
    marginBottom: 20,
  },
  cameraView: {
    flex: 1,
    borderRadius: 20,
  },
  crossButton: {
    position: "absolute",
    top: 16,
    left: 16,
    borderRadius: 20,
    alignItems: "center",
    zIndex: 2,
  },
  timerContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#1F1F1F80",
    paddingHorizontal: 10,
    borderRadius: 12,
    zIndex: 2,
  },
  timerText: { fontSize: 18, fontFamily: "InterSemiBold", color: "#fff" },
  bottomBar: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  restartIcon: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  pauseIcon: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  recordButton: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: "#000000",
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#E2594A",
  },
  buttonText: { color: "white", fontFamily: "InterMedium", fontSize: 16 },
  error: {
    position: "absolute",
    top: 50,
    backgroundColor: "#E2594A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    color: "white",
    fontFamily: "InterMedium",
  },
});
