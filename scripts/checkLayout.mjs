// 기하학적 겹침 검증 스크립트

// 점과 선분 사이의 최단 거리 계산
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

// 두 선분 간의 교차 판정
function ccw(ax, ay, bx, by, cx, cy) {
  return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
}
function intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  return (ccw(a1x, a1y, b1x, b1y, b2x, b2y) !== ccw(a2x, a2y, b1x, b1y, b2x, b2y)) &&
         (ccw(a1x, a1y, a2x, a2y, b1x, b1y) !== ccw(a1x, a1y, a2x, a2y, b2x, b2y));
}

// 1. 보통 난이도 검증
const normalNodes = {
  N1: { x: 160, y: 160 },
  N2: { x: 500, y: 120 },
  N3: { x: 280, y: 420 },
  N4: { x: 560, y: 360 },
  N5: { x: 160, y: 720 },
  N6: { x: 860, y: 320 },
  N7: { x: 480, y: 740 },
  N8: { x: 860, y: 740 }
};

const normalEdges = [
  ['N1', 'N2'], ['N1', 'N3'], ['N2', 'N4'], ['N3', 'N4'], ['N3', 'N5'],
  ['N4', 'N6'], ['N2', 'N6'], ['N5', 'N6'], ['N5', 'N7'], ['N6', 'N8'],
  ['N7', 'N8'], ['N1', 'N5'], ['N4', 'N8']
];

console.log('--- 보통 난이도 간선-노드 거리 검사 ---');
let normalOk = true;
normalEdges.forEach(([u, v]) => {
  const p1 = normalNodes[u];
  const p2 = normalNodes[v];
  Object.entries(normalNodes).forEach(([nodeId, p]) => {
    if (nodeId === u || nodeId === v) return;
    const d = distToSegment(p.x, p.y, p1.x, p1.y, p2.x, p2.y);
    if (d < 50) { // 노드 반경 26px + 라벨 20px = 최소 50px 필요
      console.log(`경고: 간선 ${u}-${v}와 노드 ${nodeId}의 거리가 너무 가까움 (${d.toFixed(1)}px)`);
      normalOk = false;
    }
  });
});
if (normalOk) console.log('보통 난이도: 모든 간선과 노드가 50px 이상 안전 거리 확보!');

// 2. 어려움 난이도 후보 좌표 검증
const hardNodes = {
  H1: { x: 160, y: 160 },
  H2: { x: 480, y: 120 },
  H3: { x: 260, y: 340 },
  H4: { x: 620, y: 260 },
  H5: { x: 240, y: 540 },
  H6: { x: 840, y: 380 },
  H7: { x: 160, y: 740 },
  H8: { x: 480, y: 740 },
  H9: { x: 740, y: 640 },
  H10: { x: 880, y: 780 }
};

const hardEdges = [
  ['H1', 'H2'], ['H1', 'H3'], ['H2', 'H4'], ['H3', 'H4'], ['H3', 'H5'],
  ['H4', 'H6'], ['H5', 'H6'], ['H5', 'H7'], ['H6', 'H8'], ['H7', 'H8'],
  ['H7', 'H9'], ['H8', 'H9'], ['H8', 'H10'], ['H9', 'H10'],
  ['H2', 'H5'], ['H4', 'H7'], ['H6', 'H10']
];

console.log('--- 어려움 난이도 간선-노드 거리 검사 ---');
let hardOk = true;
hardEdges.forEach(([u, v]) => {
  const p1 = hardNodes[u];
  const p2 = hardNodes[v];
  Object.entries(hardNodes).forEach(([nodeId, p]) => {
    if (nodeId === u || nodeId === v) return;
    const d = distToSegment(p.x, p.y, p1.x, p1.y, p2.x, p2.y);
    if (d < 45) {
      console.log(`경고: 어려움 간선 ${u}-${v}와 노드 ${nodeId} 거리: ${d.toFixed(1)}px`);
      hardOk = false;
    }
  });
});
if (hardOk) console.log('어려움 난이도: 모든 간선과 노드가 안전 거리 확보!');
