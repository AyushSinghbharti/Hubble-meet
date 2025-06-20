import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  Text
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface ChatFooterProps {
  message: string;
  useMessage: (text: string) => void;
  onPress: () => void;
  onLayout: any
}

const ChatFooter = ({onLayout, message, useMessage, onPress }: ChatFooterProps) => {

  return (
    <View style={styles.container} onLayout={onLayout}>
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
        <TouchableOpacity>
          <Image
            source={require("../../../assets/icons/send.png")}
            style={[styles.attachIcon, { tintColor: "#7A7A7A" }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 5,
    marginBottom: 0,
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
    flexDirection: 'row',
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#989898",
    borderRadius: 40,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    maxHeight: 100,
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
});

export default ChatFooter;