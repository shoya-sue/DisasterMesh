# DisasterMesh - 開発環境セットアップガイド

**最終更新**: 2025年10月17日
**対象**: macOS (Darwin 25.0.0)

---

## 📋 目次

1. [環境確認結果](#環境確認結果)
2. [セットアップ手順](#セットアップ手順)
3. [プロジェクト初期化](#プロジェクト初期化)
4. [トラブルシューティング](#トラブルシューティング)

---

## 環境確認結果

### ✅ インストール済みツール

現在の開発環境は**すべての要件を満たしています**。

| ツール | 要件 | インストール済み | 状態 |
|--------|------|------------------|------|
| Node.js | 18.x以上 | **v24.9.0** | ✅ OK |
| npm | 最新版 | **11.6.0** | ✅ OK |
| Java (JDK) | 11以上 | **OpenJDK 17.0.16** | ✅ OK |
| Rust | 1.70.0以上 | **1.90.0** | ✅ OK |
| Solana CLI | 1.18.x以上 | **2.3.13** | ✅ OK |
| Anchor Framework | 0.29.x以上 | **0.31.1** | ✅ OK |
| Android SDK | - | **インストール済み** | ✅ OK |

**Android SDK パス**: `/Users/shoya-sue/Library/Android/sdk`

---

## セットアップ手順

### Step 1: 開発ツールの確認

既にすべてのツールがインストール済みです。以下のコマンドで再確認できます:

```bash
# Node.js
node --version

# npm
npm --version

# Java
java --version

# Rust
rustc --version

# Solana CLI
solana --version

# Anchor
anchor --version

# Android SDK
echo $ANDROID_HOME
```

---

### Step 2: Solana開発環境の設定

#### 2.1 Solana設定の確認

```bash
# Solana設定を確認
solana config get

# Devnetに切り替え
solana config set --url https://api.devnet.solana.com
```

#### 2.2 Devnetウォレットの作成

```bash
# 新しいウォレットを作成（既存がない場合）
solana-keygen new --outfile ~/.config/solana/devnet-wallet.json

# ウォレットアドレスを確認
solana address

# エアドロップでDevnet SOLを取得（テスト用）
solana airdrop 2

# 残高確認
solana balance
```

**重要**: 秘密鍵ファイル (`devnet-wallet.json`) は大切に保管してください。

---

### Step 3: React Native環境の準備

#### 3.1 必要なグローバルパッケージのインストール

```bash
# React Native CLIのインストール（未インストールの場合）
npm install -g react-native-cli

# CocoaPodsのインストール（iOS開発用、macOSのみ）
# ※Android開発のみの場合はスキップ可
sudo gem install cocoapods
```

#### 3.2 Android Studioの設定確認

Android Studioが正しく設定されているか確認:

```bash
# Android SDKのパスを確認
echo $ANDROID_HOME
# 出力: /Users/shoya-sue/Library/Android/sdk

# 環境変数が設定されていない場合は追加
# ~/.zshrc または ~/.bash_profile に以下を追記:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

設定後、ターミナルを再起動:

```bash
source ~/.zshrc
```

---

## プロジェクト初期化

### Step 4: React Nativeプロジェクトの作成

```bash
# プロジェクトルートに移動
cd /Users/shoya-sue/Public/DisasterMesh

# React Nativeプロジェクトを初期化
npx react-native@latest init DisasterMeshApp --version 0.73.0
```

**プロジェクト構成**:
```
DisasterMesh/
├── DisasterMeshApp/       # React Nativeアプリ
│   ├── android/           # Androidネイティブコード
│   ├── ios/               # iOSネイティブコード（今回は未使用）
│   ├── src/               # ソースコード（後で作成）
│   ├── App.tsx            # エントリーポイント
│   ├── package.json       # 依存関係
│   └── tsconfig.json      # TypeScript設定
├── programs/              # Solanaスマートコントラクト（後で作成）
└── docs/                  # ドキュメント
```

---

### Step 5: 必要なライブラリのインストール

プロジェクトディレクトリに移動してライブラリをインストール:

```bash
cd DisasterMeshApp

# Solana Mobile関連
npm install @solana-mobile/mobile-wallet-adapter-protocol@^2.0.0
npm install @solana-mobile/mobile-wallet-adapter-protocol-web3js@^2.0.0
npm install @solana/web3.js@^1.87.0

# Bluetooth LE
npm install react-native-ble-manager@^11.0.0

# ストレージ
npm install @react-native-async-storage/async-storage@^1.21.0

# ユーティリティ
npm install react-native-buffer@^1.0.0
npm install react-native-get-random-values@^1.9.0

# ナビゲーション（オプション）
npm install @react-navigation/native@^6.1.9
npm install @react-navigation/bottom-tabs@^6.5.11
npm install react-native-screens react-native-safe-area-context

# 開発ツール
npm install --save-dev @types/react@^18.2.0
npm install --save-dev @types/react-native@^0.73.0
```

---

### Step 6: Androidパーミッションの設定

`android/app/src/main/AndroidManifest.xml` を編集:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

  <!-- Bluetooth権限 -->
  <uses-permission android:name="android.permission.BLUETOOTH" />
  <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
  <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
  <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
  <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />

  <!-- 位置情報権限（BLEスキャンに必要） -->
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

  <!-- インターネット -->
  <uses-permission android:name="android.permission.INTERNET" />

  <application ...>
    ...
  </application>
</manifest>
```

---

### Step 7: Solanaスマートコントラクトプロジェクトの作成

```bash
# プロジェクトルートに戻る
cd /Users/shoya-sue/Public/DisasterMesh

# Anchorプロジェクトを初期化
anchor init disaster-mesh-program

# プロジェクト構成
# DisasterMesh/
# ├── disaster-mesh-program/
# │   ├── programs/
# │   │   └── disaster-mesh-program/
# │   │       ├── src/
# │   │       │   └── lib.rs
# │   │       └── Cargo.toml
# │   ├── tests/
# │   ├── Anchor.toml
# │   └── package.json
```

---

### Step 8: プロジェクトのビルド確認

#### 8.1 React Nativeアプリのビルド

```bash
cd DisasterMeshApp

# Androidアプリをビルド
npm run android

# または直接React Nativeコマンドで
npx react-native run-android
```

**期待される結果**:
- Androidエミュレーターまたは実機でアプリが起動
- "Welcome to React Native"画面が表示される

#### 8.2 Solanaプログラムのビルド

```bash
cd ../disaster-mesh-program

# Anchorプログラムをビルド
anchor build

# テスト実行
anchor test
```

**期待される結果**:
- ビルド成功
- テストが通過

---

## プロジェクト構成の最終確認

```bash
cd /Users/shoya-sue/Public/DisasterMesh
tree -L 2 -I 'node_modules|target|.git'
```

**期待される構成**:
```
DisasterMesh/
├── DisasterMeshApp/           # React Nativeアプリ
│   ├── android/
│   ├── ios/
│   ├── src/                   # 後で作成
│   ├── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── disaster-mesh-program/     # Solanaスマートコントラクト
│   ├── programs/
│   ├── tests/
│   ├── Anchor.toml
│   └── Cargo.toml
├── docs/                      # ドキュメント
│   ├── 01_Planning/
│   ├── 02_Requirements/
│   └── 03_Setup/
└── README.md
```

---

## トラブルシューティング

### 問題1: Android Studio not found

**エラー**:
```
Android Studio: Not found in PATH
```

**解決方法**:
1. Android Studioをインストール: https://developer.android.com/studio
2. Android SDKをインストール（Android Studio内で）
3. 環境変数を設定（上記Step 3.2参照）

---

### 問題2: BLE権限エラー

**エラー**:
```
BLUETOOTH_SCAN permission is required
```

**解決方法**:
1. `AndroidManifest.xml`にBluetooth権限を追加（Step 6参照）
2. 実行時権限のリクエストコードを追加:

```typescript
import { PermissionsAndroid } from 'react-native';

async function requestBluetoothPermissions() {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);

  return Object.values(granted).every(
    (status) => status === PermissionsAndroid.RESULTS.GRANTED
  );
}
```

---

### 問題3: Solana airdropが失敗

**エラー**:
```
Error: airdrop request failed
```

**解決方法**:
1. Devnetの状態を確認: https://status.solana.com/
2. 別のRPCエンドポイントを試す:
   ```bash
   solana config set --url https://api.devnet.solana.com
   ```
3. Web UI経由でエアドロップ: https://faucet.solana.com/

---

### 問題4: React Native Metro Bundlerエラー

**エラー**:
```
Metro bundler has encountered an internal error
```

**解決方法**:
```bash
# キャッシュをクリア
cd DisasterMeshApp
npm start -- --reset-cache

# またはnode_modulesを再インストール
rm -rf node_modules
npm install
```

---

## 次のステップ

環境セットアップが完了したら、以下の順に進めてください:

1. **Week 1 Day 3-5**: BLE基礎実装
2. **Week 1 Day 6-7**: 基本UI構築
3. **Week 2**: コア機能開発
4. **Week 3**: 統合・デモ準備

詳細は [要件定義書](../02_Requirements/README.md) および [企画書](../01_Planning/README.md) を参照してください。

---

## 参考リンク

- [React Native公式ドキュメント](https://reactnative.dev/)
- [Solana Mobile Docs](https://docs.solanamobile.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [React Native BLE Manager](https://github.com/innoveit/react-native-ble-manager)
- [Solana Cookbook](https://solanacookbook.com/)

---

**作成日**: 2025年10月17日
**環境**: macOS (Darwin 25.0.0)
**対象プロジェクト**: DisasterMesh MVP
