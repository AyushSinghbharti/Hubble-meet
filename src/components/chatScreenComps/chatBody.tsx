// components/ChatBody.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import MessageAction from "./messageAction";

export interface ChatMsg {
  id: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
  delivered?: boolean;
}

function dateLabel(date: Date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const strip = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).valueOf();
  if (strip(date) === strip(today)) return "Today";
  if (strip(date) === strip(tomorrow)) return "Tomorrow";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ChatBody({ messages }: { messages: ChatMsg[] }) {
  const [messageProps, setMessageprops] = useState({ x: 0, y: 0, h: 0, w: 0 });
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const renderItem = ({ item }: { item: ChatMsg }) => {
    const me = item.isMe;
    const isSelected = selectedMessageId === item.id;

    return (
      <Pressable
        style={[
          styles.row,
          me && styles.rowEnd,
          isSelected && styles.onMenu,
        ]}
        onPress={(event) => {
          event.target.measure((fx, fy, width, height, px, py) => {
            setMessageprops({ x: px, y: py, w: width, h: height });
            setSelectedMessageId((prev) => (prev === item.id ? null : item.id));
          });
        }}
      >
        <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>
              {item.timestamp.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {me && (
              <Image
                source={require("../../../assets/icons/tick.png")}
                style={{ height: 16, width: 16, marginLeft: 2 }}
              />
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  const isMenuVisible = selectedMessageId !== null;

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
    >
      <MessageAction
        onAction={() => {}}
        isVisible={isMenuVisible}
        topOffset={
          messageProps.y > 550
            ? messageProps.y - messageProps.y / 2.5
            : messageProps.y > 515
            ? messageProps.y - messageProps.y / 2
            : messageProps.y - 50
        }
        leftOffset={messageProps.x > 90 ? 265 : 25}
      />

      <View style={styles.dateChip}>
        <Text style={styles.dateChipText}>
          {dateLabel(messages[0].timestamp)}
        </Text>
      </View>

      {[...messages].map((item) => (
        <View key={item.id} style={styles.listContent}>
          {renderItem({ item })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  dateChip: {
    alignSelf: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "#fff",
    borderRadius: 3,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  dateChipText: { fontSize: 10, fontFamily: "Inter", color: "#8E8E8E" },

  /* List content spacing */
  listContent: { paddingBottom: 9 },

  /* Message rows */
  row: { flexDirection: "row", paddingHorizontal: 8},
  rowEnd: { justifyContent: "flex-end" },
  onMenu: {
    backgroundColor: "#000",
    opacity: 0.5,
    paddingVertical: 2,
  },
  /* Bubbles */
  bubble: {
    gap: 10,
    minHeight: 50,
    paddingLeft: 20,
    padding: 10,
    borderRadius: 40,
    alignItems: "center",
    flexDirection: "row",
  },
  bubbleThem: {
    backgroundColor: "#E8E8E8",
  },
  bubbleMe: {
    backgroundColor: "#BBCF8D",
  },

  messageText: {
    maxWidth: 220,
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: { fontSize: 10, color: "#4D4D4D" },
});
