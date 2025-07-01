import 'react-native-gesture-handler';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from 'react-native-paper';

export { ErrorBoundary } from "expo-router";

// export const unstable_settings = {
//   initialRouteName: "(splash)",
// };

export default function RootLayout() {
  const [loaded, error] = useFonts({
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
      <PaperProvider>
        <GestureHandlerRootView>
          <StatusBar style="dark" />
          <Stack initialRouteName='(splash)'>
            <Stack.Screen name="(splash)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(subScreen)" options={{ headerShown: false }} />

          </Stack>

        </GestureHandlerRootView>

      </PaperProvider>


    </>
  );
}
