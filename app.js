// ギターコード練習アプリ - アコースティックテーマ版

// DOM要素
const chordDiagram = document.getElementById('chord-diagram');
const chordNameDisplay = document.getElementById('chord-name');
const chordButtons = document.querySelectorAll('.chord-btn');

// 選択中のアルペジオパターン
let selectedArpeggioPattern = null;

// 横向きダイアグラムの定数（もっと大きく！）
const DIAGRAM_WIDTH = 1180;
const DIAGRAM_HEIGHT = 580;
const FRET_SPACING = 180;  // フレット間隔（横方向）
const STRING_SPACING = 85; // 弦間隔（縦方向）
const START_X = 120;       // 左端からの開始位置（広めに）
const START_Y = 80;        // 上端からの開始位置
const NUM_FRETS = 5;
const NUM_STRINGS = 6;

// 指の色（パステルカラー）
const FINGER_COLORS = {
    1: '#E8A0A0', // 人差し指 - 淡いピンク
    2: '#90C090', // 中指 - 淡いグリーン
    3: '#A0B8E0', // 薬指 - 淡いブルー
    4: '#C8A8D8'  // 小指 - 淡いパープル
};

// 指番号の文字色（濃い色で見やすく）
const FINGER_TEXT_COLORS = {
    1: '#8B3030', // 人差し指 - 濃いピンク
    2: '#2E6B2E', // 中指 - 濃いグリーン
    3: '#3B5998', // 薬指 - 濃いブルー
    4: '#6B3A8B'  // 小指 - 濃いパープル
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
const STRING_WIDTHS = [2.5, 3, 4, 5.5, 7, 8.5];

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
        barreRect.setAttribute('x', barreX - 22);
        barreRect.setAttribute('y', Math.min(fromY, toY) - 22);
        barreRect.setAttribute('width', 44);
        barreRect.setAttribute('height', Math.abs(toY - fromY) + 44);
        barreRect.setAttribute('rx', '22');
        barreRect.setAttribute('fill', FINGER_COLORS[1]);
        barreRect.setAttribute('stroke', '#8B0000');
        barreRect.setAttribute('stroke-width', '3');
        svg.appendChild(barreRect);

        // バレーの指番号
        const barreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        barreText.setAttribute('x', barreX);
        barreText.setAttribute('y', (fromY + toY) / 2 + 12);
        barreText.setAttribute('text-anchor', 'middle');
        barreText.setAttribute('font-size', '36');
        barreText.setAttribute('font-weight', 'bold');
        barreText.setAttribute('fill', FINGER_TEXT_COLORS[1]);
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
            mute.setAttribute('x', START_X - 55);
            mute.setAttribute('y', y + 16);
            mute.setAttribute('text-anchor', 'middle');
            mute.setAttribute('font-size', '48');
            mute.setAttribute('font-weight', 'bold');
            mute.setAttribute('fill', '#DC143C');
            mute.textContent = '×';
            svg.appendChild(mute);
        } else if (fret === 0) {
            // 開放弦（○マーク）- 左側に表示
            const open = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            open.setAttribute('cx', START_X - 55);
            open.setAttribute('cy', y);
            open.setAttribute('r', '20');
            open.setAttribute('fill', 'none');
            open.setAttribute('stroke', '#228B22');
            open.setAttribute('stroke-width', '5');
            svg.appendChild(open);
        } else {
            // フレットを押さえる位置
            // バレーコードの場合はバレー部分の指は描画しない
            if (data.barre && fret === data.barre.fret && finger === 1) {
                continue;
            }

            const x = START_X + (fret - data.startFret + 0.5) * FRET_SPACING;

            // 指の丸（もっと大きく！）
            const fingerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            fingerCircle.setAttribute('cx', x);
            fingerCircle.setAttribute('cy', y);
            fingerCircle.setAttribute('r', '35');
            fingerCircle.setAttribute('fill', FINGER_COLORS[finger] || '#666');
            fingerCircle.setAttribute('stroke', 'white');
            fingerCircle.setAttribute('stroke-width', '4');
            svg.appendChild(fingerCircle);

            // 指番号（もっと大きく！）
            const fingerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            fingerText.setAttribute('x', x);
            fingerText.setAttribute('y', y + 14);
            fingerText.setAttribute('text-anchor', 'middle');
            fingerText.setAttribute('font-size', '40');
            fingerText.setAttribute('font-weight', 'bold');
            fingerText.setAttribute('fill', FINGER_TEXT_COLORS[finger] || '#333');
            fingerText.textContent = finger;
            svg.appendChild(fingerText);
        }
    }

    // 弦名ラベル（右側に表示）- 反転済み
    const stringNames = ['1弦', '2弦', '3弦', '4弦', '5弦', '6弦'];
    for (let i = 0; i < NUM_STRINGS; i++) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', START_X + NUM_FRETS * FRET_SPACING + 70);
        label.setAttribute('y', START_Y + i * STRING_SPACING + 10);
        label.setAttribute('text-anchor', 'start');
        label.setAttribute('font-size', '26');
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
function displayChord(chord, playSound = true) {
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

    // 音を再生
    if (playSound) {
        playChord(chord);
    }
}

// ボタンクリックイベントの設定
chordButtons.forEach(button => {
    // 右上ゾーン（アルペジオ再生）
    const zoneRightTop = button.querySelector('.zone-right-top');
    if (zoneRightTop) {
        zoneRightTop.addEventListener('click', (e) => {
            e.stopPropagation();
            const chord = button.dataset.chord;
            displayChord(chord, false); // 音なしで表示
            // 選択中のアルペジオパターンがあればそれを使用、なければ'up'
            const pattern = selectedArpeggioPattern || 'up';
            playArpeggio(chord, pattern);
        });
    }

    // 右下ゾーン（コード進行に追加）
    const zoneRightBottom = button.querySelector('.zone-right-bottom');
    if (zoneRightBottom) {
        zoneRightBottom.addEventListener('click', (e) => {
            e.stopPropagation();
            const chord = button.dataset.chord;
            addChordToProgression(chord);
        });
    }

    // 左半分（通常の楽譜セット）
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

// Web Audio API でコード音を再生（倍音＋フィルター版）
let audioContext = null;

// 各弦の開放弦の周波数（Hz）- 標準チューニング
const OPEN_STRING_FREQUENCIES = [
    329.63, // 1弦 E4
    246.94, // 2弦 B3
    196.00, // 3弦 G3
    146.83, // 4弦 D3
    110.00, // 5弦 A2
    82.41   // 6弦 E2
];

// 倍音の構成（倍率と音量比）- ギターらしい倍音構造
const HARMONICS = [
    { ratio: 1, gain: 1.0 },    // 基音
    { ratio: 2, gain: 0.5 },    // 2倍音
    { ratio: 3, gain: 0.25 },   // 3倍音
    { ratio: 4, gain: 0.125 },  // 4倍音
];

// フレットによる周波数計算（半音上がるごとに2^(1/12)倍）
function getFrequency(stringIndex, fret) {
    if (fret < 0) return null; // ミュート
    const openFreq = OPEN_STRING_FREQUENCIES[stringIndex];
    return openFreq * Math.pow(2, fret / 12);
}

// 1本の弦の音を生成（倍音付き）
function playString(freq, startTime, stringIndex) {
    // マスターゲイン（この弦全体の音量）
    const masterGain = audioContext.createGain();

    // ローパスフィルター（ギターボディの共鳴を模倣）
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, startTime); // カットオフ周波数
    filter.Q.setValueAtTime(1, startTime); // レゾナンス

    // フィルターの減衰（時間とともに高音が減る＝よりリアル）
    filter.frequency.exponentialRampToValueAtTime(800, startTime + 2.0);

    const duration = 2.5; // 音の長さ

    // 弦の太さによる音量調整（低音弦はやや大きく）
    const stringVolume = 0.15 + (5 - stringIndex) * 0.02;

    // 各倍音を生成
    HARMONICS.forEach((harmonic, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // 波形の選択（倍音ごとに少し変える）
        oscillator.type = index === 0 ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(freq * harmonic.ratio, startTime);

        // 各倍音の音量エンベロープ
        const harmonicGain = stringVolume * harmonic.gain;
        gainNode.gain.setValueAtTime(0, startTime);
        // アタック（急速に立ち上がる）
        gainNode.gain.linearRampToValueAtTime(harmonicGain, startTime + 0.005);
        // 初期ディケイ（弦を弾いた直後の急速な減衰）
        gainNode.gain.exponentialRampToValueAtTime(harmonicGain * 0.7, startTime + 0.1);
        // サステイン〜リリース（ゆっくり減衰）
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        // 接続: オシレーター → ゲイン → フィルター → マスターゲイン
        oscillator.connect(gainNode);
        gainNode.connect(filter);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    });

    // フィルター → マスターゲイン → 出力
    filter.connect(masterGain);
    masterGain.connect(audioContext.destination);

    // マスターゲインのエンベロープ
    masterGain.gain.setValueAtTime(1, startTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
}

// コードを再生
function playChord(chordName) {
    const data = chordData[chordName];
    if (!data) return;

    // AudioContextを初期化（ユーザー操作後に初期化が必要）
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const now = audioContext.currentTime;
    const strumDelay = 0.025; // 弦をかき鳴らす間隔（秒）

    // 各弦の音を生成（6弦から1弦へストローク）
    for (let i = 5; i >= 0; i--) {
        const fret = data.frets[5 - i]; // データは6弦から順
        const freq = getFrequency(i, fret);

        if (freq === null) continue; // ミュートの弦はスキップ

        const startTime = now + (5 - i) * strumDelay;
        playString(freq, startTime, i);
    }

}

// アルペジオパターンの定義
const ARPEGGIO_PATTERNS = {
    // 1. 上昇: 6弦→1弦（低音から高音へ）
    up: (validStrings) => validStrings,

    // 2. 下降: 1弦→6弦（高音から低音へ）
    down: (validStrings) => [...validStrings].reverse(),

    // 3. 往復: 上昇→下降
    updown: (validStrings) => {
        const reversed = [...validStrings].reverse().slice(1);
        return [...validStrings, ...reversed];
    },

    // 4. ピンチ: ベース音と高音を交互に
    pinch: (validStrings) => {
        const result = [];
        const len = validStrings.length;
        const half = Math.ceil(len / 2);
        for (let i = 0; i < half; i++) {
            result.push(validStrings[i]);
            if (len - 1 - i > i) {
                result.push(validStrings[len - 1 - i]);
            }
        }
        return result;
    },

    // 5. スリーフィンガー: クラシックギターの基本（ベース-中-高-中 を繰り返し）
    threefinger: (validStrings) => {
        if (validStrings.length < 3) return validStrings;
        const bass = validStrings[0]; // 最低音
        const mid = validStrings[Math.floor(validStrings.length / 2)]; // 中間
        const high = validStrings[validStrings.length - 1]; // 最高音
        return [bass, mid, high, mid, bass, mid, high, mid];
    },

    // 6. フォーフィンガー: 4本指パターン（ベース-3-2-1 を繰り返し）
    fourfinger: (validStrings) => {
        if (validStrings.length < 4) return validStrings;
        const bass = validStrings[0];
        const s3 = validStrings[Math.floor(validStrings.length * 0.5)];
        const s2 = validStrings[Math.floor(validStrings.length * 0.75)];
        const s1 = validStrings[validStrings.length - 1];
        return [bass, s3, s2, s1, bass, s3, s2, s1];
    },

    // 7. トラビス: カントリー/フォーク（交互ベース + 高音弦）
    travis: (validStrings) => {
        if (validStrings.length < 4) return validStrings;
        const bass1 = validStrings[0]; // 6弦側ベース
        const bass2 = validStrings[Math.min(1, validStrings.length - 1)]; // 5弦側ベース
        const high1 = validStrings[validStrings.length - 1]; // 1弦
        const high2 = validStrings[Math.max(0, validStrings.length - 2)]; // 2弦
        return [bass1, high2, bass2, high1, bass1, high2, bass2, high1];
    },

    // 8. ロール: 連続ロール（中間から高音へ、戻る）
    roll: (validStrings) => {
        if (validStrings.length < 4) return validStrings;
        const mid = Math.floor(validStrings.length / 2);
        const upPart = validStrings.slice(mid); // 中間から高音
        const downPart = [...upPart].reverse().slice(1); // 戻り
        return [...upPart, ...downPart, ...upPart, ...downPart];
    },

    // 9. カスケード: 流れるパターン（1つ飛ばしで弾く）
    cascade: (validStrings) => {
        const result = [];
        // 偶数インデックス（0,2,4...）を先に
        for (let i = 0; i < validStrings.length; i += 2) {
            result.push(validStrings[i]);
        }
        // 奇数インデックス（1,3,5...）を後に
        for (let i = 1; i < validStrings.length; i += 2) {
            result.push(validStrings[i]);
        }
        return result;
    },

    // 10. ランダム: ランダムな順番
    random: (validStrings) => {
        const shuffled = [...validStrings];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// アルペジオでコードを再生
function playArpeggio(chordName, pattern = 'up', button = null) {
    const data = chordData[chordName];
    if (!data) return;

    // AudioContextを初期化
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 有効な弦のデータを収集（6弦から1弦の順）
    const validStrings = [];
    for (let i = 5; i >= 0; i--) {
        const fret = data.frets[5 - i];
        const freq = getFrequency(i, fret);
        if (freq !== null) {
            validStrings.push({ stringIndex: i, freq: freq });
        }
    }

    // パターンに応じて弦の順序を決定
    const patternFunc = ARPEGGIO_PATTERNS[pattern] || ARPEGGIO_PATTERNS.up;
    const playOrder = patternFunc(validStrings);

    const now = audioContext.currentTime;
    const arpeggioDelay = 0.3; // アルペジオの間隔

    // 各弦の音を生成
    playOrder.forEach((stringData, index) => {
        const startTime = now + index * arpeggioDelay;
        playString(stringData.freq, startTime, stringData.stringIndex);
    });

    // ボタンのアニメーション
    if (button) {
        button.classList.add('playing');
        setTimeout(() => button.classList.remove('playing'), playOrder.length * arpeggioDelay * 1000 + 300);
    }
}

// アルペジオボタンのイベント
const arpeggioButtons = document.querySelectorAll('.arpeggio-btn');
arpeggioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const pattern = btn.dataset.pattern;

        // 既に選択されている場合は解除
        if (selectedArpeggioPattern === pattern) {
            selectedArpeggioPattern = null;
            btn.classList.remove('selected');
        } else {
            // 他のボタンの選択を解除
            arpeggioButtons.forEach(b => b.classList.remove('selected'));
            // このボタンを選択
            selectedArpeggioPattern = pattern;
            btn.classList.add('selected');
        }

        // 現在のコードでアルペジオ再生
        const currentChord = chordNameDisplay.textContent;
        playArpeggio(currentChord, pattern, btn);
    });
});

// 初期表示（音は鳴らさない）
displayChord('C', false);

// ========================================
// コード進行機能
// ========================================

// コード進行リスト
let chordProgression = [];
let isPlayingProgression = false;
let progressionTimeouts = [];
let playbackSpeed = 1.5; // 秒

// DOM要素
const progressionList = document.getElementById('progression-list');
const playProgressionBtn = document.getElementById('play-progression-btn');
const stopProgressionBtn = document.getElementById('stop-progression-btn');
const clearProgressionBtn = document.getElementById('clear-progression-btn');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

// コード進行にコードを追加
function addChordToProgression(chord) {
    chordProgression.push(chord);
    renderProgressionList();
}

// コード進行からコードを削除
function removeChordFromProgression(index) {
    chordProgression.splice(index, 1);
    renderProgressionList();
}

// コード進行リストを描画
function renderProgressionList() {
    progressionList.innerHTML = '';

    chordProgression.forEach((chord, index) => {
        const item = document.createElement('div');
        item.className = 'progression-item';
        item.dataset.index = index;

        const label = document.createElement('span');
        label.className = 'chord-label';
        label.textContent = chord;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeChordFromProgression(index);
        });

        item.appendChild(label);
        item.appendChild(removeBtn);

        // クリックでそのコードを表示
        item.addEventListener('click', () => {
            displayChord(chord);
        });

        progressionList.appendChild(item);
    });
}

// コード進行を再生
async function playProgression() {
    if (chordProgression.length === 0) return;
    if (isPlayingProgression) return;

    isPlayingProgression = true;
    playProgressionBtn.classList.add('playing');
    playProgressionBtn.textContent = '▶ 再生中...';

    const items = progressionList.querySelectorAll('.progression-item');

    for (let i = 0; i < chordProgression.length; i++) {
        if (!isPlayingProgression) break;

        const chord = chordProgression[i];

        // 現在再生中のアイテムをハイライト
        items.forEach(item => item.classList.remove('playing'));
        if (items[i]) items[i].classList.add('playing');

        // コードを表示して再生
        displayChord(chord);

        // 次のコードまで待機（速度設定に基づく）
        await new Promise(resolve => {
            const timeout = setTimeout(resolve, playbackSpeed * 1000);
            progressionTimeouts.push(timeout);
        });
    }

    stopProgression();
}

// コード進行を停止
function stopProgression() {
    isPlayingProgression = false;
    playProgressionBtn.classList.remove('playing');
    playProgressionBtn.textContent = '▶ 再生';

    // タイムアウトをクリア
    progressionTimeouts.forEach(timeout => clearTimeout(timeout));
    progressionTimeouts = [];

    // ハイライトを解除
    const items = progressionList.querySelectorAll('.progression-item');
    items.forEach(item => item.classList.remove('playing'));
}

// コード進行をクリア
function clearProgression() {
    stopProgression();
    chordProgression = [];
    renderProgressionList();
}

// イベントリスナー
playProgressionBtn.addEventListener('click', playProgression);
stopProgressionBtn.addEventListener('click', stopProgression);
clearProgressionBtn.addEventListener('click', clearProgression);

// 速度スライダー
speedSlider.addEventListener('input', () => {
    playbackSpeed = parseFloat(speedSlider.value);
    speedValue.textContent = playbackSpeed.toFixed(1) + '秒';
});
