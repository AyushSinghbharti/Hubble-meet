import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  Feather,
  AntDesign,
  FontAwesome6,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import SwipeButton from "../../../components/SwipeButton";
import ErrorAlert from "../../../components/errorAlert";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import UploadErrorModal from "../../../components/pitchScreenComps/popUpNotification";
import { useCreatePitch, useUpdatePitch } from "@/src/hooks/usePitch";
import { useAuthStore } from "@/src/store/auth";
import { usePitchStore } from "@/src/store/pitchStore";
import { ActivityIndicator } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Item {
  name: string;
  desc: string;
  format: string;
  pitchType: string;
  duration: number;
  videoUrl: string | null;
}

const MAX_SIZE = 50 * 1024 * 1000; //50MB

export default function CreatePitch() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item: Item = JSON.parse(params.item as string);

  const [name, setName] = useState<string>(item.name);
  const [desc, setDesc] = useState<string>(item.desc);
  const [format, setFormat] = useState(item.format);
  const [pitchType, setPitchType] = useState(item.pitchType);
  const [duration, setDuration] = useState<number>(item.duration);
  const [error, setError] = useState<string>();
  const [typeModal, setTypeModal] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [media, setMedia] = useState<string | null>(item.videoUrl);
  const [mediaType, setMediaType] = useState<string | undefined>("video/mp4");
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [popUp, setPopUp] = useState(false);

  // Enhanced recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isPreparingToRecord, setIsPreparingToRecord] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [cameraType, setCameraType] = useState<"front" | "back">("front");

  const userId = useAuthStore((state) => state.userId);
  const pitchId = usePitchStore((state) => state.pitchId);

  // Camera setup
  const { hasPermission, requestPermission } = useCameraPermission();
  const frontDevice = useCameraDevice("front");
  const backDevice = useCameraDevice("back");
  const device = cameraType === "front" ? frontDevice : backDevice;
  const cameraRef = useRef<Camera>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout>(null);

  const { mutate: createPitch, isPending: createPitchPending } =
    useCreatePitch();
  const { mutate: updatePitch, isPending: createUpdatePitch } =
    useUpdatePitch();

  useEffect(() => {
    if (format === "Record" && hasPermission) {
      handleRecord();
    }
  }, [format, hasPermission]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Request camera permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  //Media Props
  const pickImage = async () => {
    if (media) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
      videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const videoUri = result.assets[0].uri;
      console.log("Video URI:", videoUri);
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].mimeType);
      if (
        result.assets[0].fileSize !== undefined &&
        result.assets[0].fileSize >= MAX_SIZE
      ) {
        setStatus("error");
        setError("Media size is larger than limit");
      } else {
        setStatus("pending");
      }
    }
  };

  const startCountdown = () => {
    setIsPreparingToRecord(true);
    setShowStartButton(false);
    setCountdown(3);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current!);
          setIsPreparingToRecord(false);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    if (!cameraRef.current || !device) return;

    try {
      setIsRecording(true);
      setIsPaused(false);

      // Start recording
      cameraRef.current.startRecording({
        onRecordingFinished: (video) => {
          console.log("Recording finished:", video.path);
          setMedia(video.path);
          setMediaType("video/mp4");
          setShowCamera(false);
          setIsRecording(false);
          setIsPaused(false);
          setRecordingTime(0);
        },
        onRecordingError: (error) => {
          console.error("Recording error:", error);
          setError("Failed to record video");
          setIsRecording(false);
          setIsPaused(false);
          setRecordingTime(0);
        },
      });

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          // Auto-stop recording when duration limit is reached
          if (newTime >= duration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to start recording");
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = async () => {
    if (!cameraRef.current || !isRecording || isPaused) return;

    try {
      await cameraRef.current.pauseRecording();
      setIsPaused(true);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    } catch (error) {
      console.error("Error pausing recording:", error);
      setError("Failed to pause recording");
    }
  };

  const resumeRecording = async () => {
    if (!cameraRef.current || !isRecording || !isPaused) return;

    try {
      await cameraRef.current.resumeRecording();
      setIsPaused(false);

      // Resume timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error resuming recording:", error);
      setError("Failed to resume recording");
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      await cameraRef.current.stopRecording();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setError("Failed to stop recording");
    }
  };

  const toggleCamera = () => {
    setCameraType((prev) => (prev === "front" ? "back" : "front"));
  };

  const handleRecord = async () => {
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to record videos."
        );
        return;
      }
    }

    if (!device) {
      Alert.alert("Camera Error", "No camera device available.");
      return;
    }

    setShowCamera(true);
    setShowStartButton(true);
    setFormat("Record");
    setRecordingTime(0);
    setCountdown(0);
    setIsPreparingToRecord(false);
    setIsRecording(false);
    setIsPaused(false);
  };

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setShowCamera(false);
    setIsRecording(false);
    setIsPaused(false);
    setIsPreparingToRecord(false);
    setShowStartButton(false);
    setRecordingTime(0);
    setCountdown(0);
  };

  type PitchType = "Upload" | "Record";

  const handleUpload = (type: PitchType = "Upload") => {
    if (type === "Upload") {
      pickImage();
    } else {
      handleRecord();
    }
  };

  const handleSubmit = async () => {
    if (!name || !desc) {
      setError("Please fill all Fields");
      return;
    }

    if (media) {
      const size = await FileSystem.getInfoAsync(media);
      if (size.exists && size.size && size.size > MAX_SIZE) {
        setError("Video too large, Please select another");
        setStatus("error");
        return;
      }
    }

    if (!userId) {
      setError("Error fetching user info, please login again!!!");
      return;
    }

    if (!media) {
      setError("Media is not selected, select one now");
      return;
    }

    if (status === "error") {
      setError("Media size is too big");
      setPopUp(!popUp);
      return;
    }

    setLoading(true);

    const payload = {
      video: {
        uri: media.startsWith("file://") ? media : `file://${media}`,
        type: mediaType || "video/mp4",
        name: `${userId}_createdPitchat_${Date.now()}.mp4`,
      },
      user_id: userId,
      display_name: name,
      pitch_caption: desc,
      type: pitchType,
    };

    console.log(payload);

    if (pitchId) {
      await updatePitch(
        { pitchId, data: payload },
        {
          onSuccess: (res) => {
            setLoading(false);
            setPopUp(!popUp);
          },
          onError: (err) => {
            setError("Error when uploading the pitch, Please try again!!!");
            console.error("❌ Update failed:", err);
            setLoading(false);
          },
        }
      );
    } else {
      await createPitch(payload, {
        onSuccess: (res) => {
          console.log("✅ Created pitch:", res);
          setLoading(false);
          setPopUp(!popUp);
        },
        onError: (err) => {
          setError("Error when uploading the pitch, Please try again!!!");
          console.error("❌ Creation failed:", err);
          setLoading(false);
        },
      });
    }
  };

  const player = useVideoPlayer(media, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    if (player?.duration) {
      setVideoDuration(Math.round(player.duration));
    }
  }, [player?.duration]);

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handleClosePopup = () => {
    if (status === "error") {
      setPopUp(!popUp);
    } else if (status === "pending") {
      router.push("/pitch");
    } else {
      router.push("/connect");
    }
  };

  const handleTypeSelect = (text: string) => {
    setPitchType(text);
    setTypeModal(!typeModal);
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress for recording
  const recordingProgress = (recordingTime / duration) * 100;

  // Render full screen camera overlay
  const renderCameraOverlay = () => {
    if (!showCamera) return null;

    return (
      <View style={styles.cameraContainer}>
        {device && (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={showCamera}
            video={true}
            audio={true}
          />
        )}

        {/* Camera UI Overlay */}
        <View style={styles.cameraOverlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            {/* Left Side - Close */}
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={cancelRecording}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            {/* Center - Timer/Duration */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {formatTime(recordingTime)} / {formatTime(duration)}
              </Text>
              {isRecording && (
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(recordingProgress, 100)}%` },
                    ]}
                  />
                </View>
              )}
            </View>

            {/* Right Side - Camera Switch */}
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={toggleCamera}
              disabled={isRecording} // Disable during recording
            >
              <Ionicons
                name="camera-reverse-outline"
                size={28}
                color={isRecording ? "rgba(255,255,255,0.5)" : "white"}
              />
            </TouchableOpacity>
          </View>

          {/* Center Content */}
          <View style={styles.centerContent}>
            {/* Recording Status */}
            {isRecording && (
              <View style={styles.recordingStatusContainer}>
                <View style={styles.recordingIndicator}>
                  <View
                    style={[styles.recordingDot, isPaused && styles.pausedDot]}
                  />
                  <Text style={styles.recordingStatusText}>
                    {isPaused ? "PAUSED" : "REC"}
                  </Text>
                </View>
              </View>
            )}

            {/* Countdown */}
            {isPreparingToRecord && countdown > 0 && (
              <View style={styles.countdownOverlay}>
                <Text style={styles.countdownNumber}>{countdown}</Text>
                <Text style={styles.countdownLabel}>Get Ready</Text>
              </View>
            )}

            {/* Instructions when ready to start */}
            {showStartButton && !isRecording && !isPreparingToRecord && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionText}>
                  Record your {duration} second pitch
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            {/* Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
              {!isRecording && !isPreparingToRecord && showStartButton && (
                // Start Recording
                <>
                  <View style={styles.sideButtonPlaceholder} />
                  <TouchableOpacity
                    style={styles.recordButton}
                    onPress={startCountdown}
                  >
                    <View style={styles.recordButtonInner} />
                  </TouchableOpacity>
                  <View style={styles.sideButtonPlaceholder} />
                </>
              )}

              {isRecording && (
                // Recording Controls
                <>
                  <TouchableOpacity
                    style={styles.sideButton}
                    onPress={isPaused ? resumeRecording : pauseRecording}
                  >
                    <Ionicons
                      name={isPaused ? "play" : "pause"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.stopButton}
                    onPress={stopRecording}
                  >
                    <View style={styles.stopButtonInner} />
                  </TouchableOpacity>

                  <View style={styles.sideButtonPlaceholder} />
                </>
              )}
            </View>

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
              <Text style={styles.bottomInfoText}>
                {isRecording
                  ? isPaused
                    ? "Tap play to continue"
                    : "Recording in progress"
                  : "Tap the record button to start"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.replace("/pitchStack/myPitch")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>My Pitch</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Media Select box */}
      {media ? (
        <View style={styles.videoBox}>
          <VideoView
            style={styles.videoStyle}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={false}
          />

          {/* position content */}
          <Pressable style={styles.deleteIcon} onPress={() => setMedia(null)}>
            <MaterialIcons name="delete-outline" size={24} color="white" />
          </Pressable>
          <Text style={styles.videoText}>{`${videoDuration} sec`}</Text>

          {!isPlaying ? (
            <Pressable
              hitSlop={30}
              onPress={() => player.play()}
              style={styles.videoIcon}
            >
              <FontAwesome6 name="play" size={24} color="white" />
            </Pressable>
          ) : (
            <Pressable
              hitSlop={30}
              onPress={() => player.pause()}
              style={styles.videoIcon}
            >
              <FontAwesome6 name="pause" size={24} color="white" />
            </Pressable>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => handleUpload("Upload")}
        >
          <View style={styles.uploadBody}>
            <Feather name="upload-cloud" size={36} color="#292D32" />
            <Text style={styles.uploadTitle}>
              Please Upload Your Pitch Here.
            </Text>
            <Text style={styles.uploadHint}>
              You can upload your {duration} second video in maximum{"\n"}size
              of 50mb here…
            </Text>
          </View>

          <View style={[styles.uploadButtonContainer]}>
            <TouchableOpacity
              onPress={() => {
                setFormat("Record");
                handleUpload("Record");
              }}
              style={[
                styles.toggleButton,
                format === "Record"
                  ? styles.activeToggle
                  : styles.inActiveToggle,
              ]}
            >
              <Image
                source={require("../../../../assets/icons/record.png")}
                style={[
                  styles.icon,
                  { tintColor: format === "Record" ? "#fff" : "#000" },
                ]}
              />
              <Text
                style={
                  format === "Record" ? styles.activeText : styles.toggleText
                }
              >
                Record
              </Text>
            </TouchableOpacity>
            <Text style={styles.uploadHint}>Or</Text>
            <TouchableOpacity
              onPress={() => {
                setFormat("Upload");
                handleUpload("Upload");
              }}
              style={[
                styles.toggleButton,
                format === "Upload"
                  ? styles.activeToggle
                  : styles.inActiveToggle,
              ]}
            >
              <Image
                source={require("../../../../assets/icons/upload.png")}
                style={[
                  styles.icon,
                  { tintColor: format === "Upload" ? "#fff" : "#000" },
                ]}
              />
              <Text
                style={
                  format === "Upload" ? styles.activeText : styles.toggleText
                }
              >
                Upload
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Switch Bars */}
      <View
        style={{
          flexDirection: "row",
          gap: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Pitch Duration */}
        <View style={styles.card}>
          <View style={styles.rowNoGap}>
            <Image
              source={require("../../../../assets/icons/timer.png")}
              style={styles.icon}
            />
            <Text style={styles.cardTitle}>Duration</Text>
          </View>

          {/* green chip */}
          <TouchableOpacity style={styles.durationButton}>
            <Text style={styles.cardText}>{duration} Sec</Text>
          </TouchableOpacity>
        </View>

        {/* Pitch Type */}
        <View style={styles.card}>
          <View style={styles.rowNoGap}>
            <Image
              source={require("../../../../assets/icons/refresh.png")}
              style={styles.icon}
            />
            <Text style={styles.cardTitle}>Type</Text>
          </View>

          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => setTypeModal(!typeModal)}
          >
            <Text style={styles.cardText}>{pitchType}</Text>
            <AntDesign name="down" size={24} color="black" />
          </TouchableOpacity>

          {/* Modal */}
          {typeModal && (
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: "#fff",
                  borderColor: "#c7c7c7",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  gap: 5,
                },
              ]}
            >
              <Text
                style={[styles.cardText, styles.fullText]}
                onPress={() => handleTypeSelect("Individual")}
              >
                Individual
              </Text>
              <View style={{ borderBottomWidth: 1, borderColor: "#DEDEE0" }} />
              <Text
                style={[styles.cardText, styles.fullText]}
                onPress={() => handleTypeSelect("Business")}
              >
                Business
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Name and Description */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginBottom: 45,
        }}
      >
        <View>
          <TextInput
            placeholder="Display Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={"#949494"}
          />
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Caption"
              value={desc}
              onChangeText={setDesc}
              style={[styles.desc]}
              placeholderTextColor={"#949494"}
              multiline
              textAlignVertical="top"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size={"large"} color="skyblue" />
        ) : (
          <SwipeButton
            hasError={error}
            onSwipeSuccess={handleSubmit}
            text={"Swipe to Submit"}
          />
        )}
      </View>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      {/* Modals */}
      {popUp && (
        <View style={{ flex: 1 }}>
          <UploadErrorModal
            visible={popUp}
            onClose={handleClosePopup}
            type={status ?? "error"}
          />
        </View>
      )}

      {/* Full Screen Camera Overlay */}
      {renderCameraOverlay()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "InterBold",
    color: "#000",
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#5C5C6533",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 12,
    minHeight: 75,
  },
  rowNoGap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cardTitle: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: "#57616B",
  },
  cardText: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: "#000",
  },
  /* pitch‑duration chip */
  durationButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  icon: {
    height: 22,
    width: 22,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  activeToggle: {
    backgroundColor: "#596c2d",
    borderWidth: 2,
    borderColor: "#fff",
  },
  inActiveToggle: {
    backgroundColor: "#EAF0DB",
    borderWidth: 2,
    borderColor: "#fff",
  },
  toggleText: {
    color: "#4D5D2A",
    fontFamily: "InterMedium",
  },
  activeText: {
    color: "#fff",
    fontFamily: "InterSemiBold",
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
    minHeight: 100,
  },
  input: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    paddingVertical: 8,
    color: "#000",
    flex: 1,
  },
  errorText: {
    color: "#EF5350",
    fontFamily: "InterMediumItalic",
    fontSize: 12,
  },
  proceedButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  proceedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  //Upload box
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#5C5C6580",
    borderRadius: 12,
    backgroundColor: "#fff",
    minHeight: 240,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    padding: 10,
    paddingBottom: 18,
  },
  uploadBody: { justifyContent: "center", alignItems: "center", flex: 1 },
  uploadTitle: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#525f7f",
  },
  uploadHint: {
    marginTop: 6,
    fontFamily: "Inter",
    fontSize: 12,
    textAlign: "center",
    color: "#525f7f",
    lineHeight: 18,
  },
  uploadButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  //Modal View
  modalContainer: {
    position: "absolute",
    top: "120%",
    zIndex: 2,
    borderTopWidth: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    width: "115%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    elevation: 0.5,
    shadowOffset: { height: 200, width: 100 },
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  fullText: { textAlign: "left", width: "100%" },

  //Video Container:
  videoBox: {
    borderWidth: 1,
    borderColor: "#5C5C6580",
    backgroundColor: "black",
    borderRadius: 12,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  videoStyle: {
    height: "100%",
    width: "100%",
  },
  videoText: {
    position: "absolute",
    bottom: 18,
    left: 20,
    color: "#fff",
    fontFamily: "InterSemiBold",
    fontSize: 14,
  },
  videoIcon: {
    position: "absolute",
    bottom: 8,
    right: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    backgroundColor: "#FFFFFF66",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    position: "absolute",
    top: 10,
    right: 10,
  },

  // Phone Camera UI Styles
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 1000,
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  topBarButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    padding: 12,
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
  },
  timerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF3B30",
    borderRadius: 2,
  },

  // Center Content
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  recordingStatusContainer: {
    position: "absolute",
    top: 40,
    alignItems: "center",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginRight: 8,
  },
  pausedDot: {
    backgroundColor: "#FF9500",
  },
  recordingStatusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  countdownOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: "300",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  countdownLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
    marginTop: -10,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  instructionsContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  instructionText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Bottom Controls
  bottomControls: {
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sideButtonPlaceholder: {
    width: 60,
    height: 60,
  },
  sideButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF3B30",
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  stopButtonInner: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 2,
  },
  bottomInfo: {
    alignItems: "center",
    paddingTop: 10,
  },
  bottomInfoText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
  },
});
