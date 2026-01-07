import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../src/firebase/firebaseConfig'; // путь к твоему firebaseConfig.ts

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  let recaptchaVerifier: RecaptchaVerifier;

  const sendCode = async () => {
    try {
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Ошибка отправки кода");
    }
  };

  const confirmCode = async () => {
    // Здесь код для подтверждения (если есть отдельная функция)
  };

  return (
    <View>
      <TextInput
        placeholder="+79991234567"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Отправить код" onPress={sendCode} />
      <View id="recaptcha-container" /> {/* невидимый контейнер для reCAPTCHA */}

      {verificationId ? (
        <>
          <TextInput placeholder="Код из SMS" value={code} onChangeText={setCode} />
          <Button title="Подтвердить" onPress={confirmCode} />
        </>
      ) : null}

      {error ? <Text>{error}</Text> : null}
    </View>
  );
}