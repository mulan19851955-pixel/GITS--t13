// @ts-nocheck
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState, useCallback } from 'react';
import { GoogleAuthProvider, signInWithCredential, User, Auth } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseConfig';
import type { DiscoveryDocument, AuthRequestPromptOptions } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface GoogleLoginReturn {
  promptAsync: (options?: AuthRequestPromptOptions) => Promise<void>;
  user: User | null;
}

export function useGoogleLogin(): GoogleLoginReturn {
  const [user, setUser] = useState<User | null>(null);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '542379748674-inojds9rpoh416l3c9o450914a2o3r4f.apps.googleusercontent.com',
  });

  useEffect(() => {
    const handleAuth = async (): Promise<void> => {
      if (response?.type === 'success') {
        const { authentication } = response;
        
        if (authentication?.idToken) {
          try {
            const credential = GoogleAuthProvider.credential(authentication.idToken);
            const result = await signInWithCredential(auth as Auth, credential);
            console.log('Успешный вход в Firebase:', result.user.uid);
            setUser(result.user);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
            console.error('Ошибка Firebase Auth:', errorMessage, error);
          }
        }
      } else if (response?.type === 'error') {
        console.error('Ошибка Google Auth:', response.error);
      }
    };

    handleAuth();
  }, [response]);

  const handlePromptAsync = useCallback(async (options?: AuthRequestPromptOptions): Promise<void> => {
    try {
      await promptAsync(options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка promptAsync:', errorMessage, error);
    }
  }, [promptAsync]);

  return { 
    promptAsync: handlePromptAsync, 
    user 
  };
}