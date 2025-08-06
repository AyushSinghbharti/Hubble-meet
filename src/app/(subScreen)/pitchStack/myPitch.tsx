import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UploadErrorModal from "../../../components/pitchScreenComps/popUpNotification";
import { useAuthStore } from "@/src/store/auth";
import { usePitchStore } from "@/src/store/pitchStore";
import { useDeletePitch, useGetUserPitch } from "@/src/hooks/usePitch";
import ErrorAlert from "@/src/components/errorAlert";
import { removePitchFromStorage } from "@/src/store/localStorage";
import { Video } from 'expo-av'; // Add this for video playback
import { FONT } from "@/assets/constants/fonts";
import NavHeader from "@/src/components/NavHeader";

export default function MyPitchScreen() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, error, refetch } = useGetUserPitch(userId || "");
  const clearPitch = usePitchStore((state) => state.clearPitch);
  const clearPitchId = usePitchStore((state) => state.clearPitchId);

  const [viewModal, setViewModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePitchId, setDeletePitchId] = useState<string | null>(null);
  const [playingPitchId, setPlayingPitchId] = useState<string | null>(null);
  const videoRef = useRef(null);

  const { mutate: deletePitch } = useDeletePitch();

  // The API returns a single pitch object or undefined, so normalize to array
  const pitches = data ? [data] : [];

  // Toggle video playback
  const handlePlayVideo = (pitchId) => {
    if (playingPitchId === pitchId) {
      setPlayingPitchId(null);
      videoRef.current?.pauseAsync();
    } else {
      setPlayingPitchId(pitchId);
      videoRef.current?.playAsync();
    }
  };

  // Show delete modal for selected pitch
  const handleShowDeleteModal = (id) => {
    setDeletePitchId(id);
    setViewModal(true);
  };

  const handleDeletePitch = () => {
    if (!deletePitchId) return;

    setDeleting(true); // <-- show loader

    deletePitch(deletePitchId, {
      onSuccess: () => {
        clearPitch();
        clearPitchId();
        removePitchFromStorage({ removeId: true });
        setViewModal(false);
        setDeletePitchId(null);
        setDeleting(false); // <-- stop loader
        refetch?.();
      },
      onError: () => {
        setDeleteError("Error while deleting video, please try again.");
        setDeleting(false); // <-- stop loader
      },
    });
  };


  return (
    <SafeAreaView style={styles.mainBackground}>
      <NavHeader title="My Pitch" />

      {isLoading ? (
        <ActivityIndicator size="large" color="skyblue" />
      ) : error ? (
        <Text style={styles.errorText}>
          {(error.response?.status || error.status) === 404
            ? `No pitches found for ${user?.full_name || "user"}`
            : "Failed to fetch pitch details"}
        </Text>
      ) : pitches.length === 0 ? (
        <Text style={styles.emptyText}>Pitch is not uploaded. Upload one now!</Text>
      ) : (
        <FlatList
          data={pitches}
          contentContainerStyle={styles.scrollCards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.pitchCard}>
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleShowDeleteModal(item.id)}
              >
                <Feather name="trash-2" size={22} color="#ff4343" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handlePlayVideo(item.id)} activeOpacity={0.9}>
                <Video
                  ref={videoRef}
                  style={styles.videoThumbnail}
                  source={{ uri: item.url }}
                  resizeMode="contain"
                  isLooping
                  shouldPlay={playingPitchId === item.id}
                  onError={(e) => console.log("Video Error:", e)}
                />
              </TouchableOpacity>

              <View style={styles.pitchInfo}>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                  <View>

                    <Text style={styles.pitchIndividual}>
                      {item.type || "Individual"}:{" "}
                      <Text style={styles.pitchName}>
                        {item.display_name || user?.full_name || "Unknown"}
                      </Text>
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.pitchDescr}>
                      {item.pitch_caption || user?.bio || ""}
                    </Text>

                  </View>


                  <View style={styles.pitchStatsRow}>
                    <Image style={{ height: 25, width: 25 }} source={require('../../../../assets/icons/like.png')} />
                    <Text style={styles.pitchStatsText}>{item.likeCount ?? 1.5}</Text>
                  </View>

                </View>


                {/* <Text style={styles.pitchStatus}>{item.status || "Not Uploaded"}</Text> */}
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() =>
            router.push({
              pathname: "/pitchStack/createPitch",
              params: {
                item: JSON.stringify({
                  name: null,
                  desc: null,
                  format: "Upload",
                  pitchType: "Individual",
                  duration: 30,
                  videoUrl: null,
                }),
              },
            })
          }
        >
          <Text style={styles.uploadBtnText}>Upload New</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordBtn}
          onPress={() =>
            router.push({
              pathname: "/pitchStack/createPitch",
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
            })
          }
        >
          <View style={styles.row}>
            <View style={styles.redCircle} />
            <Text style={styles.recordBtnText}>Record New</Text>
          </View>
        </TouchableOpacity>
      </View>

      <UploadErrorModal
        visible={viewModal}
        onClose={handleDeletePitch}
        onExit={deleting ? undefined : () => {
          setViewModal(false);
          setDeletePitchId(null);
        }}
        type={"pending"}
        icon="delete"
        iconColor="#000"
        heading="Remove Current Pitch"
        description="This will remove the existing pitch from the application."
        buttonText="Continue"
      />

      {deleting && <ActivityIndicator color="#fff" />}
      {deleteError && (
        <ErrorAlert message={deleteError} onClose={() => setDeleteError(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainBackground: { flex: 1, backgroundColor: "#2c2c2c" },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  emptyText: { color: "#ccc", textAlign: "center", marginTop: 20 },
  scrollCards: { paddingVertical: 12, gap: 20, paddingHorizontal: 6 },
  pitchCard: {
    backgroundColor: "#191919",
    borderRadius: 15,
    marginBottom: 20,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    position: "relative",
  },
  deleteIcon: {
    position: "absolute",
    top: 16,
    right: 14,
    zIndex: 10,
  },
  videoThumbnail: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#232323",
  },
  pitchInfo: { paddingHorizontal: 16, paddingTop: 14, },
  pitchIndividual: {
    color: "#a4a4a4",
    fontFamily: "Inter",
    fontSize: 13,
    marginBottom: 3,
  },
  pitchName: {
    color: "#fff",
    fontFamily: "InterSemiBold",
    fontSize: 13,
  },
  pitchDescr: {
    color: "#bebebe",
    fontFamily: "Inter",
    fontSize: 12,
  },
  pitchStatsRow: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "flex-end"
  },
  pitchStatsText: {
    marginLeft: 5,
    color: "#bababa",
    fontFamily: "Inter",
    fontSize: 12,
  },
  pitchStatus: {
    marginTop: 6,
    color: "#bbb",
    fontFamily: "Inter",
    fontSize: 12,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2c2c2c",
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: "#181818",
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
    paddingVertical: 14,
  },
  uploadBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT.MONSERRATSEMIBOLD,
  },
  recordBtn: {
    flex: 1,
    backgroundColor: "#ddeaaa",
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
    paddingVertical: 14,
  },
  recordBtnText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT.MONSERRATSEMIBOLD,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  redCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginRight: 8,
  },
});