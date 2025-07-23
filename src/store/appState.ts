import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  swipeCount: number;
  swipedProfileIds: string[];
  isProfileComplete: boolean;
  hasShownProfilePrompt: boolean;

  incrementSwipeCount: () => Promise<number>;
  addSwipedProfileId: (id: string) => Promise<void>;
  setProfileComplete: (complete: boolean) => void;
  setProfilePromptShown: (shown: boolean) => void;
  initializeAppState: () => Promise<void>;
  resetSwipeData: () => Promise<void>;
}

export const useAppState = create<AppState>((set, get) => ({
  swipeCount: 0,
  swipedProfileIds: [],
  isProfileComplete: false,
  hasShownProfilePrompt: false,

  incrementSwipeCount: async () => {
    const currentCount = get().swipeCount;
    const newCount = currentCount + 1;
    set({ swipeCount: newCount });
    await AsyncStorage.setItem("swipeCount", newCount.toString());
    return newCount;
  },

  addSwipedProfileId: async (id: string) => {
    const currentIds = get().swipedProfileIds;
    if (!currentIds.includes(id)) {
      const newIds = [...currentIds, id];
      set({ swipedProfileIds: newIds });
      await AsyncStorage.setItem("swipedProfileIds", JSON.stringify(newIds));
    }
  },

  setProfileComplete: (complete: boolean) => {
    set({ isProfileComplete: complete });
    AsyncStorage.setItem("isProfileComplete", complete ? "true" : "false");
  },

  setProfilePromptShown: (shown: boolean) => {
    set({ hasShownProfilePrompt: shown });
    AsyncStorage.setItem("hasShownProfilePrompt", shown ? "true" : "false");
  },

  initializeAppState: async () => {
    try {
      const swipeCountStr = await AsyncStorage.getItem("swipeCount");
      const swipedIdsStr = await AsyncStorage.getItem("swipedProfileIds");
      const isProfileCompleteStr = await AsyncStorage.getItem("isProfileComplete");
      const hasShownProfilePromptStr = await AsyncStorage.getItem("hasShownProfilePrompt");

      set({
        swipeCount: swipeCountStr ? parseInt(swipeCountStr) : 0,
        swipedProfileIds: swipedIdsStr ? JSON.parse(swipedIdsStr) : [],
        isProfileComplete: isProfileCompleteStr === "true",
        hasShownProfilePrompt: hasShownProfilePromptStr === "true",
      });
    } catch (error) {
      console.error("Failed to initialize app state", error);
    }
  },

  resetSwipeData: async () => {
    set({ swipeCount: 0, swipedProfileIds: [] });
    await AsyncStorage.removeItem("swipeCount");
    await AsyncStorage.removeItem("swipedProfileIds");
  },
}));
