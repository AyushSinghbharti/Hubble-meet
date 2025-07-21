import React, { SetStateAction, useEffect, useState } from "react";
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
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import ContactCard from "../../../../components/ContactCard";
import PopUpOption from "../../../../components/chatScreenComps/popUpOption";
import { useRouter } from "expo-router";
import { FONT } from "@/assets/constants/fonts";
import { useChatStore } from "@/src/store/chatStore";

type MediaType = "image" | "video" | "doc" | "contact" | "other";

let imageLimit = 2 * 1024 * 1024;
let videoLimit = 50 * 1024 * 1024;
let docLimit = 5 * 1024 * 1024;
let width = Dimensions.get("screen").width;

type MediaShareProps = {
  name: string;
  caption: string | undefined;
  setCaption: any;
  media: any[];
  mediaType: MediaType;
  onSend?: () => void;
  onClose?: () => void;
};

const MediaShare: React.FC<MediaShareProps> = ({
  name,
  media,
  mediaType,
  caption="",
  setCaption,
  onSend,
  onClose,
}) => {
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDesc, setErrorDesc] = useState("");

  useEffect(() => {
    if (!media || media.length === 0) return;

    for (let file of media) {
      if (mediaType === "image" && file.size > imageLimit) {
        setErrorTitle("Image size too large!");
        setErrorDesc(
          "The selected image exceeds the maximum upload limit of 2 MB."
        );
        break;
      }
      if (mediaType === "video" && file.size > videoLimit) {
        setErrorTitle("Video size too large!");
        setErrorDesc(
          "The selected video exceeds the maximum upload limit of 50 MB."
        );
        break;
      }
      if (mediaType === "doc" && file.size > docLimit) {
        setErrorTitle("File size too large!");
        setErrorDesc(
          "The selected file exceeds the maximum upload limit of 5 MB."
        );
        break;
      }
    }
  }, [media, mediaType]);

  // 🎥 Dedicated component so hooks live at top level
  const VideoItem = ({ uri }: { uri: string }) => {
    const player = useVideoPlayer(uri, (p) => {
      p.loop = false;
      p.pause();
    });
    return <VideoView player={player} style={styles.mediaImage} />;
  };

  const RenderName = ({ name }: { name: string }) => {
    return (
      <View
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: 8,
          borderRadius: 15,
          paddingHorizontal: 12,
          zIndex: 3,
        }}
      >
        <Text style={{ fontFamily: FONT.MEDIUM, fontSize: 12 }}>{name}</Text>
      </View>
    );
  };

  const renderMedia = () => {
    if (mediaType === "image" || mediaType === "video") {
      return (
        <FlatList
          horizontal
          pagingEnabled
          data={media}
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          renderItem={({ item }) => {
            const type = item.mimeType || item.type || "";
            if (type.startsWith("image/")) {
              return (
                <View
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <RenderName name={item.fileName} />
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.mediaImage}
                    resizeMode="contain"
                  />
                </View>
              );
            } else if (type.startsWith("video/")) {
              return (
                <View
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <RenderName
                    name={item.fileName || item.name || "undefined name"}
                  />
                  <VideoItem uri={item.uri} />
                </View>
              );
            }
            return null;
          }}
        />
      );
    }

    if (mediaType === "contact") {
      return (
        <FlatList
          data={media}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          style={{ backgroundColor: "#fff", width: "100%" }}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <ContactCard
                name={`${item.firstName} ${item.lastName}`}
                phone={item.phoneNumbers?.[0]?.number}
                photoUri={
                  item.imageAvailable
                    ? item.imageUri
                    : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                }
              />
            </View>
          )}
        />
      );
    } else {
      return (
        <FlatList
          data={media}
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          contentContainerStyle={{
            flex: 1,
            paddingTop: 16,
            gap: 4,
            paddingHorizontal: 8,
          }}
          renderItem={({ item }) => (
            <View style={styles.mediaCenter}>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Image
                  source={require("@/assets/icons/document.png")}
                  style={{ aspectRatio: 1, height: 32, width: 32 }}
                />
                <View>
                  <Text style={styles.mediaText}>{item.name}</Text>
                  <Text style={styles.fileSize}>
                    {(item.size / 1024).toFixed(1)} KB
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      );
    }
  };

  if (!media || media.length === 0) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              if (onSend) {
                onClose?.(); // Close modal right after
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.fileTitle}>
            {mediaType === "contact"
              ? "Contacts"
              : media.length === 1
              ? media[0].fileName || media[0].name
              : `${media.length} files`}
          </Text>
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
                value={caption}
                onChangeText={setCaption}
                placeholder="Add a caption..."
                placeholderTextColor="#aaa"
                style={styles.captionInput}
              />
              <TouchableOpacity onPress={onSend}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  mediaImage: {
    width: width - width * 0.1,
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "#eee",
    zIndex: 2,
  },
  mediaCenter: {
    width: 1000,
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
