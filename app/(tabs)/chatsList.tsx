// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '@/src/firebase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function ChatsListScreen() {
  const [chats, setChats] = useState<any[]>([]);
  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, 'users', currentUser.uid, 'chats');
    const q = query(chatsRef, orderBy('lastTimestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatsList);
    });

    return unsubscribe;
  }, [currentUser]);

  const renderChat = ({ item }: any) => (
  <TouchableOpacity
    style={styles.chatItem}
    onPress={() => router.push({
      pathname: '/chat/[id]',
      params: { id: item.id }
    })}
  >
      <Image source={{ uri: item.partnerPhoto || 'https://i.imgur.com/8n2qY0j.png' }} style={styles.avatar} />
    <View style={styles.info}>
      <Text style={styles.name}>{item.partnerName || 'Котик 🐾'}</Text>
      <Text style={styles.lastMsg}>{item.lastMessage || 'Начните переписку'}</Text>
    </View>
    <View style={styles.right}>
      <Text style={styles.time}>{formatTime(item.lastTimestamp)}</Text>
      {item.unread > 0 && <View style={styles.unread}><Text style={styles.unreadText}>{item.unread}</Text></View>}
    </View>
  </TouchableOpacity>
  );
const formatTime = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'сейчас';
  if (minutes < 60) return `${minutes}м`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}ч`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Пока нет чатов... Напиши кому-нибудь 🐾</Text>}
      />
    </View>
  );
}

// Стили и formatTime опишу в следующем сообщении, чтобы не перегружать

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  chatItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 0.5, borderColor: '#333' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  info: { flex: 1 },
  name: { color: '#0f0', fontSize: 18, fontWeight: 'bold' },
  lastMsg: { color: '#aaa', fontSize: 14 },
  right: { alignItems: 'flex-end' },
  time: { color: '#aaa', fontSize: 12 },
  unread: { backgroundColor: '#0f0', borderRadius: 12, paddingHorizontal: 8, marginTop: 5 },
  unreadText: { color: '#000', fontWeight: 'bold' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 50, fontSize: 18 },
});