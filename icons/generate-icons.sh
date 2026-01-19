#!/bin/bash

# アイコン生成スクリプト
# このスクリプトは、icon.svgから各サイズのPNGアイコンを生成します
# 必要なツール: ImageMagick (convert コマンド) または rsvg-convert

SVG_FILE="icon.svg"
SIZES=(72 96 128 144 152 192 384 512)

if command -v convert &> /dev/null; then
    echo "ImageMagick を使用してアイコンを生成します..."
    for size in "${SIZES[@]}"; do
        output="icon-${size}x${size}.png"
        echo "生成中: $output"
        convert "$SVG_FILE" -resize ${size}x${size} -background none "$output"
    done
    echo "アイコン生成完了!"
elif command -v rsvg-convert &> /dev/null; then
    echo "rsvg-convert を使用してアイコンを生成します..."
    for size in "${SIZES[@]}"; do
        output="icon-${size}x${size}.png"
        echo "生成中: $output"
        rsvg-convert -w $size -h $size "$SVG_FILE" -o "$output"
    done
    echo "アイコン生成完了!"
else
    echo "エラー: ImageMagick または rsvg-convert がインストールされていません"
    echo ""
    echo "インストール方法:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  または"
    echo "  Ubuntu/Debian: sudo apt-get install librsvg2-bin"
    echo "  macOS: brew install librsvg"
    exit 1
fi
