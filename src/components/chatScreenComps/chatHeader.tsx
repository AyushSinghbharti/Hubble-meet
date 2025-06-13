import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
import { useRouter } from "expo-router"; 
import { Ionicons, Feather } from "@expo/vector-icons";

interface ChatHeaderProps {
  profileInfo: any;
  showMenu: any;
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Avatar */}
        <Image
          source={profileInfo.image}
          style={styles.avatar}
        />

        {/* Name + Subtitle */}
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{profileInfo.name}</Text>
          <Text style={styles.subTitle}>Last seen today at {profileInfo.time}</Text>
        </View>

        {/* More Options */}
        <TouchableOpacity onPress={() => {setShowMenu(!showMenu)}}>
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
    zIndex: 10,
  },
  headerContainer: {
    marginTop: StatusBar.currentHeight || 45,
    height: 80,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 20,
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
