import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";
import MessageAction from "./messageAction";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable, {
  SwipeableRef,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Contacts from "expo-contacts";

import { ChatMessage } from "@/src/interfaces/chatInterface";
import { useAuthStore } from "@/src/store/auth";
import { FONT } from "@/assets/constants/fonts";
import { useGetOtherVbcCard } from "@/src/hooks/useVbc";
import VbcChatCard from "./VbcChatCard";
import MediaViewer from "@/src/components/chatScreenComps/mediaViewer";
import { useOtherUserProfile } from "@/src/hooks/useProfile";
import colourPalette from "@/src/theme/darkPaletter";

// Helper function to format time
const formatTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Regex to detect URLs in the text
const urlRegex = /(https?:\/\/[^\s]+)/g;

// Helper: renders text with tappable links for URLs
const renderTextWithLinks = (text: string) => {
  if (!text) return null;

  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          return (
            <Text
              key={index}
              style={{ color: "#1B95E0", textDecorationLine: "underline" }}
              onPress={async () => {
                try {
                  const supported = await Linking.canOpenURL(part);
                  if (supported) {
                    await Linking.openURL(part);
                  } else {
                    Alert.alert("Invalid URL", "Cannot open this link.");
                  }
                } catch (error) {
                  Alert.alert("Error", "Failed to open the link.");
                }
              }}
            >
              {part}
            </Text>
          );
        } else {
          return (
            <Text key={index} style={styles.messageText}>
              {part}
            </Text>
          );
        }
      })}
    </>
  );
};

interface ChatBodyProps {
  messages: ChatMessage[];
  onReply?: (message: ChatMessage | null) => void;
  onDelete?: (messageId: string, deleteType: "me" | "everyone") => void;
  onStar?: (messageId: string) => void;
  onCancelReply?: () => void;
  /** NEW **/
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

type PosState = { x: number; y: number; w: number; h: number; isMe: boolean };

const ChatBubble = ({
  item,
  isSelected,
  onReply,
  currentlyOpenSwipeable,
  setMessageprops,
  setSelectedMessageId,
  setSelectedMessage,
  allMessages,
  onMediaPress,
  onStar,
}: {
  item: ChatMessage;
  isSelected: boolean;
  onReply?: (message: ChatMessage) => void;
  currentlyOpenSwipeable: React.MutableRefObject<SwipeableRef | null>;
  setMessageprops: React.Dispatch<React.SetStateAction<PosState>>;
  setSelectedMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedMessage: React.Dispatch<React.SetStateAction<ChatMessage | null>>;
  allMessages: ChatMessage[];
  onMediaPress: (
    mediaItems: Array<{
      id: string;
      url: string;
      fileName?: string;
      type?: string;
    }>,
    initialIndex: number
  ) => void;
  onStar: (messageId: string) => void;
}) => {
  const me = item.sender?.id === useAuthStore.getState().userId;
  const swipeableRef = useRef<SwipeableRef | null>(null);
  const bubbleRef = useRef<View>(null);
  const isVcard = item.messageType === "VCARD";

  const { data: userData } = useOtherUserProfile(item.vCardUserId || "");
  const { data: vbcData } = useGetOtherVbcCard(item.vCardUserId || "");

  const mergedUserData = useMemo(() => {
    if (!userData) return undefined;
    return {
      ...userData,
      color: vbcData?.color,
      vbcColor: vbcData?.color,
    };
  }, [userData, vbcData]);

  const saveContact = async (contact: { name: string; phone: string }) => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      try {
        await Contacts.addContactAsync({
          [Contacts.Fields.Name]: contact.name,
          [Contacts.Fields.FirstName]: contact.name,
          [Contacts.Fields.ContactType]: Contacts.ContactTypes.Person,
          [Contacts.Fields.PhoneNumbers]: [
            { label: "mobile", number: contact.phone },
          ],
        });
        Alert.alert("Success", `${contact.name} saved to contacts.`);
      } catch {
        Alert.alert("Error", "Could not save contact.");
      }
    } else {
      Alert.alert(
        "Permission denied",
        "Cannot save without contacts permission."
      );
    }
  };

  const handleSwipeOpen = () => {
    if (
      currentlyOpenSwipeable.current &&
      currentlyOpenSwipeable.current !== swipeableRef.current
    ) {
      currentlyOpenSwipeable.current?.close?.();
    }

    currentlyOpenSwipeable.current = swipeableRef.current;
    onReply?.(item);
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
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <Pressable
                style={styles.addContactButton}
                onPress={() => saveContact(contact)}
              >
                <Text style={styles.addContactText}>Add to contacts</Text>
              </Pressable>
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
      enableTrackpadTwoFingerGesture
      onSwipeableOpen={handleSwipeOpen}
      leftThreshold={0}
      rightThreshold={0}
    >
      <Pressable
        ref={bubbleRef}
        style={[styles.row, me && styles.rowEnd, isSelected && styles.onMenu]}
        onPress={() => {
          bubbleRef.current?.measureInWindow((x, y, width, height) => {
            setMessageprops({ x, y, w: width, h: height, isMe: me });
            setSelectedMessageId((prev) => (prev === item.id ? null : item.id));
            setSelectedMessage((prev) => (prev === item ? null : item));
          });
        }}
      >
        <View
          style={[
            isVcard
              ? styles.vcardWrapper
              : [
                  styles.bubbleWrapper,
                  me ? styles.bubbleMe : styles.bubbleThem,
                ],
          ]}
        >
          <View style={styles.bubbleContent}>
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
                          source={{ uri: parent?.media[0]?.url }}
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
                          {renderTextWithLinks(parent.content || "[message]")}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })()}

            {/* Message body with star */}
            {item.messageType === "IMAGE" &&
            item.media &&
            item.media.length > 0 ? (
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
                  {item.media.map((mediaItem, index) => (
                    <Pressable
                      key={mediaItem.id}
                      onPress={() => onMediaPress(item.media || [], index)}
                    >
                      <Image
                        source={{ uri: mediaItem.url }}
                        style={{ width: 100, height: 100, borderRadius: 10 }}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : item.messageType === "CONTACTS" ? (
              renderContacts()
            ) : item.messageType === "VCARD" ? (
              <VbcChatCard
                vbc={{ ...mergedUserData }}
                viewShareButton
                viewChatButton={
                  mergedUserData?.status && mergedUserData?.status !== "BLOCKED"
                }
                viewBlockButton
              />
            ) : item.messageType === "DOCUMENT" &&
              item.media &&
              item.media.length > 0 ? (
              <View style={{ gap: 6, maxWidth: 220 }}>
                {item.media.map((mediaItem, index) => (
                  <Pressable
                    key={mediaItem.id}
                    onPress={() => onMediaPress(item.media || [], index)}
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
                  <Text style={styles.messageText}>
                    {renderTextWithLinks(item.content)}
                  </Text>
                )}
              </View>
            ) : (
              // TEXT messages (with URL detection & star)
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {renderTextWithLinks(item.content || "")}
                <Pressable
                  onPress={() => onStar(item.id)}
                  style={{ marginLeft: 8, padding: 4 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {item.starred ? "⭐" : " "}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          <View
            style={[
              styles.timeRow,
              { alignSelf: me ? "flex-end" : "flex-start" },
            ]}
          >
            <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default function ChatBody({
  messages: initialMessages,
  onReply,
  onDelete = () => {},
  onStar = () => {},
  onLoadMore,
  hasMore = false,
  loadingMore = false,
}: ChatBodyProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const [messageProps, setMessageprops] = useState<PosState>({
    x: 0,
    y: 0,
    h: 0,
    w: 0,
    isMe: false,
  });
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(
    null
  );
  const [mediaViewerVisible, setMediaViewerVisible] = useState(false);
  const [mediaItems, setMediaItems] = useState<
    Array<{ id: string; url: string; fileName?: string; type?: string }>
  >([]);
  const [mediaInitialIndex, setMediaInitialIndex] = useState(0);

  const currentlyOpenSwipeable = useRef<SwipeableRef | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const endReachedLock = useRef(false);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const isMenuVisible = selectedMessageId !== null;

  // Position offsets for overlay menu
  // Calculate offsets
  const MENU_WIDTH = 220; // whatever your MessageAction width roughly is
  const leftOffset = messageProps.isMe
    ? Math.max(messageProps.x + messageProps.w - MENU_WIDTH, 10)
    : Math.max(messageProps.x, 10);

  const topOffset = Math.max(messageProps.y - 35, 10); // small offset above bubble
  const userId = useAuthStore((state) => state.userId);

  const onAction = (action: string) => {
    if (action === "reply") {
      onReply?.(selectedMessage);
    } else if (action === "star") {
      if (selectedMessage?.id) {
        setMessages((prevMsgs) =>
          prevMsgs.map((msg) =>
            msg.id === selectedMessage.id
              ? { ...msg, starred: !msg.starred }
              : msg
          )
        );
        onStar?.(selectedMessage.id);
      }
    } else if (action === "deleteforme") {
      onDelete?.(selectedMessage?.id || "", "me");
    } else if (action === "deleteforeveryone") {
      onDelete?.(selectedMessage?.id || "", "everyone");
    }
    setSelectedMessageId(null);
  };

  const handleMediaPress = (
    mediaItems: Array<{
      id: string;
      url: string;
      fileName?: string;
      type?: string;
    }>,
    initialIndex: number
  ) => {
    setMediaItems(mediaItems);
    setMediaInitialIndex(initialIndex);
    setMediaViewerVisible(true);
  };

  const handleCloseMediaViewer = () => {
    setMediaViewerVisible(false);
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colourPalette.backgroundPrimary }}
    >
      <View style={{ flex: 1 }}>
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
          isStarred={selectedMessage?.starred ?? false}
          onToggleStar={() => {
            if (!selectedMessage) return;
            setMessages((prevMsgs) =>
              prevMsgs.map((msg) =>
                msg.id === selectedMessage.id
                  ? { ...msg, starred: !msg.starred }
                  : msg
              )
            );
            onStar?.(selectedMessage.id);
          }}
        />

        <MediaViewer
          visible={mediaViewerVisible}
          mediaItems={mediaItems}
          initialIndex={mediaInitialIndex}
          onClose={handleCloseMediaViewer}
        />

        <FlatList
          ref={flatListRef}
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listContent}>
              <ChatBubble
                item={item}
                isSelected={selectedMessageId === item.id}
                onReply={onReply}
                currentlyOpenSwipeable={currentlyOpenSwipeable}
                setMessageprops={setMessageprops}
                setSelectedMessageId={setSelectedMessageId}
                setSelectedMessage={setSelectedMessage}
                allMessages={messages}
                onMediaPress={handleMediaPress}
                onStar={(msgId) => {
                  setMessages((prevMsgs) =>
                    prevMsgs.map((msg) =>
                      msg.id === msgId ? { ...msg, starred: !msg.starred } : msg
                    )
                  );
                  onStar?.(msgId);
                }}
              />
            </View>
          )}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            if (!hasMore || loadingMore || endReachedLock.current) return;
            endReachedLock.current = true;
            onLoadMore?.();
            setTimeout(() => {
              endReachedLock.current = false;
            }, 500);
          }}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 8 }}>
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 9 },

  row: { flexDirection: "row", paddingHorizontal: 8 },
  rowEnd: { justifyContent: "flex-end" },
  onMenu: {
    backgroundColor: "#000",
    opacity: 0.5,
    paddingVertical: 2,
  },

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
    backgroundColor: "#e2e2e2",
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 8,
    maxWidth: "100%",
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

  contactsContainer: { gap: 8 },
  contactCard: {
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
  },
  contactInfo: {
    flexShrink: 1,
    paddingRight: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  contactPhone: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  addContactButton: {
    backgroundColor: "#25D366",
    paddingVertical: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  addContactText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

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

  messageText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter",
    flexShrink: 1,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
  },
  timeText: { fontSize: 10, color: "#4D4D4D" },

  vcardWrapper: {
    // maxWidth: 250,
  },
});
