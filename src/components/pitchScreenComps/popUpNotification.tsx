import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

interface UploadErrorModalProps {
  visible: boolean;
  onClose: () => void;
  type: "error" | "success" | "pending";
}

const UploadErrorModal: React.FC<UploadErrorModalProps> = ({
  visible,
  onClose,
  type,
}) => {
  const icons = {
    success: require("../../../assets/icons/success.png"),
    pending: require("../../../assets/icons/video.png"),
    error: require("../../../assets/icons/barrier.png"),
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={icons[type]}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            {type === "success"
              ? "Pitch Upload Successful."
              : type === "pending"
              ? "Video Submitted"
              : "Upload Error!"}
          </Text>
          <Text style={styles.message}>
            {type === "success"
              ? "Congratulations! You have uploaded your pitch successfully. "
              : type === "pending"
              ? "It’ll be reviewed and updated to your profile once approved."
              : "Your video exceeds the allowed duration. Please upload a file under 5MB"}
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              {type === "success"
                ? "Go to profile"
                : type === "pending"
                ? "Go to pitch"
                : "Okay"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  icon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    marginBottom: 8,
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
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: "InterMedium",
    color: "#fff",
    fontSize: 16,
  },
});
