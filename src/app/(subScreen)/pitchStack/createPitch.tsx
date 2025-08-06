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
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
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
import NavHeader from "@/src/components/NavHeader";

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

  const [name, setName] = useState<string>(item.name);
  const [desc, setDesc] = useState<string>(item.desc || "");
  const [format, setFormat] = useState(item.format);
  const [pitchType, setPitchType] = useState(item.pitchType || "Individual");
  const [duration, setDuration] = useState<number>(item.duration || 30);
  const [error, setError] = useState<string>();
  const [typeModal, setTypeModal] = useState(false);

  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [media, setMedia] = useState<string | null>(item.videoUrl);
  const [mediaType, setMediaType] = useState<string | undefined>("video/mp4");
  const [loading, setLoading] = useState<boolean>(false);
  const [popUp, setPopUp] = useState(false);

  // Camera hooks and refs left unchanged from your code, omitted for brevity

  // Pitch hooks
  const userId = useAuthStore((state) => state.userId);
  const pitchId = usePitchStore((state) => state.pitchId);
  const { mutate: createPitch, isPending: createPitchPending } =
    useCreatePitch();
  const { mutate: updatePitch, isPending: createUpdatePitch } =
    useUpdatePitch();

  // Video Picker
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].mimeType);
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

  // Swipe-to-Submit handler
  const handleSubmit = async () => {
    if (!name || !desc) {
      setError("Please fill all fields");
      return;
    }

    if (!media) {
      setError("Media is not selected, select one now");
      return;
    }

    if (!userId) {
      setError("Error fetching user info, please login again!");
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

    if (pitchId) {
      await updatePitch(
        { pitchId, data: payload },
        {
          onSuccess: () => {
            setLoading(false);
            setPopUp(true);
          },
          onError: () => {
            setError("Error while updating the pitch. Please try again!");
            setLoading(false);
          },
        }
      );
    } else {
      await createPitch(payload, {
        onSuccess: () => {
          setLoading(false);
          setPopUp(true);
        },
        onError: () => {
          setError("Error creating the pitch. Please try again!");
          setLoading(false);
        },
      });
    }
  };

  // Video player
  const player = useVideoPlayer(media, (player) => {
    player.loop = true;
    player.pause();
  });

  useEffect(() => {
    if (media && player) {
      player.seek(0);
    }
    // eslint-disable-next-line
  }, [media]);

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const [videoDuration, setVideoDuration] = useState(0);
  useEffect(() => {
    if (player?.duration) {
      setVideoDuration(Math.round(player.duration));
    }
  }, [player?.duration, media]);

  // Modal closing
  const handleClosePopup = () => {
    setPopUp(false);
    router.push("/pitch");
  };

  // Pitch type modal
  const handleTypeSelect = (text: string) => {
    setPitchType(text);
    setTypeModal(false);
  };

  // UI 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <NavHeader title="My Pitch" />

      {/* Media Selection Card */}
      <View style={styles.mediaCard}>
        {media ? (
          <View style={styles.videoBox}>
            <VideoView
              style={styles.videoStyle}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              nativeControls={false}
            />
            <Pressable style={styles.deleteIcon} onPress={() => setMedia(null)}>
              <MaterialIcons name="delete-outline" size={26} color="#fff" />
            </Pressable>
            <Text style={styles.videoDurationText}>
              {videoDuration > 0 ? `${videoDuration} sec` : `${duration} sec`}
            </Text>
            {!isPlaying ? (
              <Pressable
                hitSlop={30}
                onPress={() => player.play()}
                style={styles.videoControlIcon}
              >
                <FontAwesome6 name="play" size={21} color="#fff" />
              </Pressable>
            ) : (
              <Pressable
                hitSlop={30}
                onPress={() => player.pause()}
                style={styles.videoControlIcon}
              >
                <FontAwesome6 name="pause" size={21} color="#fff" />
              </Pressable>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickVideo}
            activeOpacity={0.95}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Feather name="upload-cloud" size={40} color="#ADD254" />
              <Text style={styles.uploadTitle}>
                Please upload your pitch here
              </Text>
              <Text style={styles.uploadHint}>
                You can upload your {duration} second video in maximum
                size of 50mb here…
              </Text>
            </View>
            <View style={styles.typeToggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  format === "Record"
                    ? styles.activeToggle
                    : styles.inActiveToggle,
                ]}
                onPress={() => setFormat("Record")}
              >
                <Image
                  source={require("../../../../assets/icons/record.png")}
                  style={[
                    styles.icon,
                    { tintColor: format === "Record" ? "#fff" : "#222" },
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
                style={[
                  styles.toggleButton,
                  format === "Upload"
                    ? styles.activeToggle
                    : styles.inActiveToggle,
                ]}
                onPress={pickVideo}
              >
                <Image
                  source={require("../../../../assets/icons/upload.png")}
                  style={[
                    styles.icon,
                    { tintColor: format === "Upload" ? "#fff" : "#222" },
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





      {/* Name / Caption */}
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

      {!!error && (
        <ErrorAlert message={error} onClose={() => setError("")} />
      )}

      {/* Modals */}
      {popUp && (
        <UploadErrorModal
          visible={popUp}
          onClose={handleClosePopup}
          type={status ?? "error"}
        />
      )}
    </ScrollView>
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

  // Media Card (top video/upload card)
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

  // Video UI
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
    fontFamily: FONT.MONSERRATMEDIUM,
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
  typeLabel: {
    color: "#d4f088",
    fontSize: 18,
    fontWeight: "600",
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
