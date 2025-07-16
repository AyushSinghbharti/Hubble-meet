import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { UserProfile } from "@/src/interfaces/profileInterface";

interface ChatHeaderProps {
  profileInfo: UserProfile;
  showMenu: boolean;
  setShowMenu: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  profileInfo,
  showMenu,
  setShowMenu,
}) => {
  const router = useRouter();

  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace("/chat")}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            router.push({
              pathname: `chatStack/${profileInfo.user_id}/viewVBC`,
              params: { item: JSON.stringify(profileInfo) }, //Look out for error in future maybe!!!
            });
          }}
        >
          {/* Avatar */}
          <Image
            source={{
              uri:
                profileInfo.profile_picture_url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s",
            }}
            style={styles.avatar}
          />

          {/* Name + Subtitle */}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profileInfo.full_name}</Text>
            <Text style={styles.subTitle}>
              Works at {profileInfo.current_company} {/* Mark for error */}
            </Text>
          </View>
        </TouchableOpacity>

        {/* More Options */}
        <TouchableOpacity
          onPress={() => {
            setShowMenu(!showMenu);
          }}
        >
          <Feather name="more-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 2,
  },
  headerContainer: {
    height: 80,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#F0E5FF",
    marginHorizontal: 10,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: "InterBold",
    fontWeight: "600",
    color: "#000",
  },
  subTitle: {
    fontSize: 10,
    color: "#8E8E8E",
  },
});

export default ChatHeader;
