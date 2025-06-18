import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const messages = [
  {
    id: "1",
    sender: "Hellen Whilliams",
    isMe: false,
    date: "9/2/24",
    time: "16.31",
    text: "That sounds exhausting.\nGot any plans for the evening?",
    status: "read",
  },
  {
    id: "2",
    sender: "You",
    isMe: true,
    date: "9/2/24",
    time: "16.30",
    text: "Probably just relaxing and watching a show. What about you?",
  },
];

export default function StarredMessage() {
  const router = useRouter();
  const renderItem = ({ item }: { item: (typeof messages)[0] }) => (
    <View style={styles.messageBlock}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!item.isMe && <Text style={styles.senderName}>{item.sender}</Text>}
        {item.isMe && <Text style={styles.senderName}>You</Text>}
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View
        style={[
          styles.bubble,
          item.isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <View style={styles.meta}>
          <Text style={styles.messageText}>{item.text}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.timeText}>{item.time}</Text>
            {item.status === "read" && (
              <MaterialIcons name="done-all" size={16} color="#4386f4" />
            )}
          </View>
        </View>
      </View>
    </View>
  );

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
        keyExtractor={(item) => item.id}
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
  },
  timeText: {
    fontSize: 11,
    color: "#666",
  },
});
