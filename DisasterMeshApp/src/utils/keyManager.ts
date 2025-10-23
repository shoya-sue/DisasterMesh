/**
 * DisasterMesh - Key Management Utilities
 *
 * 暗号化キーの管理機能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {generateEncryptionKey} from './encryption';

const ENCRYPTION_KEY_STORAGE_KEY = '@DisasterMesh:encryptionKey';
const SIGNING_KEY_STORAGE_KEY = '@DisasterMesh:signingKey';

/**
 * 暗号化キーを取得（存在しない場合は生成）
 */
export async function getEncryptionKey(): Promise<string> {
  try {
    // 既存のキーを取得
    let key = await AsyncStorage.getItem(ENCRYPTION_KEY_STORAGE_KEY);

    // キーが存在しない場合は新規生成
    if (!key) {
      key = generateEncryptionKey();
      await AsyncStorage.setItem(ENCRYPTION_KEY_STORAGE_KEY, key);
      console.log('[KeyManager] Generated new encryption key');
    }

    return key;
  } catch (error) {
    console.error('[KeyManager] Failed to get encryption key:', error);
    throw new Error('暗号化キーの取得に失敗しました');
  }
}

/**
 * 署名キーを取得（存在しない場合は生成）
 */
export async function getSigningKey(): Promise<string> {
  try {
    // 既存のキーを取得
    let key = await AsyncStorage.getItem(SIGNING_KEY_STORAGE_KEY);

    // キーが存在しない場合は新規生成
    if (!key) {
      key = generateEncryptionKey(); // 署名キーも256ビットランダムキー
      await AsyncStorage.setItem(SIGNING_KEY_STORAGE_KEY, key);
      console.log('[KeyManager] Generated new signing key');
    }

    return key;
  } catch (error) {
    console.error('[KeyManager] Failed to get signing key:', error);
    throw new Error('署名キーの取得に失敗しました');
  }
}

/**
 * 暗号化キーをリセット（新しいキーを生成）
 */
export async function resetEncryptionKey(): Promise<string> {
  try {
    const newKey = generateEncryptionKey();
    await AsyncStorage.setItem(ENCRYPTION_KEY_STORAGE_KEY, newKey);
    console.log('[KeyManager] Encryption key reset');
    return newKey;
  } catch (error) {
    console.error('[KeyManager] Failed to reset encryption key:', error);
    throw new Error('暗号化キーのリセットに失敗しました');
  }
}

/**
 * 署名キーをリセット（新しいキーを生成）
 */
export async function resetSigningKey(): Promise<string> {
  try {
    const newKey = generateEncryptionKey();
    await AsyncStorage.setItem(SIGNING_KEY_STORAGE_KEY, newKey);
    console.log('[KeyManager] Signing key reset');
    return newKey;
  } catch (error) {
    console.error('[KeyManager] Failed to reset signing key:', error);
    throw new Error('署名キーのリセットに失敗しました');
  }
}

/**
 * すべてのキーを削除
 */
export async function clearAllKeys(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      ENCRYPTION_KEY_STORAGE_KEY,
      SIGNING_KEY_STORAGE_KEY,
    ]);
    console.log('[KeyManager] All keys cleared');
  } catch (error) {
    console.error('[KeyManager] Failed to clear keys:', error);
    throw new Error('キーのクリアに失敗しました');
  }
}

/**
 * 暗号化キーを手動で設定（デバッグ用）
 */
export async function setEncryptionKey(key: string): Promise<void> {
  try {
    await AsyncStorage.setItem(ENCRYPTION_KEY_STORAGE_KEY, key);
    console.log('[KeyManager] Encryption key set manually');
  } catch (error) {
    console.error('[KeyManager] Failed to set encryption key:', error);
    throw new Error('暗号化キーの設定に失敗しました');
  }
}

/**
 * 署名キーを手動で設定（デバッグ用）
 */
export async function setSigningKey(key: string): Promise<void> {
  try {
    await AsyncStorage.setItem(SIGNING_KEY_STORAGE_KEY, key);
    console.log('[KeyManager] Signing key set manually');
  } catch (error) {
    console.error('[KeyManager] Failed to set signing key:', error);
    throw new Error('署名キーの設定に失敗しました');
  }
}
