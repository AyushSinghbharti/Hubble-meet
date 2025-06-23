import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Entypo from "@expo/vector-icons/Entypo";
import colourPalette from "../theme/darkPaletter";

interface UploadErrorModalProps {
  visible: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const TermDetailModal: React.FC<UploadErrorModalProps> = ({
  visible,
  onClose,
  onAgree
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <ScrollView
        contentContainerStyle={styles.overlay}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity hitSlop={150} style={styles.icon} onPress={onClose}>
            <Entypo name="cross" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.desc}>
            A privacy policy explains how your website, products, and services
            collect, use, and protect user information. It outlines the types of
            data gathered, why it is collected, and how it is stored or shared,
            ensuring compliance with privacy laws. This document is sometimes
            referred to as a data protection policy or a privacy statement. Its
            purpose remains the same: to inform users of their rights and how
            their personal information is handled. By using your website,
            products, or services, customers acknowledge and agree to your your
            privacy policy.
          </Text>
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.desc}>
            Terms and conditions outline what users can and cannot do with your
            website, products, and services. They lay out the rules to protect
            you in case of misuse and enable you to take action if it becomes
            necessary. It’s also referred to by other names such as terms of
            service (ToS) and terms of use (ToU). Even though they have
            different names, in fact – there is no difference. In order to use
            your website, products, or services, your customers usually must
            agree to abide by your terms and conditions first.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onAgree}>
            <Text style={styles.buttonText}>Agree</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default TermDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    zIndex: 2,
    padding: 20,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  modalContainer: {
    backgroundColor: colourPalette.backgroundSecondary,
    width: "90%",
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    marginBottom: 8,
    textAlign: "left",
    color: colourPalette.textPrimary,
  },
  desc: {
    fontSize: 14,
    color: colourPalette.textSecondary,
    fontFamily: "Inter",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: colourPalette.buttonPrimary,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "white",
  },
  buttonText: {
    color: "#000",
    fontFamily: "InterSemiBold",
    fontSize: 16,
  },
});
