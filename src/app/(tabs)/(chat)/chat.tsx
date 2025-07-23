import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import PopUpOption from "../../../components/chatScreenComps/popUpOption";
import { useStarredMessages, useUserChats } from "@/src/hooks/useChat";
import { useAuthStore } from "@/src/store/auth";
import { Chat } from "@/src/interfaces/chatInterface";
import { useOtherUserProfile } from "@/src/hooks/useProfile";
import { useChatStore } from "@/src/store/chatStore";
import { getChatFromStorage } from "@/src/store/localStorage";
import { useDeleteChat } from "@/src/hooks/useChat";

export default function ChatScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showdeleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[] | null>(null);

  const lastViewedMap = useChatStore((state) => state.lastViewedMap);
  const updatedChats = useChatStore((state) => state.chat);
  const currentChat = useChatStore((state) => state.currentChat);
  const clearCurrentChat = useChatStore((state) => state.currentChat);
  const setMessages = useChatStore((state) => state.setMessages);
  const deleteChatMutation = useDeleteChat();
  console.log(user?.user_id);

  //LoadStarred message
  useStarredMessages(user?.user_id || "");

  useEffect(() => {
    clearCurrentChat;
  }, [currentChat]);

  // Load chats from localStorage on initial render
  useEffect(() => {
    const loadChatsFromStorage = async () => {
      const localChats = await getChatFromStorage();
      setChats(localChats);
    };
    loadChatsFromStorage();
  }, []);

  // Update chats when store updates
  useEffect(() => {
    setChats(updatedChats);
  }, [updatedChats]);

  useUserChats(user?.user_id);

  const SwipeActionBar = () => {
    return (
      <View style={styles.swipeActionBar}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowBlockModal(!showBlockModal)}
        >
          <Image
            source={require("../../../../assets/icons/block.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setDeleteModal(!showdeleteModal)}
        >
          <Image
            source={require("../../../../assets/icons/delete.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderCard = ({ item }: { item: Chat }) => {
    const swipeRowRef = useRef<SwipeableMethods | null>(null);
    const lastMsg = item.messages?.[item.messages.length - 1];
    if (!lastMsg) return;

    let lastMessageText = "No messages yet";

    if (lastMsg) {
      if (lastMsg.content && lastMsg.messageType !== "CONTACTS") {
        lastMessageText = lastMsg.content;
      } else if (lastMsg.messageType === "IMAGE") {
        lastMessageText = "📷 Photo";
      } else if (lastMsg.messageType === "VIDEO") {
        lastMessageText = "🎥 Video";
      } else if (lastMsg.messageType === "VCARD") {
        lastMessageText = "📇 VCard shared";
      } else if (lastMsg.messageType === "CONTACTS") {
        lastMessageText = "📞 Contact shared";
      } else if (
        lastMsg.messageType === "DOCUMENT" ||
        lastMsg.messageType === "FILE"
      ) {
        lastMessageText = "📄 Document";
      } else {
        lastMessageText = "New message";
      }
    }

    const messageTime = lastMsg
      ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    // Get last viewed time
    const lastViewed = lastViewedMap[item.id]
      ? new Date(lastViewedMap[item.id])
      : null;

    // Check if latest message is unread
    const isUnread =
      lastMsg &&
      lastMsg.sender?.id !== user?.user_id &&
      (!lastViewed || new Date(lastMsg.createdAt) > lastViewed);

    const otherUser = item.participants.find((p) => p.id !== user?.user_id);
    const result = useOtherUserProfile(otherUser?.id);
    const otherUserInfo = result.data;

    return (
      <Swipeable
        ref={swipeRowRef}
        renderRightActions={() => <SwipeActionBar />}
        overshootRight={false}
        friction={2}
        enableTrackpadTwoFingerGesture={true}
        onSwipeableOpen={() => setSelectedUser(item)}
      >
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() =>
            router.push({
              pathname: `chatStack/${item.id}`,
              params: { item: JSON.stringify(otherUserInfo) },
            })
          }
        >
          <View style={styles.leftSection}>
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri:
                    otherUserInfo?.profile_picture_url ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s",
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.chatText}>
              <Text style={styles.name}>{otherUserInfo?.full_name}</Text>
              <Text style={styles.message}>{lastMessageText}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.time}>{messageTime}</Text>
            {isUnread && <View style={styles.greenDot} />}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>

      {/* Search Bar */}
      <View style={styles.searchBarHolder}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="#94A3B8"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            placeholder="Search Chats"
            placeholderTextColor="#b8b6f6"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/chatStack/connection")}
        >
          <Ionicons name="add" size={24} />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={(chats || []).slice().sort((a, b) => {
          const aLastMsg = a.messages?.[a.messages.length - 1];
          const bLastMsg = b.messages?.[b.messages.length - 1];

          const aTime = aLastMsg ? new Date(aLastMsg.createdAt).getTime() : 0;
          const bTime = bLastMsg ? new Date(bLastMsg.createdAt).getTime() : 0;

          return bTime - aTime;
        })}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => <RenderCard item={item} />}
      />

      {/* Modals */}
      <PopUpOption
        visible={showBlockModal}
        onClose={() => setShowBlockModal(!showBlockModal)}
        onSelect={() => {
          setShowBlockModal(!showBlockModal);
          alert("User Blocked");
        }}
        message={`Block ${selectedUser?.name}`}
        description={
          "Blocked contacts cannot send you message.This contact will not be notified"
        }
        acceptButtonName={"Block"}
        cancelButtonName={"Cancel"}
      />
      <PopUpOption
        visible={showdeleteModal}
        onClose={() => setDeleteModal(false)}
        onSelect={() => {
          if (!selectedUser || !user?.user_id) return;
          deleteChatMutation.mutate(
            {
              chatId: selectedUser.id,
              userId: user.user_id,
            },
            {
              onSuccess: () => {
                setDeleteModal(false);
                setSelectedUser(null);
              },
              onError: (err) => {
                console.error("Chat delete failed:", err);
              },
            }
          );
        }}
        message={`Delete chat?`}
        description={
          "Also delete media received in this chat from the device gallery"
        }
        acceptButtonName={"Clear Chat"}
        cancelButtonName={"Cancel"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F7F7F7" },
  header: {
    marginTop: 32,
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 8,
  },
  searchBarHolder: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dcdff1",
    borderRadius: 30,
    gap: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#A5B4FC",
  },
  addButton: {
    backgroundColor: "#c5db98",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chatCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,

    minHeight: 72,
  },
  leftSection: { flexDirection: "row", alignItems: "center" },
  imageWrapper: {
    marginRight: 12,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#F0E5FF",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: "#5DC72F",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatText: {},
  name: {
    fontFamily: "InterBold",
    fontSize: 16,
  },
  message: {
    color: "#8E8E8E",
    fontFamily: "Inter",
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  time: {
    color: "#8E8E8E",
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "Inter",
  },
  greenDot: {
    backgroundColor: "#BBCF8D",
    aspectRatio: 1,
    borderRadius: 12,
    height: 10,
  },
  badge: {
    backgroundColor: "#BBCF8D",
    fontFamily: "Inter",
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  //Icon
  swipeActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    // Match height and spacing exactly with chatCard
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginVertical: 6,
    paddingRight: 12,
    minHeight: 72,
    // minWidth: 100,
    minWidth: "40%",
  },

  actionBtn: {
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
