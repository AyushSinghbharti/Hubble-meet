// components/chatScreenComps/ViewVbcModal.tsx
import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useOtherUserProfile } from "@/src/hooks/useProfile";
import VbcCard from "../VbcCard";

interface ViewVbcModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
}

const ViewVbcModal: React.FC<ViewVbcModalProps> = ({
  visible,
  onClose,
  profile,
}) => {
  const { data, isLoading } = useOtherUserProfile(profile.user_id);
  const userProfile = data || profile;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={32} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.modalContent}>
          <VbcCard profiles={[userProfile]} closeVBC={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    marginTop: 100,
    transform: [{ scale: 1.3 }],
    width: "90%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 34,
  },
});

export default ViewVbcModal;
