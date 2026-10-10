// 쉬움, 보통, 어려움 그래프의 기하학적 간선 배치 및 뱃지 충돌 진단 스크립트

const GRAPHS = {
  EASY: {
    nodes: [
      { id: 'A', name: 'AI 연구소', x: 220, y: 220 },
      { id: 'B', name: '태양광 발전소', x: 500, y: 150 },
      { id: 'C', name: '스마트 병원', x: 780, y: 220 },
      { id: 'D', name: '친환경 주거단지', x: 280, y: 540 },
      { id: 'E', name: '자율주행 허브', x: 650, y: 460 },
      { id: 'F', name: '스마트 농업 돔', x: 500, y: 740 },
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
  NORMAL: {
    nodes: [
      { id: 'N1', name: '데이터 센터', x: 160, y: 160 },
      { id: 'N2', name: '태양광 발전소', x: 500, y: 120 },
      { id: 'N3', name: '자율주행 허브', x: 280, y: 420 },
      { id: 'N4', name: 'AI 연구소', x: 560, y: 360 },
      { id: 'N5', name: '수소 에너지 센터', x: 160, y: 720 },
      { id: 'N6', name: '스마트 농업 돔', x: 860, y: 320 },
      { id: 'N7', name: '스마트 병원', x: 480, y: 740 },
      { id: 'N8', name: '친환경 주거단지', x: 860, y: 740 },
    ],
    edges: [
      { id: 'e_N1N2', source: 'N1', target: 'N2', weight: 3 },
      { id: 'e_N1N3', source: 'N1', target: 'N3', weight: 2 },
      { id: 'e_N2N4', source: 'N2', target: 'N4', weight: 4 },
      { id: 'e_N3N4', source: 'N3', target: 'N4', weight: 3 },
      { id: 'e_N3N5', source: 'N3', target: 'N5', weight: 5 },
      { id: 'e_N4N6', source: 'N4', target: 'N6', weight: 2 },
      { id: 'e_N2N6', source: 'N2', target: 'N6', weight: 6 },
      { id: 'e_N5N6', source: 'N5', target: 'N6', weight: 4, badgeT: 0.35 },
      { id: 'e_N5N7', source: 'N5', target: 'N7', weight: 3 },
      { id: 'e_N6N8', source: 'N6', target: 'N8', weight: 3 },
      { id: 'e_N7N8', source: 'N7', target: 'N8', weight: 2 },
      { id: 'e_N1N5', source: 'N1', target: 'N5', weight: 7 },
      { id: 'e_N4N8', source: 'N4', target: 'N8', weight: 5, badgeT: 0.55 },
    ]
  },
  HARD: {
    nodes: [
      { id: 'H1', name: 'AI 연구소', x: 160, y: 160 },
      { id: 'H2', name: '태양광 발전소', x: 480, y: 120 },
      { id: 'H3', name: '데이터 센터', x: 260, y: 340 },
      { id: 'H4', name: '스마트 병원', x: 620, y: 260 },
      { id: 'H5', name: '자율주행 허브', x: 240, y: 540 },
      { id: 'H6', name: '친환경 주거단지', x: 840, y: 380 },
      { id: 'H7', name: '수소 에너지 센터', x: 160, y: 740 },
      { id: 'H8', name: '스마트 농업 돔', x: 480, y: 740 },
      { id: 'H9', name: '친환경 주거단지', x: 740, y: 640 },
      { id: 'H10', name: '스마트 병원', x: 880, y: 780 },
    ],
    edges: [
      { id: 'e_H1H2', source: 'H1', target: 'H2', weight: 2 },
      { id: 'e_H1H3', source: 'H1', target: 'H3', weight: 3 },
      { id: 'e_H2H4', source: 'H2', target: 'H4', weight: 4 },
      { id: 'e_H3H4', source: 'H3', target: 'H4', weight: 3, badgeT: 0.68 },
      { id: 'e_H3H5', source: 'H3', target: 'H5', weight: 2 },
      { id: 'e_H4H6', source: 'H4', target: 'H6', weight: 4 },
      { id: 'e_H5H6', source: 'H5', target: 'H6', weight: 3, badgeT: 0.70 },
      { id: 'e_H5H7', source: 'H5', target: 'H7', weight: 5 },
      { id: 'e_H6H8', source: 'H6', target: 'H8', weight: 2 },
      { id: 'e_H7H8', source: 'H7', target: 'H8', weight: 4 },
      { id: 'e_H7H9', source: 'H7', target: 'H9', weight: 3, badgeT: 0.38 },
      { id: 'e_H8H9', source: 'H8', target: 'H9', weight: 3, badgeT: 0.55 },
      { id: 'e_H8H10', source: 'H8', target: 'H10', weight: 4, badgeT: 0.45 },
      { id: 'e_H9H10', source: 'H9', target: 'H10', weight: 2 },
      { id: 'e_H2H5', source: 'H2', target: 'H5', weight: 6, badgeT: 0.28 },
      { id: 'e_H4H7', source: 'H4', target: 'H7', weight: 5, badgeT: 0.30 },
      { id: 'e_H6H10', source: 'H6', target: 'H10', weight: 6 },
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

// 두 선분의 교차점 구하기
function getIntersection(p1, p2, p3, p4) {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (Math.abs(d) < 1e-9) return null; // 평행
  const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
  if (t > 0.05 && t < 0.95 && u > 0.05 && u < 0.95) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
      t,
      u
    };
  }
  return null;
}

// 점과 선분 사이의 최단거리
function distPointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

for (const [level, graph] of Object.entries(GRAPHS)) {
  console.log(`\n=================== [${level} 그래프 점검] ===================`);
  const nodeMap = new Map();
  graph.nodes.forEach(n => nodeMap.set(n.id, n));

  // 1. 교차하는 간선 쌍 찾기
  const intersections = [];
  for (let i = 0; i < graph.edges.length; i++) {
    for (let j = i + 1; j < graph.edges.length; j++) {
      const e1 = graph.edges[i];
      const e2 = graph.edges[j];
      const n1 = nodeMap.get(e1.source);
      const n2 = nodeMap.get(e1.target);
      const n3 = nodeMap.get(e2.source);
      const n4 = nodeMap.get(e2.target);
      const inter = getIntersection(n1, n2, n3, n4);
      if (inter) {
        intersections.push({ e1, e2, inter });
      }
    }
  }
  console.log(`- 대각선 간선 교차점 수: ${intersections.length}개`);
  intersections.forEach(item => {
    console.log(`  * 교차: [${item.e1.id}]와 [${item.e2.id}] at (${item.inter.x.toFixed(1)}, ${item.inter.y.toFixed(1)})`);
  });

  // 2. 가중치 뱃지 위치 계산
  const badgePositions = graph.edges.map(e => {
    const n1 = nodeMap.get(e.source);
    const n2 = nodeMap.get(e.target);
    const pos = getBadgePos(n1, n2, e.badgeT || 0.5, e.badgeOffset || 0);
    return { ...e, x: pos.x, y: pos.y, n1, n2 };
  });

  // 3. 뱃지끼리 겹침 검사 (너비 46, 높이 28 기준, 중심거리 < 50)
  console.log(`- 뱃지 상호 간격 검사:`);
  let badgeOverlapCount = 0;
  for (let i = 0; i < badgePositions.length; i++) {
    for (let j = i + 1; j < badgePositions.length; j++) {
      const b1 = badgePositions[i];
      const b2 = badgePositions[j];
      const dist = Math.hypot(b1.x - b2.x, b1.y - b2.y);
      if (dist < 52) {
        badgeOverlapCount++;
        console.warn(`  ⚠️ 뱃지 충돌: [${b1.id}]와 [${b2.id}] 거리 = ${dist.toFixed(1)}px (최소 52px 권장)`);
      }
    }
  }
  if (badgeOverlapCount === 0) console.log(`  ✔ 뱃지 간 충돌 없음`);

  // 4. 뱃지와 시설 노드 겹침 검사 (노드 반경 약 55px)
  console.log(`- 뱃지와 시설 아이콘/노드 겹침 검사:`);
  let nodeOverlapCount = 0;
  badgePositions.forEach(b => {
    graph.nodes.forEach(n => {
      const dist = Math.hypot(b.x - n.x, b.y - n.y);
      if (dist < 60) {
        nodeOverlapCount++;
        console.warn(`  ⚠️ 뱃지-노드 근접 충돌: 뱃지 [${b.id}] (${b.x.toFixed(1)}, ${b.y.toFixed(1)}) <-> 노드 [${n.id}: ${n.name}] (${n.x}, ${n.y}) 거리 = ${dist.toFixed(1)}px (최소 60px 필요)`);
      }
    });
  });
  if (nodeOverlapCount === 0) console.log(`  ✔ 뱃지-노드 충돌 없음`);

  // 5. 뱃지와 대각선 교차점 겹침 검사
  console.log(`- 뱃지와 대각선 교차점 근접 검사:`);
  let crossOverlapCount = 0;
  badgePositions.forEach(b => {
    intersections.forEach(item => {
      const dist = Math.hypot(b.x - item.inter.x, b.y - item.inter.y);
      if (dist < 40) {
        crossOverlapCount++;
        console.warn(`  ⚠️ 뱃지가 교차점에 위치: 뱃지 [${b.id}]가 교차점 (${item.e1.id} x ${item.e2.id})과의 거리 = ${dist.toFixed(1)}px`);
      }
    });
  });
  if (crossOverlapCount === 0) console.log(`  ✔ 교차점 충돌 없음`);

  // 6. 뱃지가 다른 간선 선분을 가리는 현상 검사
  console.log(`- 뱃지가 다른 도로 선분을 침범/가리는 현상 검사:`);
  let edgeOcclusionCount = 0;
  badgePositions.forEach(b => {
    graph.edges.forEach(otherE => {
      if (otherE.id === b.id) return;
      // 인접 노드를 공유하는 경우 노드 근처가 아니면 검사
      const n1 = nodeMap.get(otherE.source);
      const n2 = nodeMap.get(otherE.target);
      const dist = distPointToSegment(b.x, b.y, n1.x, n1.y, n2.x, n2.y);
      // 뱃지 반경 약 20px
      if (dist < 18) {
        edgeOcclusionCount++;
        console.warn(`  ⚠️ 뱃지 [${b.id}]가 도로 [${otherE.id}] 선분을 가림 (거리 = ${dist.toFixed(1)}px)`);
      }
    });
  });
  if (edgeOcclusionCount === 0) console.log(`  ✔ 다른 도로 선분 가림 없음`);
}
