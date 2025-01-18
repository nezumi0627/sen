# Sen - LINE Unofficial Extension

LINEのウェブバージョンにカスタムアイコンと機能を追加するChrome拡張機能です。

## 機能

- カスタムアイコンの表示
- アイコン表示の設定カスタマイズ
- モダンなUIデザイン

## 開発環境のセットアップ

1. 必要な依存関係のインストール:
   ```bash
   deno install
   ```

2. 開発用ビルド:
   ```bash
   deno task build
   ```

3. Chrome拡張機能としての読み込み:
   - Chromeで `chrome://extensions` を開く
   - 「デベロッパーモード」を有効にする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `dist` フォルダを選択

## ビルドコマンド

- `deno task build` - プロジェクトのビルド
- `deno task clean` - ビルド出力の削除
- `deno task make-dirs` - 必要なディレクトリの作成

## ライセンス

MIT License
