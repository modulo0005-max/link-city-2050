// 쉬움, 보통, 어려움의 모든 간선에 대해 세밀한 충돌 검사 및 최적 위치 탐색 시뮬레이션

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
  if (Math.abs(d) < 1e-9) return null;
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

function distPointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

// 점수의 손실 함수: 충돌 정도를 수치화
function calculatePenalty(pos, edge, graph, placedBadges, intersections) {
  let penalty = 0;
  const nodeMap = new Map();
  graph.nodes.forEach(n => nodeMap.set(n.id, n));

  // 1. 노드(시설) 아이콘 및 라벨 캡슐과의 거리 (최소 65px 필요)
  graph.nodes.forEach(n => {
    // 노드 중심과의 거리
    const dCenter = Math.hypot(pos.x - n.x, pos.y - n.y);
    if (dCenter < 70) {
      penalty += Math.pow(70 - dCenter, 2) * 20;
    }
    // 노드 라벨 캡슐 (y는 n.y + 36 부근, 너비 약 120px)
    const labelX = Math.abs(pos.x - n.x);
    const labelY = Math.abs(pos.y - (n.y + 36));
    if (labelX < 65 && labelY < 24) {
      penalty += 5000;
    }
  });

  // 2. 다른 뱃지와의 거리 (최소 56px 필요)
  placedBadges.forEach(b => {
    const d = Math.hypot(pos.x - b.x, pos.y - b.y);
    if (d < 56) {
      penalty += Math.pow(56 - d, 2) * 50;
    }
  });

  // 3. 도로 교차점과의 거리 (최소 42px 필요)
  intersections.forEach(inter => {
    const d = Math.hypot(pos.x - inter.x, pos.y - inter.y);
    if (d < 42) {
      penalty += Math.pow(42 - d, 2) * 35;
    }
  });

  // 4. 다른 도로 선분을 가리는지 (최소 22px 이격)
  graph.edges.forEach(e => {
    if (e.id === edge.id) return;
    const n1 = nodeMap.get(e.source);
    const n2 = nodeMap.get(e.target);
    const d = distPointToSegment(pos.x, pos.y, n1.x, n1.y, n2.x, n2.y);
    if (d < 22) {
      penalty += Math.pow(22 - d, 2) * 40;
    }
  });

  // 5. 화면 경계 (viewBox 0 0 1000 860) 여백 50px 확보
  if (pos.x < 50) penalty += Math.pow(50 - pos.x, 2) * 10;
  if (pos.x > 950) penalty += Math.pow(pos.x - 950, 2) * 10;
  if (pos.y < 50) penalty += Math.pow(50 - pos.y, 2) * 10;
  if (pos.y > 810) penalty += Math.pow(pos.y - 810, 2) * 10;

  return penalty;
}

// 각 간선에 대해 가장 충돌 페널티가 낮은 최적 (t, offset) 탐색
for (const [level, graph] of Object.entries(GRAPHS)) {
  console.log(`\n=================== [${level} 최적 배치 계산] ===================`);
  const nodeMap = new Map();
  graph.nodes.forEach(n => nodeMap.set(n.id, n));

  const intersections = [];
  for (let i = 0; i < graph.edges.length; i++) {
    for (let j = i + 1; j < graph.edges.length; j++) {
      const e1 = graph.edges[i];
      const e2 = graph.edges[j];
      const inter = getIntersection(nodeMap.get(e1.source), nodeMap.get(e1.target), nodeMap.get(e2.source), nodeMap.get(e2.target));
      if (inter) intersections.push(inter);
    }
  }

  const placed = [];
  const optimizedEdges = [];

  graph.edges.forEach(e => {
    const n1 = nodeMap.get(e.source);
    const n2 = nodeMap.get(e.target);

    // 탐색 후보: t는 0.3 ~ 0.7, offset은 0, -24, 24, -36, 36, -18, 18
    const tCandidates = [0.5, 0.45, 0.55, 0.4, 0.6, 0.35, 0.65, 0.3, 0.7];
    const offsetCandidates = [0, -22, 22, -30, 30, -16, 16];

    let bestScore = Infinity;
    let bestT = e.badgeT || 0.5;
    let bestOffset = e.badgeOffset || 0;
    let bestPos = getBadgePos(n1, n2, bestT, bestOffset);

    // 기존 설정 점수 먼저 계산
    const currentScore = calculatePenalty(bestPos, e, graph, placed, intersections);

    for (const t of tCandidates) {
      for (const off of offsetCandidates) {
        const pos = getBadgePos(n1, n2, t, off);
        const score = calculatePenalty(pos, e, graph, placed, intersections);
        // t가 0.5에 가깝고 offset이 0에 가까울수록 작은 선호도 부여
        const bias = Math.abs(t - 0.5) * 15 + Math.abs(off) * 0.5;
        const total = score + bias;
        if (total < bestScore) {
          bestScore = total;
          bestT = t;
          bestOffset = off;
          bestPos = pos;
        }
      }
    }

    placed.push({ ...e, ...bestPos });
    optimizedEdges.push({
      id: e.id,
      source: e.source,
      target: e.target,
      weight: e.weight,
      badgeT: Number(bestT.toFixed(2)),
      badgeOffset: bestOffset,
      pos: { x: Number(bestPos.x.toFixed(1)), y: Number(bestPos.y.toFixed(1)) },
      penalty: Math.round(bestScore)
    });
  });

  optimizedEdges.forEach(oe => {
    console.log(`  간선 ${oe.id.padEnd(8)}: t=${oe.badgeT}, offset=${oe.badgeOffset.toString().padStart(3)} => (${oe.pos.x}, ${oe.pos.y}), 페널티=${oe.penalty}`);
  });
}
