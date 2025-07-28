import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChatStore } from "@/src/store/chatStore";
import { useAuthStore } from "@/src/store/auth";

const StarFilledIcon = require("../../../../../assets/icons/star2.png");
const StarOutlineIcon = require("../../../../../assets/icons/star.png");

export default function StarredMessage() {
  const router = useRouter();
  const { id: chatId } = useLocalSearchParams<{ id: string }>();

  const userId = useAuthStore((s) => s.userId);
  const starredMessages = useChatStore((s) => s.starredMessages);

  const [toggledStars, setToggledStars] = useState<{ [id: string]: boolean }>({});

  const messages = starredMessages
    .filter((msg) => msg.chat?.id === chatId)
    .map((msg) => ({
      id: msg.id,
      sender: msg.sender?.username || "Unknown",
      isMe: msg.sender?.id === userId,
      date: new Date(msg.createdAt).toLocaleDateString(),
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: msg.content,
    }));

  const renderItem = ({ item }: { item: (typeof messages)[0] }) => {
    const isToggled = toggledStars[item.id];

    const handleStarToggle = () => {
      setToggledStars((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    };

    return (
      <View style={styles.messageBlock}>
        <View style={styles.headerRow}>
          <Text style={styles.senderName}>
            {item.isMe ? "You" : item.sender}
          </Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <TouchableOpacity onPress={handleStarToggle} activeOpacity={0.8}>
          <View
            style={[
              styles.bubble,
              item.isMe ? styles.myBubble : styles.theirBubble,
            ]}
          >
            <View style={styles.meta}>
              <Text style={styles.messageText}>{item.text}</Text>
              <View style={styles.metaRight}>
                <Text style={styles.timeText}>{item.time}</Text>
                <Image
                  source={isToggled ? StarFilledIcon : StarOutlineIcon}
                  style={styles.starIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      style={styles.container}
      onRequestClose={() => router.back()}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Starred Messages</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, idx) => `${item.id} + ${idx}`}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  title: {
    flex: 1,
    marginLeft: 12,
    fontFamily: "InterBold",
    fontSize: 16,
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  messageBlock: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  senderName: {
    marginBottom: 4,
    fontSize: 12,
    fontFamily: "Inter",
    color: "#000",
  },
  dateText: {
    fontSize: 12,
    color: "#7B7B7B",
  },
  bubble: {
    maxWidth: "85%",
    minWidth: "60%",
    minHeight: 55,
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 40,
  },
  myBubble: {
    backgroundColor: "#E8E8E8",
  },
  theirBubble: {
    backgroundColor: "#BBCF8D",
  },
  messageText: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 14,
    paddingLeft: 5,
    color: "#222",
    lineHeight: 20,
  },
  meta: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
    gap: 4,
    justifyContent: "space-between",
  },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: "#666",
  },
  starIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
});
