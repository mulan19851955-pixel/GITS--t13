import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';          // ← веб-версия
import { getFirestore } from 'firebase/firestore'; // веб-версия

const firebaseConfig = {
  apiKey: "AIzaSyBRsWiq5RsWHtGg1LnB45hZnWKhy6QHf4c",
  authDomain: "gits-15f9c.firebaseapp.com",
  projectId: "gits-15f9c",
  storageBucket: "gits-15f9c.appspot.com",
  messagingSenderId: "887386485214",
  appId: "1:887386485214:web:be1623afd816ec84916d4f",
  measurementId: "G-M15DQY2PT1"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);