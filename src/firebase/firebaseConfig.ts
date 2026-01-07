// @ts-nocheck
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // ← обычный импорт, без /react-native
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth';  // ← persistence остаётся здесь

const firebaseConfig = {
  apiKey: "AIzaSyBRsWiq5RsWHtGg1LnB45hZnWKhy6QHf4c",
  authDomain: "gits-15f9c.firebaseapp.com",
  projectId: "gits-15f9c",
  storageBucket: "gits-15f9c.appspot.com",
  messagingSenderId: "887386485214",
  appId: "1:887386485214:web:be1623afd816ec84916d4f",
  measurementId: "G-M15DQY2PT1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.setPersistence(getReactNativePersistence(ReactNativeAsyncStorage));  // ← persistence работает

const db = getFirestore(app);

export { app, auth, db };