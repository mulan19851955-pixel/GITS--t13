import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../src/firebase/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
  const [user, setUser] = useState<any>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '542379748674-inojds9rpoh416l3c9o450914a2o3r4f.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const credential = GoogleAuthProvider.credential(authentication?.idToken);
      
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log('Успешный вход в Firebase:', result.user.uid);
          setUser(result.user);
        })
        .catch((error) => {
          console.error('Ошибка Firebase Auth:', error);
        });
    }
  }, [response]);

  return { promptAsync, user };
};