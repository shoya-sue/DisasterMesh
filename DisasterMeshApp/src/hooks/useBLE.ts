/**
 * DisasterMesh - useBLE Hook
 *
 * BLE機能をReactコンポーネントで使用するためのカスタムフック
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Peripheral, PeripheralInfo } from 'react-native-ble-manager';
import BleManagerService from '../services/BleManager';
import { MessagePacket } from '../types/message';
import { Node, getSignalStrength } from '../types/node';
import {
  requestBluetoothPermissions,
  checkBluetoothPermissions,
} from '../utils/permissions';

/**
 * useBLE フックの戻り値の型
 */
export interface UseBLEReturn {
  // 状態
  isScanning: boolean;
  isInitialized: boolean;
  discoveredDevices: Map<string, Peripheral>;
  connectedNodes: Node[];
  error: string | null;

  // 関数
  initialize: () => Promise<boolean>;
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  connectToDevice: (peripheralId: string) => Promise<void>;
  disconnectFromDevice: (peripheralId: string) => Promise<void>;
  sendMessage: (peripheralId: string, packet: MessagePacket) => Promise<void>;
  cleanup: () => Promise<void>;
}

/**
 * BLE機能を提供するカスタムフック
 */
export function useBLE(
  onMessageReceived?: (peripheralId: string, packet: MessagePacket) => void
): UseBLEReturn {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<
    Map<string, Peripheral>
  >(new Map());
  const [connectedNodes, setConnectedNodes] = useState<Node[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  /**
   * BLEマネージャーを初期化
   */
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      // 権限チェック
      const hasPermissions = await checkBluetoothPermissions();

      if (!hasPermissions) {
        // 権限リクエスト
        const result = await requestBluetoothPermissions();

        if (!result.granted) {
          setError('Bluetooth権限が拒否されました。設定から権限を許可してください。');
          return false;
        }
      }

      // BLE Managerを初期化
      await BleManagerService.initialize();

      // イベントハンドラーをセットアップ
      BleManagerService.setEventHandlers({
        onDiscoverPeripheral: (peripheral) => {
          if (isMounted.current) {
            setDiscoveredDevices((prev) => {
              const newMap = new Map(prev);
              newMap.set(peripheral.id, peripheral);
              return newMap;
            });
          }
        },

        onStopScan: () => {
          if (isMounted.current) {
            setIsScanning(false);
          }
        },

        onDisconnectPeripheral: (peripheral) => {
          if (isMounted.current) {
            setConnectedNodes((prev) =>
              prev.filter((node) => node.id !== peripheral.id)
            );
          }
        },

        onDidUpdateValueForCharacteristic: (data) => {
          // メッセージをデコード
          const packet = BleManagerService.decodeMessage(data.value);

          if (packet && onMessageReceived) {
            onMessageReceived(data.peripheral, packet);
          }
        },
      });

      setIsInitialized(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('[useBLE] Initialize failed:', err);
      setError('BLE初期化に失敗しました');
      return false;
    }
  }, [onMessageReceived]);

  /**
   * スキャンを開始
   */
  const startScan = useCallback(async (): Promise<void> => {
    if (!isInitialized) {
      setError('BLEが初期化されていません');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      await BleManagerService.startScan();
    } catch (err) {
      console.error('[useBLE] Start scan failed:', err);
      setError('スキャン開始に失敗しました');
      setIsScanning(false);
    }
  }, [isInitialized]);

  /**
   * スキャンを停止
   */
  const stopScan = useCallback(async (): Promise<void> => {
    try {
      await BleManagerService.stopScan();
      setIsScanning(false);
      setError(null);
    } catch (err) {
      console.error('[useBLE] Stop scan failed:', err);
      setError('スキャン停止に失敗しました');
    }
  }, []);

  /**
   * デバイスに接続
   */
  const connectToDevice = useCallback(
    async (peripheralId: string): Promise<void> => {
      try {
        await BleManagerService.connect(peripheralId);

        // 接続したデバイスをノードリストに追加
        const peripheral = discoveredDevices.get(peripheralId);
        if (peripheral) {
          const newNode: Node = {
            id: peripheralId,
            name: peripheral.name || `Node-${peripheralId.substring(0, 8)}`,
            rssi: peripheral.rssi || -100,
            connected: true,
            lastSeen: Date.now(),
            uptimeSeconds: 0,
          };

          setConnectedNodes((prev) => {
            // 重複チェック
            if (prev.some((node) => node.id === peripheralId)) {
              return prev;
            }
            return [...prev, newNode];
          });
        }

        setError(null);
      } catch (err) {
        console.error('[useBLE] Connect failed:', err);
        setError(`接続に失敗しました: ${peripheralId}`);
      }
    },
    [discoveredDevices]
  );

  /**
   * デバイスから切断
   */
  const disconnectFromDevice = useCallback(
    async (peripheralId: string): Promise<void> => {
      try {
        await BleManagerService.disconnect(peripheralId);
        setConnectedNodes((prev) =>
          prev.filter((node) => node.id !== peripheralId)
        );
        setError(null);
      } catch (err) {
        console.error('[useBLE] Disconnect failed:', err);
        setError(`切断に失敗しました: ${peripheralId}`);
      }
    },
    []
  );

  /**
   * メッセージを送信
   */
  const sendMessage = useCallback(
    async (peripheralId: string, packet: MessagePacket): Promise<void> => {
      try {
        await BleManagerService.sendMessage(peripheralId, packet);
        setError(null);
      } catch (err) {
        console.error('[useBLE] Send message failed:', err);
        setError('メッセージ送信に失敗しました');
      }
    },
    []
  );

  /**
   * クリーンアップ
   */
  const cleanup = useCallback(async (): Promise<void> => {
    try {
      await BleManagerService.cleanup();
      setIsInitialized(false);
      setIsScanning(false);
      setDiscoveredDevices(new Map());
      setConnectedNodes([]);
      setError(null);
    } catch (err) {
      console.error('[useBLE] Cleanup failed:', err);
    }
  }, []);

  /**
   * アンマウント時のクリーンアップ
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
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
    cleanup,
  };
}
