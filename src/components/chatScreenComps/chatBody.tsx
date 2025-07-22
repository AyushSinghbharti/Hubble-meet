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
  Linking,
} from "react-native";
import { Animated } from "react-native";
import MessageAction from "./messageAction";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable, {
  SwipeableMethods,
  SwipeableRef,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { ChatMessage } from "@/src/interfaces/chatInterface";
import { useAuthStore } from "@/src/store/auth";
import { FONT } from "@/assets/constants/fonts";

interface ChatMsg {
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

interface ChatBodyProps {
  messages: ChatMessage[];
  onReply?: (message: ChatMessage | null) => void;
  onDelete?: (messageId: string, deleteType: "me" | "everyone") => void;
  onStar?: (messageId: string) => void;
  onCancelReply?: () => void;
}

const ChatBubble = ({
  item,
  isSelected,
  onReply,
  currentlyOpenSwipeable,
  setMessageprops,
  setSelectedMessageId,
  setSelectedMessage,
  allMessages,
}: {
  item: ChatMessage;
  isSelected: boolean;
  onReply?: (message: ChatMessage) => void;
  currentlyOpenSwipeable: React.MutableRefObject<SwipeableRef | null>;
  setMessageprops: React.Dispatch<React.SetStateAction<any>>;
  setSelectedMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedMessage: React.Dispatch<React.SetStateAction<ChatMessage | null>>;
  allMessages: ChatMessage[]; // NEW
}) => {
  const me = item.sender?.id === useAuthStore.getState().userId;
  const swipeableRef = useRef<SwipeableRef | null>(null);
  // console.log("item", JSON.stringify(, null, 2));

  const handleSwipeOpen = () => {
    if (
      currentlyOpenSwipeable.current &&
      currentlyOpenSwipeable.current !== swipeableRef.current
    ) {
      currentlyOpenSwipeable.current.close?.();
    }

    currentlyOpenSwipeable.current = swipeableRef.current;
    if (onReply) onReply(item);
    setTimeout(() => {
      swipeableRef.current?.close?.();
    }, 300);
  };

  const renderContacts = () => {
    try {
      const contacts = JSON.parse(item.content || "[]");
      return (
        <View style={styles.contactsContainer}>
          {contacts.map((contact: any, index: number) => (
            <View key={index} style={styles.contactCard}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
              <View style={styles.contactActions}>
                {contact.phone && (
                  <>
                    <Pressable
                      onPress={() => Linking.openURL(`tel:${contact.phone}`)}
                    >
                      <Text style={styles.contactActionText}>Call</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => Linking.openURL(`sms:${contact.phone}`)}
                    >
                      <Text style={styles.contactActionText}>Message</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      );
    } catch {
      return <Text style={styles.messageText}>Invalid contacts format</Text>;
    }
  };

  const renderRightActions = () => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ color: "#007AFF", fontWeight: "bold", fontSize: 24 }}>
        ↩
      </Text>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={me ? renderRightActions : undefined}
      renderLeftActions={!me ? renderRightActions : undefined}
      overshootRight={false}
      friction={5}
      enableTrackpadTwoFingerGesture={true}
      onSwipeableOpen={handleSwipeOpen}
      leftThreshold={0}
      rightThreshold={0}
    >
      <Pressable
        style={[styles.row, me && styles.rowEnd, isSelected && styles.onMenu]}
        onPress={(event) => {
          event.target.measure((fx, fy, width, height, px, py) => {
            setMessageprops({ x: px, y: py, w: width, h: height });
            setSelectedMessageId((prev) => (prev === item.id ? null : item.id));
            setSelectedMessage((prev) => (prev === item ? null : item));
          });
        }}
      >
        <View
          style={[
            styles.bubbleWrapper,
            me ? styles.bubbleMe : styles.bubbleThem,
          ]}
        >
          <View style={styles.bubbleContent}>
            {/* REPLY PREVIEW SECTION */}
            {item.parentMessageId &&
              (() => {
                const parent = allMessages.find(
                  (msg) => msg.id === item.parentMessageId
                );
                if (!parent) return null;

                const isImage =
                  parent.messageType === "IMAGE" && parent.media?.length > 0;
                const isDoc =
                  parent.messageType === "DOCUMENT" && parent.media?.length > 0;

                return (
                  <View style={styles.replyContainer}>
                    <View style={styles.replyStrip} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.replySender} numberOfLines={1}>
                        {parent.sender?.username || "User"}
                      </Text>
                      {isImage ? (
                        <Image
                          source={{ uri: parent.media[0].url }}
                          style={styles.replyThumbnail}
                          resizeMode="cover"
                        />
                      ) : isDoc ? (
                        <View style={styles.replyDocRow}>
                          <Image
                            source={require("@/assets/icons/document.png")}
                            style={{ width: 14, height: 14, marginRight: 6 }}
                          />
                          <Text style={styles.replyDocText} numberOfLines={1}>
                            {parent.media[0].fileName || "Document"}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.replyText} numberOfLines={1}>
                          {parent.content || "[message]"}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })()}

            {/* preview reply */}

            {item.messageType === "IMAGE" && item.media?.length > 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  gap: 8,
                  maxWidth: 220,
                }}
              >
                <View>
                  {item.media.map((mediaItem) => (
                    <Pressable
                      key={mediaItem.id}
                      onPress={() => Linking.openURL(mediaItem.url)}
                    >
                      <Image
                        source={{ uri: mediaItem.url }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 10,
                        }}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : item.messageType === "CONTACTS" ? (
              renderContacts()
            ) : item.messageType === "DOCUMENT" && item.media?.length > 0 ? (
              <View style={{ gap: 6, maxWidth: 220 }}>
                {item.media.map((mediaItem) => (
                  <Pressable
                    key={mediaItem.id}
                    onPress={() => Linking.openURL(mediaItem.url)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Image
                      source={require("@/assets/icons/document.png")}
                      style={{ width: 20, height: 20, marginRight: 8 }}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.messageText,
                        { fontFamily: FONT.MEDIUM, color: "#7174c3ff" },
                      ]}
                    >
                      {mediaItem.fileName || "Document"}
                    </Text>
                  </Pressable>
                ))}
                {item.content && (
                  <Text style={styles.messageText}>{item.content}</Text>
                )}
              </View>
            ) : (
              <Text style={styles.messageText}>{item.content}</Text>
            )}

            <View style={styles.timeRow}>
              <Text style={styles.timeText}>
                {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default function ChatBody({
  messages,
  onReply,
  onDelete = () => {},
  onStar = () => {},
  onCancelReply,
}: ChatBodyProps) {
  const [messageProps, setMessageprops] = useState({ x: 0, y: 0, h: 0, w: 0 });
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(
    null
  );
  const userId = useAuthStore((state) => state.userId);

  // Convert backend ChatMessage[] → ChatMsg[]
  const transformedMessages: ChatMsg[] = messages.map((msg) => ({
    id: msg.id,
    text: msg.content,
    timestamp: new Date(msg.createdAt),
    isMe: msg.sender?.id === userId,
    name: msg.sender.username,
    delivered: true, // Optional, set true by default
  }));

  const onAction = (
    action: "reply" | "star" | "delete" | "deleteforme" | "deleteforeveryone"
  ) => {
    if (action === "reply") {
      if (onReply) onReply(selectedMessage);
    } else if (action === "star") {
      if (onStar) onStar(selectedMessage);
    } else if (action === "deleteforme") {
      onDelete(selectedMessage?.id || "", "me");
    } else if (action === "deleteforeveryone") {
      onDelete(selectedMessage?.id || "", "everyone");
    }
    setSelectedMessageId(null);
  };

  const currentlyOpenSwipeable = useRef<SwipeableRef | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const isMenuVisible = selectedMessageId !== null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      >
        <MessageAction
          onAction={onAction}
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

        {messages.length > 0 && (
          <View style={styles.dateChip}>
            <Text style={styles.dateChipText}>
              {dateLabel(transformedMessages[0].timestamp)}
            </Text>
          </View>
        )}

        {messages.map((item) => (
          <View key={item.id} style={styles.listContent}>
            <ChatBubble
              item={item}
              isSelected={selectedMessageId === item.id}
              onReply={onReply}
              currentlyOpenSwipeable={currentlyOpenSwipeable}
              setMessageprops={setMessageprops}
              setSelectedMessageId={setSelectedMessageId}
              setSelectedMessage={setSelectedMessage}
              allMessages={messages}
            />
          </View>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
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
  row: { flexDirection: "row", paddingHorizontal: 8 },
  rowEnd: { justifyContent: "flex-end" },
  onMenu: {
    backgroundColor: "#000",
    opacity: 0.5,
    paddingVertical: 2,
  },
  /* Bubbles */
  bubbleWrapper: {
    borderRadius: 16,
    padding: 10,
    maxWidth: 250,
  },

  bubbleContent: {
    flexDirection: "column",
    gap: 8,
  },

  bubbleMe: {
    backgroundColor: "#BBCF8D",
    alignSelf: "flex-end",
  },

  bubbleThem: {
    backgroundColor: "#E8E8E8",
    alignSelf: "flex-start",
  },

  replyContainer: {
    // flexDirection: "row",
    // alignItems: "flex-start", // fixes text wrap alignment
    backgroundColor: "#e2e2e2",
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 8,
    maxWidth: "100%", // prevents overflow and allows wrapping
    flexShrink: 1,
  },

  replyStrip: {
    width: 3,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },

  replySender: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 2,
  },

  contactsContainer: { gap: 6, maxWidth: 240 },
  contactCard: {
    minWidth: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 6,
  },
  contactName: { fontWeight: "600", fontSize: 14 },
  contactPhone: { color: "#555", marginBottom: 4 },
  contactActions: { flexDirection: "row", gap: 12 },
  contactActionText: { color: "#007AFF", fontSize: 12 },

  replyText: {
    fontSize: 12,
    color: "#444",
  },

  replyDocRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  replyDocText: {
    fontSize: 12,
    color: "#444",
    flexShrink: 1,
  },

  replyThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },

  bubble: {
    gap: 10,
    minHeight: 50,
    paddingLeft: 20,
    padding: 10,
    borderRadius: 40,
    alignItems: "center",
    flexDirection: "row",
  },

  messageText: {
    maxWidth: "100%",
    minWidth: "25%",
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
  },
  timeText: { fontSize: 10, color: "#4D4D4D" },
});
