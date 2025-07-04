import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../../store/auth";
import { useAppState } from "../../store/appState";

export default function StackLayout() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { isFirstLaunch, isCheckingFirstLaunch } = useAppState();

  useEffect(() => {
    if (isCheckingFirstLaunch) return;

    const timeout = setTimeout(() => {
      if (token) {
        router.replace("/connect");
      } else if (isFirstLaunch) {
        router.replace("/onboardingScreen");
      } else {
        router.replace("/login");
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [token, isFirstLaunch, isCheckingFirstLaunch]);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="second">
      <Stack.Screen name="index" options={{ title: "First Screen" }} />
      <Stack.Screen name="second" options={{ title: "Second Screen" }} />
    </Stack>
  );
}
