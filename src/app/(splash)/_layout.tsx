import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';

export default function StackLayout() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.replace('/onboardingScreen');
    }, 3000)
  })

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen 
        name="second" 
        options={{ title: "Screen One" }} 
      />
      <Stack.Screen 
        name="first" 
        options={{ title: "Screen One" }} 
      />
    </Stack>
  );
}