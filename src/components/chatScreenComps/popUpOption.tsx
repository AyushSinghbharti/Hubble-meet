import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface BlockModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: () => void;
  message: string;
  description: string;
  acceptButtonName: string;
  cancelButtonName: string;
  altStyle?: boolean;
}

export default function PopUpOption({
  visible,
  onClose,
  onSelect,
  message,
  description,
  acceptButtonName,
  cancelButtonName,
  altStyle = false,
}: BlockModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{message}</Text>
          <Text style={styles.message}>{description}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.cancelBtn, { flex: altStyle ? 0 : 1 }]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>{cancelButtonName}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.blockBtn} onPress={onSelect}>
              <Text style={styles.blockText}>{acceptButtonName}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: "InterBold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: "Inter",
    textAlign: "center",
    color: "#8A8A8A",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    // flex: 1,
    minWidth: 70,
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  blockBtn: {
    flex: 1,
    minWidth: 70,
    backgroundColor: "#BBCF8D",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: "#555",
    fontFamily: "InterBold",
    fontWeight: "500",
  },
  blockText: {
    color: "#000",
    fontFamily: "InterBold",
    fontWeight: "600",
  },
});
