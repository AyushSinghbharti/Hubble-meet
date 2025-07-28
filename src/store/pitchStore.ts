// store/pitchStore.ts
import { create } from "zustand";
import { Pitch } from "../interfaces/pitchInterface";
import { UserProfile } from "../interfaces/profileInterface";

interface PitchState {
  pitch: Pitch | null;
  setPitch: (data: Pitch) => void;
  clearPitch: () => void;

  pitchId: string | null;
  setPitchId: (id: string) => void;
  clearPitchId: () => void;

  currentPitchUser: UserProfile | null;
  setCurrentPitchUser: (user: UserProfile) => void;
  clearCurrentPitchUser: () => void;

  // Add this for focus user id used in PitchScreen
  focusUserId: string | null;
  setFocusUserId: (id: string | null) => void;
  clearFocusUserId: () => void;
}

export const usePitchStore = create<PitchState>((set) => ({
  pitch: null,
  setPitch: (data) => set({ pitch: data }),
  clearPitch: () => set({ pitch: null }),

  pitchId: null,
  setPitchId: (id) => set({ pitchId: id }),
  clearPitchId: () => set({ pitchId: null }),

  currentPitchUser: null,
  setCurrentPitchUser: (user) => set({ currentPitchUser: user }),
  clearCurrentPitchUser: () => set({ currentPitchUser: null }),

  focusUserId: null,               // initialize focusUserId as null
  setFocusUserId: (id) => set({ focusUserId: id }),  // setter
  clearFocusUserId: () => set({ focusUserId: null }), // clearer
}));
