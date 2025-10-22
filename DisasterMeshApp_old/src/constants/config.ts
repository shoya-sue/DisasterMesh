/**
 * DisasterMesh - Configuration Constants
 *
 * アプリケーション全体で使用する定数を定義
 */

// Bluetooth LE設定
export const BLE_CONFIG = {
  // カスタムBLE Service UUID (DisasterMesh専用)
  SERVICE_UUID: '0000fff0-0000-1000-8000-00805f9b34fb',

  // Characteristic UUIDs
  CHARACTERISTICS: {
    MESSAGE_TX: '0000fff1-0000-1000-8000-00805f9b34fb',  // メッセージ送信
    MESSAGE_RX: '0000fff2-0000-1000-8000-00805f9b34fb',  // メッセージ受信
    NODE_INFO: '0000fff3-0000-1000-8000-00805f9b34fb',   // ノード情報
  },

  // スキャン設定
  SCAN_INTERVAL: 5000,        // スキャン間隔（ミリ秒）
  SCAN_DURATION: 5000,        // スキャン継続時間（ミリ秒）

  // 接続設定
  MAX_CONNECTIONS: 3,         // 最大同時接続数
  RETRY_ATTEMPTS: 3,          // 再接続試行回数
  RETRY_DELAY: 10000,         // 再接続待機時間（ミリ秒）
};

// メッシュネットワーク設定
export const MESH_CONFIG = {
  // TTL（Time To Live）設定
  DEFAULT_TTL: 3,             // デフォルトホップ数

  // メッセージ設定
  MAX_MESSAGE_LENGTH: 256,    // 最大メッセージ長（文字）
  MESSAGE_CACHE_SIZE: 1000,   // メッセージキャッシュサイズ

  // ルーティング設定
  ROUTING_ALGORITHM: 'flooding', // ルーティングアルゴリズム
};

// Solana設定
export const SOLANA_CONFIG = {
  // ネットワーク設定
  CLUSTER: 'devnet' as const,
  RPC_ENDPOINT: 'https://api.devnet.solana.com',

  // プログラムID（デプロイ後に更新）
  PROGRAM_ID: 'YourProgramIDHere',

  // 報酬設定
  REWARD_PER_HOUR: 0.1,       // 1時間あたりの報酬（トークン）

  // トランザクション設定
  CONFIRMATION_TIMEOUT: 30000, // 確認タイムアウト（ミリ秒）
};

// UI設定
export const UI_CONFIG = {
  // 色設定
  COLORS: {
    PRIMARY: '#007AFF',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    BACKGROUND: '#F2F2F7',
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#8E8E93',
  },

  // フォント設定
  FONT_SIZES: {
    SMALL: 12,
    MEDIUM: 16,
    LARGE: 20,
    EXTRA_LARGE: 24,
  },

  // スペーシング
  SPACING: {
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
  },
};

// ストレージキー
export const STORAGE_KEYS = {
  MESSAGES: '@DisasterMesh:messages',
  NODES: '@DisasterMesh:nodes',
  APP_STATE: '@DisasterMesh:appState',
  WALLET_PUBLIC_KEY: '@DisasterMesh:walletPublicKey',
  DEVICE_ID: '@DisasterMesh:deviceId',
};

// アプリ情報
export const APP_INFO = {
  NAME: 'DisasterMesh',
  VERSION: '1.0.0',
  DESCRIPTION: 'Disaster-resilient mesh network powered by Solana DePIN',
};

// パフォーマンス設定
export const PERFORMANCE = {
  MAX_MEMORY_MB: 200,
  MAX_STORAGE_MB: 50,
  MESSAGE_RETENTION_DAYS: 30,
  LOG_RETENTION_DAYS: 7,
};
