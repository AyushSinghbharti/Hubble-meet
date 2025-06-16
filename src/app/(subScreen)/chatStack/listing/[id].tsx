import {
  Text,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatHeader from "../../../../components/chatScreenComps/chatHeader";
import ChatBody from "../../../../components/chatScreenComps/chatBody";
import ChatFooter from "../../../../components/chatScreenComps/chatFooter";
import { useEffect, useState } from "react";
import AttachmentSheet from "../../../../components/chatScreenComps/attachmentSheet";
import HeaderPopupMenu from "../../../../components/chatScreenComps/headerPopup";

export interface ChatMsg {
  id: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
  delivered?: boolean;
}

const messages: ChatMsg[] = [
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
  const [message, setMessage] = useState<string>("");
  const [viewAttachment, setViewAttachment] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const item: any = JSON.parse(params.item as string);
  const [footerHeight, setFooterHeight] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const handleOptionSelect = (option: string) => {
    console.log("Selected:", option);
    setShowMenu(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} //Will be fixing issue, occuring in android, after opening keyboard, the footer change its positing to upward.
      >
        {/* Modals */}
        <AttachmentSheet
          isVisible={viewAttachment}
          footerHeight={footerHeight ? footerHeight : 115}
        />
        <HeaderPopupMenu
          isVisible={showMenu}
          onOptionSelect={handleOptionSelect}
          topOffset={101}
          rightOffset={18}
        />

        <View style={styles.flex}>
          <ChatHeader profileInfo={item} setShowMenu={setShowMenu} showMenu={showMenu} />
          <ChatBody messages={messages} />
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
    </View>
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
