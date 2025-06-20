// app/(chatStack)/_layout.tsx
import { Stack} from "expo-router";

export default function ChatStackLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="chatStack" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="pitchStack" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
