import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
  FirestoreError,
  WithFieldValue,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/src/firebase/firebaseConfig';

export interface Message {
  id: string;
  text: string;
  author: string;
  createdAt: Timestamp | null;
  reactions?: string[];
}

export const messageConverter = {
  toFirestore: (modelObject: WithFieldValue<Omit<Message, 'id'>>): DocumentData => ({
    text: modelObject.text,
    author: modelObject.author,
    createdAt: modelObject.createdAt,
    reactions: modelObject.reactions,
  }),

  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Message => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      text: typeof data.text === 'string' ? data.text : '',
      author: typeof data.author === 'string' ? data.author : 'Unknown',
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
      reactions: Array.isArray(data.reactions) ? data.reactions : undefined,
    };
  },
};

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export function useMessages(chatId: string): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId || typeof chatId !== 'string' || chatId.trim() === '') {
      setLoading(false);
      setError('Invalid chat ID');
      setMessages([]);
      return;
    }

    let unsubscribe: Unsubscribe | undefined;

    try {
      const messagesCollection = collection(db, 'chats', chatId, 'messages');
      const typedCollection = messagesCollection.withConverter(messageConverter);

      const q = query(typedCollection, orderBy('createdAt', 'asc'));

      unsubscribe = onSnapshot(q, {
        next: (snapshot) => {  // без <Message> здесь — TS выводит из converter
          const loadedMessages = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(loadedMessages);
          setLoading(false);
          setError(null);
        },
        error: (err) => {
          console.error('Firestore listener error:', err);
          setError(err.message || 'Ошибка загрузки сообщений');
          setLoading(false);
          setMessages([]);
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка инициализации подписки';
      console.error('Init error:', err);
      setError(msg);
      setLoading(false);
      setMessages([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chatId]);

  return { messages, loading, error };
}