import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

// Убрали ConfirmationResult — используем any
export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+992');
  const [confirmationResult, setConfirmationResult] = useState<any>(null); // ← any вместо ConfirmationResult
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const auth = getAuth(getApp());

  const sendCode = async () => {
  if (!phoneNumber.startsWith('+')) {
    Alert.alert('Ошибка', 'Номер должен начинаться с +');
    return;
    }
    try {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
    setConfirmationResult(confirmation);
    setMessage('Код отправлен! 🐾');
    Alert.alert('Успех', 'Код отправлен на номер!');
  } catch (error: any) {
    console.error('Ошибка отправки кода:', error);
    Alert.alert('Ошибка', error.message || 'Неизвестная ошибка');
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
      await confirmationResult.confirm(code);
      setMessage('Вход успешен!');
      Alert.alert('Добро пожаловать!', 'Ты вошла ❤️');
      // Переход в чат — если expo-router, используй router.push('(tabs)');
      // Если старый navigation — navigation.navigate('(tabs)');
    } catch (error: any) {
      console.error('Ошибка подтверждения кода:', error);
      setMessage('Неверный код: ' + (error.message || 'Неизвестная ошибка'));
      Alert.alert('Ошибка', error.message || 'Неверный код');
    }
  };

  return (
    <View style={styles.container}>
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
            autoFocus
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
            autoFocus
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