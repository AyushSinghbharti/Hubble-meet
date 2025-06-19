// components/GlobalFonts.tsx
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';

export const loadFonts = () =>
  Font.loadAsync({
    'InterRegular': require('../../../assets/fonts/Interfont/static/Inter_18pt-Regular.ttf'),
    'InterBold': require('../../../assets/fonts/Interfont/static/Inter_18pt-Bold.ttf'),
    'InterSemiBold': require('../../../assets/fonts/Interfont/static/Inter_18pt-SemiBold.ttf'),
    'InterMedium': require('../../../assets/fonts/Interfont/static/Inter_18pt-Medium.ttf'),
  });

export default function GlobalFonts({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return <>{children}</>;
}
