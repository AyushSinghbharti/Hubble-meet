import { create } from 'zustand';
import { Pitch } from '../interfaces/pitchInterface';

interface PitchState {
  // pitch object
  pitch: Pitch | null;
  setPitch: (data: Pitch) => void;
  clearPitch: () => void;

  // pitch ID separately
  pitchId: string | null;
  setPitchId: (id: string) => void;
  clearPitchId: () => void;
}

export const usePitchStore = create<PitchState>((set) => ({
  // pitch object state
  pitch: null,
  setPitch: (data) => set({ pitch: data }),
  clearPitch: () => set({ pitch: null }),

  // pitch ID state
  pitchId: null,
  setPitchId: (id) => set({ pitchId: id }),
  clearPitchId: () => set({ pitchId: null }),
}));
