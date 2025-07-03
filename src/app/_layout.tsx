import "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../store/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../../assets/fonts/Interfont/Inter-VariableFont.ttf"),
    InterSemiBold: require("../../assets/fonts/Interfont/static/Inter_18pt-SemiBold.ttf"),
    InterMedium: require("../../assets/fonts/Interfont/static/Inter_18pt-Medium.ttf"),
    InterMediumItalic: require("../../assets/fonts/Interfont/static/Inter_18pt-MediumItalic.ttf"),
    InterBold: require("../../assets/fonts/Interfont/static/Inter_18pt-Bold.ttf"),
    InterItalicBold: require("../../assets/fonts/Interfont/static/Inter_18pt-BoldItalic.ttf"),
    InterItalic: require("../../assets/fonts/Interfont/Inter-Italic-VariableFont.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const setToken = useAuthStore((state) => state.setToken);
  const [ready, setReady] = useState(false);

  // Load token from AsyncStorage once
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        console.log(token);
        if (token) {
          setToken(token);
        }
      } catch (err) {
        console.warn("Failed to load token:", err);
      } finally {
        setReady(true);
      }
    };
    loadToken();
  }, []);

  if (!ready) return null;

  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        {/* <Stack initialRouteName="(splash)"> */}
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(splash)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(subScreen)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
