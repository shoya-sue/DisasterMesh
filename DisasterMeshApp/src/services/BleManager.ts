/**
 * DisasterMesh - BLE Manager Service
 *
 * Bluetooth LE通信を管理するサービス
 * - デバイススキャン
 * - 接続/切断管理
 * - メッセージ送受信
 */

import BleManager, {
  Peripheral,
  PeripheralInfo,
} from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { BLE_CONFIG } from '../constants/config';
import { MessagePacket } from '../types/message';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/**
 * BLEイベントハンドラーの型定義
 */
interface BleEventHandlers {
  onDiscoverPeripheral?: (peripheral: Peripheral) => void;
  onStopScan?: () => void;
  onDisconnectPeripheral?: (peripheral: Peripheral) => void;
  onPeripheralConnect?: (peripheral: Peripheral) => void;
  onDidUpdateValueForCharacteristic?: (data: {
    value: number[];
    peripheral: string;
    characteristic: string;
    service: string;
  }) => void;
}

/**
 * BLE Manager クラス
 */
class BleManagerService {
  private isScanning: boolean = false;
  private connectedDevices: Map<string, PeripheralInfo> = new Map();
  private eventHandlers: BleEventHandlers = {};
  private scanTimer: NodeJS.Timeout | null = null;

  /**
   * BLE Managerを初期化
   */
  async initialize(): Promise<void> {
    try {
      await BleManager.start({ showAlert: false });
      console.log('[BleManager] Initialized successfully');
      this.setupEventListeners();
    } catch (error) {
      console.error('[BleManager] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * イベントリスナーをセットアップ
   */
  private setupEventListeners(): void {
    // デバイス発見イベント
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral: Peripheral) => {
        console.log('[BleManager] Discovered peripheral:', peripheral.id);
        if (this.eventHandlers.onDiscoverPeripheral) {
          this.eventHandlers.onDiscoverPeripheral(peripheral);
        }
      }
    );

    // スキャン停止イベント
    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      console.log('[BleManager] Scan stopped');
      this.isScanning = false;
      if (this.eventHandlers.onStopScan) {
        this.eventHandlers.onStopScan();
      }
    });

    // 切断イベント
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      (peripheral: Peripheral) => {
        console.log('[BleManager] Peripheral disconnected:', peripheral.id);
        this.connectedDevices.delete(peripheral.id);
        if (this.eventHandlers.onDisconnectPeripheral) {
          this.eventHandlers.onDisconnectPeripheral(peripheral);
        }
      }
    );

    // 接続イベント
    bleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      (peripheral: Peripheral) => {
        console.log('[BleManager] Peripheral connected:', peripheral.id);
        if (this.eventHandlers.onPeripheralConnect) {
          this.eventHandlers.onPeripheralConnect(peripheral);
        }
      }
    );

    // Characteristicの値更新イベント
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      (data: {
        value: number[];
        peripheral: string;
        characteristic: string;
        service: string;
      }) => {
        console.log('[BleManager] Characteristic updated:', data.characteristic);
        if (this.eventHandlers.onDidUpdateValueForCharacteristic) {
          this.eventHandlers.onDidUpdateValueForCharacteristic(data);
        }
      }
    );
  }

  /**
   * イベントハンドラーを登録
   */
  setEventHandlers(handlers: BleEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * BLEスキャンを開始
   */
  async startScan(): Promise<void> {
    if (this.isScanning) {
      console.log('[BleManager] Already scanning');
      return;
    }

    try {
      this.isScanning = true;
      await BleManager.scan(
        [BLE_CONFIG.SERVICE_UUID],
        BLE_CONFIG.SCAN_DURATION / 1000,
        true
      );
      console.log('[BleManager] Scan started');

      // 定期的にスキャンを再開
      this.startPeriodicScan();
    } catch (error) {
      console.error('[BleManager] Scan failed:', error);
      this.isScanning = false;
      throw error;
    }
  }

  /**
   * 定期的なスキャンを開始
   */
  private startPeriodicScan(): void {
    if (this.scanTimer) {
      clearInterval(this.scanTimer);
    }

    this.scanTimer = setInterval(async () => {
      if (!this.isScanning) {
        try {
          await this.startScan();
        } catch (error) {
          console.error('[BleManager] Periodic scan failed:', error);
        }
      }
    }, BLE_CONFIG.SCAN_INTERVAL);
  }

  /**
   * BLEスキャンを停止
   */
  async stopScan(): Promise<void> {
    if (this.scanTimer) {
      clearInterval(this.scanTimer);
      this.scanTimer = null;
    }

    try {
      await BleManager.stopScan();
      this.isScanning = false;
      console.log('[BleManager] Scan stopped manually');
    } catch (error) {
      console.error('[BleManager] Stop scan failed:', error);
      throw error;
    }
  }

  /**
   * デバイスに接続
   */
  async connect(peripheralId: string): Promise<void> {
    try {
      // 既に接続されている場合はスキップ
      if (this.connectedDevices.has(peripheralId)) {
        console.log('[BleManager] Already connected to:', peripheralId);
        return;
      }

      // 最大接続数チェック
      if (this.connectedDevices.size >= BLE_CONFIG.MAX_CONNECTIONS) {
        throw new Error(
          `Maximum connections (${BLE_CONFIG.MAX_CONNECTIONS}) reached`
        );
      }

      await BleManager.connect(peripheralId);
      console.log('[BleManager] Connected to:', peripheralId);

      // デバイス情報を取得
      const peripheralInfo = await BleManager.retrieveServices(peripheralId);
      this.connectedDevices.set(peripheralId, peripheralInfo);

      // 通知を有効化
      await this.enableNotifications(peripheralId);
    } catch (error) {
      console.error('[BleManager] Connection failed:', error);
      throw error;
    }
  }

  /**
   * 通知を有効化
   */
  private async enableNotifications(peripheralId: string): Promise<void> {
    try {
      await BleManager.startNotification(
        peripheralId,
        BLE_CONFIG.SERVICE_UUID,
        BLE_CONFIG.CHARACTERISTICS.MESSAGE_RX
      );
      console.log('[BleManager] Notifications enabled for:', peripheralId);
    } catch (error) {
      console.error('[BleManager] Enable notifications failed:', error);
      throw error;
    }
  }

  /**
   * デバイスから切断
   */
  async disconnect(peripheralId: string): Promise<void> {
    try {
      await BleManager.disconnect(peripheralId);
      this.connectedDevices.delete(peripheralId);
      console.log('[BleManager] Disconnected from:', peripheralId);
    } catch (error) {
      console.error('[BleManager] Disconnection failed:', error);
      throw error;
    }
  }

  /**
   * メッセージを送信
   */
  async sendMessage(
    peripheralId: string,
    messagePacket: MessagePacket
  ): Promise<void> {
    try {
      // メッセージをJSON文字列に変換
      const jsonString = JSON.stringify(messagePacket);

      // Base64エンコード
      const base64Data = Buffer.from(jsonString, 'utf-8').toString('base64');

      // バイト配列に変換
      const byteArray = Buffer.from(base64Data, 'base64');

      // Characteristicに書き込み
      await BleManager.write(
        peripheralId,
        BLE_CONFIG.SERVICE_UUID,
        BLE_CONFIG.CHARACTERISTICS.MESSAGE_TX,
        Array.from(byteArray)
      );

      console.log('[BleManager] Message sent to:', peripheralId);
    } catch (error) {
      console.error('[BleManager] Send message failed:', error);
      throw error;
    }
  }

  /**
   * 受信データをデコード
   */
  decodeMessage(data: number[]): MessagePacket | null {
    try {
      // バイト配列を文字列に変換
      const base64String = Buffer.from(data).toString('utf-8');

      // Base64デコード
      const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');

      // JSONパース
      const messagePacket: MessagePacket = JSON.parse(jsonString);

      return messagePacket;
    } catch (error) {
      console.error('[BleManager] Decode message failed:', error);
      return null;
    }
  }

  /**
   * 接続中のデバイス一覧を取得
   */
  getConnectedDevices(): Map<string, PeripheralInfo> {
    return new Map(this.connectedDevices);
  }

  /**
   * 接続中かチェック
   */
  isConnected(peripheralId: string): boolean {
    return this.connectedDevices.has(peripheralId);
  }

  /**
   * クリーンアップ
   */
  async cleanup(): Promise<void> {
    // スキャン停止
    await this.stopScan();

    // すべてのデバイスから切断
    const disconnectPromises = Array.from(this.connectedDevices.keys()).map(
      (peripheralId) => this.disconnect(peripheralId)
    );
    await Promise.all(disconnectPromises);

    // イベントリスナーを削除
    bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerConnectPeripheral');
    bleManagerEmitter.removeAllListeners(
      'BleManagerDidUpdateValueForCharacteristic'
    );

    console.log('[BleManager] Cleanup completed');
  }
}

// シングルトンインスタンスをエクスポート
export default new BleManagerService();
