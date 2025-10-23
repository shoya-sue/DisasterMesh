# DisasterMesh

**災害時緊急通信 DePIN ネットワーク**

Bluetooth LEメッシュネットワークとSolana DePINを組み合わせた、災害時でも通信を維持する分散型緊急通信システム。

---

## 📋 プロジェクト概要

DisasterMeshは、災害時の通信インフラ断絶に対応するため、個人のスマートフォンをメッシュネットワークノードとして機能させ、インターネット接続なしでも通信を維持できるシステムです。

### 主な機能

- **オフライン緊急メッセージング**: Bluetooth LEによる端末間直接通信
- **メッシュネットワーク形成**: 2-3ホップのマルチホップ転送
- **Solana報酬システム**: ノード稼働時間に応じた報酬配布（Devnet）
- **シンプルなUI**: メッセージング、ノード管理、報酬表示

---

## 🏗️ プロジェクト構成

```
DisasterMesh/
├── DisasterMeshApp/           # React Nativeモバイルアプリ
│   ├── android/               # Androidネイティブコード
│   ├── src/                   # アプリケーションソースコード
│   │   ├── screens/           # UI画面
│   │   ├── components/        # 再利用可能コンポーネント
│   │   ├── services/          # ビジネスロジック
│   │   ├── hooks/             # カスタムフック
│   │   ├── contexts/          # グローバル状態管理
│   │   ├── utils/             # ユーティリティ
│   │   ├── types/             # TypeScript型定義
│   │   └── constants/         # 定数
│   ├── App.tsx                # エントリーポイント
│   └── package.json           # 依存関係
├── disaster-mesh-program/     # Solanaスマートコントラクト（未作成）
├── docs/                      # ドキュメント
│   ├── 01_Planning/           # 企画書
│   ├── 02_Requirements/       # 要件定義書
│   └── 03_Setup/              # セットアップガイド
└── README.md                  # このファイル
```

---

## 🚀 クイックスタート

### 前提条件

以下のツールがインストールされている必要があります:

- Node.js 18.x以上
- npm 9.x以上
- Android Studio（Android開発用）
- Java JDK 11以上
- Rust 1.70.0以上
- Solana CLI 1.18.x以上
- Anchor 0.29.x以上

詳細は [セットアップガイド](docs/03_Setup/README.md) を参照してください。

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/DisasterMesh.git
cd DisasterMesh

# React Nativeアプリの依存関係をインストール
cd DisasterMeshApp
npm install

# Androidアプリを実行
npm run android
```

---

## 📱 開発状況

### 完了済み（Week 1）

#### プロジェクトセットアップ
- ✅ プロジェクト企画書作成
- ✅ 要件定義書作成
- ✅ 開発環境セットアップ
- ✅ React Nativeプロジェクト初期化
- ✅ プロジェクト構造作成
- ✅ 型定義・定数ファイル作成
- ✅ Android権限設定（Bluetooth、位置情報）

#### BLE基礎実装
- ✅ BleManagerサービス実装
- ✅ useBLEカスタムフック実装
- ✅ デバイススキャン機能
- ✅ 自動スキャン（5秒間隔）
- ✅ 権限管理システム

#### 基本UI構築
- ✅ メッセージ画面実装
- ✅ ノード管理画面実装
- ✅ タブナビゲーション
- ✅ アプリロゴ設定（全解像度対応）

#### 実機テスト
- ✅ Android実機でのビルド・インストール成功
- ✅ BLEスキャン動作確認
- ✅ Bluetooth権限取得確認
- ✅ 基本UI表示確認
- ✅ アプリロゴ表示確認

#### コード品質
- ✅ TypeScriptエラー解消
- ✅ ESLintエラー解消
- ✅ Gradle warningの解消（jcenter非推奨対応）

### Week 2 完了

#### メッセージング・セキュリティ機能
- ✅ メッセージング機能の完成
- ✅ BLE通信フローの確立
- ✅ メッセージ暗号化（AES-256）
- ✅ メッセージ署名（HMAC-SHA256）
- ✅ 暗号化キー管理
- ✅ BleManager暗号化統合
- ✅ TypeScript型定義作成

#### 新規ファイル
- ✅ `src/utils/encryption.ts` - 暗号化・復号化ユーティリティ
- ✅ `src/utils/keyManager.ts` - 暗号化キー管理
- ✅ `src/types/crypto.d.ts` - CryptoJS型定義

#### コード品質
- ✅ TypeScriptコンパイル成功
- ✅ ESLintエラー0件
- ✅ Androidビルド成功

### 次のステップ（Week 3）

- [ ] 実機での暗号化メッセージ送受信テスト
- [ ] メッシュネットワークのマルチホップ転送実装
- [ ] メッセージ履歴の暗号化保存
- [ ] Solana統合（報酬システム）

詳細は [企画書](docs/01_Planning/README.md) と [Week 2成果レポート](/tmp/week2_results.md) を参照してください。

---

## 🛠️ 技術スタック

### モバイルアプリ

- **フレームワーク**: React Native 0.76.5
- **言語**: TypeScript 5.0.4
- **状態管理**: React Context API
- **ナビゲーション**: React Navigation 7.x
- **Bluetooth**: react-native-ble-manager 11.5.3
- **ストレージ**: @react-native-async-storage/async-storage
- **暗号化**:
  - react-native-crypto-js (AES-256, HMAC-SHA256)
  - react-native-get-random-values (安全な乱数生成)

### ブロックチェーン

- **ネットワーク**: Solana Devnet
- **フレームワーク**: Anchor (Rust)
- **統合**: @solana/web3.js 1.98.4

---

## 🧪 実機テスト結果

### テスト環境
- **デバイス**: Android実機（Seeker - 15）
- **OSバージョン**: Android 15
- **テスト日**: 2025年10月22日

### テスト項目

#### ✅ アプリケーション基本機能
- アプリのビルド・インストール: 正常
- アプリ起動: 正常
- クラッシュ: なし
- メモリリーク: 検出なし

#### ✅ Bluetooth機能
- Bluetooth権限リクエスト: 正常動作
  - ACCESS_FINE_LOCATION: 許可
  - BLUETOOTH_SCAN: 許可
  - BLUETOOTH_CONNECT: 許可
  - BLUETOOTH_ADVERTISE: 許可
- BLE初期化: 成功
- デバイススキャン: 正常動作（5秒間隔で自動実行）
- スキャン開始/停止: 正常

#### ✅ UI/UX
- メッセージ画面: 正常表示
- ノード管理画面: 実装済み
- タブナビゲーション: 動作
- アプリロゴ: 全解像度で正常表示
- レスポンシブ: 正常

#### 📋 既知の問題
- タブ切り替えが特定の状況で遅延する場合がある（手動操作では正常動作）
- BLEデバイス検出は周辺にBLE機器がある環境でのみ確認可能

### パフォーマンス
- アプリ起動時間: ~2秒
- BLEスキャン開始時間: ~0.5秒
- メモリ使用量: 正常範囲内

---

## 📚 ドキュメント

- [企画書](docs/01_Planning/README.md) - プロジェクトの背景、目的、計画
- [要件定義書](docs/02_Requirements/README.md) - 機能要件、非機能要件、技術仕様
- [セットアップガイド](docs/03_Setup/README.md) - 開発環境のセットアップ手順

---

## 🧪 テスト

```bash
# 単体テスト実行
npm test

# カバレッジ確認
npm run test:coverage
```

---

## 🤝 コントリビューション

このプロジェクトは現在個人開発中です。コントリビューションは歓迎します。

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) を参照してください。

---

## 📞 連絡先

- **開発者**: [準備中]
- **プロジェクトリンク**: https://github.com/yourusername/DisasterMesh

---

## 🙏 謝辞

- [Solana Mobile](https://solanamobile.com/) - Mobile DePINプラットフォーム
- [React Native](https://reactnative.dev/) - モバイルアプリフレームワーク
- [Anchor Framework](https://www.anchor-lang.com/) - Solana開発フレームワーク

---

**作成日**: 2025年10月17日
**最終更新**: 2025年10月22日
**バージョン**: 0.2.0 (Week 2 完了)
**対象**: Cypherpunk Hackathon - Mobile DePIN
**ステータス**: 暗号化機能実装完了、Week 2 マイルストーン達成
