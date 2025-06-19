import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import UploadErrorModal from "../../../components/pitchScreenComps/popUpNotification";

interface Item {
  name: string;
  desc: string;
  format: string;
  pitchType: string;
  duration: number;
  videoUrl: string | null;
}

export default function UploadPitch() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item: Item = JSON.parse(params.item as string);
  const [name, setName] = useState<string>(item.name);
  const [desc, setDesc] = useState<string>(item.desc);
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<"pending" | "success" | "error">();
  const [media, setMedia] = useState<string | null>(item.videoUrl);
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    console.log(media);
  }, [media]);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setMedia(result.assets[0].uri);
      if (
        result.assets[0].fileSize !== undefined &&
        result.assets[0].fileSize >= 5000 * 1024
      ) {
        setStatus("error");
      } else {
        setStatus("pending");
      }
    }
  };

  const handleUpload = () => {
    pickImage();
  };

  const handleProceed = () => {
    if (!media) {
      setError("Pitch not uploaded. Upload One Now!");
      return;
    }

    setPopUp(!popUp);
  };

  const handleClosePopup = () => {
    if (status === "error") {
      setPopUp(!popUp);
    } else if (status === "pending") {
      router.push("/pitch");
    } else {
      router.push("/chat");
    }
  };

  const player = useVideoPlayer(media, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#0E1B33" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Pitch</Text>
          {/* Spacer so the title stays centred */}
          <View style={{ width: 24 }} />
        </View>

        {/* Name & Company card */}
        <View style={styles.card}>
          <TextInput
            placeholder="Display name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <View style={styles.separator}></View>
          <TextInput
            placeholder="Pitch caption"
            value={desc}
            onChangeText={setDesc}
            style={styles.input}
            multiline
          />
        </View>

        {/* Pitch meta card */}
        <View style={styles.card}>
          {/* Pitch duration */}
          <View style={styles.row}>
            <Image
              source={require("../../../../assets/icons/timer.png")}
              style={styles.icon}
            />
            <Text style={styles.rowLabel}>Pitch duration.</Text>
            <Text style={styles.rowValue}>{item.duration} sec pitch</Text>
          </View>

          <View style={styles.separator}></View>

          {/* Pitch type */}
          <View style={styles.row}>
            <Image
              source={require("../../../../assets/icons/refresh.png")}
              style={styles.icon}
            />
            <Text style={styles.rowLabel}>Pitch type</Text>
            <Text style={styles.rowValue}>{item.pitchType}</Text>
          </View>
        </View>

        {/* Upload area */}
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
            <Text style={styles.videoText}>30 sec</Text>
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
          <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
            <Feather name="upload-cloud" size={36} color="#292D32" />
            <Text style={styles.uploadTitle}>
              Please Upload Your Pitch Here.
            </Text>
            <Text style={styles.uploadHint}>
              You can upload your 30 second video in maximum{"\n"}size of 2mb
              here…
            </Text>
          </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
      {/* Proceed button */}
      <TouchableOpacity style={styles.button} onPress={handleProceed}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>

      {/* Modals */}
      <UploadErrorModal
        visible={popUp}
        onClose={handleClosePopup}
        type={status ?? "error"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7F9",
    paddingTop: 40,
    padding: 20,
    paddingBottom: 46,
  },
  container: {},
  /* ──────────  Header  ────────── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: "InterBold",
    fontSize: 18,
    color: "#212529",
  },
  icon: {
    height: 22,
    width: 22,
  },
  /* ──────────  Cards  ────────── */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DEDEE0",
    marginBottom: 24,
    gap: 10,
  },
  input: {
    fontFamily: "InterMedium",
    fontSize: 14,
    paddingVertical: 8,
    color: "#111",
  },
  separator: {
    height: 1,
    backgroundColor: "#DEDEE0",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  rowIcon: {
    marginRight: 6,
  },
  rowLabel: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  rowValue: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: "#90AD4B",
  },
  /* ──────────  Upload box  ────────── */
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#5C5C6580",
    borderRadius: 12,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#0E1B33",
  },
  uploadHint: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#6B7588",
    lineHeight: 18,
  },
  errorText: {
    color: "#EF5350",
    fontFamily: "InterMediumItalic",
    fontSize: 12,
  },
  /* ──────────  Video Container  ────────── */
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
  /* ──────────  Button  ────────── */
  button: {
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
