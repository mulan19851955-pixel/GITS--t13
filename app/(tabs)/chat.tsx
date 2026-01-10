import { useTranslation } from 'react-i18next';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Button } from 'react-native';
import { useGoogleLogin } from '@/src/auth/googleAuth';

export default function ChatListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [chats, setChats] = useState<any[]>([]);
const { user } = useGoogleLogin();

  useEffect(() => {
    setChats([
      {
        id: 'global',
        name: 'Global Chat 🐾',
        lastMessage: 'Привет от Пуси! 😻',
        timestamp: new Date(),
        unread: 3,
      },
      // Здесь потом будут реальные чаты из Firebase
    ]);
  }, []);

  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('chat/index', { chatId: item.id })}
    >
      <View style={styles.avatar}>
        <Text style={{ fontSize: 30 }}>🐾</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <View style={styles.rightColumn}>
        <Text style={styles.timestamp}>Теперь</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
  <View style={styles.container}>
    {!user && (
      <Button
        title="Войти по номеру телефона"
        onPress={() => navigation.navigate('phoneLogin')}
        color="#4285F4"
      />
    )}
      <Text style={styles.title}>Мои чаты 🐾</Text>

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Нет чатов пока... Но скоро будут! 😺</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e8', // твой любимый нежно-зелёный ❤️
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    padding: 20,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#d0ffd0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#00ff00',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  unreadText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
});