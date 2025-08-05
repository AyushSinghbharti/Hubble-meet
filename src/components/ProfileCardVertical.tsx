import React from "react";
import {
  View,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { lightenColor } from "@/utils/lightenColor";

interface ProfileModalProps {
  modalVisible: boolean;
  onClose: () => void;
  selectedProfile: UserProfile;
  onPressChat?: () => void;
  onPressShare?: () => void;
  onPressBlock?: () => void;
  onPressPitch?: () => void;
  onPressBag?: () => void;
  onPressViewProfile?: () => void;
}

const ProfileCardVertical: React.FC<ProfileModalProps> = ({
  modalVisible,
  onClose,
  selectedProfile,
  onPressChat,
  onPressShare,
  onPressBlock,
  onPressPitch,
  onPressBag,
  onPressViewProfile,
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: 20,
        }}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: "#333",
            width: 40,
            height: 40,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 400,
            zIndex: 1,
          }}
        >
          <Entypo name="cross" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Profile Card Container with Black Background */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#000", // Black background here
            justifyContent: "flex-end",
            width: "100%",
            alignItems: "center",
            marginTop: 470,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {/* Image Section */}
          <View
            style={{
              width: 180,
              height: 280,
              overflow: "hidden",
              alignItems: "center",
              elevation: 6,
            }}
          >
            <ImageBackground
              source={{
                uri:
                  selectedProfile.profile_picture_url ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s",
              }}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 12,
                }}
              >
                {/* Bag Icon */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    padding: 8,
                    borderRadius: 20,
                    justifyContent: "center",     // ✅ Center vertically
                    alignItems: "center",         // ✅ Center horizontally
                  }}
                  onPress={onPressBag}
                >
                  <Image
                    source={require("../../assets/icons/handshake.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>

                {/* Pitch Icon */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    padding: 8,
                    borderRadius: 20,
                    justifyContent: "center",     // ✅ Center vertically
                    alignItems: "center",         // ✅ Center horizontally
                  }}
                  onPress={onPressPitch}
                >
                  <Image
                    source={require("../../assets/myPitch.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              </View>

            </ImageBackground>
          </View>

          {/* Info Section */}
          <View
            style={{
              paddingTop: 12,
              paddingBottom: 20,
              paddingHorizontal: 16,
              width: 180,
              height: 280,
              backgroundColor: bgColor,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontFamily: "InterBold",
                color: "#000",
              }}
            >
              {selectedProfile.full_name}
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: "InterSemiBold",
                color: "#444",
                marginTop: 4,
              }}
            >
              {selectedProfile.job_title}
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: "InterSemiBold",
                color: "#5E5E5E",
                marginTop: 2,
              }}
            >
              {selectedProfile.city}
            </Text>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 16,
                justifyContent: "space-between",
              }}
            >
              {/* Chat */}
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 30,
                  backgroundColor: lightBg,
                }}
                onPress={onPressChat}
              >
                <Image
                  source={require("../../assets/icons/chat.png")}
                  style={{ width: 22, height: 22 }}
                />
              </TouchableOpacity>

              {/* Share */}
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 30,
                  backgroundColor: lightBg,
                }}
                onPress={onPressShare}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={22}
                  color="#000"
                />
              </TouchableOpacity>

              {/* Block */}
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 30,
                  backgroundColor: lightBg,
                }}
                onPress={onPressBlock}
              >
                <Image
                  source={require("../../assets/icons/block2.png")}
                  style={{ width: 22, height: 22 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* View Profile Button */}
        <TouchableOpacity
          onPress={onPressViewProfile}
          style={{
            marginTop: 10,
            backgroundColor: bgColor,
            paddingVertical: 14,

            borderRadius: 30,
            alignItems: "center",
            width: "100%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "InterSemiBold",
              color: "#000",
            }}
          >
            View Profile →
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ProfileCardVertical;
