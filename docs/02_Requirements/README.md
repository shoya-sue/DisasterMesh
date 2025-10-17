# DisasterMesh - 要件定義書
## Bluetooth LEメッシュネットワーク × Solana DePIN

---

**プロジェクト名**: DisasterMesh
**バージョン**: 1.0
**作成日**: 2025年10月17日
**最終更新日**: 2025年10月17日
**対象**: MVP（Minimum Viable Product）開発

---

## 📑 目次

1. [概要](#概要)
2. [システム要件](#システム要件)
3. [機能要件](#機能要件)
4. [非機能要件](#非機能要件)
5. [技術要件](#技術要件)
6. [データ仕様](#データ仕様)
7. [インターフェース要件](#インターフェース要件)
8. [セキュリティ要件](#セキュリティ要件)
9. [テスト要件](#テスト要件)
10. [制約事項](#制約事項)

---

## 概要

### 1.1 プロジェクト目的

災害時の通信インフラ断絶に対応するため、Bluetooth LEメッシュネットワークとSolana DePINを組み合わせた分散型緊急通信システムを構築する。

### 1.2 スコープ

**MVP版に含まれる機能**:
- Bluetooth LEによる端末間通信
- 2-3ホップのメッシュネットワーク形成
- Solana Devnetとの統合（報酬システム）
- シンプルなUI（メッセージング、ノード管理、報酬表示）

**MVPに含まれない機能**:
- 位置情報の地図表示
- エンドツーエンド暗号化
- 大規模ネットワーク（10+ノード）
- iOS対応
- バッテリー最適化

### 1.3 ユーザーストーリー

#### US-001: 災害時のメッセージ送信
**As a** 災害被災者
**I want to** インターネットなしでメッセージを送信したい
**So that** 救助要請や安否確認ができる

**受け入れ基準**:
- 機内モード（オフライン）でもメッセージ送信可能
- BLE範囲内の端末にメッセージが届く
- メッセージ履歴がローカルに保存される

#### US-002: メッシュネットワーク経由の転送
**As a** ノード運営者
**I want to** 他のノード経由でメッセージを転送したい
**So that** BLE範囲外の端末にもメッセージが届く

**受け入れ基準**:
- 2-3ホップのメッセージ転送が可能
- メッセージの重複排除が機能する
- TTL（Time To Live）により無限ループを防止

#### US-003: Solana報酬の受け取り
**As a** ノード運営者
**I want to** ノード稼働時間に応じた報酬を受け取りたい
**So that** ノード運営のインセンティブが得られる

**受け入れ基準**:
- Solana Devnetウォレットに接続可能
- 稼働時間を記録できる
- 報酬残高を確認できる
- オンライン復帰時に報酬を請求できる

---

## システム要件

### 2.1 ハードウェア要件

#### 開発環境
| 項目 | 最小要件 | 推奨要件 |
|------|---------|---------|
| CPU | Intel Core i5 / Apple M1 | Intel Core i7 / Apple M2以上 |
| メモリ | 8GB RAM | 16GB RAM以上 |
| ストレージ | 20GB 空き容量 | 50GB 空き容量 |
| OS | macOS 12+ / Windows 10+ / Ubuntu 20.04+ | macOS 14+ / Windows 11 |

#### モバイルデバイス
| 項目 | 最小要件 | 推奨要件 |
|------|---------|---------|
| OS | Android 12 (API Level 31) | Android 13以上 |
| Bluetooth | BLE 5.0対応 | BLE 5.2以上 |
| メモリ | 3GB RAM | 6GB RAM以上 |
| ストレージ | 100MB 空き容量 | 500MB 空き容量 |

**推奨テスト端末**:
- Google Pixel 6a / 7 / 8
- Samsung Galaxy A53 / A54
- OnePlus Nord N20

### 2.2 ソフトウェア要件

#### 開発ツール
| ツール | バージョン | 目的 |
|--------|-----------|------|
| Node.js | 18.x 以上 | JavaScript実行環境 |
| npm/yarn | 最新版 | パッケージ管理 |
| Android Studio | Flamingo (2023.1.1) 以上 | Android開発環境 |
| JDK | 11 以上 | Java開発環境 |
| Rust | 1.70.0 以上 | Solanaスマートコントラクト開発 |
| Solana CLI | 1.18.x 以上 | Solanaツールチェーン |
| Anchor | 0.29.x 以上 | Solanaフレームワーク |

#### React Nativeライブラリ
```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@solana-mobile/mobile-wallet-adapter-protocol": "^2.0.0",
    "@solana-mobile/mobile-wallet-adapter-protocol-web3js": "^2.0.0",
    "@solana/web3.js": "^1.87.0",
    "react-native-ble-manager": "^11.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "buffer": "^6.0.3",
    "react-native-get-random-values": "^1.9.0"
  }
}
```

---

## 機能要件

### 3.1 Bluetooth LE通信機能

#### FR-BLE-001: BLEスキャニング
**優先度**: 高
**説明**: 近隣のDisasterMeshノードを自動検出する

**要件**:
- アプリ起動時に自動的にBLEスキャンを開始
- 5秒ごとにスキャンを繰り返す
- 検出されたノードをリスト表示
- バックグラウンドでもスキャン継続（Android制約内で）

**入力**: なし
**出力**: 検出されたノードリスト（デバイスID、信号強度）

**検証方法**:
- 2台の端末でアプリを起動し、互いに検出されることを確認
- 端末間の距離を変えて信号強度が変化することを確認

---

#### FR-BLE-002: BLE接続
**優先度**: 高
**説明**: 検出されたノードに対してBLE接続を確立

**要件**:
- 検出されたノードを選択して接続可能
- 接続状態（接続中/切断）を表示
- 複数ノード（最大3台）との同時接続をサポート
- 接続エラー時のリトライ機能（最大3回）

**入力**: ノードID
**出力**: 接続状態（成功/失敗）

**検証方法**:
- 複数端末への接続が可能であることを確認
- 接続エラー時にリトライが機能することを確認

---

#### FR-BLE-003: メッセージ送信
**優先度**: 高
**説明**: 接続されたノードにメッセージを送信

**要件**:
- テキストメッセージ（最大256文字）の送信
- UTF-8エンコーディング対応（日本語サポート）
- 送信成功/失敗のフィードバック表示
- 送信履歴のローカル保存

**入力**:
- 宛先ノードID（または全ノードブロードキャスト）
- メッセージ本文（string, max 256文字）

**出力**:
- 送信成功/失敗ステータス
- タイムスタンプ

**データフォーマット**:
```json
{
  "id": "uuid-v4",
  "from": "sender-device-id",
  "to": "recipient-device-id",
  "content": "メッセージ本文",
  "timestamp": 1697500000,
  "ttl": 3,
  "signature": "hash"
}
```

**検証方法**:
- 日本語メッセージが正しく送受信できることを確認
- 256文字制限が機能することを確認

---

#### FR-BLE-004: メッセージ受信
**優先度**: 高
**説明**: 他のノードからメッセージを受信し表示

**要件**:
- リアルタイムでメッセージ受信
- 受信メッセージをリスト表示（時系列順）
- 未読/既読状態の管理
- ローカルストレージへの保存（最大1000件）

**入力**: BLE経由の受信データ
**出力**: メッセージオブジェクト

**検証方法**:
- メッセージがリアルタイムで受信・表示されることを確認
- アプリ再起動後も履歴が保持されることを確認

---

### 3.2 メッシュネットワーク機能

#### FR-MESH-001: メッセージルーティング
**優先度**: 高
**説明**: 受信したメッセージを他のノードに転送

**要件**:
- フラッディングアルゴリズムによる転送
- TTL（Time To Live）によるホップ数制限（初期値: 3）
- メッセージIDによる重複排除
- 転送ログの記録

**ルーティングロジック**:
```
1. メッセージ受信
2. メッセージIDをチェック（既に受信済みならスキップ）
3. TTLをチェック（0以下ならスキップ）
4. メッセージIDをキャッシュに追加
5. TTLを1減らす
6. 接続中の全ノード（送信元除く）に転送
```

**検証方法**:
- 3台以上の端末で連鎖的にメッセージが転送されることを確認
- TTL=0のメッセージが転送されないことを確認
- 同じメッセージが重複して転送されないことを確認

---

#### FR-MESH-002: ノード管理
**優先度**: 中
**説明**: ネットワーク内のノード状態を管理

**要件**:
- 接続中のノードリスト表示
- 各ノードの信号強度（RSSI）表示
- ノードの接続/切断イベント通知
- ノードの稼働時間トラッキング

**表示情報**:
- ノードID（短縮表示: 最初の8文字）
- 接続状態（緑: 接続中、灰色: 切断）
- 信号強度（-40dBm〜-100dBm）
- 最終接続時刻

**検証方法**:
- ノードの接続/切断が即座にUI反映されることを確認
- 信号強度がリアルタイムで更新されることを確認

---

### 3.3 Solana統合機能

#### FR-SOL-001: ウォレット接続
**優先度**: 高
**説明**: Solana Mobile Wallet Adapterを使用したウォレット接続

**要件**:
- Mobile Wallet Adapter経由での認証
- Devnetネットワーク指定
- ウォレット公開鍵の取得・表示
- 接続状態の永続化

**フロー**:
```
1. ユーザーが「ウォレット接続」ボタンをタップ
2. Mobile Wallet Adapterが起動
3. ユーザーが使用するウォレットアプリを選択
4. ウォレットアプリで認証
5. 公開鍵を取得してアプリに保存
6. UI上でウォレットアドレスを表示
```

**検証方法**:
- Phantom/Solflareなどのウォレットで接続できることを確認
- 接続後、公開鍵が正しく表示されることを確認

---

#### FR-SOL-002: 稼働時間記録
**優先度**: 中
**説明**: ノードの稼働時間をSolanaブロックチェーンに記録

**要件**:
- 「稼働記録」ボタンによる手動記録（MVP版）
- 稼働開始〜終了時刻の計算
- Solanaスマートコントラクトへのトランザクション送信
- トランザクション成功/失敗の表示

**スマートコントラクト呼び出し**:
```rust
// Anchor instruction
record_uptime(
  duration_seconds: i64
) -> Result<()>
```

**入力**: 稼働時間（秒）
**出力**: トランザクションID

**検証方法**:
- 稼働記録トランザクションがDevnetに送信されることを確認
- Solscan等でトランザクションが確認できることを確認

---

#### FR-SOL-003: 報酬計算・表示
**優先度**: 中
**説明**: ノード稼働に対する報酬を計算・表示

**要件**:
- 報酬計算式: `報酬 = (稼働時間 / 3600) * 0.1 TOKEN`
- 保留中報酬（Pending Rewards）の表示
- 獲得済み報酬（Claimed Rewards）の表示
- 合計報酬の表示

**UI表示項目**:
```
稼働時間: 120時間
保留中報酬: 12.0 DMESH
獲得済み報酬: 5.5 DMESH
合計報酬: 17.5 DMESH
```

**検証方法**:
- 稼働時間に応じて報酬が正しく計算されることを確認
- 報酬がUIに正しく表示されることを確認

---

#### FR-SOL-004: 報酬請求
**優先度**: 中
**説明**: 保留中の報酬をウォレットに送信

**要件**:
- 「報酬請求」ボタンによる手動請求
- Mobile Wallet Adapter経由でのトランザクション署名
- 請求成功時に保留中報酬をリセット
- エラーハンドリング（残高不足、ネットワークエラー等）

**フロー**:
```
1. ユーザーが「報酬請求」ボタンをタップ
2. スマートコントラクトにclaim_rewards命令を送信
3. Mobile Wallet Adapterで署名要求
4. ユーザーが署名を承認
5. トランザクション送信
6. 成功時に報酬残高を更新
```

**検証方法**:
- 報酬請求トランザクションが成功することを確認
- ウォレット残高が増加することを確認

---

### 3.4 ユーザーインターフェース

#### FR-UI-001: メッセージ画面
**優先度**: 高
**説明**: メッセージの送受信を行うメイン画面

**レイアウト**:
```
┌─────────────────────────────────┐
│ DisasterMesh        [ノード: 2] │
├─────────────────────────────────┤
│                                 │
│ 【受信】太郎: 避難所にいます      │
│   10:30                          │
│                                 │
│ 【送信】助けが必要です            │
│   10:25                          │
│                                 │
├─────────────────────────────────┤
│ [メッセージ入力欄...]            │
│ [送信ボタン]                     │
└─────────────────────────────────┘
```

**機能**:
- メッセージリスト（スクロール可能）
- 送信フォーム（テキストエリア + 送信ボタン）
- 送信者名の表示
- タイムスタンプ表示
- 送信/受信の視覚的区別（色、配置）

**検証方法**:
- メッセージが時系列順に表示されることを確認
- 送信後、即座にリストに追加されることを確認

---

#### FR-UI-002: ノード管理画面
**優先度**: 中
**説明**: 接続中のノードを表示・管理

**レイアウト**:
```
┌─────────────────────────────────┐
│ ノード管理                       │
├─────────────────────────────────┤
│ 🟢 Node-A1B2C3D4                │
│    信号強度: -55dBm (強)         │
│    接続時間: 00:15:32            │
├─────────────────────────────────┤
│ 🟢 Node-E5F6G7H8                │
│    信号強度: -75dBm (中)         │
│    接続時間: 00:03:21            │
├─────────────────────────────────┤
│ スキャン中...                    │
└─────────────────────────────────┘
```

**機能**:
- 接続中ノードのリスト表示
- ノードIDの短縮表示
- 信号強度インジケーター
- 接続時間表示
- 手動再スキャンボタン

**検証方法**:
- ノードリストがリアルタイムで更新されることを確認
- 信号強度が視覚的に分かりやすいことを確認

---

#### FR-UI-003: ダッシュボード画面
**優先度**: 中
**説明**: ノード稼働状況とSolana報酬を表示

**レイアウト**:
```
┌─────────────────────────────────┐
│ ダッシュボード                   │
├─────────────────────────────────┤
│ 🔗 ウォレット接続                │
│ Gh3k...Qw7P                     │
│                                 │
│ ⏱ 稼働時間: 48時間15分           │
│ [稼働記録]                       │
│                                 │
│ 💰 報酬                          │
│ 保留中: 4.8 DMESH               │
│ 獲得済: 2.1 DMESH               │
│ [報酬請求]                       │
└─────────────────────────────────┘
```

**機能**:
- ウォレット接続状態表示
- ウォレットアドレス（短縮表示）
- 稼働時間カウンター
- 報酬残高表示
- 稼働記録ボタン
- 報酬請求ボタン

**検証方法**:
- 稼働時間がリアルタイムで更新されることを確認
- ボタン操作が正常に機能することを確認

---

## 非機能要件

### 4.1 パフォーマンス要件

#### NFR-PERF-001: レスポンス時間
- **UI操作**: 100ms以内に応答
- **メッセージ送信**: 500ms以内に完了
- **BLEスキャン**: 5秒以内に近隣ノード検出
- **ウォレット接続**: 3秒以内に完了

#### NFR-PERF-002: スループット
- **メッセージ転送**: 最大10メッセージ/秒
- **同時接続ノード数**: 最大3台
- **メッセージキャッシュ**: 最大1000件

#### NFR-PERF-003: リソース使用量
- **メモリ使用量**: 最大200MB
- **ストレージ使用量**: 最大50MB
- **バッテリー消費**: 1時間あたり最大10%（画面ON時）

---

### 4.2 信頼性要件

#### NFR-REL-001: 可用性
- **アプリクラッシュ率**: 0.1%未満
- **BLE接続成功率**: 90%以上
- **メッセージ配信成功率**: 95%以上（1ホップ以内）

#### NFR-REL-002: 障害復旧
- **接続断時のリトライ**: 自動再接続（最大3回、10秒間隔）
- **トランザクション失敗時**: エラーメッセージ表示とリトライオプション提供
- **アプリクラッシュ後**: ローカルデータの自動復元

---

### 4.3 使いやすさ要件

#### NFR-USA-001: ユーザビリティ
- **初回セットアップ時間**: 5分以内
- **主要操作の手順数**: 3ステップ以内
- **エラーメッセージ**: 日本語でわかりやすく表示

#### NFR-USA-002: アクセシビリティ
- **フォントサイズ**: 14pt以上
- **コントラスト比**: 4.5:1以上（WCAG AA準拠）
- **タップターゲットサイズ**: 44x44dp以上

---

### 4.4 移植性要件

#### NFR-PORT-001: プラットフォーム
- **対象OS**: Android 12以上（API Level 31+）
- **画面サイズ**: 5インチ〜6.7インチをサポート
- **画面解像度**: 720x1280以上

---

### 4.5 保守性要件

#### NFR-MAIN-001: コード品質
- **コードカバレッジ**: 60%以上（MVP版）
- **コーディング規約**: ESLint + Prettier準拠
- **ドキュメント**: 主要関数にJSDoc形式のコメント

#### NFR-MAIN-002: ログ
- **エラーログ**: すべてのエラーをローカルログに記録
- **デバッグログ**: 開発モードで詳細ログ出力
- **ログローテーション**: 最大10MB、7日間保持

---

## 技術要件

### 5.1 アーキテクチャ

#### システム構成
```
┌─────────────────────────────────────────────┐
│           React Native アプリ                │
│                                             │
│  ┌─────────────┐  ┌───────────────────┐   │
│  │  UI Layer   │  │  State Management │   │
│  │  (Screens)  │  │    (Context API)  │   │
│  └─────────────┘  └───────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       Business Logic Layer          │   │
│  │  - BLE Manager                      │   │
│  │  - Mesh Router                      │   │
│  │  - Solana Service                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       Data Access Layer             │   │
│  │  - AsyncStorage (Messages)          │   │
│  │  - SecureStore (Wallet Key)         │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
         ↓                          ↓
┌─────────────────┐      ┌──────────────────┐
│ Bluetooth LE    │      │  Solana Devnet   │
│ (Hardware)      │      │  (Blockchain)    │
└─────────────────┘      └──────────────────┘
```

---

### 5.2 ディレクトリ構成

```
DisasterMesh/
├── src/
│   ├── screens/            # UI画面
│   │   ├── MessageScreen.tsx
│   │   ├── NodeScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── components/         # 再利用可能コンポーネント
│   │   ├── MessageList.tsx
│   │   ├── NodeCard.tsx
│   │   └── WalletButton.tsx
│   ├── services/           # ビジネスロジック
│   │   ├── BleManager.ts
│   │   ├── MeshRouter.ts
│   │   └── SolanaService.ts
│   ├── hooks/              # カスタムフック
│   │   ├── useBLE.ts
│   │   ├── useMesh.ts
│   │   └── useSolana.ts
│   ├── contexts/           # グローバル状態
│   │   ├── AppContext.tsx
│   │   └── WalletContext.tsx
│   ├── utils/              # ユーティリティ
│   │   ├── crypto.ts
│   │   ├── storage.ts
│   │   └── validators.ts
│   ├── types/              # TypeScript型定義
│   │   ├── message.ts
│   │   ├── node.ts
│   │   └── solana.ts
│   └── constants/          # 定数
│       └── config.ts
├── android/                # Androidネイティブコード
├── programs/               # Solanaスマートコントラクト
│   └── disaster-mesh/
│       ├── src/
│       │   └── lib.rs
│       └── Cargo.toml
├── tests/                  # テストコード
│   ├── unit/
│   └── integration/
└── docs/                   # ドキュメント
```

---

### 5.3 データベース設計

#### AsyncStorage (ローカルストレージ)

**messages テーブル**:
```typescript
interface Message {
  id: string;              // UUID v4
  from: string;            // 送信者デバイスID
  to: string;              // 受信者デバイスID ("broadcast" for all)
  content: string;         // メッセージ本文
  timestamp: number;       // Unix timestamp (秒)
  ttl: number;             // Time To Live (ホップ数)
  signature: string;       // メッセージハッシュ
  status: 'sent' | 'received' | 'forwarded';
  read: boolean;           // 既読フラグ
}
```

**nodes テーブル**:
```typescript
interface Node {
  id: string;              // BLEデバイスID
  name: string;            // ノード名（ユーザー設定可能）
  publicKey?: string;      // Solanaウォレット公開鍵
  rssi: number;            // 信号強度 (dBm)
  connected: boolean;      // 接続状態
  lastSeen: number;        // 最終接続時刻
  uptimeSeconds: number;   // 累計稼働時間
}
```

**app_state テーブル**:
```typescript
interface AppState {
  deviceId: string;        // 自身のデバイスID
  walletPublicKey?: string; // 接続中のウォレット
  totalUptime: number;     // 総稼働時間
  pendingRewards: number;  // 保留中報酬
  claimedRewards: number;  // 獲得済み報酬
}
```

---

### 5.4 Solanaスマートコントラクト仕様

#### プログラム構造

**Anchor IDL概要**:
```rust
#[program]
pub mod disaster_mesh {
    use super::*;

    // ノードアカウント初期化
    pub fn initialize_node(ctx: Context<InitializeNode>) -> Result<()>;

    // 稼働時間記録
    pub fn record_uptime(
        ctx: Context<RecordUptime>,
        duration_seconds: i64
    ) -> Result<()>;

    // 報酬請求
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()>;
}

#[account]
pub struct NodeAccount {
    pub authority: Pubkey,       // ノード所有者
    pub total_uptime: i64,        // 累計稼働時間（秒)
    pub pending_rewards: u64,     // 保留中報酬 (lamports)
    pub claimed_rewards: u64,     // 獲得済み報酬 (lamports)
    pub last_update: i64,         // 最終更新時刻
}
```

#### 報酬計算ロジック
```rust
// 1時間 = 0.1 DMESH トークン
const REWARD_PER_HOUR: u64 = 100_000_000; // 0.1 SOL in lamports

pub fn calculate_reward(duration_seconds: i64) -> u64 {
    let hours = duration_seconds / 3600;
    (hours as u64) * REWARD_PER_HOUR
}
```

---

## データ仕様

### 6.1 メッセージフォーマット

#### BLE送信データ構造
```json
{
  "version": 1,
  "type": "message",
  "payload": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "from": "android-device-abc123",
    "to": "broadcast",
    "content": "避難所にいます。水が必要です。",
    "timestamp": 1697500000,
    "ttl": 3,
    "signature": "sha256-hash-here"
  }
}
```

**フィールド仕様**:
| フィールド | 型 | 必須 | 説明 |
|-----------|---|------|------|
| version | integer | Yes | プロトコルバージョン（現在は1） |
| type | string | Yes | メッセージタイプ（"message", "ack", "ping"） |
| payload.id | string | Yes | UUID v4 |
| payload.from | string | Yes | 送信者デバイスID |
| payload.to | string | Yes | 受信者ID（"broadcast"で全員） |
| payload.content | string | Yes | メッセージ本文（max 256文字） |
| payload.timestamp | integer | Yes | Unix timestamp（秒） |
| payload.ttl | integer | Yes | ホップ数制限（初期値3） |
| payload.signature | string | Yes | SHA-256ハッシュ |

---

### 6.2 BLE Service/Characteristic UUID

```typescript
// カスタムBLE Service UUID (DisasterMesh専用)
const SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb";

// Characteristic UUIDs
const CHARACTERISTICS = {
  MESSAGE_TX: "0000fff1-0000-1000-8000-00805f9b34fb",  // メッセージ送信
  MESSAGE_RX: "0000fff2-0000-1000-8000-00805f9b34fb",  // メッセージ受信
  NODE_INFO: "0000fff3-0000-1000-8000-00805f9b34fb",   // ノード情報
};
```

---

### 6.3 Solanaトランザクション形式

#### record_uptime トランザクション
```typescript
const tx = await program.methods
  .recordUptime(new BN(7200)) // 2時間 = 7200秒
  .accounts({
    nodeAccount: nodeAccountPubkey,
    authority: walletPublicKey,
    systemProgram: SystemProgram.programId,
  })
  .transaction();
```

#### claim_rewards トランザクション
```typescript
const tx = await program.methods
  .claimRewards()
  .accounts({
    nodeAccount: nodeAccountPubkey,
    authority: walletPublicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    vault: vaultPubkey,
  })
  .transaction();
```

---

## インターフェース要件

### 7.1 外部API連携

#### Solana JSON RPC API
**エンドポイント**: `https://api.devnet.solana.com`

**使用メソッド**:
- `getBalance`: ウォレット残高取得
- `getAccountInfo`: ノードアカウント情報取得
- `sendTransaction`: トランザクション送信
- `confirmTransaction`: トランザクション確認

**エラーハンドリング**:
- ネットワークエラー: リトライ（最大3回、指数バックオフ）
- レート制限: 1秒間に最大10リクエスト
- タイムアウト: 30秒

---

### 7.2 Bluetooth LE インターフェース

#### Advertising Data構造
```
Advertising Data:
  - Service UUID: 0xFFF0 (DisasterMesh)
  - Local Name: "DMESH-{device_id_short}"
  - TX Power Level: 0dBm
```

#### Scan Response Data
```
Scan Response:
  - Manufacturer Data: 0xFFFF (Company ID: Custom)
  - Node Version: 1.0.0
  - Battery Level: 80%
```

---

## セキュリティ要件

### 8.1 認証・認可

#### SR-AUTH-001: ウォレット認証
- Mobile Wallet Adapterによるウォレット署名認証
- セッションの有効期限: 24時間
- 再認証が必要な操作: 報酬請求、稼働時間記録

#### SR-AUTH-002: メッセージ署名
- 各メッセージにSHA-256ハッシュを付与
- 改ざん検出メカニズム（MVP版ではハッシュ検証のみ）

---

### 8.2 データ保護

#### SR-DATA-001: ローカルデータ暗号化
- **ウォレット秘密鍵**: SecureStore（ハードウェア暗号化）
- **メッセージ履歴**: 平文（MVP版）
- **ノード情報**: 平文（MVP版）

#### SR-DATA-002: 通信暗号化
- **BLE通信**: 平文（MVP版、次フェーズでAES-128暗号化）
- **Solana RPC**: HTTPS通信

---

### 8.3 プライバシー

#### SR-PRIV-001: 個人情報の取り扱い
- **収集しない情報**: 氏名、住所、電話番号
- **収集する情報**: デバイスID、ウォレット公開鍵（任意）
- **位置情報**: 収集しない（MVP版）

#### SR-PRIV-002: データ保持期間
- **メッセージ履歴**: 最大30日間（自動削除）
- **ログファイル**: 最大7日間

---

### 8.4 権限管理

#### Androidパーミッション
```xml
<!-- 必須 -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- オプション -->
<uses-permission android:name="android.permission.INTERNET" />
```

**権限取得タイミング**:
- 初回起動時: Bluetooth関連権限をリクエスト
- ウォレット接続時: インターネット接続権限（自動許可）

---

## テスト要件

### 9.1 単体テスト

#### UT-001: BLE Manager
**テスト項目**:
- [ ] スキャン開始/停止が正常に動作
- [ ] 接続/切断処理が正常に動作
- [ ] メッセージ送信/受信が正常に動作
- [ ] エラーハンドリングが正常に動作

**ツール**: Jest + React Native Testing Library

---

#### UT-002: Mesh Router
**テスト項目**:
- [ ] メッセージルーティングロジックが正常
- [ ] TTL減算が正常に機能
- [ ] 重複メッセージが排除される
- [ ] メッセージキャッシュが正常に動作

**ツール**: Jest

---

#### UT-003: Solana Service
**テスト項目**:
- [ ] ウォレット接続処理が正常
- [ ] トランザクション構築が正常
- [ ] 報酬計算ロジックが正常
- [ ] エラーハンドリングが正常

**ツール**: Jest + @solana/web3.js mocks

---

### 9.2 統合テスト

#### IT-001: BLE通信テスト
**シナリオ**:
1. 2台のデバイスでアプリを起動
2. 互いにスキャンして検出
3. デバイスAからデバイスBにメッセージ送信
4. デバイスBでメッセージ受信確認

**合格基準**:
- メッセージが5秒以内に受信される
- 文字化けなくメッセージが表示される

---

#### IT-002: メッシュネットワークテスト
**シナリオ**:
1. 3台のデバイス（A, B, C）を配置
2. A-B間、B-C間は通信可能、A-C間は通信不可
3. デバイスAからメッセージ送信
4. デバイスCでメッセージ受信確認（Bを経由）

**合格基準**:
- メッセージが2ホップで転送される
- 10秒以内にデバイスCで受信される

---

#### IT-003: Solana統合テスト
**シナリオ**:
1. ウォレット接続
2. 稼働時間を記録（2時間）
3. 報酬が正しく計算される（0.2 DMESH）
4. 報酬請求トランザクション送信
5. Devnetで確認

**合格基準**:
- トランザクションが成功
- Solscanでトランザクションが確認可能

---

### 9.3 E2Eテスト

#### E2E-001: 災害シナリオテスト
**シナリオ**:
1. 通常時（オンライン）でアプリ起動、ウォレット接続
2. 機内モードON（オフライン化）
3. BLEメッシュネットワーク形成
4. メッセージ送受信
5. 機内モードOFF（オンライン復帰）
6. 稼働時間記録、報酬請求

**合格基準**:
- 全ステップが正常に完了
- データの損失がない

---

### 9.4 パフォーマンステスト

#### PT-001: 負荷テスト
**テスト内容**:
- 100件のメッセージを連続送信
- 複数ノード（3台）同時接続
- 長時間稼働（6時間）でのメモリリーク確認

**合格基準**:
- アプリクラッシュなし
- メモリ使用量が200MB以下
- レスポンス時間が1秒以内

---

## 制約事項

### 10.1 技術的制約

#### TC-001: Bluetooth LE制約
- **通信範囲**: 最大30メートル（障害物により短縮）
- **同時接続数**: 最大3台（Android制約）
- **データ転送速度**: 最大1Mbps（実効250kbps程度）
- **バックグラウンド制限**: Android 12以降で制約あり

#### TC-002: Androidプラットフォーム制約
- **最小SDKバージョン**: API Level 31 (Android 12)
- **BLEスキャン制限**: フォアグラウンドのみ（バックグラウンドは制限あり）
- **バッテリー最適化**: Dozeモードでの動作制限

#### TC-003: Solana制約
- **トランザクション手数料**: Devnetは無料、Mainnetは有料
- **RPC制限**: 無料RPCは1秒あたり100リクエスト
- **ネットワーク依存**: オフライン時はブロックチェーン操作不可

---

### 10.2 機能的制約

#### FC-001: MVP版の制限
- **暗号化**: メッセージは平文（次フェーズで実装）
- **位置情報**: 地図表示なし（次フェーズで実装）
- **iOS対応**: なし（次フェーズで実装）
- **大規模ネットワーク**: 10台以上のノードは未対応

#### FC-002: テスト環境制限
- **Solana環境**: Devnetのみ（Mainnetは次フェーズ）
- **実機テスト**: Android端末2-3台のみ
- **エミュレーター制限**: BLE機能は実機のみでテスト可能

---

### 10.3 運用制約

#### OC-001: サポート範囲
- **対応言語**: 日本語のみ（MVP版）
- **サポート時間**: ベストエフォート（個人開発）
- **バグ修正**: GitHub Issue経由

#### OC-002: 法的制約
- **電波法**: 日本国内での使用を前提（BLE使用）
- **ライセンス**: MITライセンス
- **免責事項**: 災害時の確実な通信は保証しない

---

## 付録

### A. 用語集

| 用語 | 説明 |
|------|------|
| **BLE** | Bluetooth Low Energy（低消費電力Bluetooth） |
| **DePIN** | Decentralized Physical Infrastructure Network（分散型物理インフラネットワーク） |
| **TTL** | Time To Live（メッセージの転送可能回数） |
| **RSSI** | Received Signal Strength Indicator（受信信号強度） |
| **Mesh Network** | メッシュネットワーク（複数ノードが相互接続） |
| **Flooding** | フラッディング（全ノードにメッセージを転送するルーティング方式） |
| **Devnet** | Solanaの開発用テストネットワーク |
| **Lamports** | Solanaの最小単位（1 SOL = 10億 lamports） |

---

### B. 参考資料

#### 技術ドキュメント
- [Solana Mobile Docs](https://docs.solanamobile.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [React Native BLE Manager](https://github.com/innoveit/react-native-ble-manager)
- [Bluetooth Core Specification](https://www.bluetooth.com/specifications/specs/)

#### 学習リソース
- [Solana Cookbook](https://solanacookbook.com/)
- [React Native公式ドキュメント](https://reactnative.dev/)
- [Rust Programming Language](https://www.rust-lang.org/)

---

### C. 変更履歴

| バージョン | 日付 | 変更内容 | 作成者 |
|-----------|------|---------|--------|
| 1.0 | 2025-10-17 | 初版作成 | - |

---

### D. 承認

| 役割 | 氏名 | 承認日 | 署名 |
|------|------|--------|------|
| プロジェクトオーナー | - | 2025-10-17 | - |
| 技術リード | - | 2025-10-17 | - |

---

**次のステップ**:
1. 開発環境のセットアップ（[03_Setup](../03_Setup/README.md)）
2. プロジェクト初期化
3. Week 1開発開始

---

*本要件定義書は、企画書（[01_Planning](../01_Planning/README.md)）に基づいて作成されています。*
