import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavHeader from "../../../components/NavHeader";
import Button from "../../../components/Button";
import DeleteAccountModal from "@/src/components/DeleteAccountModal";

export default function SettingsScreen() {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    // TODO: Implement delete logic
    console.log("Account deleted");
    setDeleteModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <NavHeader title="Account" />

      {/* Delete account button */}
      {/* <TouchableOpacity
        onPress={() => setDeleteModalVisible(true)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete account</Text>
        <Ionicons name="chevron-forward" size={20} color="#e53935" />
      </TouchableOpacity> */}

      {/* Delete confirmation modal */}
      <DeleteAccountModal onDelete={() => deleteModalVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3E3E3E",
    padding: 20,
    paddingTop: 60,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff5f5",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffe0e0",
    marginTop: 20,
  },
  deleteButtonText: {
    color: "#e53935",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    position: "relative",
  },
  modalClose: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  trashIcon: {
    marginBottom: 16,
    height: 40,
    width: 40,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: "#222",
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
});
