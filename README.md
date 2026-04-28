# miniApp_kanban

Supabase Auth と Supabase Database を使った、React + TypeScript 製のカンバンボードです。  
カードはユーザー単位で分離され、`TODO / DOING / DONE` の 3 列で管理されます。

## Stack

- Vite
- React 19
- TypeScript
- Supabase JavaScript Client
- CSS Modules

## Features

- メールアドレス / パスワード認証
- カードの追加 / 編集 / 削除
- PC でのドラッグアンドドロップによる列移動
- モバイルでの状態変更ボタン
- Supabase の RLS によるユーザー単位のデータ分離

## Project Structure

```text
.
├─ src/
│  ├─ app/                 # アプリ全体のエントリと画面分岐
│  ├─ features/
│  │  ├─ auth/             # 認証 UI / hooks / services
│  │  ├─ board/            # ボード UI
│  │  └─ cards/            # カード UI / hooks / services / types
│  ├─ lib/                 # Supabase client
│  ├─ shared/              # 共通コンポーネント・定数・utility
│  └─ styles/              # グローバル CSS
├─ supabase/
│  └─ schema.sql           # DB 初期化 SQL
├─ index.html
├─ package.json
└─ vite.config.ts
```

## Prerequisites

- Node.js 20 以上推奨
- Supabase プロジェクト

## Environment Variables

ルートに `.env.local` を作成して、以下を設定してください。

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

## Supabase Setup

このアプリは既存 Supabase プロジェクト内に、以下のテーブルを作成する前提です。

- `public.miniapp_kanban_cards`

セットアップ手順:

1. 対象の Supabase プロジェクトを開く
2. `SQL Editor` で `supabase/schema.sql` を実行する
3. `Authentication > Providers > Email` で Email 認証を有効にする
4. `Authentication > URL Configuration` にローカル URL を追加する

ローカル確認用の最小設定例:

- `Site URL`: `http://localhost:5173`
- `Redirect URLs`: `http://localhost:5173/**`

## Local Development

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作確認します。

## Build

```bash
npm run build
```

本番ビルドは `dist/` に出力されます。

## Deployment

Vercel を想定しています。

1. GitHub に push
2. Vercel でリポジトリを import
3. `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を設定
4. デプロイ後、Supabase の `Redirect URLs` に本番 URL を追加

## Notes

- ブラウザ側には `service_role` を入れません
- DB 初期化 SQL は `supabase/schema.sql` に保持しています
- カードデータは `miniapp_kanban_cards` テーブルに保存されます
