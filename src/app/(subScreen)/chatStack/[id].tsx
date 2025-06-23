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

        {/* Main Screens */}
        <View style={styles.flex}>
          <ChatHeader
            profileInfo={item}
            setShowMenu={setShowMenu}
            showMenu={showMenu}
          />
          {messages.length > 0 ? (
            <ChatBody messages={messages} />
          ) : (
            <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center"}}>
              <Text style={{marginBottom: 10, color: "#8B8B8BCC", fontFamily: "Inter", fontSize: 12}}>Start the Conversation</Text>
            </View>
          )}
          <ChatFooter
            onLayout={(event: any) => {
              const { height } = event.nativeEvent.layout;
              setFooterHeight(height);
            }}
            message={message}
            useMessage={(text: string) => setMessage(text)}
            onPress={() => {
              setViewAttachment(!viewAttachment);
            }}
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
