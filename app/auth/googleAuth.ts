// @ts-nocheck // оставляем временно, чтобы не ругался TS на firebase types
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState, useCallback } from 'react';
import { GoogleAuthProvider, signInWithCredential, User, getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

WebBrowser.maybeCompleteAuthSession();

interface GoogleLoginReturn {
  promptAsync: (options?: any) => Promise<void>;
  user: User | null;
}

export function useGoogleLogin(): GoogleLoginReturn {
  const [user, setUser] = useState<User | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '542379748674-inojds9rpoh416l3c9o450914a2o3r4f.apps.googleusercontent.com',
  });

  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;

        if (authentication?.idToken) {
          try {
            const auth = getAuth(getApp()); // ← свежий экземпляр каждый раз
            const credential = GoogleAuthProvider.credential(authentication.idToken);
            const result = await signInWithCredential(auth, credential);
            console.log('Успешный вход в Firebase:', result.user.uid);
            setUser(result.user);
          } catch (error) {
            console.error('Ошибка Firebase Auth:', error);
          }
        }
      } else if (response?.type === 'error') {
        console.error('Ошибка Google Auth:', response.error);
      }
    };

    handleAuth();
  }, [response]);

  const handlePromptAsync = useCallback(async (options?: any): Promise<void> => {
    try {
      await promptAsync(options);
    } catch (error) {
      console.error('Ошибка promptAsync:', error);
    }
  }, [promptAsync]);

  return { 
    promptAsync: handlePromptAsync, 
    user 
  };
}