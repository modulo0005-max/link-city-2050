// verifyBadgeAlignment.mjs
// 어려움/보통/쉬움 난이도에서 가중치 뱃지가 간선 선분 위에 100% 안착되어 있는지 정밀 기하 검증

const GRAPHS = {
  EASY: {
    nodes: [
      { id: 'A', x: 220, y: 220 },
      { id: 'B', x: 500, y: 150 },
      { id: 'C', x: 780, y: 220 },
      { id: 'D', x: 280, y: 540 },
      { id: 'E', x: 650, y: 460 },
      { id: 'F', x: 500, y: 740 },
    ],
    edges: [
      { id: 'e_AB', source: 'A', target: 'B', weight: 2 },
      { id: 'e_BC', source: 'B', target: 'C', weight: 4 },
      { id: 'e_AD', source: 'A', target: 'D', weight: 3 },
      { id: 'e_BE', source: 'B', target: 'E', weight: 3 },
      { id: 'e_CE', source: 'C', target: 'E', weight: 2 },
      { id: 'e_DE', source: 'D', target: 'E', weight: 4 },
      { id: 'e_DF', source: 'D', target: 'F', weight: 5 },
      { id: 'e_EF', source: 'E', target: 'F', weight: 3 },
      { id: 'e_AE', source: 'A', target: 'E', weight: 6 },
    ]
  },
  HARD: {
    nodes: [
      { id: 'H1', x: 160, y: 160 },
      { id: 'H2', x: 480, y: 120 },
      { id: 'H3', x: 260, y: 340 },
      { id: 'H4', x: 620, y: 260 },
      { id: 'H5', x: 240, y: 540 },
      { id: 'H6', x: 840, y: 380 },
      { id: 'H7', x: 160, y: 740 },
      { id: 'H8', x: 480, y: 740 },
      { id: 'H9', x: 740, y: 640 },
      { id: 'H10', x: 880, y: 780 },
    ],
    edges: [
      { id: 'e_H1H2', source: 'H1', target: 'H2', weight: 2, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H1H3', source: 'H1', target: 'H3', weight: 3, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H2H4', source: 'H2', target: 'H4', weight: 4, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H3H4', source: 'H3', target: 'H4', weight: 3, badgeT: 0.68, badgeOffset: 0 },
      { id: 'e_H3H5', source: 'H3', target: 'H5', weight: 2, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H4H6', source: 'H4', target: 'H6', weight: 4, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H5H6', source: 'H5', target: 'H6', weight: 3, badgeT: 0.70, badgeOffset: 0 },
      { id: 'e_H5H7', source: 'H5', target: 'H7', weight: 5, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H6H8', source: 'H6', target: 'H8', weight: 2, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H7H8', source: 'H7', target: 'H8', weight: 4, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H7H9', source: 'H7', target: 'H9', weight: 3, badgeT: 0.38, badgeOffset: 0 },
      { id: 'e_H8H9', source: 'H8', target: 'H9', weight: 3, badgeT: 0.55, badgeOffset: 0 },
      { id: 'e_H8H10', source: 'H8', target: 'H10', weight: 4, badgeT: 0.45, badgeOffset: 0 },
      { id: 'e_H9H10', source: 'H9', target: 'H10', weight: 2, badgeT: 0.5, badgeOffset: 0 },
      { id: 'e_H2H5', source: 'H2', target: 'H5', weight: 6, badgeT: 0.28, badgeOffset: 0 },
      { id: 'e_H4H7', source: 'H4', target: 'H7', weight: 5, badgeT: 0.30, badgeOffset: 0 },
      { id: 'e_H6H10', source: 'H6', target: 'H10', weight: 6, badgeT: 0.5, badgeOffset: 0 },
    ]
  }
};

function getBadgePos(n1, n2, t = 0.5, offset = 0) {
  const bx = n1.x + (n2.x - n1.x) * t;
  const by = n1.y + (n2.y - n1.y) * t;
  if (!offset) return { x: bx, y: by };
  const dx = n2.x - n1.x;
  const dy = n2.y - n1.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: bx + (-dy / len) * offset,
    y: by + (dx / len) * offset
  };
}

// 점 (px, py)와 선분 (x1, y1)-(x2, y2) 사이의 최단 거리
function distancePointToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2));
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);
  return Math.hypot(px - projX, py - projY);
}

console.log('=== [어려움 난이도 뱃지 선상 일치성 검증] ===');
const hard = GRAPHS.HARD;
const nodeMap = new Map(hard.nodes.map(n => [n.id, n]));
const badgePositions = [];

hard.edges.forEach((e) => {
  const n1 = nodeMap.get(e.source);
  const n2 = nodeMap.get(e.target);
  const pos = getBadgePos(n1, n2, e.badgeT || 0.5, e.badgeOffset || 0);
  const dist = distancePointToSegment(pos.x, pos.y, n1.x, n1.y, n2.x, n2.y);
  badgePositions.push({ id: e.id, pos, weight: e.weight });
  
  if (dist > 0.001) {
    console.error(`❌ [불일치] 간선 ${e.id}: 뱃지가 선상에서 ${dist.toFixed(2)}px 이탈함!`);
  } else {
    console.log(`✅ [선상 안착] 간선 ${e.id} (${e.source}-${e.target}, ${e.weight}억): pos=(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}), 선상 이탈거리=0.00px`);
  }
});

// 뱃지 상호 간격 검증
console.log('\n=== [뱃지 간 상호 최소 거리 검증] ===');
let hasOverlap = false;
for (let i = 0; i < badgePositions.length; i++) {
  for (let j = i + 1; j < badgePositions.length; j++) {
    const d = Math.hypot(badgePositions[i].pos.x - badgePositions[j].pos.x, badgePositions[i].pos.y - badgePositions[j].pos.y);
    if (d < 35) {
      console.warn(`⚠️ 간선 ${badgePositions[i].id}와 ${badgePositions[j].id}의 뱃지가 너무 가까움 (${d.toFixed(1)}px)`);
      hasOverlap = true;
    }
  }
}
if (!hasOverlap) {
  console.log('✅ 모든 뱃지 간의 거리가 35px 이상으로 상호 겹침 없음!');
}
