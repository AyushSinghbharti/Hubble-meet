import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Image } from "expo-image";

const ReportSuccessModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={{uri: "https://cdn-icons-gif.flaticon.com/11020/11020134.gif"}}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Pitch Reported</Text>
          <Text style={styles.message}>
            Thank you! Our team will review this pitch shortly.
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.okButton}>
            <Text style={styles.okText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReportSuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  image: {
    width: 75,
    height: 60,
  },
  title: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#333",
    marginBottom: 8,
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    fontFamily: "InterMedium",
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  okText: {
    color: "#fff",
    fontFamily: "InterSemiBold",
    fontSize: 14,
  },
});
