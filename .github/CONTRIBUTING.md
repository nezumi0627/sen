# コントリビューションガイドライン

Subnect+へのコントリビューションに興味を持っていただき、ありがとうございます。以下のガイドラインをご確認ください。

## 始める前に

1. [行動規範](CODE_OF_CONDUCT.md)を読んでください。
2. [セキュリティポリシー](SECURITY.md)を確認してください。
3. [Discussions](https://github.com/nezumi0627/subnect-plus/discussions)で質問や提案ができます。

## プロジェクト構造

```
subnect-plus/
├── .github/          # GitHub関連のファイル
│   ├── workflows/    # GitHub Actions
│   ├── ISSUE_TEMPLATE/
│   ├── CONTRIBUTING.md
│   ├── SECURITY.md
│   └── PULL_REQUEST_TEMPLATE.md
├── src/             # ソースコード
│   ├── content/     # コンテンツスクリプト
│   ├── background/  # バックグラウンドスクリプト
│   ├── types/       # 型定義
│   └── styles/      # スタイルシート
├── icons/           # アイコンファイル
└── docs/            # ドキュメント
```

## ブランチ戦略

```
main (安定版)
└── develop (開発用メイン)
    ├── feature/* (機能開発)
    ├── fix/* (バグ修正)
    ├── docs/* (ドキュメント)
    └── refactor/* (リファクタリング)
```

### ブランチの命名規則

- 機能開発: `feature/機能名`
- バグ修正: `fix/バグ内容`
- ドキュメント: `docs/更新内容`
- リファクタリング: `refactor/対象機能`

## コントリビューションの種類

以下のような形でプロジェクトに貢献できます：

1. バグ報告
2. 機能提案
3. コードの改善
4. ドキュメントの改善
5. テストの追加

## 開発プロセス

1. リポジトリをフォークしてください。
2. developブランチから新しいブランチを作成してください：
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. 変更を加えてください。
4. テストを追加または更新してください。
5. コードをフォーマットしてください：
   ```bash
   deno fmt
   ```
6. リンターを実行してください：
   ```bash
   deno lint
   ```
7. ビルドを確認してください：
   ```bash
   deno task build
   ```
8. 変更をコミットしてください：
   ```bash
   git commit -m "feat: Add new feature @pre-push"
   ```
9. フォークにプッシュしてください：
   ```bash
   git push origin feature/your-feature-name
   ```
10. プルリクエストを作成してください。

## コミットメッセージのガイドライン

- コミットメッセージは日本語で書いてください
- 以下のプレフィックスを使用してください：
  - `feat:` - 新機能
  - `fix:` - バグ修正
  - `docs:` - ドキュメントのみの変更
  - `style:` - コードの意味に影響しない変更（スペース、フォーマット等）
  - `refactor:` - バグ修正でも新機能でもないコードの変更
  - `test:` - テストの追加・修正
  - `chore:` - ビルドプロセスやツールの変更
- 必ず `@pre-push` タグを含めてください

## プルリクエストのガイドライン

1. 明確なタイトルと説明を付けてください
2. 変更内容を箇条書きで記載してください
3. スクリーンショットがあれば添付してください
4. 関連するIssueがあればリンクしてください
5. developブランチに向けて作成してください

## コードスタイル

- [Deno Style Guide](https://deno.land/manual/contributing/style_guide)に従ってください
- TypeScriptの型を適切に使用してください
- コメントは日本語で書いてください
- 関数やクラスには適切なJSDocを付けてください

## テスト

- 新しい機能には必ずテストを追加してください
- 既存のテストが壊れていないことを確認してください
- テストカバレッジを維持してください

## ドキュメント

- 新しい機能には必ずドキュメントを追加してください
- READMEやその他のドキュメントを最新に保ってください
- コードコメントは明確で簡潔に書いてください

## リリースプロセス

1. developブランチでの開発が完了
2. テストとレビューが完了
3. mainブランチにマージ
4. バージョンタグを付与
5. リリースノートを作成

## 質問や提案

- [Discussions](https://github.com/nezumi0627/subnect-plus/discussions)で質問や提案ができます
- バグ報告は[Issues](https://github.com/nezumi0627/subnect-plus/issues)で行ってください
- セキュリティ関連の問題は[Security Policy](SECURITY.md)に従って報告してください

ご協力ありがとうございます！
