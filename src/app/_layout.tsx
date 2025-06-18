import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../../assets/fonts/Interfont/Inter-VariableFont.ttf"),
    InterSemiBold: require("../../assets/fonts/Interfont/static/Inter_18pt-SemiBold.ttf"),
    InterBold: require("../../assets/fonts/Interfont/static/Inter_18pt-Bold.ttf"),
    InterItalicBold: require("../../assets/fonts/Interfont/static/Inter_18pt-BoldItalic.ttf"),
    InterItalic: require("../../assets/fonts/Interfont/Inter-Italic-VariableFont.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(splash)" options={{ headerShown: false }} />
        
        {/* For extra screens, that will be render outside of the tab bars */}
        <Stack.Screen name="(subScreen)" options={{ headerShown: false }} /> 
      </Stack>
    </>
  );
}
