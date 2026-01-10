import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import ChatScreen from './(tabs)/chat';
import 'react-native-reanimated';

import { useColorScheme } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
  <Stack>
    {/* Твои текущие экраны */}
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      
      <Stack.Screen 
      name="auth/phoneLogin" 
      options={{ headerShown: false }} // или true, если нужен заголовок
    />
  </Stack>
  );
}
