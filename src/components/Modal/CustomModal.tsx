import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  name,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2600); // Auto-close after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Image
                source={require("../../../assets/gif/added.gif")}
                style={styles.gif}
              />
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.subLabel}>Added on your Hubble Circle</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
  },
  gif: {
    width: 180,
    height: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    fontFamily: "InterBold",
  },
  subLabel: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "InterRegular",
  },
});
