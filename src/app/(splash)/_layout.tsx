import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
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