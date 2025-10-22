/**
 * DisasterMesh - MessageScreen
 *
 * メッセージの送受信画面
 * - メッセージ一覧の表示
 * - メッセージ送信フォーム
 * - 送受信状態の表示
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type {Message} from '../types/message';
import type {Node} from '../types/node';
import {
  saveMessages,
  loadMessages,
  saveDeviceId,
  loadDeviceId,
} from '../utils/storage';
import {validateMessageLength, sanitizeMessageContent} from '../utils/validators';
import {generateUUID} from '../utils/crypto';
import {MESH_CONFIG} from '../constants/config';

interface MessageScreenProps {
  connectedNodes: Node[];
  onSendMessage: (nodeId: string, content: string) => Promise<void>;
  onMessageReceived?: (message: Message) => void;
}

export default function MessageScreen({
  connectedNodes,
  onSendMessage,
  onMessageReceived,
}: MessageScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  // デバイスIDの初期化
  useEffect(() => {
    const initializeDeviceId = async () => {
      let id = await loadDeviceId();
      if (!id) {
        id = generateUUID();
        await saveDeviceId(id);
      }
      setDeviceId(id);
    };
    initializeDeviceId();
  }, []);

  // メッセージ履歴の読み込み
  useEffect(() => {
    const loadMessageHistory = async () => {
      const loadedMessages = await loadMessages();
      setMessages(loadedMessages);
    };
    loadMessageHistory();
  }, []);

  // メッセージ受信時のハンドラー
  // Note: 現在は未実装。将来的にはBLEフックからのコールバックを使用します
  useEffect(() => {
    if (onMessageReceived) {
      // TODO: メッセージ受信ハンドラーの実装
    }
  }, [onMessageReceived]);

  // メッセージ送信
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) {
      Alert.alert('エラー', 'メッセージを入力してください');
      return;
    }

    if (connectedNodes.length === 0) {
      Alert.alert('エラー', '接続されたノードがありません');
      return;
    }

    const sanitizedContent = sanitizeMessageContent(inputText);

    if (!validateMessageLength(sanitizedContent)) {
      Alert.alert(
        'エラー',
        `メッセージは${MESH_CONFIG.MAX_MESSAGE_LENGTH}文字以内にしてください`
      );
      return;
    }

    setIsSending(true);

    try {
      // 接続中の全ノードにメッセージを送信
      const sendPromises = connectedNodes.map(node =>
        onSendMessage(node.id, sanitizedContent)
      );

      await Promise.all(sendPromises);

      // 送信済みメッセージを履歴に追加
      const newMessage: Message = {
        id: generateUUID(),
        from: deviceId,
        to: 'broadcast', // ブロードキャスト送信
        content: sanitizedContent,
        timestamp: Date.now(),
        ttl: MESH_CONFIG.DEFAULT_TTL,
        signature: '', // 署名は送信時に生成される
        status: 'sent',
        read: true,
      };

      const updatedMessages = [newMessage, ...messages];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);

      setInputText('');
      Alert.alert('成功', 'メッセージを送信しました');
    } catch (error) {
      Alert.alert('エラー', 'メッセージの送信に失敗しました');
      console.error('Message send error:', error);
    } finally {
      setIsSending(false);
    }
  }, [inputText, connectedNodes, onSendMessage, deviceId, messages]);

  // メッセージアイテムのレンダリング
  const renderMessageItem = ({item}: {item: Message}) => {
    const isSent = item.from === deviceId;
    const formattedTime = new Date(item.timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View
        style={[
          styles.messageItem,
          isSent ? styles.sentMessage : styles.receivedMessage,
        ]}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageFrom}>
            {isSent ? 'あなた' : `ノード ${item.from.slice(0, 8)}`}
          </Text>
          <Text style={styles.messageTime}>{formattedTime}</Text>
        </View>
        <Text style={styles.messageContent}>{item.content}</Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageStatus}>
            {item.status === 'sent' && '✓ 送信済み'}
            {item.status === 'received' && '✓ 受信'}
            {item.status === 'forwarded' && '✓ 転送済み'}
          </Text>
          <Text style={styles.messageTTL}>TTL: {item.ttl}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>メッセージ</Text>
        <Text style={styles.headerSubtitle}>
          接続中: {connectedNodes.length} ノード
        </Text>
      </View>

      {/* メッセージ一覧 */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        inverted
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>メッセージがありません</Text>
            <Text style={styles.emptySubtext}>
              ノードに接続してメッセージを送信できます
            </Text>
          </View>
        }
      />

      {/* 入力フォーム */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="メッセージを入力..."
          placeholderTextColor="#999"
          multiline
          maxLength={MESH_CONFIG.MAX_MESSAGE_LENGTH}
          editable={!isSending && connectedNodes.length > 0}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (isSending || !inputText.trim() || connectedNodes.length === 0) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={isSending || !inputText.trim() || connectedNodes.length === 0}>
          <Text style={styles.sendButtonText}>
            {isSending ? '送信中...' : '送信'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageFrom: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  messageStatus: {
    fontSize: 11,
    color: '#999',
  },
  messageTTL: {
    fontSize: 11,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
