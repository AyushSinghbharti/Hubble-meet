// /src/store/appState.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingSlice {
  isFirstLaunch: boolean | null;
  isCheckingFirstLaunch: boolean;
  checkFirstLaunch: () => Promise<void>;
  setIsFirstLaunch: (value: boolean) => void;
}

interface ProfileSlice {
  isProfileComplete: boolean;
  setProfileComplete: (value: boolean) => void;
}

type AppState = OnboardingSlice & ProfileSlice;

export const useAppState = create<AppState>((set) => ({
  isFirstLaunch: null,
  isCheckingFirstLaunch: true,

  checkFirstLaunch: async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        set({ isFirstLaunch: true });
      } else {
        set({ isFirstLaunch: false });
      }
    } catch (e) {
      console.error("Error checking first launch", e);
      set({ isFirstLaunch: false });
    } finally {
      set({ isCheckingFirstLaunch: false });
    }
  },

  setIsFirstLaunch: (value) => set({ isFirstLaunch: value }),

  // Profile Slice
  isProfileComplete: false,
  setProfileComplete: (value: boolean) => set({ isProfileComplete: value }),
}));
