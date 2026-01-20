// @ts-nocheck
import { useTranslation } from 'react-i18next';
import { useRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMessages } from '@/src/hooks/useMessages';
import { db } from '@/src/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, arrayUnion, doc, updateDoc, Timestamp } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  author: string;
  createdAt: Timestamp | null;
  reactions?: string[];
}

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const chatId = params.id as string;
  
  const { messages, loading } = useMessages(chatId);
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList<Message>>(null);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      await addDoc(messagesRef, {
        text: input.trim(),
        author: 'Me',
        createdAt: serverTimestamp(),
      });

      setInput('');
      setError(null);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отправки сообщения';
      console.error('Ошибка отправки:', err);
      setError(errorMessage);
    }
  };

  const addReaction = async (messageId: string, emoji: string): Promise<void> => {
    try {
      const messageRef = doc(db, 'chats', chatId, 'messages', messageId);

      await updateDoc(messageRef, {
        reactions: arrayUnion(emoji),
      });

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка добавления реакции';
      console.error('Ошибка реакции:', err);
      setError(errorMessage);
    }
  };

  const formatTimestamp = (timestamp: Timestamp | null): string => {
    if (!timestamp || !timestamp.toDate) return 'Отправляется...';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    if (diffMinutes < 1) return t('justNow');
    if (diffMinutes < 60) return t('minutesAgo', { count: Math.floor(diffMinutes) });
    if (date.toDateString() === now.toDateString()) {
      return date.toTimeString().slice(0, 5);
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return t('yesterday') + ' ' + date.toTimeString().slice(0, 5);
    }
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm} ${date.toTimeString().slice(0, 5)}`;
  };

  const MessageItem = ({ item }: { item: Message }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, [fadeAnim, slideAnim]);

    const isMe = item.author === 'Me';

    const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      marginVertical: 10,
      maxWidth: '75%',
    };

    return (
      <Animated.View style={animatedStyle}>
        <View>
          <View style={[styles.bubbleContainer, isMe && styles.myBubbleContainer]}>
            <View style={[styles.heartBubble, isMe && styles.myHeartBubble]}>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.text}>{item.text}</Text>
              {item.createdAt ? (
                <Text style={[styles.timestamp, isMe && styles.myTimestamp]}>
                  {formatTimestamp(item.createdAt)}
                </Text>
              ) : (
                <Text style={[styles.timestamp, isMe && styles.myTimestamp]}>
                  Отправляется...
                </Text>
              )}
            </View>

            <View style={[styles.heartTail, isMe && styles.myHeartTail]} />

            <View style={[styles.smallHearts, isMe && styles.mySmallHearts]}>
              <Text style={{ fontSize: 18 }}>❤️</Text>
              <Text style={{ fontSize: 14, marginLeft: 6 }}>❤️</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <TouchableOpacity onPress={() => addReaction(item.id, '🐈‍⬛')}>
                <Text style={{ fontSize: 30, marginHorizontal: 5 }}>🐈‍⬛</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addReaction(item.id, '😻')}>
                <Text style={{ fontSize: 30, marginHorizontal: 5 }}>😻</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addReaction(item.id, '🙊')}>
                <Text style={{ fontSize: 30, marginHorizontal: 5 }}>🙊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addReaction(item.id, '🐾')}>
                <Text style={{ fontSize: 30, marginHorizontal: 5 }}>🐾</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addReaction(item.id, '😿')}>
                <Text style={{ fontSize: 30, marginHorizontal: 5 }}>😿</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addReaction(item.id, '😾')}>
                <Text style={{ fontSize: 30, marginHorizontal: 5 }}>😾</Text>
              </TouchableOpacity>
            </View>

            {item.reactions && Array.isArray(item.reactions) && item.reactions.length > 0 && (
              <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                {[...new Set(item.reactions)].map((emoji: string, index: number) => {
                  const count = item.reactions!.filter((r: string) => r === emoji).length;
                  return (
                    <Text key={`${emoji}-${index}`} style={{ fontSize: 24, marginHorizontal: 4 }}>
                      {emoji}{count > 1 ? ` ${count}` : ''}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0f0" />
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('error', { error })}</Text>
      </View>
    );
  }

  return (
  <View style={{ flex: 1, backgroundColor: '#e8f5e8' }}>  {/* светло-зелёный фон вместо картинки */}
    <FlatList<Message>
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageItem item={item} />}
      inverted={false}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder={t('inputPlaceholder')}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={sendMessage}
      />
      <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
        <Image
          source={require('../../../../assets/send.png')}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e8',
    padding: 12,
  },
  bubbleContainer: {
    maxWidth: '75%',
    marginVertical: 10,
    position: 'relative',
  },
  myBubbleContainer: {
    alignSelf: 'flex-end',
  },
  heartBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  myHeartBubble: {
    backgroundColor: '#e0ffe0',
  },
  heartTail: {
    position: 'absolute',
    bottom: -10,
    left: 25,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderLeftColor: 'transparent',
    borderRightWidth: 12,
    borderRightColor: 'transparent',
    borderTopWidth: 20,
    borderTopColor: '#ffffff',
  },
  myHeartTail: {
    borderTopColor: '#e0ffe0',
    left: undefined,
    right: 25,
  },
  smallHearts: {
    position: 'absolute',
    bottom: -25,
    left: 35,
    flexDirection: 'row',
  },
  mySmallHearts: {
    left: undefined,
    right: 35,
  },
  author: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: '#222',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
    opacity: 0.7,
  },
  myTimestamp: {
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#0f0',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 12,
  },
});