import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";

interface Profile {
  name: string;
  title: string;
  location: string;
  src: any;
  borderColor: string;
}

interface ProfileModalProps {
  modalVisible: boolean;
  onClose: () => void;
  selectedProfile: Profile;
}

export const lightenColor = (hex: string, percent: number): string => {
  let r = 0,
    g = 0,
    b = 0;

  // Expand shorthand like #abc → #aabbcc
  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  // Convert hex to RGB
  const bigint = parseInt(hex.slice(1), 16);
  r = (bigint >> 16) & 255;
  g = (bigint >> 8) & 255;
  b = bigint & 255;

  // Increase each component toward white by percent
  r = Math.min(255, Math.round(r + ((255 - r) * percent) / 100));
  g = Math.min(255, Math.round(g + ((255 - g) * percent) / 100));
  b = Math.min(255, Math.round(b + ((255 - b) * percent) / 100));

  // Convert back to hex
  const toHex = (val: number) => val.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const ProfileCardVertical: React.FC<ProfileModalProps> = ({
  modalVisible,
  onClose,
  selectedProfile,
}) => {
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={selectedProfile.src}
              style={styles.image}
              imageStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
            >
              {/* Top Left & Right Icons */}
              <View style={styles.topIcons}>
                <View style={styles.iconWrapper}>
                  <Image
                    source={require("../../assets/icons/suitcase.png")}
                    style={styles.icon}
                  />
                </View>
                <View style={[styles.iconWrapper]}>
                  <Image
                    source={require("../../assets/icons/pitch2.png")}
                    style={styles.icon}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>

        <View
          style={[
            styles.profileInfo,
            { backgroundColor: selectedProfile.borderColor },
          ]}
        >
          <Text style={styles.name}>{selectedProfile.name}</Text>
          <Text style={styles.title}>{selectedProfile.title}</Text>
          <Text style={styles.location}>{selectedProfile.location}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionCircle,{backgroundColor: lightenColor(selectedProfile.borderColor,50)}]}>
              <Image source={require("../../assets/icons/chat.png")} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCircle,{backgroundColor: lightenColor(selectedProfile.borderColor,50)}]}>
              <MaterialCommunityIcons
                name="share-variant"
                size={22}
                color="#000"
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCircle,{backgroundColor: lightenColor(selectedProfile.borderColor,50)}]}>
              <Image source={require("../../assets/icons/block2.png")} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Entypo name="cross" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ProfileCardVertical;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "#FEF9C3",
    borderRadius: 30,
    overflow: "hidden",
    alignItems: "center",
    elevation: 6,
  },
  imageContainer: {
    width: "100%",
    height: 280,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  iconWrapper: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  profileInfo: {
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: "#FEF9C3",
    borderRadius: 30,
    width: "85%",
    paddingHorizontal: 16,
    top: -50,
  },
  name: {
    fontSize: 28,
    fontFamily: "InterBold",
    color: "#000",
  },
  title: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#444",
  },
  location: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#5E5E5E",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    width: "100%",
  },
  actionCircle: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
  },
  closeBtn: {
    backgroundColor: "#333",
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
  },
});
