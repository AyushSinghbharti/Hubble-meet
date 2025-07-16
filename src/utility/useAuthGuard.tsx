import { useRouter } from "expo-router";
import { useEffect } from "react";
import { getUserIdFromStorage } from "../store/localStorage";
import { logout } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth"; // Zustand

export const useAuthGuard = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      const storedId = await getUserIdFromStorage();
      if (!storedId || !user) {
        console.log("Logging out from useAuthGuard()");
        logout();
        router.replace("/login");
      }
    };
    checkAuth();
  }, [user]);
};
