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
import CustomCard from "../Cards/vbcCard";
import { useGetVbcCard } from "@/src/hooks/useVbc";

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
  const { data, isLoading } = useGetVbcCard(profile.user_id);
  const userProfile = data || profile;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
        <View style={styles.modalContent}>
          <View style={{ transform: [{ scale: 1.5 }] }}>
            <CustomCard
              id={userProfile.user_id}
              name={userProfile.full_name || userProfile.display_name}
              role={userProfile.job_title || ""}
              location={userProfile.city || userProfile.location}
              backgroundColor={userProfile.color}
              avatar={{ uri: userProfile.profile_picture_url }}
            />
          </View>
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
    width: "90%",
    // backgroundColor: "#fff",
    // borderRadius: 16,
    // padding: 20,
    alignItems: "center",
    // elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 34,
  },
});

export default ViewVbcModal;
