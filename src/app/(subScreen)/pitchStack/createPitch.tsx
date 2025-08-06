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
import { FONT } from "@/assets/constants/fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const MAX_SIZE = 50 * 1024 * 1000; // 50MB
const ERROR = "#EF5350";
const PLACEHOLDER = "#7c8664";

interface Item {
  name: string;
  desc: string;
  format: string;
  pitchType: string;
  duration: number;
  videoUrl: string | null;
}

export default function CreatePitch() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item: Item = JSON.parse(params.item as string);
  const [name, setName] = useState(item.name);
  const [desc, setDesc] = useState(item.desc || "");
  const [format, setFormat] = useState(item.format);
  const [pitchType, setPitchType] = useState(item.pitchType || "Individual");
  const [duration, setDuration] = useState(item.duration || 30);
  const [error, setError] = useState<string | undefined>();
  const [typeModal, setTypeModal] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [media, setMedia] = useState(item.videoUrl);
  const [mediaType, setMediaType] = useState("video/mp4");
  const [loading, setLoading] = useState(false);
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
  const cameraRef = useRef<Camera | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: createPitch, isPending: createPitchPending } = useCreatePitch();
  const { mutate: updatePitch, isPending: createUpdatePitch } = useUpdatePitch();

  useEffect(() => {
    if (format === "Record" && hasPermission) {
      handleRecord();
    }
  }, [format, hasPermission]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Request camera permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // Media Props
  const pickImage = async () => {
    if (media) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
      videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      const videoUri = result.assets[0].uri;
      setMedia(videoUri);
      setMediaType(result.assets[0].mimeType || "video/mp4");
      if (
        result.assets[0].fileSize !== undefined &&
        result.assets[0].fileSize >= MAX_SIZE
      ) {
        setStatus("error");
        setError("Video size is too large (max 50MB)");
      } else {
        setStatus("pending");
        setError(undefined);
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
      cameraRef.current.startRecording({
        onRecordingFinished: (video) => {
          setMedia(video.path);
          setMediaType("video/mp4");
          setShowCamera(false);
          setIsRecording(false);
          setIsPaused(false);
          setRecordingTime(0);
        },
        onRecordingError: (error) => {
          setError("Failed to record video");
          setIsRecording(false);
          setIsPaused(false);
          setRecordingTime(0);
        },
      });
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
      setError("Failed to pause recording");
    }
  };

  const resumeRecording = async () => {
    if (!cameraRef.current || !isRecording || !isPaused) return;
    try {
      await cameraRef.current.resumeRecording();
      setIsPaused(false);
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
    console.log("handleSubmit triggered");

    if (!name || !desc) {
      console.log("Validation failed: Missing name or description");
      setError("Please fill all fields");
      return;
    }

    if (media) {
      try {
        console.log("Checking media size...");
        const size = await FileSystem.getInfoAsync(media);
        console.log("Media size info:", size);

        if (size.exists && size.size && size.size > MAX_SIZE) {
          console.log("Validation failed: Video too large");
          setError("Video too large, please select another");
          setStatus("error");
          return;
        }
      } catch (err) {
        console.error("Error getting media info:", err);
        setError("Unable to process media file");
        return;
      }
    }

    if (!media) {
      console.log("Validation failed: No media selected");
      setError("Media is not selected, select one now");
      return;
    }

    if (!userId) {
      console.log("Validation failed: Missing userId");
      setError("Error fetching user info, please login again!");
      return;
    }

    setLoading(true);
    console.log("All validations passed, building payload...");

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

    console.log("Payload ready:", payload);

    if (pitchId) {
      console.log("Updating existing pitch with ID:", pitchId);
      await updatePitch(
        { pitchId, data: payload },
        {
          onSuccess: () => {
            console.log("Pitch update successful");
            setLoading(false);
            setPopUp(true);
          },
          onError: (error) => {
            console.error("Error while updating the pitch:", error);
            setError("Error while updating the pitch. Please try again!");
            setLoading(false);
          },
        }
      );
    } else {
      console.log("Creating new pitch...");
      await createPitch(payload, {
        onSuccess: () => {
          console.log("Pitch creation successful");
          setLoading(false);
          setPopUp(true);
        },
        onError: (error) => {
          console.error("Error creating the pitch:", error);
          setError("Error creating the pitch. Please try again!");
          setLoading(false);
        },
      });
    }
  };


  const player = useVideoPlayer(media, (player) => {
    player.loop = true;
    player.pause();
  });

  useEffect(() => {
    if (player?.duration) {
      setVideoDuration(Math.round(player.duration));
    }
  }, [player?.duration, media]);

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handleClosePopup = () => {
    setPopUp(false);
    if (status === "error") {
      setPopUp(true);
    } else if (status === "pending") {
      router.push("/pitch");
    } else {
      router.push("/connect");
    }
  };

  const handleTypeSelect = (text: string) => {
    setPitchType(text);
    setTypeModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const recordingProgress = (recordingTime / duration) * 100;

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
            video
            audio
          />
        )}

        <View style={styles.cameraOverlay}>
          {/* Top Bar with Close and Timer */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={cancelRecording} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            <View style={styles.timerContainer}>
              {isRecording && (
                <View style={styles.timerDisplay}>
                  <Text style={styles.timerText}>
                    {formatTime(recordingTime)} / {formatTime(duration)}
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${recordingProgress}%` }]}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={toggleCamera} style={styles.cameraFlipButton}>
              <Ionicons name="camera-reverse" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Center Content Area */}
          <View style={styles.centerContent}>
            {/* Countdown Display */}
            {isPreparingToRecord && countdown > 0 && (
              <View style={styles.countdownContainer}>
                <View style={styles.countdownCircle}>
                  <Text style={styles.countdownNumber}>{countdown}</Text>
                </View>
                <Text style={styles.countdownLabel}>Get Ready</Text>
              </View>
            )}

            {/* Recording Status */}
            {isRecording && (
              <View style={styles.recordingStatusBadge}>
                <View style={[styles.recordingDot, isPaused && styles.pausedDot]} />
                <Text style={styles.recordingStatusText}>
                  {isPaused ? "PAUSED" : "RECORDING"}
                </Text>
              </View>
            )}

            {/* Start Recording Instructions */}
            {showStartButton && !isRecording && !isPreparingToRecord && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionTitle}>Start Recording</Text>
                <Text style={styles.instructionSubtitle}>
                  Record your {duration} second pitch
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <View style={styles.controlsRow}>
              {/* Gallery/Media Button */}
              {/* <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                <Ionicons name="images" size={24} color="white" />
              </TouchableOpacity> */}

              {/* Main Record/Control Button */}
              <View style={styles.recordButtonContainer}>
                {!isRecording && !isPreparingToRecord && showStartButton && (
                  <TouchableOpacity
                    onPress={startCountdown}
                    style={styles.recordButton}
                  >
                    <View style={styles.recordButtonInner} />
                  </TouchableOpacity>
                )}

                {isRecording && (
                  <View style={styles.recordingControls}>
                    <TouchableOpacity
                      onPress={stopRecording}
                      style={styles.stopButton}
                    >
                      <View style={styles.stopButtonInner} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Pause/Resume Button */}
              {isRecording ? (
                <TouchableOpacity
                  onPress={isPaused ? resumeRecording : pauseRecording}
                  style={styles.pauseButton}
                >
                  <Ionicons
                    name={isPaused ? "play" : "pause"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.placeholderButton} />
              )}
            </View>

            {/* Bottom Status Text */}
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                {isRecording
                  ? isPaused
                    ? "Recording paused"
                    : "Recording in progress..."
                  : "Tap to start recording"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.replace("/pitchStack/myPitch")}>
            <Ionicons name="arrow-back" size={24} color="#1C2303" />
          </TouchableOpacity>
          <Text style={styles.title}>My Pitch</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Media Select box */}
        <View style={styles.mediaCard}>
          {media ? (
            <View style={styles.videoBox}>
              <VideoView
                style={styles.videoStyle}
                player={player}
                allowsFullscreen
                nativeControls={false}
              />
              <TouchableOpacity
                onPress={() => setMedia(null)}
                style={styles.deleteIcon}
              >
                <MaterialIcons name="delete" size={22} color="white" />
              </TouchableOpacity>
              <Text style={styles.videoDurationText}>
                {videoDuration > 0 ? `${videoDuration} sec` : `${duration} sec`}
              </Text>
              {!isPlaying ? (
                <TouchableOpacity
                  onPress={() => player.play()}
                  style={styles.videoControlIcon}
                >
                  <FontAwesome name="play" size={22} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => player.pause()}
                  style={styles.videoControlIcon}
                >
                  <FontAwesome name="pause" size={22} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => handleUpload("Upload")}
            >
              <Image
                source={require("../../../../assets/icons/upload.png")}
                style={styles.icon}
              />
              <Text style={styles.uploadTitle}>
                Please upload your pitch here
              </Text>
              <Text style={styles.uploadHint}>
                You can upload your {duration} second video in maximum size of 50mb
                here…
              </Text>
              <View style={styles.typeToggleRow}>
                <TouchableOpacity
                  onPress={() => {
                    setFormat("Record");
                    handleUpload("Record");
                  }}
                  style={[
                    styles.toggleButton,
                    format === "Record" ? styles.activeToggle : styles.inActiveToggle,
                  ]}
                >
                  <Feather
                    name="video"
                    size={23}
                    color={format === "Record" ? "#fff" : "#6e7a33"}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      format === "Record" && styles.activeText,
                    ]}
                  >
                    Record
                  </Text>
                </TouchableOpacity>
                <Text style={styles.toggleText}>Or</Text>
                <TouchableOpacity
                  onPress={() => {
                    setFormat("Upload");
                    handleUpload("Upload");
                  }}
                  style={[
                    styles.toggleButton,
                    format === "Upload" ? styles.activeToggle : styles.inActiveToggle,
                  ]}
                >
                  <Feather
                    name="upload"
                    size={23}
                    color={format === "Upload" ? "#fff" : "#6e7a33"}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      format === "Upload" && styles.activeText,
                    ]}
                  >
                    Upload
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ backgroundColor: "#1e1e1e", padding: 25, borderRadius: 20 }}>
          <Text style={[styles.typeLabel, { marginBottom: 15 }]}>Type</Text>

          {/* Type Buttons */}
          <View style={styles.typeButtonGroup}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                pitchType === "Individual" && { borderColor: "#ecffab" }, // Only border color changes
              ]}
              onPress={() => handleTypeSelect("Individual")}
            >
              <Feather
                name="user"
                size={24}
                color={pitchType === "Individual" ? "#ecffab" : "#fff"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  pitchType === "Individual" && { color: "#ecffab" },
                ]}
              >
                Individual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                pitchType === "Business" && { borderColor: "#ecffab" }, // Only border color changes
              ]}
              onPress={() => handleTypeSelect("Business")}
            >
              <Feather
                name="briefcase"
                size={24}
                color={pitchType === "Business" ? "#ecffab" : "#fff"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  pitchType === "Business" && { color: "#ecffab" },
                ]}
              >
                Business
              </Text>
            </TouchableOpacity>
          </View>

        </View>








        <View style={{ marginTop: 18, backgroundColor: '#1e1e1e', padding: 20, borderRadius: 20 }}>
          <Text style={{ color: "#4B4B4B", fontFamily: FONT.MONSERRATMEDIUM, fontSize: 20 }}>Description</Text>
          <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATREGULAR, fontSize: 16, marginVertical: 10 }}>Display Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Display Name"
            placeholderTextColor={PLACEHOLDER}
            value={name}
            onChangeText={setName}

          />
          <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATREGULAR, fontSize: 16, marginVertical: 10 }}>Caption</Text>


          <View style={styles.captionBox}>


            <TextInput
              style={styles.captionInput}
              placeholder="Write your caption here…"
              value={desc}
              onChangeText={t =>
                t.length <= 100 ? setDesc(t) : undefined
              }
              placeholderTextColor={PLACEHOLDER}
              multiline
            />
            <Text style={styles.charCount}>{desc.length}/100</Text>
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Submit Button */}
        <View style={{ marginTop: 36, marginBottom: 14 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#679900" />
          ) : (
            <SwipeButton
              hasError={!!error}
              onSwipeSuccess={handleSubmit}
              text="Swipe to Submit"
            />
          )}
        </View>



        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {/* 
        {loading ? (
          <ActivityIndicator size="large" color="#717C07" />
        ) : (
          <SwipeButton
            onSwipeSuccess={handleSubmit}
            title="Swipe to Submit Pitch"
            disabled={createPitchPending || createUpdatePitch}
            resetOnSuccess
          />
        )} */}

        {!!error && <ErrorAlert message={error} onClose={() => setError("")} />}

        {/* Modals */}
        {popUp && (
          <UploadErrorModal
            visible={popUp}
            onClose={handleClosePopup}
            type={status} // ✅ Use "type" instead of "status"
            description={error} // ✅ If you want to show the error as the message
          />

        )}

        {/* Full Screen Camera Overlay */}
        {renderCameraOverlay()}
      </ScrollView>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    padding: 22,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 6,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "InterBold",
    fontSize: 20,
    color: "#1C2303",
    flex: 1,
    textAlign: "center",
  },
  // Media Card
  mediaCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderColor: "#e7f4c4",
    borderWidth: 1.5,
    padding: 0,
    marginBottom: 14,
    overflow: "hidden",
    minHeight: 232,
    marginTop: 2,
  },
  uploadBox: {
    borderStyle: "dotted",
    borderWidth: 0.1,
    borderColor: "#B3CF68",
    borderRadius: 16,
    backgroundColor: "#1e1e1e",
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 0,
    minHeight: 220,
    justifyContent: "center",
  },
  uploadTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#728403",
  },
  uploadHint: {
    fontSize: 12,
    textAlign: "center",
    color: "#96b05a",
    marginTop: 7,
    lineHeight: 17,
    fontWeight: "500",
  },
  videoBox: {
    height: 220,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#23290f",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  videoStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  deleteIcon: {
    position: "absolute",
    top: 14,
    right: 16,
    backgroundColor: "#679900cc",
    borderRadius: 15,
    padding: 8,
    zIndex: 15,
  },
  videoDurationText: {
    position: "absolute",
    bottom: 17,
    left: 22,
    color: "#fff",
    fontWeight: "700",
    fontSize: 13.5,
    opacity: 0.93,
    backgroundColor: "#23290fcc",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  videoControlIcon: {
    position: "absolute",
    right: 13,
    bottom: 13,
    backgroundColor: "#23290fcc",
    borderRadius: 19,
    padding: 9,
    zIndex: 22,
  },
  // Toggle Row
  typeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 0,
    justifyContent: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 19,
    borderRadius: 12,
    backgroundColor: "#f5fbe1",
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: "#e7f4c4",
  },
  activeToggle: {
    backgroundColor: "#717C07",
    borderColor: "#697012",
  },
  inActiveToggle: {
    backgroundColor: "#ECFFAB",
    borderColor: "#e7f4c4",
  },
  toggleText: {
    color: "#6e7a33",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.09,
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.09,
  },
  icon: {
    width: 23,
    height: 23,
  },
  // Row below video: Type & Duration
  row2: {
    flexDirection: "row",
    gap: 14,
    marginVertical: 11,
    marginBottom: 0,
    justifyContent: "space-between",
  },
  typeBox: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 11,
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e7f4c4",
    alignItems: "flex-start",
    marginHorizontal: 2,
    minHeight: 70,
  },
  typeLabel: {
    fontSize: 13,
    color: "#BBCF8D",
    fontWeight: "500",
    marginBottom: 5,
  },
  typePicker: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeSelected: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1,
    color: "#424805",
    paddingRight: 0,
  },
  // Type modal
  typeModalBox: {
    position: "absolute",
    top: 44,
    left: 0,
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e7f4c4",
    zIndex: 400,
    elevation: 11,
    shadowColor: "#222",
    shadowOpacity: 0.14,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 5,
  },
  typeModalChoice: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    width: "100%",
    borderRadius: 7,
  },
  typeModalText: {
    color: "#7c8664",
    fontSize: 15,
    letterSpacing: 0.1,
    fontWeight: "600",
  },
  typeChoiceDivider: {
    width: "96%",
    height: 1,
    backgroundColor: "#e4ebd3",
    alignSelf: "center",
  },
  // Name & Caption
  nameInput: {
    backgroundColor: "#292929",
    borderRadius: 10,
    fontSize: 15,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#4B4B4B",
    color: "#1C2303",
    fontWeight: "700",
    marginBottom: 13,
    marginTop: 16,
  },
  captionBox: {
    backgroundColor: "#292929",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#4B4B4B",
    paddingTop: 10,
    paddingBottom: 23,
    minHeight: 90,
    justifyContent: "flex-end",
    marginBottom: 1,
  },
  captionInput: {
    fontSize: 15,
    color: "#1C2303",
    fontWeight: "500",
    minHeight: 46,
    paddingTop: 0,
    letterSpacing: 0.09,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 13,
    color: "#838f50",
    marginTop: 2,
    fontWeight: "600",
  },
  errorText: {
    color: ERROR,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 7,
    marginLeft: 2,
  },
  // Camera UI Styles
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
    width: screenWidth,
    height: screenHeight,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    padding: 12,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraFlipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    padding: 12,
    width: 50,
    height: 50,
    justifyContent: "flex-end",
    alignItems: "center",
    top: 640

  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  timerDisplay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 140,
  },
  timerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    marginTop: 6,
    width: 120,
  },
  progressBar: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF3B30",
    borderRadius: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  countdownContainer: {
    alignItems: "center",
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: "300",
    color: "white",
    textAlign: "center",
  },
  countdownLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  recordingStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    position: "absolute",
    top: 40,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginRight: 10,
  },
  pausedDot: {
    backgroundColor: "#FF9500",
  },
  recordingStatusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  instructionsContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  instructionTitle: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  instructionSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "400",
  },

  // Bottom Controls Styles
  bottomControls: {
    paddingBottom: Platform.OS === "ios" ? 50 : 40,
    paddingHorizontal: 30,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 100
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF3B30",
  },
  recordingControls: {
    alignItems: "center",
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButtonInner: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 2,
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderButton: {
    width: 50,
    height: 50,
  },
  statusContainer: {
    alignItems: "center",
    paddingTop: 10,
  },
  statusText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },


  typeButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  typeButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 12,
    flex: 1,
  },
  typeButtonSelected: {
    backgroundColor: "#ecffab",
    borderColor: "#ecffab",
  },

  typeButtonText: {
    marginTop: 8,
    color: "#fff",
    fontSize: 14,
  },

  typeButtonTextSelected: {
    color: "#424805",
    fontWeight: "600",
  },
});