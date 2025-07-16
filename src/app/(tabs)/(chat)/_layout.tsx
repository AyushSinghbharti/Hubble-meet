import React, { useEffect } from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen 
        name="chat" 
        options={{ title: "Screen One" }} 
      />
      {/* <Stack.Screen
        name="listing/[id]"
        options={{
          headerTransparent: true,
          headerTitle: "",
        }}
      /> */}
    </Stack>
  );
}