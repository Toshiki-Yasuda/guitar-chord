// ギターコード練習アプリ - 横向きワイドスクリーン版

// DOM要素
const chordDiagram = document.getElementById('chord-diagram');
const chordNameDisplay = document.getElementById('chord-name');
const chordButtons = document.querySelectorAll('.chord-btn');
const mainDisplay = document.querySelector('.main-display');

// 横向きダイアグラムの定数（めちゃくちゃ大きく）
const DIAGRAM_WIDTH = 900;
const DIAGRAM_HEIGHT = 500;
const FRET_SPACING = 150;  // フレット間隔（横方向）
const STRING_SPACING = 70; // 弦間隔（縦方向）
const START_X = 80;        // 左端からの開始位置
const START_Y = 80;        // 上端からの開始位置
const NUM_FRETS = 5;
const NUM_STRINGS = 6;

// 指の色（明るく見やすい色）
const FINGER_COLORS = {
    1: '#ff6b6b', // 人差し指 - 明るい赤
    2: '#51cf66', // 中指 - 明るい緑
    3: '#339af0', // 薬指 - 明るい青
    4: '#cc5de8'  // 小指 - 明るい紫
};

// コードダイアグラムをSVGで描画（横向き・巨大版）
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

    // 背景（角丸の暗いボックス）
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', '10');
    bg.setAttribute('y', '10');
    bg.setAttribute('width', DIAGRAM_WIDTH - 20);
    bg.setAttribute('height', DIAGRAM_HEIGHT - 20);
    bg.setAttribute('fill', '#1e1e2e');
    bg.setAttribute('rx', '20');
    bg.setAttribute('stroke', '#3d3d5c');
    bg.setAttribute('stroke-width', '3');
    svg.appendChild(bg);

    // ナット（1フレットから始まる場合、左端に太い線）
    if (data.startFret === 1) {
        const nut = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nut.setAttribute('x', START_X - 8);
        nut.setAttribute('y', START_Y - 10);
        nut.setAttribute('width', 12);
        nut.setAttribute('height', STRING_SPACING * (NUM_STRINGS - 1) + 20);
        nut.setAttribute('fill', '#f8f8f8');
        nut.setAttribute('rx', '4');
        svg.appendChild(nut);
    } else {
        // フレット番号表示（1フレット以外から始まる場合）
        const fretNum = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fretNum.setAttribute('x', START_X + FRET_SPACING / 2);
        fretNum.setAttribute('y', START_Y - 25);
        fretNum.setAttribute('text-anchor', 'middle');
        fretNum.setAttribute('font-size', '28');
        fretNum.setAttribute('font-weight', 'bold');
        fretNum.setAttribute('fill', '#ffd43b');
        fretNum.textContent = data.startFret + 'fr';
        svg.appendChild(fretNum);
    }

    // フレット線を描画（縦線）
    for (let i = 0; i <= NUM_FRETS; i++) {
        const fret = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        fret.setAttribute('x1', START_X + i * FRET_SPACING);
        fret.setAttribute('y1', START_Y);
        fret.setAttribute('x2', START_X + i * FRET_SPACING);
        fret.setAttribute('y2', START_Y + STRING_SPACING * (NUM_STRINGS - 1));
        fret.setAttribute('stroke', i === 0 ? '#888' : '#555');
        fret.setAttribute('stroke-width', i === 0 ? '4' : '3');
        svg.appendChild(fret);
    }

    // 弦を描画（横線）- 6弦が上、1弦が下
    for (let i = 0; i < NUM_STRINGS; i++) {
        const string = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        string.setAttribute('x1', START_X);
        string.setAttribute('y1', START_Y + i * STRING_SPACING);
        string.setAttribute('x2', START_X + NUM_FRETS * FRET_SPACING);
        string.setAttribute('y2', START_Y + i * STRING_SPACING);
        // 弦の太さ（6弦が太く、1弦が細い）
        const stringWidth = 6 - i * 0.8;
        string.setAttribute('stroke', '#c9c9c9');
        string.setAttribute('stroke-width', stringWidth);
        svg.appendChild(string);
    }

    // バレーコード（セーハ）の描画
    if (data.barre) {
        const barre = data.barre;
        const barreX = START_X + (barre.fret - data.startFret + 0.5) * FRET_SPACING;
        const fromY = START_Y + (NUM_STRINGS - barre.fromString) * STRING_SPACING;
        const toY = START_Y + (NUM_STRINGS - barre.toString) * STRING_SPACING;

        const barreRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        barreRect.setAttribute('x', barreX - 15);
        barreRect.setAttribute('y', Math.min(fromY, toY) - 15);
        barreRect.setAttribute('width', 30);
        barreRect.setAttribute('height', Math.abs(toY - fromY) + 30);
        barreRect.setAttribute('rx', '15');
        barreRect.setAttribute('fill', FINGER_COLORS[1]);
        barreRect.setAttribute('filter', 'url(#glow)');
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

    // グローエフェクト用のフィルター定義
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '4');
    feGaussianBlur.setAttribute('result', 'coloredBlur');

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);

    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // 各弦のフレット位置と指番号を描画
    for (let i = 0; i < NUM_STRINGS; i++) {
        const fret = data.frets[i];
        const finger = data.fingers[i];
        // 6弦(index 0)が上、1弦(index 5)が下
        const y = START_Y + i * STRING_SPACING;

        if (fret === -1) {
            // ミュート（×マーク）- 左側に表示
            const mute = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            mute.setAttribute('x', START_X - 40);
            mute.setAttribute('y', y + 12);
            mute.setAttribute('text-anchor', 'middle');
            mute.setAttribute('font-size', '36');
            mute.setAttribute('font-weight', 'bold');
            mute.setAttribute('fill', '#ff6b6b');
            mute.textContent = '×';
            svg.appendChild(mute);
        } else if (fret === 0) {
            // 開放弦（○マーク）- 左側に表示
            const open = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            open.setAttribute('cx', START_X - 40);
            open.setAttribute('cy', y);
            open.setAttribute('r', '16');
            open.setAttribute('fill', 'none');
            open.setAttribute('stroke', '#51cf66');
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
            fingerCircle.setAttribute('filter', 'url(#glow)');
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

    // 弦名ラベル（右側に表示）
    const stringNames = ['6弦', '5弦', '4弦', '3弦', '2弦', '1弦'];
    for (let i = 0; i < NUM_STRINGS; i++) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', START_X + NUM_FRETS * FRET_SPACING + 50);
        label.setAttribute('y', START_Y + i * STRING_SPACING + 8);
        label.setAttribute('text-anchor', 'start');
        label.setAttribute('font-size', '22');
        label.setAttribute('fill', '#888');
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

    // アニメーション効果
    mainDisplay.classList.remove('updated');
    void mainDisplay.offsetWidth; // リフロー強制
    mainDisplay.classList.add('updated');

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
