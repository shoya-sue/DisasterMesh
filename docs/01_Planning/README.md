# 災害時緊急通信DePINネットワーク
## Cypherpunk Hackathon 企画書

---

## 📋 プロジェクト概要

**プロジェクト名**: DisasterMesh（仮称）

**キャッチコピー**: スマートフォンが創る、災害に強い分散型通信インフラ

**コンセプト**: 
日本の地震・台風などの災害時に、個人のスマートフォンをメッシュネットワークノードとして機能させ、通信インフラが破壊された地域でも通信を維持。平時はSolanaトークン報酬で待機ノード運営者にインセンティブを提供する。

**開発者**: 個人開発者（1名）

**開発期間**: 2-3週間

**対象**: Cypherpunk Hackathon - Mobile DePIN

---

## 🌍 背景・課題

### 災害時の通信インフラの脆弱性

自然災害により従来のインフラは維持できなくなり、代替的な革新的ソリューションが必要とされています。モバイルメッシュネットワークは、同じ部屋のデバイス接続から、自然災害時の実際的な問題への対処まで、幅広いソリューションを提供します。

### 日本特有の課題

- 地震、台風、津波などの自然災害が多発
- 2011年東日本大震災での通信インフラ崩壊の教訓
- 過疎地域・離島での通信インフラ維持コストの問題

### DePINによる解決可能性

DePINネットワークは必要な場所にカバレッジ/容量を迅速に作成でき、従来のモデルよりも速くカバレッジを展開できます。また、CAPEX不要のスケーラビリティにより、拡張が資本集約的なインフラプロジェクトに制限されなくなります。

---

## 💡 ソリューション概要

### コア機能（個人開発版・最小構成）

#### 1. オフライン緊急メッセージング
- Bluetooth Low Energyによる端末間直接通信
- インターネット接続なしで最大100メートル範囲での通信
- シンプルなテキストメッセージ送受信
- メッセージ履歴のローカル保存

#### 2. メッシュネットワーク形成
- 2-3ホップのマルチホップ転送
- 自動ノード検出・接続
- 基本的なメッセージルーティング

#### 3. Solanaトークン報酬デモ
- Devnetでの報酬配布シミュレーション
- ノード稼働時間の記録
- オンライン復帰時の報酬請求

#### 4. シンプルなUI
- ノード一覧表示
- メッセージ送受信画面
- 報酬残高表示

### 削除した機能（フルバージョンで実装）

- ❌ 位置情報の可視化（地図表示）
- ❌ 高度な暗号化機能
- ❌ 大規模ネットワーク対応（10+ノード）
- ❌ バッテリー最適化機能
- ❌ 優先度制御システム
- ❌ iOS対応

---

## 🏗️ 技術アーキテクチャ（最小構成）

### システム構成図

```
┌─────────────────────────────────────────────┐
│          DisasterMesh アプリ                 │
│  ┌─────────────────────────────────────┐   │
│  │        React Native UI層            │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │     Bluetooth LE メッシュ層          │   │
│  │  - ノード検出・接続                   │   │
│  │  - メッセージルーティング              │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │      Solana Mobile Stack            │   │
│  │  - Mobile Wallet Adapter            │   │
│  │  - Web3.js                          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│      Solana Devnet (テストネット)            │
│  - スマートコントラクト（報酬配布）            │
│  - トークンミント                            │
└─────────────────────────────────────────────┘
```

### 技術スタック

**フロントエンド（モバイルアプリ）**
```yaml
フレームワーク: React Native
理由: 
  - Web3.jsとの互換性
  - Solana Mobile Stack公式サポート
  - JavaScript/TypeScriptで開発可能

必要なライブラリ:
  - @solana-mobile/mobile-wallet-adapter-protocol
  - @solana/web3.js
  - react-native-ble-manager (Bluetooth制御)
  - react-native-async-storage (ローカルストレージ)
```

**ブロックチェーン層**
```yaml
ネットワーク: Solana Devnet
スマートコントラクト: Anchor Framework (Rust)
主要機能:
  - ノード稼働時間の記録
  - 報酬計算・配布
  - メッセージ転送カウント
```

**通信層**
```yaml
プロトコル: Bluetooth Low Energy (BLE)
範囲: 約30メートル（屋外）
トポロジー: メッシュネットワーク（フラッディング方式）
```

---

## 📱 開発計画（個人開発者向け・3週間）

### Week 1: 環境構築 + 基礎実装

**Day 1-2: 開発環境セットアップ**
- [ ] Node.js、Android Studioインストール
- [ ] React Native環境構築
- [ ] Solana CLI、Anchor Frameworkセットアップ
- [ ] テスト用Devnetウォレット作成

**Day 3-5: BLE基礎実装**
```javascript
// BLE基本実装イメージ
import BleManager from 'react-native-ble-manager';

// ノード検出
function startScanning() {
  BleManager.scan([], 5, true)
    .then(() => console.log('Scanning...'));
}

// メッセージ送信
function sendMessage(deviceId, message) {
  const data = Buffer.from(message).toString('base64');
  BleManager.write(deviceId, serviceUUID, characteristicUUID, data);
}
```

**Day 6-7: 基本UI構築**
- メッセージ送受信画面
- ノード一覧画面
- 接続状態表示

### Week 2: コア機能開発

**Day 8-10: メッシュルーティング実装**
```javascript
// シンプルなメッセージルーティング
class MeshRouter {
  constructor() {
    this.routingTable = new Map();
    this.messageCache = new Set();
  }
  
  forwardMessage(message) {
    // 既に見たメッセージはスキップ
    if (this.messageCache.has(message.id)) return;
    
    this.messageCache.add(message.id);
    
    // TTL（Time To Live）チェック
    if (message.ttl <= 0) return;
    
    // 近隣ノードに転送
    this.broadcastToNeighbors({
      ...message,
      ttl: message.ttl - 1
    });
  }
}
```

**Day 11-12: Solana統合**
```rust
// Anchorスマートコントラクト（シンプル版）
#[program]
pub mod disaster_mesh {
    pub fn record_uptime(
        ctx: Context<RecordUptime>,
        duration_seconds: i64
    ) -> Result<()> {
        let node = &mut ctx.accounts.node_account;
        node.total_uptime += duration_seconds;
        
        // 1時間ごとに0.1トークン報酬
        let reward = (duration_seconds / 3600) * 100_000; // 0.1 SOL in lamports
        node.pending_rewards += reward;
        
        Ok(())
    }
}
```

**Day 13-14: ウォレット接続**
```typescript
// Mobile Wallet Adapter統合
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol';

async function claimRewards() {
  const result = await transact(async (wallet) => {
    const authResult = await wallet.authorize({
      cluster: 'devnet',
      identity: { name: 'DisasterMesh' }
    });
    
    // 報酬請求トランザクション署名・送信
    return await wallet.signAndSendTransactions({
      transactions: [rewardTransaction]
    });
  });
}
```

### Week 3: 統合・デモ準備

**Day 15-17: 統合テスト**
- 2-3台のデバイスでメッシュネットワークテスト
- オフライン→オンライン復帰シナリオテスト
- バグ修正

**Day 18-19: デモ準備**
- デモシナリオ作成（災害シミュレーション）
- スクリーンキャプチャ・デモビデオ撮影
- ピッチデック作成（10スライド程度）

**Day 20-21: 最終調整**
- コードクリーンアップ
- README作成（GitHub公開用）
- 提出物準備

---

## 🛠️ 必要な機材・技術（最小化）

### ハードウェア

| 項目 | 必要台数 | 仕様 | 推定コスト |
|------|---------|------|-----------|
| **開発用PC** | 1台 | メモリ16GB、SSD 256GB以上 | $0（既存使用） |
| **Androidスマホ** | 2-3台 | Android 12以上、BLE対応 | $300-900 |
| （テスト用） |  | 中古でOK（$150-300/台） |  |

**スマートフォン推奨機種**:
- Google Pixel 6a以降（中古 $200-300）
- Samsung Galaxy A53以降（中古 $150-250）
- または手持ちのAndroid端末

### ソフトウェア・開発環境

| ツール | バージョン | コスト |
|--------|-----------|--------|
| Node.js | 18.x以上 | 無料 |
| Android Studio | 最新版 | 無料 |
| VS Code | 最新版 | 無料 |
| Solana CLI | 1.18.x以上 | 無料 |
| Anchor | 0.29.x以上 | 無料 |
| Git | 最新版 | 無料 |

### クラウド・インフラ（最小化）

| サービス | 用途 | コスト |
|---------|------|--------|
| Solana Devnet | テストネット | **無料** |
| GitHub | コード管理 | **無料** |
| なし | サーバー不要 | **$0** |

**重要**: サーバーインフラは不要。すべてローカル開発とDevnetで完結。

---

## 💰 予算見積もり（最小構成・個人開発）

### 詳細見積もり

| カテゴリ | 項目 | 数量 | 単価 | 合計 |
|---------|------|------|------|------|
| **機材** | 中古Android端末 | 2台 | $200 | $400 |
|  | USBケーブル・充電器 | 1式 | $30 | $30 |
| **開発** | Solana Devnet | - | $0 | $0 |
|  | 開発ツール | - | $0 | $0 |
| **その他** | 予備費 | - | - | $70 |
| **合計** | | | | **$500** |

### コスト削減オプション

**$0で始める場合**:
- 手持ちのAndroidスマホ2台使用
- エミュレーターで初期開発（実機テストは後で）
- 友人から端末を借りる

**最低限必要な投資**: 
- 実機テスト用Android端末1台追加 = **$150-300**

---

## 🎯 開発スコープ（最小化版）

### ✅ 実装する機能（MUST HAVE）

1. **BLE通信**
   - 2台のデバイス間でのBLE接続
   - テキストメッセージ送受信（最大256文字）
   - 接続状態の可視化

2. **シンプルなメッシュ**
   - 2-3ホップのメッセージ転送
   - 基本的なフラッディングルーティング
   - メッセージ重複排除

3. **Solana統合**
   - Devnetウォレット接続
   - 稼働時間の手動記録ボタン
   - 報酬残高表示
   - トークン請求機能（デモ用）

4. **基本UI**
   - メッセージリスト
   - 送信フォーム
   - ノード一覧（接続中のデバイス）
   - シンプルなダッシュボード

### ⏰ 次フェーズで実装（時間があれば）

- 自動稼働時間トラッキング
- メッセージの暗号化
- 位置情報共有
- バッテリー最適化

### ❌ 削除した機能

- リアルタイム地図表示
- 大規模ネットワーク対応（10+ノード）
- iOS版
- 優先度制御
- 高度なセキュリティ機能

---

## 📊 期待される成果物

### ハッカソン提出物

1. **動作するAndroidアプリ（APK）**
   - GitHub公開
   - インストール手順書付き

2. **デモビデオ（3-5分）**
   - 災害シナリオのシミュレーション
   - 実機でのメッシュ通信デモ
   - Solana報酬配布の流れ

3. **ピッチデック（10スライド）**
   - 問題提起
   - ソリューション
   - 技術詳細
   - ビジネスモデル
   - 将来計画

4. **技術ドキュメント**
   - README（GitHub）
   - アーキテクチャ図
   - セットアップガイド
   - APIドキュメント（簡易版）

### デモシナリオ例

```
【災害発生シミュレーション】

1. 通常時（オンライン）
   - アプリ起動、ウォレット接続
   - 他のノードを自動検出
   
2. 災害発生（オフライン化）
   - 機内モードON（インターネット遮断）
   - BLEメッシュネットワーク自動形成
   - メッセージ送受信デモ
   
3. 救助・復旧（オンライン復帰）
   - 機内モードOFF
   - 稼働記録をSolanaに送信
   - 報酬トークン受取
```

---

## 🏆 審査基準との適合性

### (a) 機能性
**評価**: ⭐⭐⭐⭐ (4/5)
- 実際に動作するメッシュ通信
- Solana Devnet統合
- 2-3台でのデモ可能

### (b) 潜在的影響力
**評価**: ⭐⭐⭐⭐⭐ (5/5)
- 自然災害時に通信インフラ崩壊しても使える分散型通信
- 日本全国9,000万人のドコモユーザーが潜在対象
- 世界中の災害多発地域へ展開可能

### (c) 斬新さ
**評価**: ⭐⭐⭐⭐ (4/5)
- モバイル×ブロックチェーン×メッシュの融合
- DePINは2025年に市場規模250億ドル、350以上のトークンが存在する急成長分野
- 日本の災害対策インフラへの新アプローチ

### (d) ユーザー体験
**評価**: ⭐⭐⭐ (3/5)
- アプリ起動で自動的にノードとして機能
- Mobile Wallet Adapterによる統一されたウォレット体験
- シンプルなUI（個人開発版は最小限）

### (e) オープンソース性
**評価**: ⭐⭐⭐⭐⭐ (5/5)
- 完全オープンソース（MITライセンス）
- GitHub公開
- Solanaエコシステムと完全統合可能
- HeliumやHivemapperなど既存DePINとの相互運用可能

### (f) ビジネスプラン
**評価**: ⭐⭐⭐⭐ (4/5)

**フェーズ1（ハッカソン後 0-6ヶ月）**
- 自治体パイロットプログラム（3-5自治体）
- 防災訓練での実証実験

**フェーズ2（6-18ヶ月）**
- 災害時バックアップインフラとしての組み込み
- B2G（Business to Government）モデル

**フェーズ3（18ヶ月以降）**
- 全国展開
- 海外市場（東南アジア、中南米等）

**収益モデル**:
1. 自治体導入ライセンス
2. エンタープライズ版（企業BCP対策）
3. トークンエコノミー（ノード運営報酬の一部手数料）

---

## 📚 参考資料・技術リファレンス

### 既存プロジェクト

| プロジェクト | 参考にする点 | URL |
|------------|------------|-----|
| **Helium Mobile** | DePINトークンモデル | solana.com/news/only-possible-on-solana-helium |
| **FireChat** | BLEメッシュ実装 | - |
| **TxTenna** | オフラインブロックチェーン | coincenter.org |
| **SmartMesh** | オフライン決済 | smartmesh.io |

### 技術ドキュメント

- [Solana Mobile Docs](https://docs.solanamobile.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [React Native BLE Manager](https://github.com/innoveit/react-native-ble-manager)
- [Bluetooth Mesh Specification](https://www.bluetooth.com/specifications/specs/mesh-protocol/)

### 学習リソース

- [Solana Mobile Development Course](https://solana.com/developers/courses/mobile/intro-to-solana-mobile)
- [Building Mobile Apps on Solana](https://medium.com/@ayushkmrjha/building-mobile-apps-on-solana-a-technical-deep-dive-41d4817f4295)

---

## 🚀 提出物チェックリスト

### コード・アプリ

- [ ] GitHubリポジトリ（公開）
- [ ] APKファイル（インストール可能）
- [ ] README（セットアップ手順）
- [ ] ライセンス表記（MIT推奨）

### デモ

- [ ] デモビデオ（3-5分、YouTube公開）
- [ ] スクリーンショット（5-10枚）
- [ ] 災害シナリオスクリプト

### ドキュメント

- [ ] ピッチデック（PDF、10-15スライド）
- [ ] 技術仕様書（簡易版）
- [ ] アーキテクチャ図
- [ ] 将来計画・ロードマップ

### Solana統合証明

- [ ] スマートコントラクトコード（GitHub）
- [ ] Devnetデプロイ済みプログラムID
- [ ] トランザクション履歴（Solscan等）

---

## 📞 連絡先・リンク

**GitHub**: [準備中]

**デモビデオ**: [準備中]

**開発者情報**: [準備中]

---

## 📝 免責事項

本企画書は個人開発者向けの最小構成版です。完全版の実装には追加のリソース・時間・予算が必要です。

- 本デモはProof of Conceptであり、商用利用には追加の開発・テストが必要
- Bluetooth通信範囲は環境により変動（屋内10-30m、屋外最大100m）
- セキュリティ機能は最小限（エンドツーエンド暗号化は次フェーズ）
- 大規模災害での実証実験は未実施

---

## 🎉 まとめ

**DisasterMesh**は、Solana Mobile StackとBluetooth LEメッシュネットワークを組み合わせ、災害時でも通信を維持する革新的なDePINソリューションです。

日本の災害対策インフラに新しい選択肢を提供し、グローバルに展開可能なビジネスモデルを持つ本プロジェクトは、ハッカソンで高い評価を得られる可能性があります。

---

**作成日**: 2025年10月17日  
**バージョン**: 1.0（個人開発版）  
**対象ハッカソン**: Cypherpunk Hackathon - Mobile DePIN