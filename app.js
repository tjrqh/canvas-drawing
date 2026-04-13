/* STATE & CONSTANTS */
let nid = 1;
const gid = () => `e${nid++}`;

const S = {
    tool: 'select',
    strokeColor: '#58a6ff', fillColor: '#21262d', strokeWidth: 2,
    shapes: [], connections: [], fpaths: [],
    isDown: false, drawPts: null,
    isDrag: false, dragId: null, dox: 0, doy: 0,
    isConn: false, connFrom: null,
    sel: null, placing: null
};

const $ = id => document.getElementById(id);
const svg = $('cv'), lp = $('lp'), lc = $('lc'), ls = $('ls'), lt = $('lt'), ghost = $('ghost');

/* RENDERING */
function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function renderAll() {
    renderPaths(); renderConns(); renderShapes();
    $('scnt').textContent = S.shapes.length;
    $('pcnt').textContent = S.fpaths.length;
    $('ccnt').textContent = S.connections.length;
}

function renderShapes() {
    ls.innerHTML = '';
    for (const s of S.shapes) {
        const def = SD[s.type]; if (!def) continue;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('shape-g'); 
        g.dataset.id = s.id;
        
        const isSel = S.sel?.id === s.id && S.sel?.type === 'shape';
        let html = def.render(s);
        
        if (isSel) { 
            html += `<rect x="${s.x - 4}" y="${s.y - 4}" width="${s.w + 8}" height="${s.h + 8}" fill="none" stroke="#3fb950" stroke-width="1.5" stroke-dasharray="5 3" rx="4" pointer-events="none"/>`; 
        }
        
        // 중요: pointer-events="none" 속성이 있어야 텍스트를 눌러도 도형 클릭으로 인식됩니다.
        html += `<text class="slabel" x="${s.x + s.w / 2}" y="${s.y + s.h / 2}" 
                 fill="#c9d1d9" font-size="12" 
                 text-anchor="middle" dominant-baseline="middle" 
                 pointer-events="none" style="user-select:none;">${esc(s.label)}</text>`;
        
        for (const p of def.cp(s)) { 
            html += `<circle class="cp" cx="${p.x}" cy="${p.y}" r="5" data-sid="${s.id}" data-pid="${p.id}"/>`; 
        }
        
        g.innerHTML = html; 
        ls.appendChild(g);
    }
}

function renderConns() {
    lc.innerHTML = '';
    for (const c of S.connections) {
        const fs = S.shapes.find(s => s.id === c.fid), ts = S.shapes.find(s => s.id === c.tid);
        if (!fs || !ts) continue;
        const fp = SD[fs.type]?.cp(fs).find(p => p.id === c.fpt), tp = SD[ts.type]?.cp(ts).find(p => p.id === c.tpt);
        if (!fp || !tp) continue;
        const isSel = S.sel?.id === c.id;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('cl'); path.dataset.id = c.id;
        path.setAttribute('d', bezier(fp, tp, c.fpt));
        path.setAttribute('stroke', isSel ? '#3fb950' : c.stroke);
        path.setAttribute('stroke-width', c.sw);
        path.setAttribute('marker-end', isSel ? 'url(#arr-sel)' : 'url(#arr)');
        lc.appendChild(path);
    }
}

function renderPaths() {
    lp.innerHTML = '';
    for (const fp of S.fpaths) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.classList.add('fp'); p.dataset.id = fp.id;
        p.setAttribute('d', fp.d); p.setAttribute('stroke', fp.stroke);
        p.setAttribute('stroke-width', fp.sw);
        lp.appendChild(p);
    }
}

/* MATH HELPERS */
function bezier(a, b, fptId) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const off = Math.max(60, Math.abs(dx) * .45, Math.abs(dy) * .45);
    let cx1, cy1;
    if (fptId === 't') { cx1 = a.x; cy1 = a.y - off; }
    else if (fptId === 'b') { cx1 = a.x; cy1 = a.y + off; }
    else if (fptId === 'l') { cx1 = a.x - off; cy1 = a.y; }
    else { cx1 = a.x + off; cy1 = a.y; }
    const cx2 = b.x + (cx1 > a.x ? -off * .4 : off * .4), cy2 = b.y + (cy1 > a.y ? -off * .4 : off * .4);
    return `M${a.x},${a.y} C${cx1},${cy1} ${cx2},${cy2} ${b.x},${b.y}`;
}

function pts2path(pts) {
    if (pts.length < 2) return '';
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
        d += ` Q${pts[i].x},${pts[i].y} ${mx},${my}`;
    }
    d += ` L${pts[pts.length - 1].x},${pts[pts.length - 1].y}`;
    return d;
}

/* EVENT HANDLERS */
function svgPt(e){const r=svg.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function dist(a,b){return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2)}

function initEvents(){
  $('cvwrap').addEventListener('contextmenu',e=>e.preventDefault());
  svg.addEventListener('mousedown',onDown);
  window.addEventListener('mousemove',onMove);
  window.addEventListener('mouseup',onUp);
  svg.addEventListener('dblclick',onDbl);

  window.addEventListener('keydown',e=>{
    const tag=document.activeElement?.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA')return;
    if(e.key==='Delete'||e.key==='Backspace')delSel();
    if(e.key==='v'||e.key==='V')setTool('select');
    if(e.key==='p'||e.key==='P')setTool('pen');
    if(e.key==='e'||e.key==='E')setTool('eraser');
    if(e.key==='c'||e.key==='C')setTool('connect');
    if(e.key==='Escape'){S.sel=null;svg.classList.remove('svg-connecting');renderAll();}
  });

  // Panel shape drag
  window.addEventListener('mousemove',e=>{
    if(!S.placing)return;
    ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
  });
  window.addEventListener('mouseup',e=>{
    if(!S.placing)return;
    ghost.style.display='none';
    // Check if over canvas
    const cvr=svg.getBoundingClientRect();
    if(e.clientX>=cvr.left&&e.clientX<=cvr.right&&e.clientY>=cvr.top&&e.clientY<=cvr.bottom){
      placeShape(S.placing,svgPt(e));
    }
    S.placing=null;
  });
}

function onDown(e){
  const p=svgPt(e);
  S.isDown=true;
  // Right click → erase
  if(e.button===2){eraseAt(p);return;}

  const tool=S.tool;

  // PEN
  if(tool==='pen'){S.drawPts=[p];return;}

  // ERASER
  if(tool==='eraser'){eraseAt(p);return;}

  // Connection point clicked (any tool)
  if(e.target.classList.contains('cp')){
    const sid=e.target.dataset.sid,pid=e.target.dataset.pid;
    const shape=S.shapes.find(s=>s.id===sid);
    if(shape){
      const pt=SD[shape.type]?.cp(shape).find(p=>p.id===pid);
      if(pt){
        S.isConn=true;
        S.connFrom={sid,pid,x:pt.x,y:pt.y};
        svg.classList.add('svg-connecting');
        return;
      }
    }
  }

  // SELECT
  if(tool==='select'||tool==='connect'){
    const g=e.target.closest('.shape-g');
    if(g){
      const id=g.dataset.id,shape=S.shapes.find(s=>s.id===id);
      S.sel={type:'shape',id};
      if(tool==='select'&&!e.target.classList.contains('cp')){
        S.isDrag=true;S.dragId=id;
        S.dox=p.x-shape.x;S.doy=p.y-shape.y;
      }
      renderAll();return;
    }
    if(e.target.classList.contains('cl')){
      S.sel={type:'conn',id:e.target.dataset.id};renderAll();return;
    }
    if(e.target.id==='cvbg'){S.sel=null;renderAll();}
  }
}

function onMove(e){
  const p=svgPt(e);
  $('spos').textContent=`${Math.round(p.x)}, ${Math.round(p.y)}`;
  if(!S.isDown)return;

  // Right drag = erase
  if(e.buttons===2){eraseAt(p);return;}

  // Pen drawing
  if(S.tool==='pen'&&S.drawPts){
    S.drawPts.push(p);
    let tp=lt.querySelector('#tdp');
    if(!tp){tp=document.createElementNS('http://www.w3.org/2000/svg','path');tp.id='tdp';tp.classList.add('fp');lt.appendChild(tp);}
    tp.setAttribute('d',pts2path(S.drawPts));
    tp.setAttribute('stroke',S.strokeColor);tp.setAttribute('stroke-width',S.strokeWidth);
    return;
  }

  // Eraser drag
  if(S.tool==='eraser'&&e.buttons===1){eraseAt(p);return;}

  // Drag shape
  if(S.isDrag&&S.dragId){
    const s=S.shapes.find(sh=>sh.id===S.dragId);
    if(s){s.x=p.x-S.dox;s.y=p.y-S.doy;renderAll();}
    return;
  }

  // Connection drawing
  if(S.isConn&&S.connFrom){
    lt.innerHTML='';
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.classList.add('clt');
    path.setAttribute('d',`M${S.connFrom.x},${S.connFrom.y} L${p.x},${p.y}`);
    path.setAttribute('stroke',S.strokeColor);path.setAttribute('stroke-width',Math.max(1,S.strokeWidth));
    lt.appendChild(path);
    // Highlight target cp
    document.querySelectorAll('.cp.cphover').forEach(el=>el.classList.remove('cphover'));
    const el=document.elementFromPoint(e.clientX,e.clientY);
    if(el?.classList.contains('cp'))el.classList.add('cphover');
    return;
  }
}

function onUp(e){
  const p=svgPt(e);

  // Finish pen stroke
  if(S.tool==='pen'&&S.drawPts&&S.drawPts.length>1){
    S.fpaths.push({id:gid(),d:pts2path(S.drawPts),stroke:S.strokeColor,sw:S.strokeWidth});
    S.drawPts=null;lt.innerHTML='';renderAll();
  }
  S.drawPts=null;

  // Finish connection
  if(S.isConn&&S.connFrom){
    document.querySelectorAll('.cp.cphover').forEach(el=>el.classList.remove('cphover'));
    const el=document.elementFromPoint(e.clientX,e.clientY);
    if(el?.classList.contains('cp')){
      const tid=el.dataset.sid,tpid=el.dataset.pid;
      if(tid!==S.connFrom.sid){
        S.connections.push({id:gid(),fid:S.connFrom.sid,fpt:S.connFrom.pid,tid,tpt:tpid,stroke:S.strokeColor,sw:S.strokeWidth});
      }
    }
    S.isConn=false;S.connFrom=null;lt.innerHTML='';
    svg.classList.remove('svg-connecting');
    renderAll();
  }

  S.isDown=false;S.isDrag=false;S.dragId=null;
}

function onDbl(e){
  const g=e.target.closest('.shape-g');if(!g)return;
  const s=S.shapes.find(sh=>sh.id===g.dataset.id);if(!s)return;
  const v=prompt('도형 이름 변경:',s.label||'');
  if(v!==null){s.label=v;renderAll();}
}   
function onMove(e) {
    const p = svgPt(e); $('spos').textContent = `${Math.round(p.x)}, ${Math.round(p.y)}`;
    if (!S.isDown) return;
    if (e.buttons === 2 || S.tool === 'eraser') { eraseAt(p); return; }
    if (S.tool === 'pen' && S.drawPts) {
        S.drawPts.push(p); let tp = lt.querySelector('#tdp');
        if (!tp) { tp = document.createElementNS('http://www.w3.org/2000/svg', 'path'); tp.id = 'tdp'; tp.classList.add('fp'); lt.appendChild(tp); }
        tp.setAttribute('d', pts2path(S.drawPts)); tp.setAttribute('stroke', S.strokeColor); tp.setAttribute('stroke-width', S.strokeWidth);
        return;
    }
    if (S.isDrag && S.dragId) { const s = S.shapes.find(sh => sh.id === S.dragId); if (s) { s.x = p.x - S.dox; s.y = p.y - S.doy; renderAll(); } return; }
    if (S.isConn && S.connFrom) {
        lt.innerHTML = ''; const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('clt'); path.setAttribute('d', `M${S.connFrom.x},${S.connFrom.y} L${p.x},${p.y}`);
        path.setAttribute('stroke', S.strokeColor); path.setAttribute('stroke-width', 1); lt.appendChild(path);
        return;
    }
}

function onUp(e) {
    if (S.tool === 'pen' && S.drawPts && S.drawPts.length > 1) {
        S.fpaths.push({ id: gid(), d: pts2path(S.drawPts), stroke: S.strokeColor, sw: S.strokeWidth });
    }
    if (S.isConn && S.connFrom) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el?.classList.contains('cp')) {
            const tid = el.dataset.sid, tpid = el.dataset.pid;
            if (tid !== S.connFrom.sid) S.connections.push({ id: gid(), fid: S.connFrom.sid, fpt: S.connFrom.pid, tid, tpt: tpid, stroke: S.strokeColor, sw: S.strokeWidth });
        }
    }
    S.isDown = false; S.isDrag = false; S.isConn = false; S.drawPts = null; lt.innerHTML = ''; svg.classList.remove('svg-connecting'); renderAll();
}

function eraseAt(p) {
    const R = Math.max(S.strokeWidth * 4, 12);
    S.fpaths = S.fpaths.filter(fp => {
        const el = lp.querySelector(`[data-id="${fp.id}"]`); if (!el) return true;
        try {
            const len = el.getTotalLength();
            for (let t = 0; t <= len; t += 5) {
                const pt = el.getPointAtLength(t); if (dist({ x: pt.x, y: pt.y }, p) < R) return false;
            }
        } catch (e) { } return true;
    }); renderPaths();
}

function placeShape(type, p) {
    const def = SD[type]; if (!def) return;
    const s = { id: gid(), type, x: p.x - def.dw / 2, y: p.y - def.dh / 2, w: def.dw, h: def.dh, fill: S.fillColor, stroke: S.strokeColor, sw: S.strokeWidth, label: def.name };
    S.shapes.push(s); S.sel = { type: 'shape', id: s.id }; renderAll();
}

function delSel() {
    if (!S.sel) return;
    if (S.sel.type === 'shape') { S.shapes = S.shapes.filter(s => s.id !== S.sel.id); S.connections = S.connections.filter(c => c.fid !== S.sel.id && c.tid !== S.sel.id); }
    else S.connections = S.connections.filter(c => c.id !== S.sel.id);
    S.sel = null; renderAll();
}

/* UI INIT */
function setTool(t) {
    S.tool = t; document.querySelectorAll('.tbtn[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === t));
    $('stool').textContent = t; $('cvwrap').style.cursor = t === 'pen' ? 'crosshair' : 'default';
}

function initToolbar() {
    document.querySelectorAll('.tbtn[data-tool]').forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));
    $('sc').oninput = e => { S.strokeColor = e.target.value; if (S.sel) renderAll(); };
    $('fc').oninput = e => { S.fillColor = e.target.value; if (S.sel) renderAll(); };
    $('sw').oninput = e => { S.strokeWidth = +e.target.value; $('swv').textContent = e.target.value; };
    $('btn-del').onclick = delSel;
    $('btn-clear').onclick = () => { if (confirm('초기화하시겠습니까?')) { S.shapes = []; S.connections = []; S.fpaths = []; renderAll(); } };
}

function initPanel() {
    const p = $('spanel');
    Object.entries(SD).forEach(([key, def]) => {
        const el = document.createElement('div'); el.className = 'sitem'; el.innerHTML = def.ico;
        el.onmousedown = e => { S.placing = key; ghost.innerHTML = def.ico; ghost.style.display = 'block'; };
        p.appendChild(el);
    });
}

initPanel(); initToolbar(); initEvents(); renderAll();