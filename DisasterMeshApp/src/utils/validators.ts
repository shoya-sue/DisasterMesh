/**
 * DisasterMesh - Validators Utility
 *
 * バリデーション関連のユーティリティ
 */

import { MESH_CONFIG } from '../constants/config';

/**
 * メッセージの長さをチェック
 */
export function validateMessageLength(message: string): boolean {
  return message.length > 0 && message.length <= MESH_CONFIG.MAX_MESSAGE_LENGTH;
}

/**
 * UUIDの形式をチェック
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Bluetooth デバイスIDの形式をチェック
 */
export function validateDeviceId(deviceId: string): boolean {
  return deviceId.length > 0 && deviceId.length <= 50;
}

/**
 * TTL値をチェック
 */
export function validateTTL(ttl: number): boolean {
  return ttl >= 0 && ttl <= MESH_CONFIG.DEFAULT_TTL;
}

/**
 * タイムスタンプをチェック
 */
export function validateTimestamp(timestamp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  const oneHourAgo = now - 3600;
  const oneHourLater = now + 3600;

  // タイムスタンプが前後1時間以内であることをチェック
  return timestamp >= oneHourAgo && timestamp <= oneHourLater;
}

/**
 * メッセージ内容のサニタイズ
 */
export function sanitizeMessageContent(content: string): string {
  // 制御文字を削除
  return content.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
}
