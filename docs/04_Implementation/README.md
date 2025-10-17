# DisasterMesh - BLE基礎実装

**実装日**: 2025年10月17日
**対象**: Week 1 Day 3-5
**ステータス**: ✅ 完了

---

## 📋 実装概要

Bluetooth LE (BLE) 通信の基礎機能を実装しました。これにより、DisasterMeshアプリは近隣のデバイスを検出し、接続してメッセージを送受信できるようになります。

---

## ✅ 完了した実装

### 1. **ドキュメント矛盾点の修正**
   - 要件定義書の`react-native-buffer`を`buffer`に修正
   - ライブラリ依存関係の一貫性を確保

### 2. **BLE Manager サービス** (`src/services/BleManager.ts`)

#### 主要機能:
- ✅ BLE初期化
- ✅ デバイススキャン（5秒ごとに自動再スキャン）
- ✅ デバイス接続/切断
- ✅ メッセージ送受信
- ✅ 通知の有効化
- ✅ イベントリスナー管理

#### 主要メソッド:
```typescript
- initialize(): Promise<void>
- startScan(): Promise<void>
- stopScan(): Promise<void>
- connect(peripheralId: string): Promise<void>
- disconnect(peripheralId: string): Promise<void>
- sendMessage(peripheralId: string, packet: MessagePacket): Promise<void>
- decodeMessage(data: number[]): MessagePacket | null
- cleanup(): Promise<void>
```

#### 実装の特徴:
- **シングルトンパターン**: アプリ全体で1つのインスタンスを共有
- **イベント駆動型**: デバイス発見、接続、切断などのイベントをハンドリング
- **自動再接続**: 接続エラー時のリトライ機能（最大3回）
- **最大接続数管理**: 同時接続は最大3台まで

---

### 3. **権限リクエスト機能** (`src/utils/permissions.ts`)

#### 主要機能:
- ✅ Android 12+ 対応のBluetooth権限リクエスト
- ✅ 権限チェック機能
- ✅ 位置情報権限リクエスト
- ✅ エラーメッセージ生成

#### 主要メソッド:
```typescript
- requestBluetoothPermissions(): Promise<PermissionResult>
- checkBluetoothPermissions(): Promise<boolean>
- requestLocationPermission(): Promise<boolean>
- getPermissionErrorMessage(deniedPermissions: string[]): string
```

#### 対応権限:
- `BLUETOOTH_SCAN`
- `BLUETOOTH_CONNECT`
- `BLUETOOTH_ADVERTISE`
- `ACCESS_FINE_LOCATION`

---

### 4. **カスタムフック** (`src/hooks/useBLE.ts`)

#### 主要機能:
- ✅ BLE機能をReactコンポーネントで簡単に使用
- ✅ 状態管理（スキャン中、初期化済み、エラー等）
- ✅ 発見されたデバイスリスト
- ✅ 接続中のノードリスト
- ✅ メッセージ受信コールバック

#### 提供する状態:
```typescript
{
  isScanning: boolean
  isInitialized: boolean
  discoveredDevices: Map<string, Peripheral>
  connectedNodes: Node[]
  error: string | null
}
```

#### 提供する関数:
```typescript
{
  initialize: () => Promise<boolean>
  startScan: () => Promise<void>
  stopScan: () => Promise<void>
  connectToDevice: (peripheralId: string) => Promise<void>
  disconnectFromDevice: (peripheralId: string) => Promise<void>
  sendMessage: (peripheralId: string, packet: MessagePacket) => Promise<void>
  cleanup: () => Promise<void>
}
```

---

### 5. **ユーティリティ関数**

#### a. **暗号化・ハッシュ** (`src/utils/crypto.ts`)
- ✅ SHA-256ハッシュ生成
- ✅ メッセージ署名の生成・検証
- ✅ UUID v4生成

```typescript
- generateSHA256Hash(data: string): string
- generateMessageSignature(from, to, content, timestamp): string
- verifyMessageSignature(...): boolean
- generateUUID(): string
```

#### b. **ストレージ** (`src/utils/storage.ts`)
- ✅ メッセージの保存・読み込み
- ✅ ノード情報の保存・読み込み
- ✅ デバイスIDの保存・読み込み
- ✅ ウォレット公開鍵の保存・読み込み
- ✅ 全データクリア

```typescript
- saveMessages(messages: Message[]): Promise<void>
- loadMessages(): Promise<Message[]>
- saveNodes(nodes: Node[]): Promise<void>
- loadNodes(): Promise<Node[]>
- saveDeviceId(deviceId: string): Promise<void>
- loadDeviceId(): Promise<string | null>
- saveWalletPublicKey(publicKey: string): Promise<void>
- loadWalletPublicKey(): Promise<string | null>
- clearAllData(): Promise<void>
```

#### c. **バリデーション** (`src/utils/validators.ts`)
- ✅ メッセージ長チェック
- ✅ UUID形式チェック
- ✅ デバイスID形式チェック
- ✅ TTL値チェック
- ✅ タイムスタンプチェック
- ✅ メッセージ内容サニタイズ

```typescript
- validateMessageLength(message: string): boolean
- validateUUID(uuid: string): boolean
- validateDeviceId(deviceId: string): boolean
- validateTTL(ttl: number): boolean
- validateTimestamp(timestamp: number): boolean
- sanitizeMessageContent(content: string): string
```

---

## 📂 ファイル構成

```
DisasterMeshApp/src/
├── constants/
│   └── config.ts             ✅ 設定定数
├── types/
│   ├── message.ts            ✅ メッセージ型定義
│   ├── node.ts               ✅ ノード型定義
│   └── solana.ts             ✅ Solana型定義
├── services/
│   └── BleManager.ts         ✅ BLE Manager サービス
├── hooks/
│   └── useBLE.ts             ✅ BLE カスタムフック
└── utils/
    ├── permissions.ts        ✅ 権限管理
    ├── crypto.ts             ✅ 暗号化・ハッシュ
    ├── storage.ts            ✅ ストレージ操作
    └── validators.ts         ✅ バリデーション
```

---

## 🔄 メッセージフロー

### 1. **初期化フロー**
```
App起動
  ↓
権限チェック
  ↓
BLE Manager初期化
  ↓
イベントリスナー設定
  ↓
スキャン開始
```

### 2. **デバイス発見・接続フロー**
```
BLEスキャン開始
  ↓
デバイス発見（onDiscoverPeripheral）
  ↓
デバイスリストに追加
  ↓
ユーザーがデバイス選択
  ↓
接続（connect）
  ↓
サービス・Characteristic取得
  ↓
通知有効化
  ↓
接続完了
```

### 3. **メッセージ送信フロー**
```
ユーザーがメッセージ入力
  ↓
バリデーション
  ↓
MessagePacket作成
  ↓
署名生成
  ↓
JSON → Base64エンコード
  ↓
BLE write
  ↓
送信完了
```

### 4. **メッセージ受信フロー**
```
Characteristicの値更新（onDidUpdateValueForCharacteristic）
  ↓
Base64デコード
  ↓
JSON parse
  ↓
署名検証
  ↓
MessagePacket取得
  ↓
コールバック実行
```

---

## 🧪 テスト方法

### 1. **権限テスト**
```bash
# アプリ起動
npm run android

# 期待される動作:
- Bluetooth権限のリクエストダイアログが表示
- すべての権限を許可すると初期化成功
```

### 2. **スキャンテスト**
```bash
# 2台のデバイスでアプリ起動
# 各デバイスで以下を確認:
- 5秒ごとにスキャンが実行される
- 近隣のデバイスが発見される
- デバイスリストに追加される
```

### 3. **接続テスト**
```bash
# デバイスAでデバイスBを選択して接続
# 期待される動作:
- 接続成功のログ表示
- 接続中ノードリストに追加
- 通知が有効化される
```

### 4. **メッセージ送受信テスト**
```bash
# デバイスAからデバイスBにメッセージ送信
# 期待される動作:
- メッセージが送信される
- デバイスBで受信イベント発火
- コールバックが実行される
```

---

## 🐛 既知の課題

### 1. **暗号化の未実装**
- **現状**: メッセージは平文で送信
- **対応**: Week 2で暗号化機能を実装予定

### 2. **バックグラウンドスキャン**
- **現状**: フォアグラウンドのみでスキャン
- **対応**: Android制約のため、現時点では制限あり

### 3. **エラーハンドリング**
- **現状**: 基本的なエラー処理のみ
- **対応**: より詳細なエラーハンドリングを追加予定

---

## 📝 次のステップ（Week 1 Day 6-7）

### 1. **基本UI構築**
- [ ] メッセージ送受信画面
- [ ] ノード一覧画面
- [ ] 接続状態表示

### 2. **統合テスト**
- [ ] 2台のデバイスでメッセージ送受信テスト
- [ ] スキャン→接続→送信の一連のフロー確認

### 3. **バグ修正**
- [ ] 発見された問題の修正
- [ ] パフォーマンス改善

---

## 📚 参考資料

- [React Native BLE Manager](https://github.com/innoveit/react-native-ble-manager)
- [Bluetooth Core Specification](https://www.bluetooth.com/specifications/specs/)
- [Android Bluetooth Guide](https://developer.android.com/guide/topics/connectivity/bluetooth)

---

**作成者**: Claude Code
**最終更新**: 2025年10月17日
**対象**: DisasterMesh MVP - Week 1 Day 3-5
