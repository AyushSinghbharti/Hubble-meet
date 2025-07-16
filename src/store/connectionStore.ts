import { create } from 'zustand';
import { ConnectionUser } from '../interfaces/connectionInterface';

interface ConnectionStore {
  connections: ConnectionUser[];
  setConnections: (data: ConnectionUser[]) => void;
  clearConnections: () => void;
  addConnection: (user: ConnectionUser) => void;
  removeConnection: (userId: string) => void;
  updateConnectionStatus: (userId: string, status: ConnectionUser['connection_status']) => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connections: [],

  setConnections: (data) => set({ connections: data }),

  clearConnections: () => set({ connections: [] }),

  addConnection: (user) =>
    set((state) => ({
      connections: [...state.connections, user],
    })),

  removeConnection: (userId) =>
    set((state) => ({
      connections: state.connections.filter((conn) => conn.user_id !== userId),
    })),

  updateConnectionStatus: (userId, status) =>
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.user_id === userId ? { ...conn, connection_status: status } : conn
      ),
    })),
}));
