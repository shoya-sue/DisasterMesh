/**
 * DisasterMesh - Solana Type Definitions
 *
 * Solana関連の型定義
 */

import { PublicKey } from '@solana/web3.js';

/**
 * ウォレット接続状態
 */
export type WalletConnectionState = 'connected' | 'connecting' | 'disconnected';

/**
 * ウォレット情報
 */
export interface WalletInfo {
  publicKey: PublicKey | null;
  connected: boolean;
}

/**
 * ノードアカウント（Solanaプログラム上のデータ）
 */
export interface NodeAccount {
  authority: PublicKey;      // ノード所有者
  totalUptime: number;       // 累計稼働時間（秒）
  pendingRewards: number;    // 保留中報酬 (lamports)
  claimedRewards: number;    // 獲得済み報酬 (lamports)
  lastUpdate: number;        // 最終更新時刻 (Unix timestamp)
}

/**
 * トランザクション結果
 */
export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * 報酬情報
 */
export interface RewardInfo {
  pending: number;           // 保留中報酬（トークン）
  claimed: number;           // 獲得済み報酬（トークン）
  total: number;             // 合計報酬（トークン）
}
