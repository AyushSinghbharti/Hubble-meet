import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function StackLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <StatusBar style="light" />
      <Stack.Screen 
        name="connect" 
        options={{ title: "Connect" }} 
      />
      <Stack.Screen 
        name="notification" 
        options={{ title: "notification" }} 
      />
    </Stack>
  );
}