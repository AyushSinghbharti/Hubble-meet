import React, { useEffect, useState } from "react";
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
import ManualBlur from "../../../components/BlurComp";
import { useCreatePitch, useUpdatePitch } from "@/src/hooks/usePitch";
import { useAuthStore } from "@/src/store/auth";
import { usePitchStore } from "@/src/store/pitchStore";
import { ActivityIndicator } from "react-native-paper";
import * as FileSystem from "expo-file-system";

interface Item {
  name: string;
  desc: string;
  format: string;
  pitchType: string;
  duration: number;
  videoUrl: string | null;
}

const MAX_SIZE = 10 * 1024 * 1000; //5MB

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

  const userId = useAuthStore((state) => state.userId);
  const pitchId = usePitchStore((state) => state.pitchId);

  const { mutate: createPitch, isPending: createPitchPending } =
    useCreatePitch();
  const { mutate: updatePitch, isPending: createUpdatePitch } =
    useUpdatePitch();

  //Media Props
  const pickImage = async () => {
    if (media) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].mimeType);
      if (
        result.assets[0].fileSize !== undefined &&
        result.assets[0].fileSize >= MAX_SIZE
      ) {
        console.log(result.assets[0].fileSize);
        setStatus("error");
        setError("Media size is larger than limit");
      } else {
        setStatus("pending");
      }
    }
  };

  type PitchType = "Upload" | "Record";

  const handleUpload = (type: PitchType = "Upload") => {
    if (type === "Upload") {
      pickImage();
    } else {
      router.push({
        pathname: "/pitchStack/recordPitch",
        params: {
          item: JSON.stringify({
            name,
            desc,
            format,
            pitchType,
            duration,
            videoUrl: null,
          }),
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!name || !desc) {
      setError("Please fill all Fields");
      return;
    }

    if (media) {
      const size = await FileSystem.getInfoAsync(media);
      console.log(size.size / MAX_SIZE);
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
        uri: media,
        type: mediaType || "video/mp4",
        name: `${userId}_createdPitchat_${Date.now()}.mp4`,
      },
      user_id: userId,
      display_name: name,
      pitch_caption: desc,
      type: pitchType
    };

    if (pitchId) {
      await updatePitch(
        { pitchId, data: payload },
        {
          onSuccess: (res) => {
            setLoading(false);
            setPopUp(!popUp);
          },
          onError: (err) => {
            setError("Errow when uploading the pitch, Please try again!!!");
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
          setError("Errow when uploading the pitch, Please try again!!!");
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
          {/* <Text style={styles.videoText}>30 sec</Text> */}
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
              You can upload your 30 second video in maximum{"\n"}size of 10mb
              here…
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
});
