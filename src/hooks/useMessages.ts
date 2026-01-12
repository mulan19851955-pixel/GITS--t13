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
  FirestoreError
} from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { db } from '@/src/firebase/firebaseConfig';

export interface Message {
  id: string;
  text: string;
  author: string;
  createdAt: Timestamp | null;
  reactions?: string[];
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export function useMessages(chatId: string): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): (() => void) | undefined => {
    // Валидация chatId
    if (!chatId || typeof chatId !== 'string' || chatId.trim() === '') {
      setLoading(false);
      setError('Invalid chat ID');
      setMessages([]);
      return undefined;
    }

    let unsubscribe: Unsubscribe | undefined;

    try {
      // Создаём ссылку на коллекцию сообщений
      const messagesRef = collection(db as Firestore, 'chats', chatId, 'messages');
      
      // Создаём запрос с сортировкой по дате создания
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      // Подписываемся на изменения в реальном времени
      unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>): void => {
          try {
            const loadedMessages: Message[] = snapshot.docs.map((doc): Message => {
              const data = doc.data();
              
              // Валидация и преобразование данных
              return {
                id: doc.id,
                text: typeof data.text === 'string' ? data.text : '',
                author: typeof data.author === 'string' ? data.author : 'Unknown',
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
                reactions: Array.isArray(data.reactions) ? data.reactions : undefined,
              };
            });

            setMessages(loadedMessages);
            setLoading(false);
            setError(null);
          } catch (parseError: unknown) {
            const errorMessage = parseError instanceof Error 
              ? parseError.message 
              : 'Ошибка обработки данных сообщений';
            console.error('Ошибка парсинга сообщений:', parseError);
            setError(errorMessage);
            setLoading(false);
            setMessages([]);
          }
        },
        (err: FirestoreError): void => {
          console.error('Ошибка загрузки сообщений из Firestore:', err);
          const errorMessage = err?.message || 'Неизвестная ошибка при загрузке сообщений';
          setError(errorMessage);
          setLoading(false);
          setMessages([]);
        }
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Неизвестная ошибка при инициализации подписки';
      console.error('Ошибка создания подписки на сообщения:', err);
      setError(errorMessage);
      setLoading(false);
      setMessages([]);
      return undefined;
    }

    // Функция очистки подписки
    return (): void => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (cleanupError: unknown) {
          console.error('Ошибка при отписке от сообщений:', cleanupError);
        }
      }
    };
  }, [chatId]);

  return { messages, loading, error };
}