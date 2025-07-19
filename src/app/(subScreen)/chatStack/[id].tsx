import {
  Text,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatHeader from "../../../components/chatScreenComps/chatHeader";
import ChatBody from "../../../components/chatScreenComps/chatBody";
import ChatFooter from "../../../components/chatScreenComps/chatFooter";
import { useEffect, useState } from "react";
import AttachmentSheet from "../../../components/chatScreenComps/attachmentSheet";
import HeaderPopupMenu from "../../../components/chatScreenComps/headerPopup";
import PopUpOption from "../../../components/chatScreenComps/popUpOption";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Contacts from "expo-contacts";
import ContactPicker from "../../../components/ContactPicker";
import MediaShare from "./[id]/mediaShare";
import { UserProfile } from "@/src/interfaces/profileInterface";
import {
  useChatById,
  useChatMessages,
  useCreateChat,
  useDeleteMessage,
  useRemoveUserFromChat,
  useSendMediaMessage,
  useSendMessage,
} from "@/src/hooks/useChat";
import { useChatStore } from "@/src/store/chatStore";
import { ChatMessage } from "@/src/interfaces/chatInterface";
import ErrorAlert from "@/src/components/errorAlert";
import { useAuthStore } from "@/src/store/auth";

export default function ChatDetailsScreen() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>("");
  const [viewAttachment, setViewAttachment] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const params = useLocalSearchParams();
  const profile: UserProfile = JSON.parse(params.item as string);
  const id = params.id;
  const [footerHeight, setFooterHeight] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [clearChatPopUp, setClearChatPopUp] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>();
  const [contactModal, setContactModal] = useState(false);
  const [media, setMedia] = useState<any | null>();
  const [mediaType, setMediaType] = useState<
    "image" | "video" | "doc" | "contact" | "other"
  >("image");
  const [error, setError] = useState("");

  //Backend Functions
  const currentChat = useChatStore((state) => state.currentChat);
  const user = useAuthStore((state) => state.user);
  useChatMessages(id);
  const updatedMessages = useChatStore((state) => state.messages);
  useEffect(() => {
    setMessages(updatedMessages);
  }, [updatedMessages]);
  //Update last seen
  const { setLastViewed } = useChatStore();
  useEffect(() => {
    if (id) {
      setLastViewed(id, new Date().toISOString());
    }
  }, [id]);

  const { mutate: sendMessage } = useSendMessage();
  const { mutate: removeUser } = useRemoveUserFromChat();
  const { mutate: createChat } = useCreateChat();
  const { mutate: deleteMessage } = useDeleteMessage();
  const { mutate: sendMediaMessage } = useSendMediaMessage();

  const onPressSendMessage = (content: string) => {
    if (!content) return;
    const currentChat = useChatStore.getState().currentChat;
    const messages = useChatStore.getState().messages;
    if (!user) return;
    if (!currentChat && messages.length <= 0) {
      createChat(
        {
          users: [
            {
              id: user.user_id,
              username: user.full_name,
              email: user.email,
            },
            {
              id: profile.user_id,
              username: profile.full_name,
              email: profile.email,
            },
          ],
          name: profile.full_name,
        },
        {
          onSuccess: (res) => {
            console.log("Chat created successfully");
          },
          onError: (err) => {
            console.error("Chat creation failed", err);
            setError("Failed to start chat");
          },
        }
      );
      return;
    }

    const sendMessagePayload = {
      content: content,
      sender: {
        id: user.user_id,
        username: user.full_name,
        email: user.email,
      },
      chat: {
        id: currentChat?.id,
        name: currentChat?.name || "",
        isGroup: currentChat?.isGroup,
      },
      messageType: "TEXT",
    };

    sendMessage(sendMessagePayload, {
      onSuccess: () => {},
      onError: (error) => {
        console.error("Failed to send message", error);
        setError("Failed to send message");
      },
    });
    setMessage(null);
  };

  const handleSendMedia = () => {
    if (!media || !mediaType || !currentChat || !user) return;

    console.log(media);
    console.log(mediaType);
    console.log(currentChat.id);

    const payload = {
      chat: {
        id: currentChat.id,
        name: currentChat.name || "",
        isGroup: currentChat.isGroup,
      },
      sender: {
        id: user.user_id,
        username: user.full_name,
        email: user.email,
      },
      messageType:
        mediaType === "image"
          ? "IMAGE"
          : mediaType === "video"
          ? "VIDEO"
          : "DOCUMENT",
      files: [
        {
          uri: media.uri,
          name: media.fileName || media.name || "uploaded file",
          type: media.mimeType || media.type || "application/octet-stream",
        },
        {
          uri: media.uri,
          name: media.fileName || media.name || "uploaded file",
          type: media.mimeType || media.type || "application/octet-stream",
        },
      ],
    };

    sendMediaMessage(payload, {
      onSuccess: () => {
        console.log("Media message sent");
        setMedia(null);
      },
      onError: (err) => {
        console.error("Failed to send media", err);
        setError("Failed to send media message");
      },
    });
  };

  const onPressDeleteMessage = (messageId: string) => {
    if (!messageId) return;

    deleteMessage(
      { messageId: messageId },
      {
        onSuccess: () => {
          console.log("Message deleted successfully:", messageId);
        },
        onError: (error) => {
          console.error("Failed to delete message:", error);
        },
      }
    );
  };

  //Handle Pick media
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos", "livePhotos"],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setMedia(result.assets[0]);
      setMediaType(result.assets[0].mimeType?.split("/")[0]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // or specify MIME types like 'application/pdf'
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets) {
        console.log("Document picked:", result);
        setMedia(result.assets[0]);
        const type = result.assets[0].mimeType?.split("/")[0];
        setMediaType(type === "application" ? "docs" : type);
      }
    } catch (error) {
      console.error("Document picker error:", error);
    }
  };

  const pickContact = () => {
    setContactModal(!contactModal);
  };

  const handleReply = (message: ChatMessage | null) => {
    if (message) {
      setSelectedMessage(message);
    } else {
      setSelectedMessage(null);
    }
  };

  const onCancelReply = () => {
    setSelectedMessage(null);
  };

  const handleOptionSelect = (option: string) => {
    console.log("Selected:", option);
    if (option === "Media, docs and links") {
      router.push({
        pathname: `chatStack/${id}/sharedAssets`,
        params: { item: JSON.stringify(profile) },
      });
    } else if (option === "View VBC") {
      router.push({
        pathname: `chatStack/${id}/viewVBC`,
        params: { item: JSON.stringify(profile) }, //Look out for error in future maybe!!!
      });
    } else if (option === "Starred messages") {
      router.push({
        pathname: `chatStack/${id}/starredMessage`,
      });
    } else if (option === "Clear chat") {
      setClearChatPopUp(!clearChatPopUp);
    }
    setShowMenu(false);
  };

  const handleAttachmentSelect = (item) => {
    if (item === "Photo") {
      pickImage();
    } else if (item === "Document") {
      pickDocument();
    } else if (item === "VBC") {
      alert("VBC selected");
    } else if (item === "Contact") {
      pickContact();
    }
  };

  return (
    <Modal
      style={styles.container}
      animationType="fade"
      onRequestClose={() => {
        router.back();
      }}
    >
      <View style={styles.flex}>
        {/* Modals */}
        <HeaderPopupMenu
          isVisible={showMenu}
          onOptionSelect={handleOptionSelect}
          topOffset={70}
          rightOffset={15}
        />
        <AttachmentSheet
          isVisible={viewAttachment}
          footerHeight={footerHeight ? footerHeight : 115}
          handlePress={handleAttachmentSelect}
        />
        <PopUpOption
          visible={clearChatPopUp}
          onClose={() => setClearChatPopUp(!clearChatPopUp)}
          onSelect={() => {
            setMessages([]), setClearChatPopUp(false);
          }}
          message={`Clear this chat?`}
          description={
            "Also delete media received in this chat from the device gallery"
          }
          acceptButtonName={"Clear Chat"}
          cancelButtonName={"Cancel"}
        />
        <ContactPicker
          visible={contactModal}
          onClose={() => setContactModal(false)}
          onConfirm={(contacts) => {
            setMedia(contacts);
            setMediaType("contact");
          }}
        />
        {media && mediaType && (
          <MediaShare
            name={profile.full_name}
            media={media}
            mediaType={mediaType}
            onClose={() => setMedia(null)}
            onSend={handleSendMedia}
          />
        )}

        {/* Main Screens */}
        <View style={styles.flex}>
          <ChatHeader
            profileInfo={profile}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
          {messages.length > 0 ? (
            <ChatBody
              messages={messages}
              onReply={handleReply}
              onCancelReply={onCancelReply}
              onDelete={onPressDeleteMessage}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginBottom: 10,
                  color: "#8B8B8BCC",
                  fontFamily: "Inter",
                  fontSize: 12,
                }}
              >
                Start the Conversation
              </Text>
            </View>
          )}
          <ChatFooter
            onLayout={(event: any) => {
              const { height } = event.nativeEvent.layout;
              setFooterHeight(height);
            }}
            selectedMessage={selectedMessage}
            message={message}
            useMessage={(text: string) => setMessage(text)}
            onPress={() => {
              setViewAttachment(!viewAttachment);
            }}
            onCancelReply={onCancelReply}
            onSendMessage={onPressSendMessage}
          />
        </View>

        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
});
