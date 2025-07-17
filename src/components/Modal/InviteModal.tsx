import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Clipboard,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import AlertModal from "../Alerts/AlertModal";

interface InviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const INVITE_LINK = "http://www.sample.org/headhatsapp";

export default function InviteModal({ visible, onClose }: InviteModalProps) {
  // const [requestSentVisible, setRequestSentVisible] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(INVITE_LINK);
  };

  const handleWhatsAppInvite = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(INVITE_LINK)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open WhatsApp");
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          {/* Close Icon */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Send an Invite</Text>

          {/* Illustration */}
          <Image
            source={{
              uri: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-high-five-team-building-flaticons-lineal-color-flat-icons.png",
            }}
            style={styles.illustration}
          />

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>{INVITE_LINK}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={handleWhatsAppInvite}
          >
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={styles.whatsappText}> Invite via Whatsapp</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
      {/* <AlertModal
        visible={requestSentVisible}
        onClose={() => setRequestSentVisible(false)}
        imageSource={require("../../../assets/icons/tick1.png")}
        label="Request Sent"
        onButtonPress={() => setRequestSentVisible(false)}
        positionBottom
      /> */}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000040",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
  },
  illustration: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF4E6",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  linkText: {
    fontSize: 13,
    flex: 1,
    color: "#333",
  },
  copyButton: {
    marginLeft: 10,
    backgroundColor: "#B2CD82",
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
