import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function StackLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="connect" options={{ title: "Connect" }} />
        <Stack.Screen name="notification" options={{ title: "notification" }} />
      </Stack>
    </>
  );
}
