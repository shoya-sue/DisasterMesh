/**
 * DisasterMesh - Main Application
 *
 * BLEメッシュネットワークによる災害時通信アプリ
 */

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-get-random-values';
import {Buffer} from 'buffer';

// Polyfill for Buffer
global.Buffer = Buffer;

import AppNavigator from './src/navigation/AppNavigator';
import {useBLE} from './src/hooks/useBLE';
import {
  requestBluetoothPermissions,
  getPermissionErrorMessage,
} from './src/utils/permissions';
import type {MessagePacket} from './src/types/message';

function App(): React.JSX.Element {
  const [isInitializing, setIsInitializing] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // BLEフックの使用
  const {
    isScanning,
    isInitialized,
    discoveredDevices,
    connectedNodes,
    error,
    initialize,
    startScan,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    sendMessage,
  } = useBLE(handleMessageReceived);

  // メッセージ受信ハンドラー
  function handleMessageReceived(peripheralId: string, packet: MessagePacket) {
    console.log('Message received from:', peripheralId);
    console.log('Packet:', packet);

    // メッセージ通知をユーザーに表示
    Alert.alert(
      '新着メッセージ',
      `${packet.payload.content}\n\nFrom: ${packet.payload.from.slice(0, 8)}...`,
      [{text: 'OK'}]
    );
  }

  // メッセージ送信ラッパー
  const handleSendMessage = useCallback(
    async (nodeId: string, content: string) => {
      try {
        // MessagePacketを構築してsendMessageに渡す
        const packet: MessagePacket = {
          version: 1,
          type: 'message',
          payload: {
            id: '', // BleManagerで生成される
            from: '', // BleManagerで設定される
            to: nodeId,
            content,
            timestamp: Date.now(),
            ttl: 3,
            signature: '', // BleManagerで生成される
          },
        };

        await sendMessage(nodeId, packet);
      } catch (error) {
        console.error('Send message error:', error);
        throw error;
      }
    },
    [sendMessage]
  );

  // 初期化処理（初回のみ実行）
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Requesting Bluetooth permissions...');
        const permissionResult = await requestBluetoothPermissions();

        if (!permissionResult.granted) {
          const errorMessage = getPermissionErrorMessage(
            permissionResult.deniedPermissions
          );
          Alert.alert('権限エラー', errorMessage);
          setIsInitializing(false);
          return;
        }

        setPermissionsGranted(true);
        console.log('Permissions granted, initializing BLE...');

        const bleInitialized = await initialize();
        if (!bleInitialized) {
          Alert.alert('エラー', 'BLEの初期化に失敗しました');
          setIsInitializing(false);
          return;
        }

        console.log('BLE initialized successfully');

        // 初期化完了後、自動でスキャン開始
        await startScan();

        setIsInitializing(false);
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('エラー', 'アプリの初期化に失敗しました');
        setIsInitializing(false);
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回のみ実行

  // エラー表示
  useEffect(() => {
    if (error) {
      Alert.alert('BLEエラー', error);
    }
  }, [error]);

  // 初期化中の表示
  if (isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>初期化中...</Text>
        <Text style={styles.loadingSubtext}>
          Bluetooth権限を確認しています
        </Text>
      </View>
    );
  }

  // 権限が許可されていない場合
  if (!permissionsGranted) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.errorText}>⚠️</Text>
        <Text style={styles.errorTitle}>権限が必要です</Text>
        <Text style={styles.errorMessage}>
          DisasterMeshを使用するには、Bluetooth権限が必要です。
          {'\n\n'}
          アプリの設定から権限を許可してください。
        </Text>
      </View>
    );
  }

  // BLE初期化失敗
  if (!isInitialized) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.errorText}>❌</Text>
        <Text style={styles.errorTitle}>初期化エラー</Text>
        <Text style={styles.errorMessage}>
          BLEの初期化に失敗しました。
          {'\n\n'}
          アプリを再起動してください。
        </Text>
      </View>
    );
  }

  // メインアプリ画面
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <AppNavigator
        isScanning={isScanning}
        discoveredDevices={discoveredDevices}
        connectedNodes={connectedNodes}
        onStartScan={startScan}
        onStopScan={stopScan}
        onConnectDevice={connectToDevice}
        onDisconnectDevice={disconnectFromDevice}
        onSendMessage={handleSendMessage}
        onMessageReceived={handleMessageReceived}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default App;
