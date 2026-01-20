import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getApp } from '@react-native-firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

export default function VerifyCode() {
  const params = useLocalSearchParams<{ verificationId: string }>();
  const verificationId = params.verificationId;
  const router = useRouter();

  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(240);
  const [canResend, setCanResend] = useState(false);

  // Правильный экземпляр auth
  const auth = getAuth(getApp());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      Alert.alert('Успех', 'Вход выполнен!');
      router.push('(tabs)');
    } catch (error: any) {
      Alert.alert('Ошибка', 'Неверный код');
      console.error(error);
    }
  };

  const resendCode = async () => {
    Alert.alert('Повторная отправка', 'Код отправлен заново');
    setTimeLeft(240);
    setCanResend(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Введите код из SMS</Text>
      <TextInput
        style={{ backgroundColor: '#333', color: '#fff', padding: 15, borderRadius: 10, marginVertical: 20, textAlign: 'center', fontSize: 24 }}
        placeholder="------"
        placeholderTextColor="#aaa"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      <TouchableOpacity onPress={confirmCode} style={{ backgroundColor: '#2196F3', padding: 15, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Подтвердить</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resendCode} disabled={!canResend} style={{ marginTop: 20 }}>
        <Text style={{ color: canResend ? '#4CAF50' : '#888', textAlign: 'center' }}>
          {canResend ? 'Отправить код повторно' : `Повторно через ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}