// @ts-nocheck
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseConfig';

export default function PhoneLoginScreen({ navigation }: { navigation: any }) {
  const [phoneNumber, setPhoneNumber] = useState('+992');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const recaptchaVerifierRef = useRef<any>(null);

  const sendCode = async () => {
    if (!phoneNumber.startsWith('+')) {
      Alert.alert('Ошибка', 'Номер должен начинаться с +');
      return;
    }

    try {
      // Invisible reCAPTCHA для React Native
      // Примечание: RecaptchaVerifier требует WebView в React Native
      // Для production рекомендуется использовать @react-native-firebase или expo-firebase-recaptcha
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA решена
        },
        'expired-callback': () => {
          Alert.alert('Ошибка', 'reCAPTCHA истекла. Попробуйте снова.');
        }
      });

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setMessage('Код отправлен! 🐾');
      Alert.alert('Успех', 'Код отправлен на номер!');
    } catch (error: any) {
      console.error('Ошибка отправки:', error);
      setMessage('Ошибка: ' + error.message);
      Alert.alert('Ошибка', error.message || 'Неизвестно');
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    }
  };

  const confirmCode = async () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert('Ошибка', 'Введи 6 цифр');
      return;
    }

    try {
      if (!confirmationResult) {
        Alert.alert('Ошибка', 'Сначала отправь код');
        return;
      }
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, code);
      await signInWithCredential(auth, credential);
      setMessage('Вход успешен!');
      Alert.alert('Добро пожаловать!', 'Ты вошла ❤️');
      navigation.navigate('(tabs)');
    } catch (error: any) {
      setMessage('Неверный код: ' + error.message);
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View id="recaptcha-container" style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }} />
      <Text style={styles.title}>Вход по номеру</Text>
      {!confirmationResult ? (
        <>
          <Text style={styles.label}>Номер телефона</Text>
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
          <Text style={styles.label}>Код из SMS</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { color: '#aaa', fontSize: 16, marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#333', color: '#fff', padding: 12, marginVertical: 10, borderRadius: 8, fontSize: 18 },
  message: { color: '#0f0', marginTop: 10, textAlign: 'center' },
});