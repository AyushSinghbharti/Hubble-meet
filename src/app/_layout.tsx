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
import { useAppState } from "../store/appState";
import {
  getExpoPushToken,
  getFirebaseToken,
  initializeFirebaseMessaging,
  requestNotificationPermission,
} from "../api/notification";
import * as WebBrowser from "expo-web-browser";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getTokenFromStorage,
  getUserIdFromStorage,
} from "../store/localStorage";
import FlashMessage from "react-native-flash-message";

//Global runners
WebBrowser.maybeCompleteAuthSession();
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENTID,
  scopes: ["profile", "email"],
});

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
    
    MontserratRegular: require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    MontserratSemiBold: require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    MontserratBold: require("../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    MontserratMedium: require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    MontserratItalic: require("../../assets/fonts/Montserrat/static/Montserrat-BlackItalic.ttf"),
    MontserratItalicMedium: require("../../assets/fonts/Montserrat/static/Montserrat-MediumItalic.ttf"),
    MontserratItalicSemiBold: require("../../assets/fonts/Montserrat/static/Montserrat-SemiBoldItalic.ttf"),
    MontserratItalicBold: require("../../assets/fonts/Montserrat/static/Montserrat-BoldItalic.ttf"),
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
  const setUserId = useAuthStore((state) => state.setUserId);
  const checkFirstLaunch = useAppState((state) => state.checkFirstLaunch);
  const [ready, setReady] = useState(false);

  // Notification Logic
  useEffect(() => {
    const fixNotification = async () => {
      requestNotificationPermission();
      initializeFirebaseMessaging();
    };

    fixNotification();
  }, []);

  // Load token from AsyncStorage once
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = await getTokenFromStorage();
        const userId = await getUserIdFromStorage();
        if (token) {
          setToken(token);
        }
        if (userId) {
          setUserId(userId);
        }
        await checkFirstLaunch();
      } catch (err) {
        console.warn("Failed to load token or first launch state:", err);
      } finally {
        setReady(true);
      }
    };

    loadInitialData();
  }, []);

  if (!ready) return null;

  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#121212" }}>
        <StatusBar style="dark" />
        <Stack
          initialRouteName="(splash)"
          screenOptions={{
            contentStyle: { backgroundColor: "#121212" },
          }}
        >
          <Stack.Screen name="(splash)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(subScreen)" options={{ headerShown: false }} />
        </Stack>
        {/* In-app notification banner */}
        <FlashMessage
          position="top"
          floating
          autoHide
          duration={4000}
          style={{ marginTop: 50, borderRadius: 8 }}
          titleStyle={{ fontWeight: "600" }}
        />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
