// ギターコード練習アプリ - アコースティックテーマ版

// DOM要素
const chordDiagram = document.getElementById('chord-diagram');
const chordNameDisplay = document.getElementById('chord-name');
const chordButtons = document.querySelectorAll('.chord-btn');

// 横向きダイアグラムの定数（大きく）
const DIAGRAM_WIDTH = 900;
const DIAGRAM_HEIGHT = 500;
const FRET_SPACING = 150;  // フレット間隔（横方向）
const STRING_SPACING = 70; // 弦間隔（縦方向）
const START_X = 80;        // 左端からの開始位置
const START_Y = 80;        // 上端からの開始位置
const NUM_FRETS = 5;
const NUM_STRINGS = 6;

// 指の色（見やすい色）
const FINGER_COLORS = {
    1: '#DC143C', // 人差し指 - クリムゾン
    2: '#228B22', // 中指 - フォレストグリーン
    3: '#4169E1', // 薬指 - ロイヤルブルー
    4: '#9932CC'  // 小指 - ダークオーキッド
};

// アコースティックギターの弦の色（巻き弦とプレーン弦）
// 1弦が上、6弦が下の順（ギターを見下ろした時の視点で反転）
const STRING_COLORS = [
    '#E8E8E8', // 1弦 - プレーン弦（シルバー）
    '#E0E0E0', // 2弦 - プレーン弦（シルバー）
    '#D4A574', // 3弦 - 巻き弦（ブロンズ）
    '#CD853F', // 4弦 - 巻き弦（ブロンズ）
    '#B87333', // 5弦 - 巻き弦（ブロンズ濃い）
    '#A0522D'  // 6弦 - 巻き弦（ブロンズ濃い）
];

// 弦の太さ（1弦が細く、6弦が太い）- 反転後
const STRING_WIDTHS = [2, 2.5, 3.5, 4.5, 5.5, 6.5];

// コードダイアグラムをSVGで描画（横向き・アコースティック版）
function drawChordDiagram(chord) {
    const data = chordData[chord];
    if (!data) return;

    // SVG要素を作成
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.maxWidth = DIAGRAM_WIDTH + 'px';
    svg.style.maxHeight = DIAGRAM_HEIGHT + 'px';

    // 背景（木目調のベージュ）
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', '10');
    bg.setAttribute('y', '10');
    bg.setAttribute('width', DIAGRAM_WIDTH - 20);
    bg.setAttribute('height', DIAGRAM_HEIGHT - 20);
    bg.setAttribute('fill', '#FDF5E6');
    bg.setAttribute('rx', '15');
    bg.setAttribute('stroke', '#D2B48C');
    bg.setAttribute('stroke-width', '3');
    svg.appendChild(bg);

    // 指板の木目背景
    const fretboard = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fretboard.setAttribute('x', START_X);
    fretboard.setAttribute('y', START_Y - 15);
    fretboard.setAttribute('width', NUM_FRETS * FRET_SPACING);
    fretboard.setAttribute('height', STRING_SPACING * (NUM_STRINGS - 1) + 30);
    fretboard.setAttribute('fill', '#8B4513');
    fretboard.setAttribute('rx', '5');
    svg.appendChild(fretboard);

    // ナット（1フレットから始まる場合、左端に象牙色の太い線）
    if (data.startFret === 1) {
        const nut = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nut.setAttribute('x', START_X - 10);
        nut.setAttribute('y', START_Y - 15);
        nut.setAttribute('width', 14);
        nut.setAttribute('height', STRING_SPACING * (NUM_STRINGS - 1) + 30);
        nut.setAttribute('fill', '#FFFFF0');
        nut.setAttribute('stroke', '#D2B48C');
        nut.setAttribute('stroke-width', '1');
        nut.setAttribute('rx', '3');
        svg.appendChild(nut);
    } else {
        // フレット番号表示（1フレット以外から始まる場合）
        const fretNum = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fretNum.setAttribute('x', START_X + FRET_SPACING / 2);
        fretNum.setAttribute('y', START_Y - 25);
        fretNum.setAttribute('text-anchor', 'middle');
        fretNum.setAttribute('font-size', '28');
        fretNum.setAttribute('font-weight', 'bold');
        fretNum.setAttribute('fill', '#8B4513');
        fretNum.textContent = data.startFret + 'fr';
        svg.appendChild(fretNum);
    }

    // フレット線を描画（縦線）- シルバーのフレット
    for (let i = 0; i <= NUM_FRETS; i++) {
        const fret = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        fret.setAttribute('x1', START_X + i * FRET_SPACING);
        fret.setAttribute('y1', START_Y - 10);
        fret.setAttribute('x2', START_X + i * FRET_SPACING);
        fret.setAttribute('y2', START_Y + STRING_SPACING * (NUM_STRINGS - 1) + 10);
        fret.setAttribute('stroke', '#C0C0C0');
        fret.setAttribute('stroke-width', i === 0 ? '5' : '3');
        svg.appendChild(fret);
    }

    // 弦を描画（横線）- 1弦が上、6弦が下（反転済み）
    for (let i = 0; i < NUM_STRINGS; i++) {
        const string = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        string.setAttribute('x1', START_X);
        string.setAttribute('y1', START_Y + i * STRING_SPACING);
        string.setAttribute('x2', START_X + NUM_FRETS * FRET_SPACING);
        string.setAttribute('y2', START_Y + i * STRING_SPACING);
        string.setAttribute('stroke', STRING_COLORS[i]);
        string.setAttribute('stroke-width', STRING_WIDTHS[i]);
        string.setAttribute('stroke-linecap', 'round');
        svg.appendChild(string);
    }

    // バレーコード（セーハ）の描画
    if (data.barre) {
        const barre = data.barre;
        const barreX = START_X + (barre.fret - data.startFret + 0.5) * FRET_SPACING;
        // 反転: fromString と toString の位置を調整
        const fromY = START_Y + (barre.toString - 1) * STRING_SPACING;
        const toY = START_Y + (barre.fromString - 1) * STRING_SPACING;

        const barreRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        barreRect.setAttribute('x', barreX - 18);
        barreRect.setAttribute('y', Math.min(fromY, toY) - 18);
        barreRect.setAttribute('width', 36);
        barreRect.setAttribute('height', Math.abs(toY - fromY) + 36);
        barreRect.setAttribute('rx', '18');
        barreRect.setAttribute('fill', FINGER_COLORS[1]);
        barreRect.setAttribute('stroke', '#8B0000');
        barreRect.setAttribute('stroke-width', '2');
        svg.appendChild(barreRect);

        // バレーの指番号
        const barreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        barreText.setAttribute('x', barreX);
        barreText.setAttribute('y', (fromY + toY) / 2 + 10);
        barreText.setAttribute('text-anchor', 'middle');
        barreText.setAttribute('font-size', '28');
        barreText.setAttribute('font-weight', 'bold');
        barreText.setAttribute('fill', 'white');
        barreText.textContent = '1';
        svg.appendChild(barreText);
    }

    // 各弦のフレット位置と指番号を描画
    for (let i = 0; i < NUM_STRINGS; i++) {
        const fret = data.frets[i];
        const finger = data.fingers[i];
        // 反転: index 0 (6弦データ) → 画面下 (index 5の位置)
        const displayIndex = NUM_STRINGS - 1 - i;
        const y = START_Y + displayIndex * STRING_SPACING;

        if (fret === -1) {
            // ミュート（×マーク）- 左側に表示
            const mute = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            mute.setAttribute('x', START_X - 40);
            mute.setAttribute('y', y + 12);
            mute.setAttribute('text-anchor', 'middle');
            mute.setAttribute('font-size', '36');
            mute.setAttribute('font-weight', 'bold');
            mute.setAttribute('fill', '#DC143C');
            mute.textContent = '×';
            svg.appendChild(mute);
        } else if (fret === 0) {
            // 開放弦（○マーク）- 左側に表示
            const open = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            open.setAttribute('cx', START_X - 40);
            open.setAttribute('cy', y);
            open.setAttribute('r', '16');
            open.setAttribute('fill', 'none');
            open.setAttribute('stroke', '#228B22');
            open.setAttribute('stroke-width', '4');
            svg.appendChild(open);
        } else {
            // フレットを押さえる位置
            // バレーコードの場合はバレー部分の指は描画しない
            if (data.barre && fret === data.barre.fret && finger === 1) {
                continue;
            }

            const x = START_X + (fret - data.startFret + 0.5) * FRET_SPACING;

            // 指の丸（大きく！）
            const fingerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            fingerCircle.setAttribute('cx', x);
            fingerCircle.setAttribute('cy', y);
            fingerCircle.setAttribute('r', '28');
            fingerCircle.setAttribute('fill', FINGER_COLORS[finger] || '#666');
            fingerCircle.setAttribute('stroke', 'white');
            fingerCircle.setAttribute('stroke-width', '3');
            svg.appendChild(fingerCircle);

            // 指番号（大きく！）
            const fingerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            fingerText.setAttribute('x', x);
            fingerText.setAttribute('y', y + 12);
            fingerText.setAttribute('text-anchor', 'middle');
            fingerText.setAttribute('font-size', '32');
            fingerText.setAttribute('font-weight', 'bold');
            fingerText.setAttribute('fill', 'white');
            fingerText.textContent = finger;
            svg.appendChild(fingerText);
        }
    }

    // 弦名ラベル（右側に表示）- 反転済み
    const stringNames = ['1弦', '2弦', '3弦', '4弦', '5弦', '6弦'];
    for (let i = 0; i < NUM_STRINGS; i++) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', START_X + NUM_FRETS * FRET_SPACING + 50);
        label.setAttribute('y', START_Y + i * STRING_SPACING + 8);
        label.setAttribute('text-anchor', 'start');
        label.setAttribute('font-size', '22');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', '#8B4513');
        label.textContent = stringNames[i];
        svg.appendChild(label);
    }

    // 既存のSVGをクリアして新しいものを追加
    chordDiagram.innerHTML = '';
    chordDiagram.appendChild(svg);
}

// コードを表示する
function displayChord(chord) {
    // コード名を更新
    chordNameDisplay.textContent = chord;

    // ダイアグラムを描画
    drawChordDiagram(chord);

    // アクティブボタンの更新
    chordButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.chord === chord) {
            btn.classList.add('active');
        }
    });
}

// ボタンクリックイベントの設定
chordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const chord = button.dataset.chord;
        displayChord(chord);
    });
});

// キーボードショートカット（オプション）
document.addEventListener('keydown', (e) => {
    const keyMap = {
        '1': 'C', '2': 'D', '3': 'E', '4': 'F', '5': 'G', '6': 'A',
        'q': 'Am', 'w': 'Dm', 'e': 'Em', 'r': 'Bm',
        'a': 'C7', 's': 'D7', 'd': 'G7', 'f': 'A7'
    };
    const chord = keyMap[e.key.toLowerCase()];
    if (chord && chordData[chord]) {
        displayChord(chord);
    }
});

// 初期表示
displayChord('C');
