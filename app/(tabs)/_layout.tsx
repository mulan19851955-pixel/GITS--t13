import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Держим сплеш до полной готовности
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        // Здесь можно загрузить шрифты, данные, проверить авторизацию и т.д.
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 секунды для GIF-котика
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []); // Пустой массив зависимостей — выполнится один раз при монтировании

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      {/* Добавь другие экраны, если есть */}
    </Stack>
  );
}