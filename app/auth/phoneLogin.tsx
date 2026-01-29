import { auth } from 'E:/Project/GITS/firebaseConfig';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+992'); // префикс Таджикистана
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const router = useRouter();
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  // Инициализация reCAPTCHA (нужна для web-версии phone auth в dev)
  useEffect(() => {
    try {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible', // или 'normal' если хочешь видимую капчу
      });
    } catch (error) {
      console.error('reCAPTCHA init error:', error);
    }
  }, []);

  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона');
      return;
    }

    setLoading(true);
    try {
      const appVerifier = recaptchaVerifier.current;
      if (!appVerifier) throw new Error('reCAPTCHA не инициализирован');

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmation.verificationId);
      Alert.alert('Успех', 'Код отправлен! Проверьте SMS.');
    } catch (error: any) {
      console.error('Ошибка отправки кода:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось отправить код. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    if (!verificationId || !code || code.length < 6) {
      Alert.alert('Ошибка', 'Введите 6-значный код из SMS');
      return;
    }

    setConfirming(true);
    try {
      const credential = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current!)
        .then((confirmationResult) => confirmationResult.confirm(code));

      // Здесь пользователь авторизован
      Alert.alert('Успех', 'Вход выполнен!');
      router.replace('/chat'); // или куда тебе нужно после логина
    } catch (error: any) {
      console.error('Ошибка подтверждения:', error);
      Alert.alert('Ошибка', error.message || 'Неверный код');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Вход по номеру телефона</Text>

        {!verificationId ? (
          <>
            <Text style={styles.label}>Номер телефона</Text>
            <TextInput
              style={styles.input}
              placeholder="+992XXXXXXXXX"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={sendVerificationCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Отправить код</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Код из SMS</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity
              style={[styles.button, confirming && styles.buttonDisabled]}
              onPress={confirmCode}
              disabled={confirming}
            >
              {confirming ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Подтвердить</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Обязательный контейнер для reCAPTCHA (даже если invisible) */}
        <View id="recaptcha-container" style={{ height: 0, width: 0 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});