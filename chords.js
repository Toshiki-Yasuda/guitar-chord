// ギターコードデータ
// frets: 各弦のフレット位置 (0=開放弦, -1=ミュート, 1以上=フレット番号)
// fingers: 各弦を押さえる指 (0=押さえない, 1=人差し指, 2=中指, 3=薬指, 4=小指)
// 弦の順序: [6弦(低), 5弦, 4弦, 3弦, 2弦, 1弦(高)]

const chordData = {
    // メジャーコード
    'C': {
        name: 'C',
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        startFret: 1
    },
    'D': {
        name: 'D',
        frets: [-1, -1, 0, 2, 3, 2],
        fingers: [0, 0, 0, 1, 3, 2],
        startFret: 1
    },
    'E': {
        name: 'E',
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [0, 2, 3, 1, 0, 0],
        startFret: 1
    },
    'F': {
        name: 'F',
        frets: [1, 1, 2, 3, 3, 1],
        fingers: [1, 1, 2, 3, 4, 1],
        startFret: 1,
        barre: { fret: 1, fromString: 6, toString: 1 }
    },
    'G': {
        name: 'G',
        frets: [3, 2, 0, 0, 0, 3],
        fingers: [2, 1, 0, 0, 0, 3],
        startFret: 1
    },
    'A': {
        name: 'A',
        frets: [-1, 0, 2, 2, 2, 0],
        fingers: [0, 0, 1, 2, 3, 0],
        startFret: 1
    },

    // マイナーコード
    'Am': {
        name: 'Am',
        frets: [-1, 0, 2, 2, 1, 0],
        fingers: [0, 0, 2, 3, 1, 0],
        startFret: 1
    },
    'Dm': {
        name: 'Dm',
        frets: [-1, -1, 0, 2, 3, 1],
        fingers: [0, 0, 0, 2, 3, 1],
        startFret: 1
    },
    'Em': {
        name: 'Em',
        frets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 2, 3, 0, 0, 0],
        startFret: 1
    },
    'Bm': {
        name: 'Bm',
        frets: [-1, 2, 4, 4, 3, 2],
        fingers: [0, 1, 3, 4, 2, 1],
        startFret: 2,
        barre: { fret: 2, fromString: 5, toString: 1 }
    },

    // セブンスコード
    'C7': {
        name: 'C7',
        frets: [-1, 3, 2, 3, 1, 0],
        fingers: [0, 3, 2, 4, 1, 0],
        startFret: 1
    },
    'D7': {
        name: 'D7',
        frets: [-1, -1, 0, 2, 1, 2],
        fingers: [0, 0, 0, 2, 1, 3],
        startFret: 1
    },
    'G7': {
        name: 'G7',
        frets: [3, 2, 0, 0, 0, 1],
        fingers: [3, 2, 0, 0, 0, 1],
        startFret: 1
    },
    'A7': {
        name: 'A7',
        frets: [-1, 0, 2, 0, 2, 0],
        fingers: [0, 0, 1, 0, 2, 0],
        startFret: 1
    }
};
