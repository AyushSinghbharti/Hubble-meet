// store/pitchStore.ts
import { create } from 'zustand';
import { Pitch } from '../interfaces/pitchInterface';
import { UserProfile } from '../interfaces/profileInterface';

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
}));