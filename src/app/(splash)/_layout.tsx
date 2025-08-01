import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../../store/auth";
import { useAppState } from "../../store/appState";
import { logout } from "@/src/hooks/useAuth";

export default function StackLayout() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const { isFirstLaunch, isCheckingFirstLaunch } = useAppState();

  // useEffect(() => {
  //   if (isCheckingFirstLaunch) return;

  //   const timeout = setTimeout(() => {
  //     if (token && userId) {
  //       router.replace("/connect");
  //     } else if (isFirstLaunch) {
  //       router.replace("/onboardingScreen");
  //     } else {
  //       logout();
  //       router.replace("/login");
  //     }
  //   }, 3000);

  //   return () => clearTimeout(timeout);
  // }, [token, userId, user, isFirstLaunch, isCheckingFirstLaunch]);
  router.replace("/onboardingScreen");

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="second" />
    </Stack>
  );
}
