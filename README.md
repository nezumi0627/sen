# Sen - 線 LINE Unofficial Extension

LINEのweb版をより使いやすくするための拡張機能です。

## 免責事項

本拡張機能は**非公式**であり、LINEヤフー株式会社とは一切の関係がありません。本拡張機能の使用はすべて自己責任となります。LINEヤフー株式会社から法的根拠に基づく変更または削除の要請があった場合、適用される法律に従って対応いたします。

## 機能

- カスタムアイコンの表示

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
