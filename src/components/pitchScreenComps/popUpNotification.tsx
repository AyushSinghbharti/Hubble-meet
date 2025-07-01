import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

interface UploadErrorModalProps {
  visible: boolean;
  onClose: () => void;
  onExit?: () => void;
  type: "success" | "pending" | "error" | "warning";
  heading?: string;
  description?: string;
  buttonText?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap; // e.g. "exclamation-circle"
  iconColor?: string;
}

const MODAL_CONFIG = {
  success: {
    icon: require("../../../assets/icons/success.png"),
    heading: "Pitch Upload Successful.",
    description: "Congratulations! You have uploaded your pitch successfully.",
    buttonText: "Go to profile",
  },
  pending: {
    icon: require("../../../assets/icons/video.png"),
    heading: "Video Submitted",
    description: "It’ll be reviewed and updated to your profile once approved.",
    buttonText: "Go to pitch",
  },
  error: {
    icon: require("../../../assets/icons/barrier.png"),
    heading: "Upload Error!",
    description:
      "Your video exceeds the allowed duration. Please upload a file under 5MB",
    buttonText: "Okay",
  },
  warning: {
    icon: require("../../../assets/icons/barrier.png"),
    heading: "Warning",
    description: "Please review the upload guidelines before continuing.",
    buttonText: "Understood",
  },
};

const UploadErrorModal: React.FC<UploadErrorModalProps> = ({
  visible,
  onClose,
  onExit,
  type,
  heading,
  description,
  buttonText,
  icon,
  iconColor = "#000",
}) => {
  const config = MODAL_CONFIG[type];

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onExit}>
      <Pressable style={styles.overlay} onPress={onExit}>
        <View style={styles.modalContainer}>
          <View style={styles.iconWrapper}>
            <Image
              source={config.icon}
              style={styles.icon}
              resizeMode="contain"
            />
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={24}
                color={iconColor}
                style={[styles.customIcon]}
              />
            )}
          </View>
          <Text style={styles.title}>{heading || config.heading}</Text>
          <Text style={styles.message}>
            {description || config.description}
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              {buttonText || config.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default UploadErrorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12
  },
  customIcon: {
    position: "absolute",
    bottom: 5,
    right: -10,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    marginBottom: 4,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#525f7f",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#BBCF8D",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: "center"
  },
  buttonText: {
    fontFamily: "InterBold",
    color: "#000",
    fontSize: 16,
  },
});
