import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // получаем ID чата

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Чат ID: {id}</Text>
      <Text style={styles.info}>Здесь будет переписка 🐾</Text>
      <Text style={styles.info}>Сообщения появятся скоро 😻</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { color: '#0f0', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { color: '#aaa', fontSize: 18, textAlign: 'center', marginTop: 50 },
});