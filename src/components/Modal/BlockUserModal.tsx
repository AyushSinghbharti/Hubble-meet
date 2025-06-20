import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AlertModal from "../Alerts/AlertModal";

interface BlockUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  userName: string;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  visible,
  onClose,
  userName,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");
  const [blockedModalVisible, setBlockedModalVisible] = useState(false);

  const handleFileUpload = () => {
    setFileName("file_example.jpg");
  };

  const handleSubmit = () => {
    if (!reason.trim()) return;

    onSubmit(reason);
    setReason("");
    setFileName("");
    onClose(); // close current modal
    setBlockedModalVisible(true); // open confirmation modal
  };

  return (
    <>
      {/* Main Block Modal */}
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <View style={styles.modalBox}>
              <Text style={styles.title}>Block {userName}</Text>
              <Text style={styles.label}>
                What is the reason for blocking{"\n"}
                <Text>{userName}</Text>?
                <Text style={{ color: "red" }}> *</Text>
              </Text>

              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Write Here"
                placeholderTextColor="#9CA3AF"
                multiline
                returnKeyType="done"
                style={styles.textarea}
                onSubmitEditing={() => {
                  if (reason.trim()) handleSubmit();
                }}
              />

              <Text style={styles.uploadLabel}>
                Upload File{" "}
                <Text style={{ fontStyle: "italic", color: "#888" }}>(optional)</Text>
              </Text>

              <Pressable style={styles.uploadBox} onPress={handleFileUpload}>
                <Feather name="upload" size={24} color="#6B7280" />
                <Text style={styles.uploadText}>
                  {fileName ? fileName : "Click to upload"}
                </Text>
              </Pressable>

              <Text style={styles.warning}>
                Note: Once you block this user, the action can be undone via{" "}
                <Text style={{ fontWeight: "bold" }}>"Block Users"</Text> within Settings
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    reason.trim() ? styles.submitBtnActive : styles.submitBtnDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!reason.trim()}
                >
                  <Text
                    style={[
                      styles.submitText,
                      reason.trim() ? styles.submitTextActive : styles.submitTextDisabled,
                    ]}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <AlertModal
  visible={blockedModalVisible}
  onClose={() => setBlockedModalVisible(false)}
  label="Connection Blocked"
  imageSource={require("../../../assets/icons/tick1.png")}
  positionBottom
/>

    </>
  );
};

export default BlockUserModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 24,
    maxHeight: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#1F2937",
  },
  label: {
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 20,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    color: "#111827",
    marginBottom: 20,
    fontSize: 14,
  },
  uploadLabel: {
    fontSize: 14,
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    borderStyle: "dashed",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
  warning: {
    fontSize: 12,
    color: "red",
    marginBottom: 24,

  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Submit Button Styling
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 12,
    alignItems: "center",
  },
  submitBtnActive: {
    backgroundColor: "#111827", // black when active
  },
  submitBtnDisabled: {
    backgroundColor: "#E5E7EB", // gray when disabled
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  submitTextActive: {
    color: "#FFFFFF",
  },
  submitTextDisabled: {
    color: "#111827",
  },

  // Confirmation Modal
  confirmModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    width: "80%",
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1F2937",
  },
  confirmMessage: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
  okBtn: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  okText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
