/**
 * DisasterMesh - Crypto Utility
 *
 * 暗号化・ハッシュ化関連のユーティリティ
 */

import CryptoJS from 'react-native-crypto-js';

/**
 * SHA-256ハッシュを生成
 */
export function generateSHA256Hash(data: string): string {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

/**
 * メッセージの署名を生成
 */
export function generateMessageSignature(
  from: string,
  to: string,
  content: string,
  timestamp: number
): string {
  const data = `${from}:${to}:${content}:${timestamp}`;
  return generateSHA256Hash(data);
}

/**
 * メッセージの署名を検証
 */
export function verifyMessageSignature(
  from: string,
  to: string,
  content: string,
  timestamp: number,
  signature: string
): boolean {
  const expectedSignature = generateMessageSignature(from, to, content, timestamp);
  return expectedSignature === signature;
}

/**
 * UUID v4を生成
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
