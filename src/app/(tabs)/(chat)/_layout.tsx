import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function StackLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <StatusBar style="light" />
      <Stack.Screen 
        name="chat" 
        options={{ title: "Screen One" }} 
      />
    </Stack>
  );
}