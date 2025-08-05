import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  Text,
} from "react-native";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ChatMessage } from "@/src/interfaces/chatInterface";
import colourPalette from "@/src/theme/darkPaletter";

interface ChatFooterProps {
  message: string;
  useMessage: (text: string) => void;
  onPress: () => void;
  onLayout: any;
  selectedMessage?: ChatMessage; // Assuming seletedMessage is not used in this component
  onCancelReply?: () => void; // Optional callback for canceling reply
  onSendMessage?: (content: string) => void;
}

const ChatFooter = ({
  onLayout,
  message,
  useMessage,
  onPress,
  selectedMessage,
  onCancelReply = () => {},
  onSendMessage = () => {},
}: ChatFooterProps) => {
  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* Reply Bar */}
      {selectedMessage && (
        <View style={styles.replyContainer}>
          <View style={styles.replyHolder}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.replyText}>
                {selectedMessage.sender.username}
              </Text>
              <TouchableOpacity onPress={onCancelReply}>
                <Entypo name="cross" size={20} color={colourPalette.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.replyMessage} numberOfLines={2}>
              {selectedMessage.content}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footerWrapper}>
        <View style={styles.chatBar}>
          {/* Input Field */}
          <TextInput
            value={message}
            onChangeText={useMessage}
            placeholder="Type a message..."
            placeholderTextColor="#B0B0B0"
            style={styles.inputField}
            multiline
          />

          {/* Attachment Icon */}
          <TouchableOpacity style={styles.iconWrapper} onPress={onPress}>
            <Image
              source={require("../../../assets/icons/attach.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity
            onPress={() => onSendMessage(message)}
            style={styles.sendWrapper}
          >
            <Image
              source={require("../../../assets/icons/send.png")}
              style={styles.sendIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colourPalette.backgroundPrimary,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  footerWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chatBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
    paddingRight: 8,
    maxHeight: 100,
  },
  iconWrapper: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#AFAFAF",
  },
  sendWrapper: {
    marginLeft: 8,
    backgroundColor: "#CDE6A9",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: "#1D1D1D",
  },

  // --- Reply section unchanged
  replyContainer: {
    backgroundColor: colourPalette.backgroundPrimary,
    padding: 12,
    width: "100%",
    minHeight: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  replyHolder: {
    borderRadius: 48,
    padding: 12,
    width: "100%",
    paddingHorizontal: 26,
    marginHorizontal: 4,
    backgroundColor: colourPalette.backgroundSecondary,
  },
  replyText: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: colourPalette.textPrimary,
  },
  replyMessage: {
    fontSize: 14,
    fontFamily: "InterMedium",
    color: colourPalette.textSecondary,
  },
});

export default ChatFooter;
