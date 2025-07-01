import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{headerShown: false, contentStyle: {paddingBottom: 85}}}>
      <Stack.Screen 
        name="profile" 
        options={{ title: "Profile" }} 
      />
      <Stack.Screen 
        name="Setting" 
        options={{ title: "Setting" }} 
      />
      <Stack.Screen 
        name="Profile1" 
        options={{ title: "profile" }} 
      />
      <Stack.Screen 
        name="Account" 
        options={{ title: "Account" }} 
      />
      <Stack.Screen 
        name="Permissions" 
        options={{ title: "Permissions" }} 
      />
      <Stack.Screen 
        name="Notifications" 
        options={{ title: "Notifications" }} 
      />
      <Stack.Screen 
        name="SecurityandPrivacy" 
        options={{ title: "SecurityandPrivacy" }} 
      />
      <Stack.Screen 
        name="SupportHelp" 
        options={{ title: "SupportandHelp" }} 
      />
      <Stack.Screen 
        name="Logoutaccount" 
        options={{ title: "Logoutaccount" }} 
      />
    </Stack>
  );
}