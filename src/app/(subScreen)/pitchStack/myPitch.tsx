import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useRouter } from "expo-router";
import UploadErrorModal from "../../../components/pitchScreenComps/popUpNotification";
import { useAuthStore } from "@/src/store/auth";
import { usePitchStore } from "@/src/store/pitchStore";
import { useGetUserPitch } from "@/src/hooks/usePitch";
import { AxiosError } from "axios";
import ErrorAlert from "@/src/components/errorAlert";
import { removePitchFromStorage } from "@/src/store/localStorage";

export default function MyPitchScreen() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const pitch = usePitchStore((state) => state.pitch);
  const clearPitch = usePitchStore((state) => state.clearPitch);
  const clearPitchId = usePitchStore((state) => state.clearPitchId);

  const result = useGetUserPitch(userId || "");

  useEffect(() => {
    setLoading(result.isLoading);
  }, [result.isLoading]);

  useEffect(() => {
    if (result.error) {
      const axiosError = result.error as AxiosError<any>;
      const status = axiosError.response?.status;
      const message =
        status === 404
          ? `No pitches found for user ${user?.full_name}`
          : "Failed to fetch pitch details, please try again.";

      setError(message);
      console.error("Pitch fetch error:", message);
    }
  }, [result.error]);

  useEffect(() => {
    if (pitch) {
      setVideoUri(pitch.url);
    }
  }, [pitch]);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.pause();
  });

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleRouter = (type) => {
    if (type === "Upload") {
      router.push({
        pathname: "/pitchStack/createPitch",
        params: {
          item: JSON.stringify({
            name: null,
            desc: null,
            format: "Upload",
            pitchType: "Business",
            duration: 30,
            videoUrl: null,
          }),
        },
      });
    } else {
      router.push({
        pathname: "/pitchStack/recordPitch",
        params: {
          item: JSON.stringify({
            name: null,
            desc: null,
            format: "Record",
            pitchType: "Individual",
            duration: 30,
            videoUrl: null,
          }),
        },
      });
    }
  };

  const handleDeletePitch = () => {
    setViewModal(!viewModal);
    // removePitchFromStorage({ removeId: true });
    // clearPitch();
    // clearPitchId();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/pitch")}
          hitSlop={50}
          style={{ zIndex: 999 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Pitch</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.videoContainer}>
        {loading ? (
          <ActivityIndicator size={50} color={"skyblue"} />
        ) : pitch ? (
          <>
            <VideoView
              style={StyleSheet.absoluteFillObject}
              player={player}
              nativeControls={false}
              startsPictureInPictureAutomatically={true}
              allowsPictureInPicture={true}
              onTouchStart={handlePlayPause}
            />
            {!isPlaying && (
              <TouchableOpacity
                onPress={handlePlayPause}
                style={[styles.playButton]}
              >
                <Entypo name="controller-play" size={32} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={handleDeletePitch}
            >
              <Image
                source={require("../../../../assets/icons/delete.png")}
                style={[styles.icon, { tintColor: "#fff" }]}
              />
            </TouchableOpacity>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Individual</Text>
            </View>
            <View style={styles.pitchStatus}>
              <Text style={styles.tagText}>{pitch.status}</Text>
            </View>
          </>
        ) : (
          <Text>Pitch is not uploaded for you, upload one now!!!</Text>
        )}
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.input}>
          {pitch?.display_name || user?.full_name}
        </Text>
        <Text style={[styles.input, { height: 80 }]}>
          {pitch?.pitch_caption || user?.bio}
        </Text>
      </View>

      <View style={[styles.uploadButtonContainer]}>
        <TouchableOpacity
          onPress={() => handleRouter("Record")}
          style={[styles.toggleButton, styles.activeToggle]}
        >
          <Image
            source={require("../../../../assets/icons/record.png")}
            style={[styles.icon, { tintColor: "#fff" }]}
          />
          <Text style={styles.activeText}>Record</Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>Or</Text>
        <TouchableOpacity
          onPress={() => handleRouter("Upload")}
          style={[styles.toggleButton, styles.inActiveToggle]}
        >
          <Image
            source={require("../../../../assets/icons/upload.png")}
            style={[styles.icon, { tintColor: "#000" }]}
          />
          <Text style={styles.toggleText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <UploadErrorModal
        visible={viewModal}
        onClose={() => {
          handleRouter("Upload");
          setViewModal(!viewModal)
        }}
        onExit={() => setViewModal(!viewModal)}
        type={"pending"}
        icon="delete"
        iconColor="#000"
        heading="Remove Current Pitch"
        description="This will remove the existing pitch from the application."
        buttonText="Continue"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 45,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "InterBold",
    color: "#111",
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 10,
  },
  tag: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pitchStatus: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: "#fff",
    fontFamily: "InterMedium",
    fontSize: 12,
  },
  inputSection: {
    gap: 12,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#343D46",
    fontFamily: "InterSemiBold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4a5f24",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e6e6e0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  orText: {
    fontSize: 14,
    color: "#666",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },

  //Upload Button Container
  uploadButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
    borderColor: "#f7f7f7",
  },
  inActiveToggle: {
    backgroundColor: "#EAF0DB",
    borderWidth: 2,
    borderColor: "#f7f7f7",
  },
  toggleText: {
    color: "#4D5D2A",
    fontFamily: "InterMedium",
  },
  activeText: {
    color: "#fff",
    fontFamily: "InterSemiBold",
  },
  icon: {
    height: 22,
    width: 22,
  },
  uploadHint: {
    marginTop: 6,
    fontFamily: "Inter",
    fontSize: 12,
    textAlign: "center",
    color: "#525f7f",
    lineHeight: 18,
  },
});
