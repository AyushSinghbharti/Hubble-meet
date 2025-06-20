import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';

export default function StackLayout() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/onboardingScreen'); // 👈 Make sure this route exists
    }, 3000);

    return () => clearTimeout(timeout); // ✅ Clean up
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="first" options={{ title: "First Screen" }} />
      <Stack.Screen name="second" options={{ title: "Second Screen" }} />
      <Stack.Screen name="onboardingScreen" options={{ title: "Onboarding" }} /> {/* ✅ Add this */}
    </Stack>
  );
}
