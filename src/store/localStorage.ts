import AsyncStorage from "@react-native-async-storage/async-storage";
import { VbcCard } from "../interfaces/vbcInterface";
import { Pitch } from "../interfaces/pitchInterface";
import { Chat, ChatMessage } from "../interfaces/chatInterface";

const keys = {
  token: "@token",
  userId: "@userId",
  user: "@user",
  vbcId: "@vbcId",
  vbc: "@vbc",
  pitchId: "@myPitchId",
  pitch: "@myPitch",
  chat: "@chat",
};

// ---------- Token ----------
export const saveTokenToStorage = async (token: string) => {
  await AsyncStorage.setItem(keys.token, token);
};

export const getTokenFromStorage = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(keys.token);
};

export const removeTokenFromStorage = async () => {
  await AsyncStorage.removeItem(keys.token);
};

// ---------- User ID ----------
export const saveUserIdToStorage = async (userId: string) => {
  await AsyncStorage.setItem(keys.userId, userId);
};

export const getUserIdFromStorage = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(keys.userId);
};

// ---------- User Info ----------
export const saveUserToStorage = async (user: any) => {
  await AsyncStorage.setItem(keys.user, JSON.stringify(user));
};

export const getUserFromStorage = async (): Promise<any | null> => {
  const json = await AsyncStorage.getItem(keys.user);
  return json ? JSON.parse(json) : null;
};

export const removeUserFromStorage = async ({ removeId }: { removeId?: boolean } = {}) => {
  await AsyncStorage.removeItem(keys.user);
  if (removeId) await AsyncStorage.removeItem(keys.userId);
};

// ---------- VBC ID ----------
export const saveVBCIdToStorage = async (VbcId: string) => {
  await AsyncStorage.setItem(keys.vbc, VbcId);
};

export const getVBCIdFromStorage = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(keys.vbcId);
};

// ---------- VBC ----------
export const saveVBCToStorage = async (vbc: VbcCard) => {
  await AsyncStorage.setItem(keys.vbc, JSON.stringify(vbc));
};

export const getVBCFromStorage = async (): Promise<VbcCard | null> => {
  const json = await AsyncStorage.getItem(keys.vbc);
  return json ? JSON.parse(json) : null;
};

export const removeVBCFromStorage = async ({ removeId }: { removeId?: boolean } = {}) => {
  await AsyncStorage.removeItem(keys.vbc);
  if (removeId) await AsyncStorage.removeItem(keys.vbcId);
}

// ---------- Pitch Id Info ----------
export const savePitchIdToStorage = async (pitchId: string) => {
  await AsyncStorage.setItem(keys.pitchId, pitchId);
};

export const getPitchIdFromStorage = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(keys.pitchId);
};

// ---------- Pitch Info ----------
export const savePitchToStorage = async (pitch: Pitch) => {
  await AsyncStorage.setItem(keys.pitch, JSON.stringify(pitch));
};

export const getPitchFromStorage = async (): Promise<Pitch | null> => {
  const json = await AsyncStorage.getItem(keys.pitch);
  return json ? JSON.parse(json) : null;
};

export const removePitchFromStorage = async ({ removeId }: { removeId?: boolean } = {}) => {
  await AsyncStorage.removeItem(keys.pitch);
  if (removeId) await AsyncStorage.removeItem(keys.pitchId);
}



// ---------- Chat Info ----------
export const saveChatToStorage = async (chat: Chat[]) => {
  await AsyncStorage.setItem(keys.chat, JSON.stringify(chat));
};

export const getChatFromStorage = async (): Promise<Chat[] | null> => {
  const json = await AsyncStorage.getItem(keys.chat);
  return json ? JSON.parse(json) : null;
};

export const removeChatFromStorage = async () => {
  await AsyncStorage.removeItem(keys.chat);
};

// ---------- Clear All ----------
export const clearAllAppStorage = async () => {
  await AsyncStorage.multiRemove(Object.values(keys));
};
