import { create } from 'zustand';
import { VbcCard } from '../interfaces/vbcInterface';

type VbcState = {
  vbcId: string | null;
  vbc: VbcCard | null;

  setVbcId: (id: string) => void;
  setVbc: (card: VbcCard) => void;
  clearVbc: () => void;
};

export const useVbcStore = create<VbcState>((set) => ({
  vbcId: null,
  vbc: null,

  setVbcId: (id) => set({ vbcId: id }),
  setVbc: (card) => set({ vbc: card }),
  clearVbc: () => set({ vbc: null, vbcId: null }),
}));