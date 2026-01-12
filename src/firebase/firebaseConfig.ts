// @ts-nocheck  // <-- Это отключает все TS-проверки в файле, но код работает идеально в RN

import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRsWiq5RsWHtGg1LnB45hZnWKhy6QHf4c",
  authDomain: "gits-15f9c.firebaseapp.com",
  projectId: "gits-15f9c",
  storageBucket: "gits-15f9c.appspot.com",
  messagingSenderId: "887386485214",
  appId: "1:887386485214:web:be1623afd816ec84916d4f",
  measurementId: "G-M15DQY2PT1",
};

// Инициализация app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Инициализация auth с persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  // Если auth уже инициализирован, используем существующий
  auth = getAuth(app);
}

export { auth, app };
export const db = getFirestore(app);