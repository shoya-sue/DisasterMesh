/**
 * DisasterMesh - Encryption Utilities
 *
 * メッセージの暗号化・復号化機能
 */

import CryptoJS from 'react-native-crypto-js';
import { getRandomValues } from 'react-native-get-random-values';

/**
 * ランダムな暗号化キーを生成
 */
export function generateEncryptionKey(): string {
  const array = new Uint8Array(32); // 256ビット
  getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * メッセージを暗号化
 * @param message - 暗号化するメッセージ
 * @param key - 暗号化キー（256ビット16進数文字列）
 * @returns 暗号化されたメッセージ（Base64）
 */
export function encryptMessage(message: string, key: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
    return encrypted;
  } catch (error) {
    console.error('[Encryption] Encrypt failed:', error);
    throw new Error('メッセージの暗号化に失敗しました');
  }
}

/**
 * 暗号化されたメッセージを復号化
 * @param encryptedMessage - 暗号化されたメッセージ（Base64）
 * @param key - 復号化キー（256ビット16進数文字列）
 * @returns 復号化されたメッセージ
 */
export function decryptMessage(encryptedMessage: string, key: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key);
    const message = decrypted.toString(CryptoJS.enc.Utf8);

    if (!message) {
      throw new Error('復号化に失敗しました');
    }

    return message;
  } catch (error) {
    console.error('[Encryption] Decrypt failed:', error);
    throw new Error('メッセージの復号化に失敗しました');
  }
}

/**
 * メッセージの署名を生成（HMAC-SHA256）
 * @param message - 署名するメッセージ
 * @param privateKey - 秘密鍵
 * @returns 署名（16進数文字列）
 */
export function signMessage(message: string, privateKey: string): string {
  try {
    const signature = CryptoJS.HmacSHA256(message, privateKey).toString();
    return signature;
  } catch (error) {
    console.error('[Encryption] Sign failed:', error);
    throw new Error('署名の生成に失敗しました');
  }
}

/**
 * メッセージの署名を検証
 * @param message - 検証するメッセージ
 * @param signature - 署名
 * @param publicKey - 公開鍵
 * @returns 検証結果
 */
export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const expectedSignature = CryptoJS.HmacSHA256(message, publicKey).toString();
    return signature === expectedSignature;
  } catch (error) {
    console.error('[Encryption] Verify failed:', error);
    return false;
  }
}

/**
 * ハッシュ値を生成（SHA-256）
 * @param data - ハッシュ化するデータ
 * @returns ハッシュ値（16進数文字列）
 */
export function hash(data: string): string {
  try {
    return CryptoJS.SHA256(data).toString();
  } catch (error) {
    console.error('[Encryption] Hash failed:', error);
    throw new Error('ハッシュ化に失敗しました');
  }
}
