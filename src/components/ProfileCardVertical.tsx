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
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { UserProfile } from "@/src/interfaces/profileInterface";

interface ProfileModalProps {
  modalVisible: boolean;
  onClose: () => void;
  selectedProfile: UserProfile;
  onPressChat?: () => void;
  onPressShare?: () => void;
  onPressBlock?: () => void;
  onPressPitch?: () => void;
  onPressBag?: () => void;
}

export const lightenColor = (hex: string, percent: number): string => {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const bigint = parseInt(hex.slice(1), 16);
  r = (bigint >> 16) & 255;
  g = (bigint >> 8) & 255;
  b = bigint & 255;

  r = Math.min(255, Math.round(r + ((255 - r) * percent) / 100));
  g = Math.min(255, Math.round(g + ((255 - g) * percent) / 100));
  b = Math.min(255, Math.round(b + ((255 - b) * percent) / 100));

  const toHex = (val: number) => val.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const ProfileCardVertical: React.FC<ProfileModalProps> = ({
  modalVisible,
  onClose,
  selectedProfile,
  onPressChat,
  onPressShare,
  onPressBlock,
  onPressPitch,
  onPressBag,
}) => {
  const bgColor = "#cbeaa3";
  const lightBg = lightenColor(bgColor, 50);

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
              source={{ uri: selectedProfile.profile_picture_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s"}}
              style={styles.image}
              imageStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
            >
              <View style={styles.topIcons}>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={onPressBag}
                >
                  <Image
                    source={require("../../assets/icons/suitcase.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={onPressPitch}
                >
                  <Image
                    source={require("../../assets/icons/pitch2.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>

        <View style={[styles.profileInfo, { backgroundColor: bgColor }]}>
          <Text style={styles.name}>{selectedProfile.full_name}</Text>
          <Text style={styles.title}>{selectedProfile.job_title}</Text>
          <Text style={styles.location}>{selectedProfile.city}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionCircle, { backgroundColor: lightBg }]}
              onPress={onPressChat}
            >
              <Image
                source={require("../../assets/icons/chat.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionCircle, { backgroundColor: lightBg }]}
              onPress={onPressShare}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={22}
                color="#000"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionCircle, { backgroundColor: lightBg }]}
              onPress={onPressBlock}
            >
              <Image
                source={require("../../assets/icons/block2.png")}
                style={styles.icon}
              />
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
