// src/hooks/useInAppNotify.ts
import { showMessage } from "react-native-flash-message";
import { usePathname } from "expo-router";
import { useAuthStore } from "../store/auth";

const EXCLUDED_PATHS = ["/login", "/onboarding"];

export function useInAppNotify() {
    const user = useAuthStore((s) => s.user);
    const path = usePathname();

    return (title: string, description?: string, type: "info" | "success" | "warning" | "danger" = "info") => {
        if (!user) return;
        if (EXCLUDED_PATHS.includes(path)) return;
        showMessage({
            message: title,
            description,
            type,
            icon: "auto",
            hideOnPress: true,
        });
    };
}
