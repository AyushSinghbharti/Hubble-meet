import { create } from 'zustand';
import { ConnectionUser, ConnectionRequest } from '../interfaces/connectionInterface';

interface ConnectionStore {
  // Connections
  connections: ConnectionUser[];
  setConnections: (data: ConnectionUser[]) => void;
  clearConnections: () => void;
  addConnection: (user: ConnectionUser) => void;
  removeConnection: (userId: string) => void;
  updateConnectionStatus: (userId: string, status: ConnectionUser['connection_status']) => void;

  // Recommendations
  recommendations: ConnectionUser[];
  setRecommendations: (data: ConnectionUser[]) => void;
  clearRecommendations: () => void;
  removeRecommendation: (userId: string) => void;
  addRecommendation: (user: ConnectionUser) => void;
  updateRecommendationStatus: (userId: string, status: ConnectionUser['connection_status']) => void;

  // Requests
  requests: ConnectionRequest[];
  setRequests: (requests: ConnectionRequest[]) => void;
  addRequest: (request: ConnectionRequest) => void;
  removeRequest: (id: string) => void;
  clearRequests: () => void;
  requestCount: number;

  // Sent Requests
  sentRequests: ConnectionRequest[];
  setSentRequests: (requests: ConnectionRequest[]) => void;
  addSentRequest: (request: ConnectionRequest) => void;
  removeSentRequest: (id: string) => void;
  clearSentRequests: () => void;
  sentRequestCount: number;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  // Connections
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

  // Recommendations
  recommendations: [],
  setRecommendations: (data) => set({ recommendations: data }),
  clearRecommendations: () => set({ recommendations: [] }),
  removeRecommendation: (userId) =>
    set((state) => ({
      recommendations: state.recommendations.filter((rec) => rec.user_id !== userId),
    })),
  addRecommendation: (user) =>
    set((state) => ({
      recommendations: [...state.recommendations, user],
    })),
  updateRecommendationStatus: (userId, status) =>
    set((state) => ({
      recommendations: state.recommendations.map((rec) =>
        rec.user_id === userId ? { ...rec, connection_status: status } : rec
      ),
    })),

  // Requests
  requests: [],
  requestCount: 0,
  setRequests: (requests) =>
    set({
      requests,
      requestCount: requests.filter((r) => r.request_status === 'RECEIVED').length,
    }),
  addRequest: (request) =>
    set((state) => {
      const updated = [request, ...state.requests];
      return {
        requests: updated,
        requestCount: updated.filter((r) => r.request_status === 'RECEIVED').length,
      };
    }),
  removeRequest: (id) =>
    set((state) => {
      const updated = state.requests.filter((r) => r.user_id !== id);
      return {
        requests: updated,
        requestCount: updated.filter((r) => r.request_status === 'RECEIVED').length,
      };
    }),
  clearRequests: () => set({ requests: [], requestCount: 0 }),

  // Sent Requests
  sentRequests: [],
  sentRequestCount: 0,
  setSentRequests: (requests) =>
    set({
      sentRequests: requests,
      sentRequestCount: requests.length,
    }),
  addSentRequest: (request) =>
    set((state) => ({
      sentRequests: [request, ...state.sentRequests],
      sentRequestCount: state.sentRequestCount + 1,
    })),
  removeSentRequest: (id) =>
    set((state) => {
      const updated = state.sentRequests.filter((r) => r.user_id !== id);
      return {
        sentRequests: updated,
        sentRequestCount: updated.length,
      };
    }),
  clearSentRequests: () => set({ sentRequests: [], sentRequestCount: 0 }),
}));