# PWA (Progressive Web App) 実装について

このアプリケーションは、PWA (Progressive Web App) として実装されています。

## PWAとは

Progressive Web App (PWA) は、Webアプリケーションをネイティブアプリのように使用できる技術です。以下の特徴があります:

- **オフライン動作**: インターネット接続がなくても使用可能
- **ホーム画面に追加**: スマートフォンやPCのホーム画面にアプリアイコンを追加できる
- **アプリライクな体験**: ブラウザのUIを非表示にしてネイティブアプリのような見た目
- **高速な起動**: キャッシュ機能により高速に起動
- **プッシュ通知**: (今後実装可能)

## 実装内容

### 1. manifest.json
アプリのメタデータを定義するファイルです。以下の情報が含まれています:

- アプリ名: "ととさんのギター教室"
- 表示モード: standalone (アプリとして表示)
- テーマカラー: #8b6f47
- 背景色: #f5f1e8
- アイコン設定
- カテゴリ: 教育、音楽

### 2. service-worker.js
オフライン機能を実装するService Workerです。以下の機能があります:

- **キャッシュ戦略**: 初回アクセス時に必要なファイルをキャッシュ
- **オフライン対応**: ネットワークがなくてもキャッシュから読み込み
- **自動更新**: 新しいバージョンがあれば自動的に更新

キャッシュされるファイル:
- index.html
- styles.css
- app.js
- chords.js
- manifest.json

### 3. アイコン
`icons/` ディレクトリにアプリアイコンが格納されています:

- **icon.svg**: ベクター形式のアイコン（すべてのサイズに対応）
- **icon-192x192.png**: 標準サイズ（生成が必要）
- **icon-512x512.png**: 高解像度サイズ（生成が必要）

## インストール方法

### スマートフォン (Android/iOS)

1. **ブラウザでアクセス**: Chrome、Safari、Edgeなどで本アプリを開く
2. **インストールプロンプト**:
   - Android Chrome: アドレスバーの「ホーム画面に追加」をタップ
   - iOS Safari: 共有ボタン → 「ホーム画面に追加」
3. **アイコンが追加**: ホーム画面にアプリアイコンが追加されます

### パソコン (Windows/Mac/Linux)

1. **ブラウザでアクセス**: Chrome、Edgeなどで本アプリを開く
2. **インストール**: アドレスバーの「インストール」ボタン (⊕) をクリック
3. **デスクトップに追加**: アプリがスタンドアロンウィンドウで起動できるようになります

## オフライン機能

一度アクセスすれば、インターネット接続がなくても以下の機能が使用できます:

- コード表示
- コードダイアグラム表示
- アルペジオパターンの再生
- コード進行の作成と再生

## アイコンの生成

PNGアイコンがまだ生成されていない場合は、以下の方法で生成できます:

### 方法1: スクリプトを使用

```bash
cd icons/
./generate-icons.sh
```

必要なツール: ImageMagick または librsvg2-bin

### 方法2: オンラインツール

- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)

icon.svgをアップロードして各サイズのPNGを生成できます。

### 方法3: 手動変換

画像編集ソフト（Photoshop、GIMP、Inkscapeなど）で:
1. icons/icon.svg を開く
2. 192x192 と 512x512 のサイズでPNGとしてエクスポート

## テスト方法

### ローカルテスト

PWAは HTTPS または localhost でのみ動作します。ローカルでテストする場合:

```bash
# Python 3 の場合
python -m http.server 8000

# Node.js の場合
npx http-server -p 8000
```

その後、`http://localhost:8000` でアクセスします。

### Service Worker の確認

Chrome DevTools で確認できます:

1. ページを開く
2. F12 でDevToolsを開く
3. Application タブ → Service Workers
4. 登録状態とキャッシュを確認

### Lighthouseでスコア確認

1. Chrome DevToolsを開く
2. Lighthouse タブ
3. 「Generate report」をクリック
4. PWAスコアを確認

## トラブルシューティング

### Service Worker が登録されない

- HTTPSまたはlocalhostで実行しているか確認
- ブラウザのコンソールでエラーを確認
- service-worker.jsのパスが正しいか確認

### アイコンが表示されない

- manifest.jsonでアイコンのパスが正しいか確認
- PNGファイルが実際に存在するか確認（SVGは一時的な代替）
- ブラウザのキャッシュをクリアして再読み込み

### キャッシュが更新されない

- Service Workerのバージョン（CACHE_NAME）を変更
- DevToolsから手動でService Workerを削除
- ハードリロード（Ctrl+Shift+R / Cmd+Shift+R）

## 今後の拡張可能性

- **プッシュ通知**: 練習リマインダーなど
- **バックグラウンド同期**: オフラインでの変更を同期
- **共有機能**: コード進行の共有
- **ショートカット**: よく使うコードへの直接アクセス

## 参考リンク

- [MDN - Progressive Web Apps](https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps)
- [Google - PWA チェックリスト](https://web.dev/pwa-checklist/)
- [Service Worker の概要](https://developers.google.com/web/fundamentals/primers/service-workers)
