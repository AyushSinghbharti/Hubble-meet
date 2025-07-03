import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';

export default function StackLayout() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (token) {
        router.replace('/tabs');
      } else {
        router.replace('/onboardingScreen');
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="second">
      <Stack.Screen name="index" options={{ title: 'First Screen' }} />
      <Stack.Screen name="second" options={{ title: 'Second Screen' }} />
    </Stack>
  );
}
