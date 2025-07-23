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
import ContactPicker from "../../../components/ContactPicker";
import MediaShare from "./[id]/mediaShare";
import { UserProfile } from "@/src/interfaces/profileInterface";
import {
  useChatMessages,
  useCreateChat,
  useDeleteMessageForMe,
  useDeleteMessageForEveryone,
  useSendMediaMessage,
  useSendMessage,
  useStarMessage,
  useUnstarMessage,
  useChatById,
} from "@/src/hooks/useChat";
import { useChatStore } from "@/src/store/chatStore";
import { ChatMessage } from "@/src/interfaces/chatInterface";
import ErrorAlert from "@/src/components/errorAlert";
import { useAuthStore } from "@/src/store/auth";
import { useClearChat } from "@/src/hooks/useChat";
import { uploadFileToS3 } from "@/src/api/aws";
import ShareVBCScreen from "./[id]/vbcShare";

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
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage>();
  const [contactModal, setContactModal] = useState(false);
  const [media, setMedia] = useState<any[]>([]);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [vbcModal, setVbcModal] = useState(false);
  const [vbcData, setVbcData] = useState();

  const [error, setError] = useState("");

  //Backend Functions
  //Stores
  const currentChat = useChatStore((state) => state.currentChat);
  const user = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.userId);
  const updatedMessages = useChatStore((state) => state.messages);
  const starredMessages = useChatStore((state) => state.starredMessages);
  const deleteMessageFromStore = useChatStore((state) => state.deleteMessage);

  //Mutations
  const { mutate: sendMessage } = useSendMessage();
  const { mutate: createChat } = useCreateChat();
  const { mutate: deleteMessageforme } = useDeleteMessageForMe();
  const { mutate: deleteMessageforeveryone } = useDeleteMessageForEveryone();
  const { mutate: sendMediaMessage } = useSendMediaMessage();
  const { mutate: star } = useStarMessage();
  const { mutate: unstar } = useUnstarMessage();
  const { mutate: clearChatMutation } = useClearChat();

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

  //Fetching all messages
  useChatById(id);
  useChatMessages(id);

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
      parentMessageId: selectedMessage?.id,
    };

    sendMessage(sendMessagePayload, {
      onSuccess: (res) => {},
      onError: (error) => {
        console.error("Failed to send message", error);
        setError("Failed to send message");
      },
    });
    setMessage(null);
  };

  const handleSendMedia = () => {
    if (!media || media.length === 0 || !currentChat || !user) return;

    // Determine message type
    let messageType: "IMAGE" | "VCARD" | "CONTACTS" | "DOCUMENT" = "DOCUMENT";

    if (mediaType === "contact") {
      messageType = "CONTACTS";

      const contactsPayload = media.map((contact) => {
        const firstPhone = contact.phoneNumbers?.[0] || {};
        return {
          name:
            contact.name ||
            `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
          phone: firstPhone.number || "",
          label: firstPhone.label || "",
          email: contact.emails?.[0]?.email || "",
          imageUri: contact.imageUri || null,
          source: "device",
        };
      });

      const payload = {
        content: JSON.stringify(contactsPayload),
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
        messageType: "CONTACTS",
      };

      sendMessage(payload, {
        onSuccess: () => {
          console.log("Contacts shared successfully");
          setMedia([]);
          setMediaType(null);
          setViewAttachment(false);
        },
        onError: (err) => {
          console.error("Failed to send contacts", err);
          setError("Failed to send contact message");
        },
      });

      return;
    } else if (mediaType === "vcard") {
      messageType = "VCARD";
    } else if (
      media.every((file) =>
        (file.mimeType || file.type || "").startsWith("image/")
      )
    ) {
      messageType = "IMAGE";
    } else {
      messageType = "DOCUMENT";
    }

    // Prepare files
    const files = media.map((file) => ({
      uri: file.uri,
      name: file.fileName || file.name || "uploaded_file",
      type: file.mimeType || file.type || "application/octet-stream",
    }));

    // Final payload
    const payload = {
      content: caption || "",
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
      messageType,
      files,
    };

    sendMediaMessage(payload, {
      onSuccess: () => {
        console.log("Media batch sent successfully");
        setMedia([]);
      },
      onError: (err) => {
        console.error("Failed to send media", err);
        setError("Failed to send media message");
      },
    });

    setViewAttachment(false);
    setCaption("");
    setMedia([]);
  };

  const onPressDeleteMessage = ({
    messageId,
    deleteType,
  }: {
    messageId: string;
    deleteType: "me" | "everyone";
  }) => {
    if (!messageId) return;

    if (deleteType === "me")
      deleteMessageforme(
        { messageId: messageId, userId: userId },
        {
          onSuccess: () => {
            console.log("Message deleted for me successfully:", messageId);
            deleteMessageFromStore(messageId);
          },
          onError: (error) => {
            console.error("Failed to delete message for me", error);
          },
        }
      );
    else {
      deleteMessageforeveryone(
        { messageId: messageId, userId: userId },
        {
          onSuccess: () => {
            console.log(
              "Message deleted for everyone successfully:",
              messageId
            );
            deleteMessageFromStore(messageId);
          },
          onError: (error) => {
            console.error("Failed to delete message for everyone:", error);
          },
        }
      );
    }
  };

  //Handle Pick media
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedAssets = result.assets;
      setMedia(selectedAssets); // store all
      setMediaType("image"); // base type, could be per-item but one is fine here
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.assets) {
        setMedia(result.assets);
        const type = result.assets[0].mimeType?.split("/")[0];
        setMediaType(type);
      }
    } catch (error) {
      console.error("Document picker error:", error);
    }
  };

  const pickContact = () => {
    setContactModal(!contactModal);
  };

  const pickVBC = () => {
    setVbcModal(true);
    setViewAttachment(false);
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

  const handleStarMessage = (message: ChatMessage | null) => {
    if (!message || !userId) return;

    const isAlreadyStarred = starredMessages.some((m) => m.id === message.id);

    if (isAlreadyStarred) {
      unstar({ messageId: message.id, userId });
    } else {
      star({ messageId: message.id, userId });
    }
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
      pickVBC();
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
        {vbcModal && (
          <ShareVBCScreen
            visible
            chatId={currentChat?.id!}
            chatName={currentChat?.name || ""}
            onClose={() => setVbcModal(false)}
          />
        )}
        <AttachmentSheet
          isVisible={viewAttachment}
          footerHeight={footerHeight ? footerHeight : 115}
          handlePress={handleAttachmentSelect}
        />
        <PopUpOption
          visible={clearChatPopUp}
          onClose={() => setClearChatPopUp(false)}
          onSelect={() => {
            if (!currentChat?.id || !user?.user_id) return;

            clearChatMutation(
              {
                chatId: currentChat.id,
                userId: user.user_id,
              },
              {
                onSuccess: () => {
                  setMessages([]);
                  setClearChatPopUp(false);
                },
                onError: (err) => {
                  console.error("Clear chat failed", err);
                  setClearChatPopUp(false);
                },
              }
            );
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
        <MediaShare
          name={profile.full_name}
          caption={caption}
          setCaption={setCaption}
          media={media}
          mediaType={mediaType}
          onClose={() => setMedia([])}
          onSend={handleSendMedia}
        />
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
              onStar={handleStarMessage}
              onCancelReply={onCancelReply}
              onDelete={(messageId, deleteType) =>
                onPressDeleteMessage({ messageId, deleteType })
              }
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
