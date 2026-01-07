import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';  // ←←←← Импорт из expo-image!

const { width, height } = Dimensions.get('window');

export default function IntroScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, 6000);  // время под длину твоей анимации

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./cat-intro.gif')}
        style={styles.image}
        contentFit="contain"  // вместо resizeMode
        // autoplay по умолчанию для GIF
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2e6b2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.95,
    height: height * 0.95,
  },
});