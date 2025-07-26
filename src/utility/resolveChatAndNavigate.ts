// utils/resolveChatAndNavigate.ts

import { router } from "expo-router";
import { getUserChats, createChat, sendMessage } from "../api/chat";
import { Chat, CreateChatRequest } from "../interfaces/chatInterface";
import { UserProfile } from "../interfaces/profileInterface";
import { fetchUserProfile } from "../api/profile"; // use the direct API version, not hook

/**
 * Navigates to an existing chat if it exists.
 * Otherwise, creates a new one with the given user and navigates to it.
 * Optionally sends a message after resolution.
 */

export interface VbcDataProp {
  id: string;
  DisplayName: string;
  Title: string;
  CompanyName: string;
  Location: string;
  IsDeleted: boolean;
  AllowSharing: boolean | null;
}


export const resolveChatAndNavigate = async ({
  currentUser,
  targetUser,
  isRoutingEnable = true,
  initialMessage,
  messageType = "TEXT",
  vbcData,
}: {
  currentUser: UserProfile;
  targetUser: UserProfile;
  isRoutingEnable?: boolean;
  initialMessage?: string;
  messageType?: "VCARD" | "TEXT" | "IMAGE" | "DOCUMENT";
  vbcData?: VbcDataProp;
}) => {
  let targetUserEmail = targetUser.email;

  if (!targetUserEmail) {
    try {
      const result = await fetchUserProfile(targetUser.user_id);
      targetUserEmail = result?.email ?? "";
    } catch (error) {
      console.error("❌ Error fetching target user profile:", error);
      return;
    }
  }

  try {
    const chats: Chat[] = await getUserChats(currentUser.user_id);
    // Declare chat object
    let resolvedChat: Chat | undefined = chats.find((chat) => {
      if (chat.isGroup) return false;
      return chat.participants.some((p) => p.id === targetUser.user_id);
    });

    // If not found, create it
    if (!resolvedChat) {
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

      resolvedChat = await createChat(requestBody);
    }

    // Navigate if required
    if (isRoutingEnable && resolvedChat) {
      router.push({
        pathname: `/chatStack/${resolvedChat.id}`,
        params: { item: JSON.stringify(targetUser) },
      });
    }

    // Send message if provided
    //Pass intitial as a object payload noww 
    if (initialMessage && resolvedChat) {
      const payload = {
        content: initialMessage,
        messageType: messageType,
        sender: {
          id: currentUser.user_id,
          username: currentUser.full_name,
          email: currentUser.email,
        },
        chat: {
          id: resolvedChat.id,
          name: resolvedChat.name || "",
          isGroup: resolvedChat.isGroup,
          participants: resolvedChat.participants || [],
        },

        //Passing VBC data
        vCardData: {
          userId: vbcData?.id || undefined,
          displayName: vbcData?.DisplayName || undefined,
          jobTitle: vbcData?.Title || undefined,
          companyName: vbcData?.CompanyName || undefined,
          location: vbcData?.Location || undefined,
          allowSharing: vbcData?.AllowSharing || undefined,
        },
      };

      try {
        await sendMessage(payload);
        console.log("✅ Initial message sent.");
      } catch (error) {
        console.error("❌ Failed to send message:", error);
      }
    }
  } catch (error) {
    console.error("❌ Error resolving or creating chat:", error);
  }
};