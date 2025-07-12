import { create } from 'zustand';
import { Pitch } from '../interfaces/pitchInterface';

interface PitchState {
  pitches: Pitch[];
  setPitches: (list: Pitch[]) => void;
  addPitch: (p: Pitch) => void;
  updatePitch: (p: Pitch) => void;
  clearPitches: () => void;
}

export const usePitchStore = create<PitchState>((set) => ({
  pitches: [],
  setPitches: (list) => set({ pitches: list }),
  addPitch: (p) => set((state) => ({ pitches: [p, ...state.pitches] })),
  updatePitch: (p) =>
    set((state) => ({
      pitches: state.pitches.map((x) => (x.id === p.id ? p : x)),
    })),
  clearPitches: () => set({ pitches: [] }),
}));