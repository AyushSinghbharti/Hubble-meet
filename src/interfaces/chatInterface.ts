/* ---------- Basic building-blocks ---------- */

export interface ChatUser {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMedia {
  id: string;
  messageId: string;
  url: string;
  mediaType: MessageType;
  fileName: string;
  mimeType: string;
  createdAt: string;
}

export type MessageType =
  | "TEXT"
  | "IMAGE"
  | "VIDEO"
  | "FILE"
  | "AUDIO"
  | "VCARD" | string; // extend as backend grows

/* ---------- Chat & Message models ---------- */

export interface ChatPreview {
  /** Chat / room ID */
  id: string;
  name: string;
  isGroup: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chat extends ChatPreview {
  /** Full list of participants */
  participants: ChatUser[];
  /** First page of messages (if backend includes them) */
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  content: string;
  messageType: MessageType;
  createdAt: string;
  updatedAt: string;
  sender: ChatUser;
  chat: Chat;
  media?: ChatMedia[];

  /* ----- optional vCard attachment fields (backend sends null when N/A) ----- */
  vCardUserId?: string | null;
  vCardDisplayName?: string | null;
  vCardJobTitle?: string | null;
  vCardCompanyName?: string | null;
  vCardLocation?: string | null;
  vCardIsDeleted?: boolean;
  vCardAllowSharing?: boolean | null;
}

/* ---------- Request payloads ---------- */

export interface CreateChatRequest {
  /** Users who should be in the room (current user assumed server-side) */
  users: Pick<ChatUser, "id" | "username" | "email">[];
  /** Optional display name; ignored for 1-to-1 chats */
  name?: string;
}

export interface SendMessageRequest {
  content: string;
  sender: Pick<ChatUser, "id" | "username" | "email">
  chat: Pick<ChatPreview, "id" | "name" | "isGroup">
  /** Defaults to "TEXT" server-side when omitted */
  messageType?: MessageType | string;
  parentMessageId?: string | null;
}

export interface SendMediaRequest {
  content: string | undefined;
  chat: ChatPreview;
  sender: Pick<ChatUser, "id" | "username" | "email">;
  messageType: MessageType;
  files: File[];
  parentMessageId?: string | null;
}


export interface AddUserToChatRequest {
  chatId: string;
  userId: string;
}

export interface RemoveUserFromChatRequest {
  chatId: string;
  userId: string;
}

export interface DeleteMessageRequest {
  messageId: string;
}

/* ---------- Convenience response aliases ---------- */

export type CreateChatResponse = Chat;
export type GetChatByIdResponse = Chat;
export type GetUserChatsResponse = ChatPreview[];
export type SendMessageResponse = ChatMessage;
export type GetChatMessagesResponse = ChatMessage[];
export type AddUserToChatResponse = Chat;
export type RemoveUserFromChatResponse = Chat;
export type DeleteMessageResponse = { success: boolean; id: string };
