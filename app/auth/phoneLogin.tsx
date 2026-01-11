import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { auth } from '@/src/firebase/firebaseConfig';

// Твой Firebase Web Config
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDEWEGOAP-2jxp7hc9IWUFkjrpGA",
  authDomain: "gits-15f9c.firebaseapp.com",
  projectId: "gits-15f9c",
  storageBucket: "gits-15f9c.appspot.com",
  messagingSenderId: "887386485214",
  appId: "1:887386485214:web:be1623afd816ec849164df",
  measurementId: "G-M5DQYPT1"
};

export default function PhoneLoginScreen({ navigation }: { navigation: any }) {
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('+992');
  const [verificationId, setVerificationId] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const sendCode = async () => {
    console.log('Нажата кнопка Отправить код! Номер:', phoneNumber);

    if (!phoneNumber.startsWith('+')) {
      Alert.alert('Ошибка', 'Номер должен начинаться с +');
      return;
    }

    try {
      console.log('Verifier готов?', recaptchaVerifier.current);

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current as any
      );

      setConfirmationResult(confirmation);
      setVerificationId(confirmation.verificationId);
      setMessage('Код отправлен на номер! 🐾');
      Alert.alert('Успех', 'Код отправлен!');
      console.log('Код отправлен успешно!');
    } catch (error: any) {
      console.error('Ошибка отправки кода:', error);
      setMessage('Ошибка: ' + (error.message || 'Не удалось отправить код'));
      Alert.alert('Ошибка', error.message || 'Неизвестная ошибка');
    }
  };

  const confirmCode = async () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert('Ошибка', 'Введи 6 цифр');
      return;
    }

    try {
      const credential = await confirmationResult.confirm(code);
      setMessage('Вход успешен! UID: ' + credential.user.uid);
      Alert.alert('Добро пожаловать!', 'Ты вошла! ❤️');
      navigation.navigate('chat'); // переход в чат
    } catch (error: any) {
      setMessage('Неверный код: ' + error.message);
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={FIREBASE_CONFIG}
        attemptInvisibleVerification={false}
      />

      <Text style={styles.title}>Вход по номеру телефона</Text>

      {!verificationId ? (
        <>
          <Text style={styles.label}>Введи номер телефона</Text>
          <TextInput
            style={styles.input}
            placeholder="+992..."
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Button title="Отправить код" onPress={sendCode} color="#4285F4" />
        </>
      ) : (
        <>
          <Text style={styles.label}>Введи код из SMS</Text>
          <TextInput
            style={styles.input}
            placeholder="6 цифр"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button title="Войти" onPress={confirmCode} color="#0f0" />
        </>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FirebaseRecaptchaBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 18,
  },
  message: {
    color: '#0f0',
    marginTop: 10,
    textAlign: 'center',
  },
});