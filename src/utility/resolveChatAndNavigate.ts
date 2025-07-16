// utils/resolveChatAndNavigate.ts

import { router } from "expo-router";
import { getUserChats, createChat } from "../api/chat";
import { Chat, CreateChatRequest } from "../interfaces/chatInterface";
import { UserProfile } from "../interfaces/profileInterface";

/**
 * Navigates to an existing chat if it exists.
 * Otherwise, creates a new one with the given user and navigates to it.
 */
export const resolveChatAndNavigate = async ({
  currentUser,
  targetUser,
}: {
  currentUser: UserProfile;
  targetUser: UserProfile; // same as ChatUser in structure
}) => {
  try {
    // ✅ Step 1: Fetch current user's chats
    const chats: Chat[] = await getUserChats(currentUser.user_id);

    // ✅ Step 2: Look for an existing 1-to-1 chat
    const existingChat = chats.find((chat) => {
      if (chat.isGroup) return false; // only 1-to-1
      return chat.participants.some((p) => p.id === targetUser.user_id);
    });

    if (existingChat) {
      // ✅ Navigate to the existing chat
      router.push({
        pathname: `/chatStack/${existingChat.id}`,
        params: { item: JSON.stringify(targetUser) },
      });
      return;
    }

    // ✅ Step 3: Create new chat if not found
    const requestBody: CreateChatRequest = {
      users: [
        {
          id: currentUser.user_id,
          username: currentUser.full_name,
          email: currentUser.email,
        },
        {
          id: targetUser.user_id,
          username: targetUser.full_name,
          email: targetUser.email,
        },
      ],
    };

    const newChat: Chat = await createChat(requestBody);

    router.push({
      pathname: `/chatStack/${newChat.id}`,
      params: { item: JSON.stringify(targetUser) },
    });
  } catch (error) {
    console.error("❌ Error resolving or creating chat:", error);
  }
};
