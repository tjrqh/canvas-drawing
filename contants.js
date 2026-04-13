/* 도형 정의 데이터 */
export const SHAPE_DEFINITIONS = {
    rect: {
        name: '사각형',
        ico: `<svg ...><rect x="5" y="11" width="28" height="16" rx="2"/></svg>`,
        dw: 120, dh: 75,
        render(s) { /* ...기존 render 로직... */ },
        cp(s) { /* ...기존 커넥션 포인트 로직... */ }
    },
    // ... 나머지 circle, diamond, star 등 모든 도형 정의 포함
};

/* 앱 상태 객체 */
export const State = {
    tool: 'select',
    strokeColor: '#58a6ff',
    fillColor: '#21262d',
    strokeWidth: 2,
    shapes: [],
    connections: [],
    fpaths: [],
    isDown: false,
    drawPts: null,
    isDrag: false,
    dragId: null,
    isConn: false,
    connFrom: null,
    sel: null,
    placing: null
};

export const nid = { current: 1 };
export const gid = () => `e${nid.current++}`;