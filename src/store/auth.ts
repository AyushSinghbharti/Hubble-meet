import { create } from 'zustand';
import {UserProfile} from '../interfaces/profileInterface';

type AuthState = {
    //Token and related function
    token: string | null;
    setToken: (token: string | null) => void;
    clearToken: () => void;

    //user info
    userId: string | null;
    user: UserProfile | null;
    setUserId: (id: string) => void;
    setUser: (data: any) => void;
    resetUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,

    setToken: (token) => set({ token }),

    clearToken: () => {
        set({ token: null });
    },
    
    userId: null,
    user: null,
    setUserId: (id) => set({ userId: id }),
    setUser: (data: any) => set({ user: data }),
    resetUser: () => {
        set({ userId: null, user: null });
    },
}));
