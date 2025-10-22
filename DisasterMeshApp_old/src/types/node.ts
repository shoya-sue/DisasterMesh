/**
 * DisasterMesh - Node Type Definitions
 *
 * ノード関連の型定義
 */

/**
 * ノード情報
 */
export interface Node {
  id: string;                // BLEデバイスID
  name: string;              // ノード名（ユーザー設定可能）
  publicKey?: string;        // Solanaウォレット公開鍵
  rssi: number;              // 信号強度 (dBm)
  connected: boolean;        // 接続状態
  lastSeen: number;          // 最終接続時刻 (Unix timestamp)
  uptimeSeconds: number;     // 累計稼働時間（秒）
}

/**
 * ノード接続状態
 */
export type NodeConnectionState = 'connected' | 'connecting' | 'disconnected';

/**
 * 信号強度レベル
 */
export type SignalStrength = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * 信号強度を判定
 */
export function getSignalStrength(rssi: number): SignalStrength {
  if (rssi >= -50) return 'excellent';
  if (rssi >= -60) return 'good';
  if (rssi >= -70) return 'fair';
  return 'poor';
}

/**
 * 信号強度の表示名
 */
export const SIGNAL_STRENGTH_LABEL: Record<SignalStrength, string> = {
  excellent: '優',
  good: '良',
  fair: '中',
  poor: '弱',
};
