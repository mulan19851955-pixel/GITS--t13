// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  '(tabs)': undefined;
  login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PhoneLoginScreenProps {
  navigation: NavigationProp;
}

// Временная заглушка вместо настоящего Firebase auth (пока новый build не собран)
// Удалить эту часть, когда установишь новый APK с @react-native-firebase/auth
const mockAuth = {
  signInWithPhoneNumber: async (phone: string) => {
    console.log('Mock: отправка кода на', phone);
    Alert.alert('Mock-режим', 'Код "123456" (введи любой 6-значный для успеха)');
    return {
      confirm: async (code: string) => {
        console.log('Mock: подтверждение кода', code);
        if (code.length === 6) {
          return { user: { uid: 'mock-user-id' } };
        }
        throw new Error('Неверный код');
      }
    };
  }
};

export default function PhoneLoginScreen({ navigation }: PhoneLoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>('+992');
  const [confirmationResult, setConfirmationResult] = useState<any>(null); // any вместо FirebaseAuthTypes
  const [code, setCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const sendCode = async (): Promise<void> => {
    if (!phoneNumber.startsWith('+')) {
      Alert.alert('Ошибка', 'Номер должен начинаться с +');
      return;
    }

    try {
      // Используем заглушку вместо реального auth()
      const confirmation = await mockAuth.signInWithPhoneNumber(phoneNumber);
      setConfirmationResult(confirmation);
      setMessage('Код отправлен! 🐾 (введи любой 6-значный)');
      Alert.alert('Успех (mock)', 'Код "отправлен" — введи любой 6-значный!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка отправки (mock):', error);
      setMessage('Ошибка: ' + errorMessage);
      Alert.alert('Ошибка', errorMessage);
    }
  };

  const confirmCode = async (): Promise<void> => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert('Ошибка', 'Введи 6 цифр');
      return;
    }

    try {
      if (!confirmationResult) {
        Alert.alert('Ошибка', 'Сначала отправь код');
        return;
      }
      // Используем заглушку confirm
      await confirmationResult.confirm(code);
      setMessage('Вход успешен! (mock-режим)');
      Alert.alert('Добро пожаловать!', 'Ты вошла ❤️ (mock)');
      navigation.navigate('(tabs)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка подтверждения (mock):', error);
      setMessage('Неверный код: ' + errorMessage);
      Alert.alert('Ошибка', errorMessage);
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
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#000' 
  },
  title: { 
    color: '#fff', 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  label: { 
    color: '#aaa', 
    fontSize: 16, 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#333', 
    color: '#fff', 
    padding: 12, 
    marginVertical: 10, 
    borderRadius: 8, 
    fontSize: 18 
  },
  message: { 
    color: '#0f0', 
    marginTop: 10, 
    textAlign: 'center' 
  },
});