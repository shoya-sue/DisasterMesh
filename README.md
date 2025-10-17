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

### 完了済み

- ✅ プロジェクト企画書作成
- ✅ 要件定義書作成
- ✅ 開発環境セットアップ
- ✅ React Nativeプロジェクト初期化
- ✅ プロジェクト構造作成
- ✅ 型定義・定数ファイル作成
- ✅ Android権限設定

### 次のステップ（Week 1）

- [ ] BLE基礎実装（Day 3-5）
- [ ] 基本UI構築（Day 6-7）

詳細は [企画書](docs/01_Planning/README.md) を参照してください。

---

## 🛠️ 技術スタック

### モバイルアプリ

- **フレームワーク**: React Native 0.73.0
- **言語**: TypeScript
- **状態管理**: React Context API
- **Bluetooth**: react-native-ble-manager
- **ストレージ**: AsyncStorage

### ブロックチェーン

- **ネットワーク**: Solana Devnet
- **フレームワーク**: Anchor (Rust)
- **統合**: Solana Mobile Stack

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
**バージョン**: 1.0.0
**対象**: Cypherpunk Hackathon - Mobile DePIN
