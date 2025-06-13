import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface BlockUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  userName: string;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  visible,
  onClose,
  onSubmit,
  userName,
}) => {
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = () => {
    setFileName("file_example.jpg");
  };

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
    setFileName("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
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
            style={styles.textarea}
          />

          <Text style={styles.uploadLabel}>Upload File <Text style={{ fontStyle: 'italic', color: '#888' }}>(optional)</Text></Text>

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
              style={[styles.submitBtn, { opacity: reason.trim() ? 1 : 0.5 }]}
              onPress={handleSubmit}
              disabled={!reason.trim()}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    maxHeight: "90%", // Limit height so it doesn't overflow
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
    color: "#374151",
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
    textAlign: "center",
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
  submitBtn: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "bold",
  },
});

