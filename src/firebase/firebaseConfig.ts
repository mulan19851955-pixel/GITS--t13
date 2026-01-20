import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRsWiq5RsWHtGg1LnB45hZnWKhy6QHf4c",
  authDomain: "gits-15f9c.firebaseapp.com",
  projectId: "gits-15f9c",
  storageBucket: "gits-15f9c.appspot.com",
  messagingSenderId: "887386485214",
  appId: "1:887386485214:web:be1623afd816ec84916d4f",
  measurementId: "G-M15DQY2PT1"
};


// Ключевой момент: инициализируем синхронно, если ещё нет приложения
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // берём уже существующее — без Promise!
}

// @ts-ignore
export const auth = getAuth(app);
// @ts-ignore
export const db = getFirestore(app);