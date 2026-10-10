import { EASY_GRAPH, NORMAL_GRAPH, HARD_GRAPH } from '../src/data/presetGraphs.ts';

function checkGraphOnEdge(name, graph, candidateUpdates) {
  console.log(`\n================== [${name}] 간선 위 뱃지 검증 ==================`);
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));
  const badges = [];

  for (const edge of graph.edges) {
    const u = nodeMap.get(edge.source);
    const v = nodeMap.get(edge.target);
    const update = candidateUpdates[edge.id] || {};
    const t = update.badgeT !== undefined ? update.badgeT : (edge.badgeT !== undefined ? edge.badgeT : 0.5);
    const offset = update.badgeOffset !== undefined ? update.badgeOffset : 0; // 우리는 0(선 위)을 목표로 함

    // 선분 상 좌표
    const bx = u.x + (v.x - u.x) * t;
    const by = u.y + (v.y - u.y) * t;

    // 검증: 선분 거리 (오차 0이어야 함)
    // 선분 방정식: P(t) = u + t*(v-u)
    badges.push({ id: edge.id, weight: edge.weight, u, v, bx, by, t, offset });
    console.log(`간선 ${edge.id.padEnd(8)} (${edge.source}->${edge.target}): t=${t}, offset=${offset} => Badge (${bx.toFixed(1)}, ${by.toFixed(1)})`);
  }

  // 1. 뱃지 간 최소 거리 검사
  let minBadgeDist = Infinity;
  let minPair = null;
  for (let i = 0; i < badges.length; i++) {
    for (let j = i + 1; j < badges.length; j++) {
      const d = Math.hypot(badges[i].bx - badges[j].bx, badges[i].by - badges[j].by);
      if (d < minBadgeDist) {
        minBadgeDist = d;
        minPair = [badges[i].id, badges[j].id];
      }
    }
  }
  console.log(`-> 뱃지 간 최소 거리: ${minBadgeDist.toFixed(1)}px (쌍: ${minPair?.join(' & ')})`);

  // 2. 노드 중심과의 최소 거리 검사
  let minNodeDist = Infinity;
  let minNodePair = null;
  for (const b of badges) {
    for (const node of graph.nodes) {
      const d = Math.hypot(b.bx - node.x, b.by - node.y);
      if (d < minNodeDist) {
        minNodeDist = d;
        minNodePair = [b.id, node.id];
      }
    }
  }
  console.log(`-> 노드 중심과의 최소 거리: ${minNodeDist.toFixed(1)}px (간선 ${minNodePair?.[0]} vs 노드 ${minNodePair?.[1]})`);

  const passed = minBadgeDist >= 42 && minNodeDist >= 40;
  console.log(`-> 검증 결과: ${passed ? '✅ 완벽 통과 (충돌 없음)' : '⚠️ 조정 필요'}`);
  return { passed, minBadgeDist, minNodeDist, badges };
}

// 보통 난이도 테스트
const normalUpdates = {
  e_N1N2: { badgeT: 0.5, badgeOffset: 0 },
  e_N1N3: { badgeT: 0.5, badgeOffset: 0 },
  e_N2N4: { badgeT: 0.45, badgeOffset: 0 },
  e_N3N4: { badgeT: 0.45, badgeOffset: 0 },
  e_N3N5: { badgeT: 0.5, badgeOffset: 0 },
  e_N4N6: { badgeT: 0.5, badgeOffset: 0 },
  e_N2N6: { badgeT: 0.5, badgeOffset: 0 },
  e_N5N6: { badgeT: 0.32, badgeOffset: 0 },
  e_N5N7: { badgeT: 0.5, badgeOffset: 0 },
  e_N6N8: { badgeT: 0.5, badgeOffset: 0 },
  e_N7N8: { badgeT: 0.5, badgeOffset: 0 },
  e_N1N5: { badgeT: 0.5, badgeOffset: 0 },
  e_N4N8: { badgeT: 0.72, badgeOffset: 0 },
};

checkGraphOnEdge('보통', NORMAL_GRAPH, normalUpdates);

// 쉬움 난이도 테스트
const easyUpdates = {
  e_AB: { badgeT: 0.5, badgeOffset: 0 },
  e_BC: { badgeT: 0.5, badgeOffset: 0 },
  e_AD: { badgeT: 0.5, badgeOffset: 0 },
  e_BE: { badgeT: 0.48, badgeOffset: 0 },
  e_CE: { badgeT: 0.5, badgeOffset: 0 },
  e_DE: { badgeT: 0.5, badgeOffset: 0 },
  e_DF: { badgeT: 0.5, badgeOffset: 0 },
  e_EF: { badgeT: 0.5, badgeOffset: 0 },
  e_AE: { badgeT: 0.45, badgeOffset: 0 },
};

checkGraphOnEdge('쉬움', EASY_GRAPH, easyUpdates);

// 어려움 난이도 테스트
const hardUpdates = {
  e_H1H2: { badgeT: 0.5, badgeOffset: 0 },
  e_H1H3: { badgeT: 0.5, badgeOffset: 0 },
  e_H2H4: { badgeT: 0.5, badgeOffset: 0 },
  e_H3H4: { badgeT: 0.72, badgeOffset: 0 },
  e_H3H5: { badgeT: 0.5, badgeOffset: 0 },
  e_H4H6: { badgeT: 0.5, badgeOffset: 0 },
  e_H5H6: { badgeT: 0.68, badgeOffset: 0 },
  e_H5H7: { badgeT: 0.5, badgeOffset: 0 },
  e_H6H8: { badgeT: 0.45, badgeOffset: 0 },
  e_H7H8: { badgeT: 0.5, badgeOffset: 0 },
  e_H7H9: { badgeT: 0.35, badgeOffset: 0 },
  e_H8H9: { badgeT: 0.5, badgeOffset: 0 },
  e_H8H10: { badgeT: 0.5, badgeOffset: 0 },
  e_H9H10: { badgeT: 0.5, badgeOffset: 0 },
  e_H2H5: { badgeT: 0.28, badgeOffset: 0 },
  e_H4H7: { badgeT: 0.28, badgeOffset: 0 },
  e_H6H10: { badgeT: 0.5, badgeOffset: 0 },
};

checkGraphOnEdge('어려움', HARD_GRAPH, hardUpdates);
