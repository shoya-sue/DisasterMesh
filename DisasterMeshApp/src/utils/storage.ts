/**
 * DisasterMesh - Storage Utility
 *
 * ローカルストレージ操作のユーティリティ
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types/message';
import { Node } from '../types/node';
import { STORAGE_KEYS } from '../constants/config';

/**
 * メッセージを保存
 */
export async function saveMessages(messages: Message[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, jsonValue);
  } catch (error) {
    console.error('[Storage] Save messages failed:', error);
    throw error;
  }
}

/**
 * メッセージを読み込み
 */
export async function loadMessages(): Promise<Message[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('[Storage] Load messages failed:', error);
    return [];
  }
}

/**
 * ノード情報を保存
 */
export async function saveNodes(nodes: Node[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(nodes);
    await AsyncStorage.setItem(STORAGE_KEYS.NODES, jsonValue);
  } catch (error) {
    console.error('[Storage] Save nodes failed:', error);
    throw error;
  }
}

/**
 * ノード情報を読み込み
 */
export async function loadNodes(): Promise<Node[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.NODES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('[Storage] Load nodes failed:', error);
    return [];
  }
}

/**
 * デバイスIDを保存
 */
export async function saveDeviceId(deviceId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  } catch (error) {
    console.error('[Storage] Save device ID failed:', error);
    throw error;
  }
}

/**
 * デバイスIDを読み込み
 */
export async function loadDeviceId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  } catch (error) {
    console.error('[Storage] Load device ID failed:', error);
    return null;
  }
}

/**
 * ウォレット公開鍵を保存
 */
export async function saveWalletPublicKey(publicKey: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WALLET_PUBLIC_KEY, publicKey);
  } catch (error) {
    console.error('[Storage] Save wallet public key failed:', error);
    throw error;
  }
}

/**
 * ウォレット公開鍵を読み込み
 */
export async function loadWalletPublicKey(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.WALLET_PUBLIC_KEY);
  } catch (error) {
    console.error('[Storage] Load wallet public key failed:', error);
    return null;
  }
}

/**
 * すべてのデータをクリア
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.clear();
    console.log('[Storage] All data cleared');
  } catch (error) {
    console.error('[Storage] Clear all data failed:', error);
    throw error;
  }
}
