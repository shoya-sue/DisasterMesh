/**
 * DisasterMesh - NodeScreen
 *
 * ノード管理画面
 * - 発見されたデバイスの一覧表示
 * - 接続/切断操作
 * - 信号強度(RSSI)表示
 * - デバイススキャン制御
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type {Node} from '../types/node';
import type {Peripheral} from 'react-native-ble-manager';

interface NodeScreenProps {
  isScanning: boolean;
  discoveredDevices: Map<string, Peripheral>;
  connectedNodes: Node[];
  onStartScan: () => Promise<void>;
  onStopScan: () => Promise<void>;
  onConnectDevice: (peripheralId: string) => Promise<void>;
  onDisconnectDevice: (peripheralId: string) => Promise<void>;
}

export default function NodeScreen({
  isScanning,
  discoveredDevices,
  connectedNodes,
  onStartScan,
  onStopScan,
  onConnectDevice,
  onDisconnectDevice,
}: NodeScreenProps) {
  const [connectingDevices, setConnectingDevices] = useState<Set<string>>(
    new Set()
  );
  const [disconnectingDevices, setDisconnectingDevices] = useState<Set<string>>(
    new Set()
  );

  // スキャン開始/停止
  const handleToggleScan = useCallback(async () => {
    try {
      if (isScanning) {
        await onStopScan();
      } else {
        await onStartScan();
      }
    } catch (error) {
      Alert.alert('エラー', 'スキャン操作に失敗しました');
      console.error('Scan toggle error:', error);
    }
  }, [isScanning, onStartScan, onStopScan]);

  // デバイスに接続
  const handleConnect = useCallback(
    async (peripheralId: string) => {
      setConnectingDevices(prev => new Set(prev).add(peripheralId));
      try {
        await onConnectDevice(peripheralId);
        Alert.alert('成功', 'デバイスに接続しました');
      } catch (error) {
        Alert.alert('エラー', 'デバイスへの接続に失敗しました');
        console.error('Connect error:', error);
      } finally {
        setConnectingDevices(prev => {
          const newSet = new Set(prev);
          newSet.delete(peripheralId);
          return newSet;
        });
      }
    },
    [onConnectDevice]
  );

  // デバイスから切断
  const handleDisconnect = useCallback(
    async (peripheralId: string) => {
      setDisconnectingDevices(prev => new Set(prev).add(peripheralId));
      try {
        await onDisconnectDevice(peripheralId);
        Alert.alert('成功', 'デバイスから切断しました');
      } catch (error) {
        Alert.alert('エラー', 'デバイスからの切断に失敗しました');
        console.error('Disconnect error:', error);
      } finally {
        setDisconnectingDevices(prev => {
          const newSet = new Set(prev);
          newSet.delete(peripheralId);
          return newSet;
        });
      }
    },
    [onDisconnectDevice]
  );

  // 信号強度のレベルを取得
  const getSignalLevel = (rssi: number): string => {
    if (rssi >= -50) return '優';
    if (rssi >= -70) return '良';
    if (rssi >= -85) return '可';
    return '弱';
  };

  // 信号強度の色を取得
  const getSignalColor = (rssi: number): string => {
    if (rssi >= -50) return '#4CAF50';
    if (rssi >= -70) return '#8BC34A';
    if (rssi >= -85) return '#FFC107';
    return '#F44336';
  };

  // デバイスが接続中かチェック
  const isDeviceConnected = (peripheralId: string): boolean => {
    return connectedNodes.some(node => node.id === peripheralId);
  };

  // デバイスリストのレンダリング
  const renderDeviceItem = ({item}: {item: [string, Peripheral]}) => {
    const [peripheralId, peripheral] = item;
    const isConnected = isDeviceConnected(peripheralId);
    const isConnecting = connectingDevices.has(peripheralId);
    const isDisconnecting = disconnectingDevices.has(peripheralId);
    const isProcessing = isConnecting || isDisconnecting;

    const connectedNode = connectedNodes.find(node => node.id === peripheralId);
    const rssi = connectedNode?.rssi || peripheral.rssi || -100;

    return (
      <View style={styles.deviceItem}>
        {/* デバイス情報 */}
        <View style={styles.deviceInfo}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>
              {peripheral.name || 'Unknown Device'}
            </Text>
            {isConnected && (
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>接続中</Text>
              </View>
            )}
          </View>
          <Text style={styles.deviceId}>ID: {peripheralId.slice(0, 16)}...</Text>

          {/* 信号強度 */}
          <View style={styles.signalContainer}>
            <Text style={styles.signalLabel}>信号強度:</Text>
            <View
              style={[
                styles.signalBadge,
                {backgroundColor: getSignalColor(rssi)},
              ]}>
              <Text style={styles.signalValue}>{getSignalLevel(rssi)}</Text>
            </View>
            <Text style={styles.rssiValue}>{rssi} dBm</Text>
          </View>

          {/* 接続時間（接続中のみ） */}
          {isConnected && connectedNode && (
            <Text style={styles.uptimeText}>
              稼働時間: {Math.floor(connectedNode.uptimeSeconds / 60)} 分
            </Text>
          )}
        </View>

        {/* 接続/切断ボタン */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            isConnected ? styles.disconnectButton : styles.connectButton,
            isProcessing && styles.actionButtonDisabled,
          ]}
          onPress={() =>
            isConnected
              ? handleDisconnect(peripheralId)
              : handleConnect(peripheralId)
          }
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>
              {isConnected ? '切断' : '接続'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // デバイス配列を作成
  const deviceArray = Array.from(discoveredDevices.entries());

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ノード管理</Text>
        <Text style={styles.headerSubtitle}>
          発見: {discoveredDevices.size} / 接続: {connectedNodes.length}
        </Text>
      </View>

      {/* スキャン制御ボタン */}
      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[
            styles.scanButton,
            isScanning ? styles.scanButtonActive : styles.scanButtonInactive,
          ]}
          onPress={handleToggleScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'スキャン停止' : 'スキャン開始'}
          </Text>
        </TouchableOpacity>
        {isScanning && (
          <View style={styles.scanningIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.scanningText}>スキャン中...</Text>
          </View>
        )}
      </View>

      {/* デバイス一覧 */}
      <FlatList
        data={deviceArray}
        renderItem={renderDeviceItem}
        keyExtractor={item => item[0]}
        style={styles.deviceList}
        contentContainerStyle={styles.deviceListContent}
        refreshControl={
          <RefreshControl
            refreshing={isScanning}
            onRefresh={handleToggleScan}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>デバイスが見つかりません</Text>
            <Text style={styles.emptySubtext}>
              「スキャン開始」ボタンを押して近くのデバイスを探します
            </Text>
          </View>
        }
      />

      {/* 接続数警告 */}
      {connectedNodes.length >= 3 && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ 最大接続数に達しました（3台）
          </Text>
        </View>
      )}
    </View>
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
  controlContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scanButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonActive: {
    backgroundColor: '#F44336',
  },
  scanButtonInactive: {
    backgroundColor: '#007AFF',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  scanningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  deviceList: {
    flex: 1,
  },
  deviceListContent: {
    padding: 16,
  },
  deviceItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  connectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  connectedBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  deviceId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  signalLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  signalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  signalValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  rssiValue: {
    fontSize: 12,
    color: '#999',
  },
  uptimeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#007AFF',
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonDisabled: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
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
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFE082',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});
