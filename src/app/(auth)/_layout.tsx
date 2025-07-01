import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function StackLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboardingScreen" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="otpVerify" />
        <Stack.Screen name="profileSetup" />
      </Stack>
    </>
  );
}
