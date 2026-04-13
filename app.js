import { SHAPE_DEFINITIONS as SD, State as S, gid } from './constants.js';

// DOM 요소 캐싱
const $ = id => document.getElementById(id);
const svg = $('cv'), lp = $('lp'), lc = $('lc'), ls = $('ls'), lt = $('lt'), ghost = $('ghost');

/* ── RENDER DOMAIN ── */
function renderAll() {
    renderPaths();
    renderConns();
    renderShapes();
    updateStatusBar();
}

function renderShapes() {
    ls.innerHTML = '';
    S.shapes.forEach(s => {
        const def = SD[s.type];
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('shape-g');
        g.dataset.id = s.id;
        // ... 기존 렌더링 로직 적용 ...
        ls.appendChild(g);
    });
}

/* ── EVENT DOMAIN ── */
function initEvents() {
    svg.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    
    // 단축키 설정
    window.addEventListener('keydown', e => {
        if (e.key === 'Delete') delSel();
        // ... 기타 키 바인딩 ...
    });
}

function onDown(e) {
    const p = getSvgPt(e);
    S.isDown = true;
    if (e.button === 2) { eraseAt(p); return; }
    // ... 모드별 분기 처리 ...
}

/* ── UTILS DOMAIN ── */
function getSvgPt(e) {
    const r = svg.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function updateStatusBar() {
    $('spos').textContent = `...`;
    // ... 카운트 업데이트 ...
}

// 초기화 실행
(function bootstrap() {
    initPanel();
    initToolbar();
    initEvents();
    renderAll();
})();

// UI 초기화 함수들 (initPanel, initToolbar 등 기존 코드 모듈화하여 포함)