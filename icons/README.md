# アプリアイコン

このディレクトリには、PWAアプリのアイコンファイルを配置します。

## 必要なアイコンサイズ

manifest.jsonで定義されている以下のサイズのPNGアイコンが必要です:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## アイコンの生成方法

1. **icon.svgを使用する場合**:
   - icon.svgファイルを画像編集ソフト(Inkscape、Adobe Illustrator等)で開く
   - 各サイズでPNGとしてエクスポート

2. **オンラインツールを使用する場合**:
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)

3. **コマンドラインツールを使用する場合**:
   ```bash
   # ImageMagickを使用
   convert icon.svg -resize 72x72 icon-72x72.png
   convert icon.svg -resize 96x96 icon-96x96.png
   convert icon.svg -resize 128x128 icon-128x128.png
   convert icon.svg -resize 144x144 icon-144x144.png
   convert icon.svg -resize 152x152 icon-152x152.png
   convert icon.svg -resize 192x192 icon-192x192.png
   convert icon.svg -resize 384x384 icon-384x384.png
   convert icon.svg -resize 512x512 icon-512x512.png
   ```

## デザインガイドライン

- アプリのテーマカラー(#8b6f47)を使用
- シンプルで認識しやすいデザイン
- 小さいサイズでも視認性を保つ
