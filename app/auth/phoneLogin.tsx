import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { app } from '@/firebase/firebaseConfig'; // или твой правильный путь

const auth = getAuth(app);

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');

  const sendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Ошибка', 'Введи номер телефона');
      return;
    }

    try {
      // Обходим reCAPTCHA — пустой verifier для нативных приложений
      // @ts-ignore — Firebase поймёт, что это мобильное устройство
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, {} as any);

      setVerificationId(confirmation.verificationId);
      Alert.alert('Код отправлен!', 'Введи 6 цифр из SMS 🐾');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Ошибка', error.message || 'Не удалось отправить код');
    }
  };

  const confirmCode = async () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert('Ошибка', 'Введи 6 цифр');
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      Alert.alert('Успех!', 'Ты вошла! Теперь чаты твои на всех устройствах ❤️🐾');
      // Здесь можно перейти на главный экран чата
    } catch (error: any) {
      console.error(error);
      Alert.alert('Ошибка', error.message || 'Неверный код');
    }
  };

  return (
    <View style={styles.container}>
      {!verificationId ? (
        <>
          <Text style={styles.label}>Введи номер телефона</Text>
          <TextInput
            placeholder="+7xxxxxxxxxx"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            autoComplete="tel"
          />
          <Button title="Отправить код" onPress={sendCode} />
        </>
      ) : (
        <>
          <Text style={styles.label}>Введи код из SMS</Text>
          <TextInput
            placeholder="6 цифр"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
            maxLength={6}
          />
          <Button title="Войти" onPress={confirmCode} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e8f5e8', // нежно-зелёный, как в твоём чате ❤️
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    fontSize: 18,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});