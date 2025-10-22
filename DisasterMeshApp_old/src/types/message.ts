/**
 * DisasterMesh - Message Type Definitions
 *
 * メッセージ関連の型定義
 */

/**
 * メッセージステータス
 */
export type MessageStatus = 'sent' | 'received' | 'forwarded';

/**
 * メッセージタイプ
 */
export type MessageType = 'message' | 'ack' | 'ping';

/**
 * メッセージオブジェクト
 */
export interface Message {
  id: string;                // UUID v4
  from: string;              // 送信者デバイスID
  to: string;                // 受信者デバイスID ("broadcast" for all)
  content: string;           // メッセージ本文
  timestamp: number;         // Unix timestamp (秒)
  ttl: number;               // Time To Live (ホップ数)
  signature: string;         // メッセージハッシュ
  status: MessageStatus;     // メッセージステータス
  read: boolean;             // 既読フラグ
}

/**
 * BLE送信用メッセージペイロード
 */
export interface MessagePayload {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  ttl: number;
  signature: string;
}

/**
 * BLE送信用メッセージパケット
 */
export interface MessagePacket {
  version: number;           // プロトコルバージョン
  type: MessageType;         // メッセージタイプ
  payload: MessagePayload;   // ペイロード
}

/**
 * メッセージ作成パラメータ
 */
export interface CreateMessageParams {
  to: string;
  content: string;
}

/**
 * メッセージフィルタ
 */
export interface MessageFilter {
  from?: string;
  to?: string;
  status?: MessageStatus;
  startDate?: number;
  endDate?: number;
}
