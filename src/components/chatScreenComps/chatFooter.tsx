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
  selectedMessage, // Assuming seletedMessage is not used in this component
  onCancelReply = () => {},
  onSendMessage = () => {},
}: ChatFooterProps) => {
  console.log(selectedMessage);
  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* Reply Bar */}
      {selectedMessage && (
        <View style={styles.replyContainer}>
          <View style={styles.replyHolder}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.replyText}>
                {selectedMessage.sender.username}
              </Text>
              <TouchableOpacity onPress={onCancelReply}>
                <Entypo
                  name="cross"
                  size={24}
                  color="black"
                  onPress={onCancelReply}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.replyMessage} numberOfLines={2}>
              {selectedMessage.content}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footerContainer}>
        {/* Camera icon */}
        <TouchableOpacity style={styles.IconContainer} onPress={onPress}>
          <Image
            source={require("../../../assets/icons/attach.png")}
            style={styles.attachIcon}
          />
        </TouchableOpacity>

        {/* Message Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            onChangeText={(text) => useMessage(text)}
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            multiline
          />

          {/* Send button */}
          <TouchableOpacity onPress={() => onSendMessage(message)}>
            <Image
              source={require("../../../assets/icons/send.png")}
              style={[styles.attachIcon, { tintColor: "#7A7A7A" }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 5,
    marginBottom: 0,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  IconContainer: {
    height: 48,
    aspectRatio: 1,
    borderRadius: 40,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
  attachIcon: {
    tintColor: "#1D1D1D",
    width: 24,
    height: 24,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#989898",
    borderRadius: 40,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    maxHeight: 80,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 5,
    color: "#333",
  },

  //Reply Bar Styles
  replyContainer: {
    padding: 12,
    backgroundColor: "#fff",
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
    backgroundColor: "#D9D9D9",
  },
  replyText: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#000",
  },
  replyMessage: {
    fontSize: 14,
    fontFamily: "InterMedium",
    color: "#000",
  },
});

export default ChatFooter;
