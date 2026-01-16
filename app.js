// ギターコード練習アプリ - メインスクリプト

// DOM要素
const chordDiagram = document.getElementById('chord-diagram');
const chordNameDisplay = document.getElementById('chord-name');
const chordButtons = document.querySelectorAll('.chord-btn');
const chordDisplaySection = document.querySelector('.chord-display');

// 定数
const DIAGRAM_WIDTH = 200;
const DIAGRAM_HEIGHT = 250;
const STRING_SPACING = 30;
const FRET_SPACING = 45;
const START_X = 35;
const START_Y = 50;
const NUM_FRETS = 5;
const NUM_STRINGS = 6;

// 指の色
const FINGER_COLORS = {
    1: '#e53e3e', // 人差し指 - 赤
    2: '#38a169', // 中指 - 緑
    3: '#3182ce', // 薬指 - 青
    4: '#805ad5'  // 小指 - 紫
};

// コードダイアグラムをSVGで描画
function drawChordDiagram(chord) {
    const data = chordData[chord];
    if (!data) return;

    // SVG要素を作成
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`);
    svg.setAttribute('width', DIAGRAM_WIDTH);
    svg.setAttribute('height', DIAGRAM_HEIGHT);

    // 背景
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', DIAGRAM_WIDTH);
    bg.setAttribute('height', DIAGRAM_HEIGHT);
    bg.setAttribute('fill', '#fafafa');
    bg.setAttribute('rx', '10');
    svg.appendChild(bg);

    // フレット番号表示（1フレット以外から始まる場合）
    if (data.startFret > 1) {
        const fretNum = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fretNum.setAttribute('x', START_X - 25);
        fretNum.setAttribute('y', START_Y + FRET_SPACING / 2 + 5);
        fretNum.setAttribute('font-size', '14');
        fretNum.setAttribute('fill', '#4a5568');
        fretNum.textContent = data.startFret + 'fr';
        svg.appendChild(fretNum);
    }

    // ナット（1フレットから始まる場合）
    if (data.startFret === 1) {
        const nut = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nut.setAttribute('x', START_X);
        nut.setAttribute('y', START_Y - 5);
        nut.setAttribute('width', STRING_SPACING * (NUM_STRINGS - 1));
        nut.setAttribute('height', 8);
        nut.setAttribute('fill', '#2d3748');
        nut.setAttribute('rx', '2');
        svg.appendChild(nut);
    }

    // フレット線を描画
    for (let i = 0; i <= NUM_FRETS; i++) {
        const fret = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        fret.setAttribute('x1', START_X);
        fret.setAttribute('y1', START_Y + i * FRET_SPACING);
        fret.setAttribute('x2', START_X + STRING_SPACING * (NUM_STRINGS - 1));
        fret.setAttribute('y2', START_Y + i * FRET_SPACING);
        fret.setAttribute('stroke', '#718096');
        fret.setAttribute('stroke-width', i === 0 ? '3' : '1');
        svg.appendChild(fret);
    }

    // 弦を描画
    for (let i = 0; i < NUM_STRINGS; i++) {
        const string = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        string.setAttribute('x1', START_X + i * STRING_SPACING);
        string.setAttribute('y1', START_Y);
        string.setAttribute('x2', START_X + i * STRING_SPACING);
        string.setAttribute('y2', START_Y + NUM_FRETS * FRET_SPACING);
        string.setAttribute('stroke', '#4a5568');
        // 弦の太さを変える（低音弦は太く）
        string.setAttribute('stroke-width', 2.5 - i * 0.3);
        svg.appendChild(string);
    }

    // バレーコード（セーハ）の描画
    if (data.barre) {
        const barre = data.barre;
        const barreY = START_Y + (barre.fret - data.startFret + 0.5) * FRET_SPACING;
        const fromX = START_X + (NUM_STRINGS - barre.fromString) * STRING_SPACING;
        const toX = START_X + (NUM_STRINGS - barre.toString) * STRING_SPACING;

        const barreRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        barreRect.setAttribute('x', Math.min(fromX, toX) - 8);
        barreRect.setAttribute('y', barreY - 8);
        barreRect.setAttribute('width', Math.abs(toX - fromX) + 16);
        barreRect.setAttribute('height', 16);
        barreRect.setAttribute('rx', '8');
        barreRect.setAttribute('fill', FINGER_COLORS[1]);
        svg.appendChild(barreRect);
    }

    // 各弦のフレット位置と指番号を描画
    for (let i = 0; i < NUM_STRINGS; i++) {
        const fret = data.frets[i];
        const finger = data.fingers[i];
        const x = START_X + i * STRING_SPACING;

        if (fret === -1) {
            // ミュート（×マーク）
            const mute = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            mute.setAttribute('x', x);
            mute.setAttribute('y', START_Y - 15);
            mute.setAttribute('text-anchor', 'middle');
            mute.setAttribute('font-size', '18');
            mute.setAttribute('font-weight', 'bold');
            mute.setAttribute('fill', '#e53e3e');
            mute.textContent = '×';
            svg.appendChild(mute);
        } else if (fret === 0) {
            // 開放弦（○マーク）
            const open = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            open.setAttribute('cx', x);
            open.setAttribute('cy', START_Y - 15);
            open.setAttribute('r', '8');
            open.setAttribute('fill', 'none');
            open.setAttribute('stroke', '#38a169');
            open.setAttribute('stroke-width', '2');
            svg.appendChild(open);
        } else {
            // フレットを押さえる位置
            // バレーコードの場合はバレー部分の指は描画しない
            if (data.barre && fret === data.barre.fret && finger === 1) {
                continue;
            }

            const y = START_Y + (fret - data.startFret + 0.5) * FRET_SPACING;

            // 指の丸
            const fingerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            fingerCircle.setAttribute('cx', x);
            fingerCircle.setAttribute('cy', y);
            fingerCircle.setAttribute('r', '12');
            fingerCircle.setAttribute('fill', FINGER_COLORS[finger] || '#4a5568');
            svg.appendChild(fingerCircle);

            // 指番号
            const fingerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            fingerText.setAttribute('x', x);
            fingerText.setAttribute('y', y + 5);
            fingerText.setAttribute('text-anchor', 'middle');
            fingerText.setAttribute('font-size', '14');
            fingerText.setAttribute('font-weight', 'bold');
            fingerText.setAttribute('fill', 'white');
            fingerText.textContent = finger;
            svg.appendChild(fingerText);
        }
    }

    // 弦名ラベル
    const stringNames = ['6', '5', '4', '3', '2', '1'];
    for (let i = 0; i < NUM_STRINGS; i++) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', START_X + i * STRING_SPACING);
        label.setAttribute('y', START_Y + NUM_FRETS * FRET_SPACING + 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', '#718096');
        label.textContent = stringNames[i] + '弦';
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
    chordDisplaySection.classList.remove('updated');
    void chordDisplaySection.offsetWidth; // リフロー強制
    chordDisplaySection.classList.add('updated');

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

// 初期表示
displayChord('C');
