import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { FONT } from "@/assets/constants/fonts";

const { width } = Dimensions.get("window");

interface InviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const INVITE_LINK = "http://www.sample.org/headhatsapp";

export default function InviteModal({ visible, onClose }: InviteModalProps) {
  const handleCopy = () => {
    require("react-native").Clipboard.setString(INVITE_LINK);
    Alert.alert("Copied", "Invite link copied to clipboard!");
  };

  const handleWhatsAppInvite = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(INVITE_LINK)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open WhatsApp");
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        {/* Close button floating above modal */}
        <TouchableOpacity onPress={onClose} style={styles.floatingCloseButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        {/* Modal at the bottom */}
        <Pressable style={styles.modal} onPress={() => { }}>
          {/* Illustration */}
          <Image
            source={require("../../../assets/invite.png")}
            style={styles.illustration}
          />

          {/* Title */}
          <Text style={styles.title}>Send an Invite</Text>

          {/* Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>{INVITE_LINK}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* WhatsApp */}
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={handleWhatsAppInvite}
          >
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={styles.whatsappText}> Invite via WhatsApp</Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000040",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  floatingCloseButton: {
    position: "absolute",
    bottom: 380, // Adjust this based on modal height
    right: 180,
    backgroundColor: "#BBCF8D",
    padding: 8,
    borderRadius: 20,
    zIndex: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 12,
    color: "#fff",
    fontFamily: FONT.MONSERRATMEDIUM,
  },
  illustration: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#323232",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "gray",
  },
  linkText: {
    fontSize: 13,
    flex: 1,
    color: "#fff",
    fontFamily: FONT.MONSERRATREGULAR,
  },
  copyButton: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 6,
  },
  whatsappButton: {
    flexDirection: "row",
    backgroundColor: "#B2CD82",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  whatsappText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
