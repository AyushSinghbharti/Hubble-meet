import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen 
        name="vbc" 
        options={{ title: "VBC" }} 
      />
      <Stack.Screen 
        name="HubbleCircleViewAll" 
        options={{ title: "HubbleCircleViewAll" }} 
      />
    </Stack>
  );
}