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
import { useState } from "react";
import AttachmentSheet from "../../../components/chatScreenComps/attachmentSheet";
import HeaderPopupMenu from "../../../components/chatScreenComps/headerPopup";
import PopUpOption from "../../../components/chatScreenComps/popUpOption";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Contacts from "expo-contacts";
import ContactPicker from "../../../components/ContactPicker";
import MediaShare from "./[id]/mediaShare";

export interface ChatMsg {
  id: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
  delivered?: boolean;
}

let messageList: ChatMsg[] = [
  { id: "1", text: "Hello!", timestamp: new Date(), isMe: false },
  {
    id: "2",
    text: "Hello!",
    timestamp: new Date(),
    isMe: true,
    delivered: true,
  },
  {
    id: "3",
    text: "Hey! How's your day going?",
    timestamp: new Date(),
    isMe: false,
  },
  {
    id: "4",
    text: "Hey! It’s going well. Just a bit busy with work. You?",
    timestamp: new Date(),
    isMe: true,
    delivered: true,
  },
  {
    id: "5",
    text: "Same here. Meetings all day!",
    timestamp: new Date(),
    isMe: false,
  },
  {
    id: "6",
    text: "That sounds exhausting.\nGot any plans for the evening?",
    timestamp: new Date(),
    isMe: true,
    delivered: true,
  },
  {
    id: "7",
    text: "Probably just relaxing and watching a show. What about you?",
    timestamp: new Date(),
    isMe: false,
  },
  {
    id: "8",
    text: "Thinking of going for a walk.\nNeed some fresh air",
    timestamp: new Date(),
    isMe: true,
    delivered: true,
  },
  {
    id: "9",
    text: "Sounds like a good idea!\nEnjoy your walk",
    timestamp: new Date(),
    isMe: false,
  },
];

export default function ChatDetailsScreen() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [viewAttachment, setViewAttachment] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMsg[]>(messageList);
  const params = useLocalSearchParams();
  const item: any = JSON.parse(params.item as string);
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

  const handleReply = (message: ChatMsg | null) => {
    if (message) {
      console.log(message);
      setSelectedMessage({ ...message, name: item.name });
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
        params: { item: JSON.stringify(item) },
      });
    } else if (option === "View VBC") {
      router.push({
        pathname: `chatStack/${id}/viewVBC`,
        params: { item: JSON.stringify(item) }, //Look out for error in future maybe!!!
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
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
            name={item.name}
            media={media}
            mediaType={mediaType}
            onClose={() => setMedia(null)}
            onSend={() => setMedia(null)}
          />
        )}

        {/* Main Screens */}
        <View style={styles.flex}>
          <ChatHeader
            profileInfo={item}
            setShowMenu={setShowMenu}
            showMenu={showMenu}
          />
          {messages.length > 0 ? (
            <ChatBody messages={messages} onReply={handleReply} />
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
          />
        </View>
      </KeyboardAvoidingView>
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
