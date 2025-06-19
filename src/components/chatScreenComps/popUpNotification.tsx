import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  name: string;
  closeFriend: boolean;
};

const PopUpNotification = ({ visible, onClose, name, closeFriend }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.popup}>
          {closeFriend ? (
            <View style={styles.iconContainer}>
              <FontAwesome name="close" size={32} color="black" />
            </View>
          ) : (
            <Image
              source={require("../../../assets/icons/added.gif")}
              style={{ height: 52, width: 60 }}
            />
          )}
          <Text style={styles.name}>{name}</Text>
          {closeFriend ? (
            <Text style={styles.desc}>Removed from your Hubble Circle</Text>
          ) : (
            <Text style={styles.desc}>Added from your Hubble Circle</Text>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#000",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f87171",
    borderRadius: 40,
    padding: 12,
    marginBottom: 12,
  },
  name: {
    color: "#fff",
    fontFamily: "InterBold",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    color: "#ccc",
    fontFamily: "Inter",
    fontSize: 13,
  },
});

export default PopUpNotification;
