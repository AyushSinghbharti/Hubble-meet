// utils/resolveChatAndNavigate.ts

import { router } from "expo-router";
import { getUserChats, createChat } from "../api/chat";
import { Chat, CreateChatRequest } from "../interfaces/chatInterface";
import { UserProfile } from "../interfaces/profileInterface";
import { fetchUserProfile } from "../api/profile"; // use the direct API version, not hook

/**
 * Navigates to an existing chat if it exists.
 * Otherwise, creates a new one with the given user and navigates to it.
 */
export const resolveChatAndNavigate = async ({
  currentUser,
  targetUser,
}: {
  currentUser: UserProfile;
  targetUser: UserProfile;
}) => {
  console.log("currentUser", currentUser.user_id, currentUser.full_name, currentUser.email);
  console.log("targetUser", targetUser.user_id, targetUser.full_name, targetUser.email);

  // ✅ Step 0: Ensure we have targetUser's email
  let targetUserEmail = targetUser.email;
  if (!targetUserEmail) {
    try {
      const result = await fetchUserProfile(targetUser.user_id); // not the hook
      targetUserEmail = result?.email ?? "";
      console.log("Fetched targetUser email:", targetUserEmail);
    } catch (error) {
      console.error("❌ Error fetching target user profile:", error);
    }
  }

  try {
    // ✅ Step 1: Fetch current user's chats
    const chats: Chat[] = await getUserChats(currentUser.user_id);

    // ✅ Step 2: Look for existing 1-to-1 chat
    const existingChat = chats.find((chat) => {
      if (chat.isGroup) return false;
      return chat.participants.some((p) => p.id === targetUser.user_id);
    });

    if (existingChat) {
      router.push({
        pathname: `/chatStack/${existingChat.id}`,
        params: { item: JSON.stringify(targetUser) },
      });
      return;
    }

    // ✅ Step 3: Create new chat
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
          email: targetUserEmail,
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
