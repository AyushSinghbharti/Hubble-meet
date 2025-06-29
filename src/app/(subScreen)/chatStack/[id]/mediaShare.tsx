import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import ContactCard from "../../../../components/ContactCard";
import PopUpOption from "../../../../components/chatScreenComps/popUpOption";
import { useRouter } from "expo-router";

type MediaType = "image" | "video" | "doc" | "contact" | "other";

let imageLimit = 2 * 1024 * 1024;
let videoLimit = 50 * 1024 * 1024;
let docLimit = 5 * 1024 * 1024;

type MediaShareProps = {
  name: string;
  media: any;
  mediaType: MediaType;
  onSend?: () => void;
  onClose?: () => void;
};

const MediaShare: React.FC<MediaShareProps> = ({
  name,
  media,
  mediaType,
  onSend,
  onClose,
}) => {
  const uri = media?.uri;
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log(media, media.size, imageLimit, videoLimit, docLimit);
    if (mediaType === "image" && media.fileSize > imageLimit) {
      setErrorTitle("Image size too large!");
      setErrorDesc(
        "The selected image exceeds the maximum upload limit of 2 MB."
      );
    }
    if (mediaType === "video" && media.fileSize > videoLimit || media.size > videoLimit) {
      setErrorTitle("Video size too large!");
      setErrorDesc(
        "The selected image exceeds the maximum upload limit of 50 MB."
      );
    }
    if (mediaType === "doc" && media.size > docLimit) {
      setErrorTitle("File size too large!");
      setErrorDesc(
        "The selected file exceeds the maximum upload limit of 5 MB."
      );
    }
  }, [media, mediaType]);

  const renderMedia = () => {
    switch (mediaType) {
      case "image":
        return (
          <Image
            source={{ uri }}
            style={styles.mediaImage}
            resizeMode="contain"
          />
        );

      case "video": {
        const player = useVideoPlayer(uri, (player) => {
          player.loop = true;
          player.play();
        });
        const { isPlaying } = useEvent(player, "playingChange", {
          isPlaying: player.playing,
        });
        return (
          <VideoView
            style={styles.mediaImage}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        );
      }

      case "doc":
      case "other":
        return (
          <View style={styles.mediaCenter}>
            <MaterialIcons name="picture-as-pdf" size={64} color="#888" />
            <Text style={styles.mediaText}>{media?.name || "Document"}</Text>
            <Text style={styles.fileSize}>
              {(media?.size / 1000).toFixed(1)} KB
            </Text>
          </View>
        );

      case "contact":
        return (
          <View style={{ width: "100%", height: "100%", flex: 1 }}>
            <FlatList
              data={media}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              style={{ backgroundColor: "#fff" }}
              renderItem={({ item }) => (
                <View style={styles.contactItem}>
                  <ContactCard
                    name={`${item.firstName}` + " " + `${item.lastName}`}
                    phone={item.phoneNumbers?.[0]?.number}
                    photoUri={
                      item.imageAvailable
                        ? item.imageUri
                        : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
                    }
                  />
                </View>
              )}
            />
          </View>
        );

      default:
        return (
          <View style={styles.mediaCenter}>
            <MaterialIcons name="insert-drive-file" size={50} color="#888" />
            <Text style={[styles.mediaText, { marginTop: 8, marginBottom: 2 }]}>
              {media.name}
            </Text>
            <Text style={styles.mediaText}>
              {(media.size / (1024 * 1024)).toFixed(3)} MB
            </Text>
          </View>
        );
    }
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          {media?.fileName || media?.name ? (
            <Text style={styles.fileTitle}>{media.fileName || media.name}</Text>
          ) : (
            <Text style={styles.fileTitle}>Contacts</Text>
          )}
        </View>

        <View style={[styles.container]}>
          {mediaType === "contact" ? (
            <View
              style={[
                {
                  flex: 1,
                  width: "100%",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {renderMedia()}
            </View>
          ) : (
            <View style={[styles.mediaWrapper]}>{renderMedia()}</View>
          )}

          <View style={styles.userTagContainer}>
            <View style={styles.userTag}>
              <Text style={styles.userText}>{name}</Text>
            </View>

            <View style={styles.captionBox}>
              <TextInput
                placeholder="Add a caption..."
                placeholderTextColor="#aaa"
                style={styles.captionInput}
              />
              <TouchableOpacity onPress={onSend}>
                {/* <Ionicons name="send" size={24} color="#007AFF" /> */}
                <Image
                  source={require("../../../../../assets/icons/send.png")}
                  style={{ height: 24, width: 24 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <PopUpOption
          visible={!!errorTitle}
          altStyle={true}
          onClose={() => setErrorTitle("")}
          onSelect={onClose}
          message={errorTitle}
          description={errorDesc}
          acceptButtonName={`Choose another ${mediaType}`}
          cancelButtonName="Ok"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeIcon: {
    padding: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  fileTitle: {
    fontSize: 16,
    width: "80%",
    fontFamily: "InterSemiBold",
    color: "#0F172A",
    marginVertical: 12,
  },
  mediaWrapper: {
    flex: 1,
    width: "90%",
    margin: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  mediaCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  mediaText: {
    fontFamily: "Inter",
    fontSize: 16,
  },
  fileSize: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  userTagContainer: {
    // height: 40,
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderColor: "#f7f7f7",
    width: "100%",
    // borderWidth: 1,
  },
  userTag: {
    marginTop: 8,
    backgroundColor: "#EDEDED",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 40,
    justifyContent: "center",
    minHeight: 50,
    maxWidth: 200,
  },
  userText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "InterMedium",
  },
  captionBox: {
    flexDirection: "row",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    width: "100%",
  },
  captionInput: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#000",
  },
  contactList: {
    flex: 1,
    paddingVertical: 20,
    // backgroundColor: "red",
    // marginHorizontal: 16,
  },
  contactItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 6,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  contactPhone: {
    fontSize: 14,
    color: "#666",
  },
});

export default MediaShare;
