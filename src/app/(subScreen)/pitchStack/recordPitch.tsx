import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useVideoPlayer, VideoView } from "expo-video";
import Entypo from "@expo/vector-icons/Entypo";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import ErrorAlert from "../../../components/errorAlert";
import * as FileSystem from "expo-file-system";

//Global Variable
const MAX_DURATION = 30;
const MAX_SIZE = 10 * 1024 * 1000; //10MB
const buttonSize = (Dimensions.get("window").width * 13) / 100;

export default function RecordPitch() {
  const params = useLocalSearchParams();
  const item = JSON.parse(params.item as string);

  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [timer, useTimer] = useState<number>(30);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>();
  const [cameraFace, setCameraFace] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
      setError(null);
      setIsRecording(true);

      const result = await cameraRef.current.recordAsync({
        quality: Camera?.Constants?.VideoQuality["144p"], ///Need to fix this in future
        maxDuration: MAX_DURATION,
        maxFileSize: MAX_SIZE,
        mute: false,
      });

      const size = await FileSystem.getInfoAsync(result?.uri || "");
      if (size.exists && size.size && size.size > MAX_SIZE) {
        setError("Video too large");
        return;
      }
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
      pathname: "/pitchStack/createPitch",
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

  //Ping time every 0.5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [player]);

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
      <View style={[styles.container, { zIndex: 4 }]}>
        <View
          style={[
            styles.cameraView,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
              borderRadius: 10,
            },
          ]}
        >
          <VideoView
            style={[{ width: "100%", aspectRatio: 9 / 16 }]}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            contentFit="cover"
            nativeControls={false}
            onTouchStart={() => {
              if (player.playing) {
                player.pause();
                setVideoPlaying(false);
              } else {
                player.play();
                setVideoPlaying(true);
              }
            }}
          />

          {/* Absolute components  */}
          {/* HEader */}
          <View style={[styles.headerButtonContainer]}>
            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => router.back()}
            >
              <Entypo name="cross" size={30} color="#fff" />
            </TouchableOpacity>

            <View style={[styles.timerContainer, { minWidth: 60 }]}>
              <Text style={styles.timerText}>{Math.round(currentTime)} s</Text>
            </View>
          </View>

          {!videoPlaying && (
            <TouchableOpacity
              onPress={() => {
                player.play();
                setVideoPlaying(true);
              }}
              style={[styles.captureButton, { top: "45%" }]}
            >
              <View
                style={[
                  styles.captureButtonInside,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                  },
                ]}
              >
                <Feather name="play" size={24} color="black" />
              </View>
            </TouchableOpacity>
          )}

          {/* Bottom */}
          <View style={[styles.bottomBar, { bottom: 35 }]}>
            <View style={{ width: buttonSize }} />
            <TouchableOpacity
              style={styles.restartIcon}
              onPress={() => setVideoUri(null)}
            >
              <MaterialIcons name="restart-alt" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleContinue}
              style={[styles.restartIcon, { backgroundColor: "#BBCF8D" }]}
            >
              <Entypo name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
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
          facing={cameraFace ? "front" : "back"}
        ></CameraView>

        {/* Absolute Items */}
        <View
          style={[styles.headerButtonContainer, { top: isRecording ? 43 : 16 }]}
        >
          <TouchableOpacity
            style={styles.crossButton}
            onPress={() => router.back()}
          >
            <Entypo name="cross" size={30} color="#000" />
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <MaterialCommunityIcons
              name={timer % 2 ? "timer-sand-complete" : "timer-sand"}
              size={22}
              color="#fff"
            />
            <Text style={styles.timerText}>{timer} s</Text>
          </View>
        </View>

        {isRecording && (
          <View
            style={{
              position: "absolute",
              top: 16,
              flex: 1,
              width: "95%",
              alignSelf: "center",
              borderRadius: 50,
              overflow: "hidden",
              backgroundColor: "#CDCDCD",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: `${((MAX_DURATION - timer) / MAX_DURATION) * 100}%`,
                paddingVertical: 3,
              }}
            ></View>
          </View>
        )}

        {/* Bottom Bar */}
        {/* {isRecording && (
          )} */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.restartIcon} onPress={handleRestart}>
            <MaterialIcons name="restart-alt" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <View
              style={[
                styles.captureButtonInside,
                { backgroundColor: isRecording ? "#FD9292" : "#fff" },
              ]}
            />
          </TouchableOpacity>

          {/* <View style={{ width: 48 }} /> */}
          <View style={[styles.playFlipContainer]}>
            <TouchableOpacity
              style={[styles.playFlipButton]}
              onPress={() => setCameraFace(!cameraFace)}
            >
              <MaterialIcons
                name="flip-camera-android"
                size={buttonSize / 2.25}
                color="black"
              />
            </TouchableOpacity>

            {isRecording && (
              <TouchableOpacity
                style={[styles.playFlipButton]}
                onPress={handlePause}
              >
                <Feather name="pause" size={buttonSize / 2.25} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Buttons */}

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  cameraView: {
    flex: 1,
    borderRadius: 10,
  },
  headerButtonContainer: {
    position: "absolute",
    left: 0,
    top: 16,
    // top: 43,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
  },
  crossButton: {
    borderRadius: 20,
    alignItems: "center",
    zIndex: 2,
  },
  timerContainer: {
    minWidth: 85,
    backgroundColor: "#1F1F1F80",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 2,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: { fontSize: 18, fontFamily: "InterSemiBold", color: "#fff" },
  bottomBar: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  restartIcon: {
    backgroundColor: "white",
    height: buttonSize,
    width: buttonSize,
    borderRadius: 30,
    justifyContent: "center",
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

  //Float Buttons
  captureButton: {
    height: buttonSize,
    width: buttonSize,
    borderRadius: "100%",
    zIndex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  captureButtonInside: {
    height: buttonSize - 10,
    width: buttonSize - 10,
    borderRadius: "100%",
    zIndex: 3,
    borderWidth: 3,
    backgroundColor: "#FD9292",
  },

  playFlipContainer: {
    zIndex: 3,
    gap: 20,
  },
  playFlipButton: {
    height: buttonSize,
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
