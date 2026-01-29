import { User } from 'firebase/auth';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'E:/Project/GITS/firebaseConfig';

// Держим сплеш до полной готовности
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Слушаем изменения состояния авторизации
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('Auth state changed:', currentUser ? 'logged in' : 'logged out');
    });

    // Подготовка приложения (шрифты, сплеш и т.д.)
    async function prepare() {
      try {
        // Здесь можно загрузить шрифты, данные и т.д.
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 секунды для GIF-котика
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    // Очистка при размонтировании
    return () => unsubscribe();
  }, []);

  // Пока приложение не готово — ничего не рендерим (сплеш висит)
  if (!appIsReady) {
    return null;
  }

  // Если пользователь НЕ залогинен — редирект на логин
  if (!user) {
    return <Redirect href="/auth/phoneLogin" />;
  }

  // Если залогинен — показываем основной стек
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      {/* Добавь сюда другие экраны, если нужно */}
      {/* <Stack.Screen name="profile" options={{ headerShown: false }} /> */}
    </Stack>
  );
}