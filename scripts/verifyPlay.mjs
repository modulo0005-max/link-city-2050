import assert from 'node:assert/strict';

// dev-server.mjs와 동일한 게임 데이터 및 알고리즘
const GRAPHS = {
  EASY: {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
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
    nodes: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'],
    edges: [
      { id: 'e_N1N2', source: 'N1', target: 'N2', weight: 3 },
      { id: 'e_N1N3', source: 'N1', target: 'N3', weight: 2 },
      { id: 'e_N2N4', source: 'N2', target: 'N4', weight: 4 },
      { id: 'e_N3N4', source: 'N3', target: 'N4', weight: 3 },
      { id: 'e_N3N5', source: 'N3', target: 'N5', weight: 5 },
      { id: 'e_N4N6', source: 'N4', target: 'N6', weight: 2 },
      { id: 'e_N2N6', source: 'N2', target: 'N6', weight: 6 },
      { id: 'e_N5N6', source: 'N5', target: 'N6', weight: 4 },
      { id: 'e_N5N7', source: 'N5', target: 'N7', weight: 3 },
      { id: 'e_N6N8', source: 'N6', target: 'N8', weight: 3 },
      { id: 'e_N7N8', source: 'N7', target: 'N8', weight: 2 },
      { id: 'e_N1N5', source: 'N1', target: 'N5', weight: 7 },
      { id: 'e_N4N8', source: 'N4', target: 'N8', weight: 5 },
    ]
  },
  HARD: {
    nodes: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'],
    edges: [
      { id: 'e_H1H2', source: 'H1', target: 'H2', weight: 2 },
      { id: 'e_H1H3', source: 'H1', target: 'H3', weight: 3 },
      { id: 'e_H2H4', source: 'H2', target: 'H4', weight: 4 },
      { id: 'e_H3H4', source: 'H3', target: 'H4', weight: 3 },
      { id: 'e_H3H5', source: 'H3', target: 'H5', weight: 2 },
      { id: 'e_H4H6', source: 'H4', target: 'H6', weight: 4 },
      { id: 'e_H5H6', source: 'H5', target: 'H6', weight: 3 },
      { id: 'e_H5H7', source: 'H5', target: 'H7', weight: 5 },
      { id: 'e_H6H8', source: 'H6', target: 'H8', weight: 2 },
      { id: 'e_H7H8', source: 'H7', target: 'H8', weight: 4 },
      { id: 'e_H7H9', source: 'H7', target: 'H9', weight: 3 },
      { id: 'e_H8H9', source: 'H8', target: 'H9', weight: 3 },
      { id: 'e_H8H10', source: 'H8', target: 'H10', weight: 4 },
      { id: 'e_H9H10', source: 'H9', target: 'H10', weight: 2 },
      { id: 'e_H2H5', source: 'H2', target: 'H5', weight: 6 },
      { id: 'e_H4H7', source: 'H4', target: 'H7', weight: 5 },
      { id: 'e_H6H10', source: 'H6', target: 'H10', weight: 6 },
    ]
  }
};

class UnionFind {
  constructor(elements) {
    this.parent = new Map();
    this.rank = new Map();
    for (const el of elements) {
      this.parent.set(el, el);
      this.rank.set(el, 0);
    }
  }
  find(x) {
    if (!this.parent.has(x)) return x;
    if (this.parent.get(x) === x) return x;
    const root = this.find(this.parent.get(x));
    this.parent.set(x, root);
    return root;
  }
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;
    const rX = this.rank.get(rootX) || 0;
    const rY = this.rank.get(rootY) || 0;
    if (rX < rY) this.parent.set(rootX, rootY);
    else if (rX > rY) this.parent.set(rootY, rootX);
    else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rX + 1);
    }
    return true;
  }
}

function hasCycle(edges, nodeIds) {
  const uf = new UnionFind(nodeIds);
  for (const e of edges) {
    if (!uf.union(e.source, e.target)) return true;
  }
  return false;
}

function isConnected(edges, nodeIds) {
  const uf = new UnionFind(nodeIds);
  for (const e of edges) uf.union(e.source, e.target);
  const root = uf.find(nodeIds[0]);
  for (let i = 1; i < nodeIds.length; i++) {
    if (uf.find(nodeIds[i]) !== root) return false;
  }
  return true;
}

console.log('--- 1인용 게임 플레이 시뮬레이션 시작 ---');

// 1. 쉬움 난이도 플레이 시뮬레이션
{
  console.log('[1] 쉬움 난이도 플레이 검증');
  const g = GRAPHS.EASY;
  const picks = ['e_AB', 'e_CE', 'e_AD', 'e_BE', 'e_EF'];
  const edges = picks.map(id => g.edges.find(e => e.id === id));

  // 사이클 없음 확인
  assert.equal(hasCycle(edges, g.nodes), false);
  // 전체 연결 확인
  assert.equal(isConnected(edges, g.nodes), true);
  // 비용 합계 검증
  const totalCost = edges.reduce((sum, e) => sum + e.weight, 0);
  assert.equal(totalCost, 13);
  console.log('  -> 쉬움 난이도 PERFECT CITY (13억, 5간선) 검증 통과!');

  // 사이클 시도 검증 (A-B, A-D, B-E가 있는데 D-E를 추가하려 할 때)
  const cycleAttempt = [...edges.slice(0, 4), g.edges.find(e => e.id === 'e_DE')];
  // A-B-E-D-A 사이클 발생
  assert.equal(hasCycle(cycleAttempt, g.nodes), true);
  console.log('  -> 사이클 발생 간선 차단 로직 검증 통과!');
}

// 2. 보통 난이도 플레이 시뮬레이션
{
  console.log('[2] 보통 난이도 플레이 검증');
  const g = GRAPHS.NORMAL;
  const picks = ['e_N1N3', 'e_N4N6', 'e_N7N8', 'e_N1N2', 'e_N3N4', 'e_N5N7', 'e_N6N8'];
  const edges = picks.map(id => g.edges.find(e => e.id === id));

  assert.equal(hasCycle(edges, g.nodes), false);
  assert.equal(isConnected(edges, g.nodes), true);
  const totalCost = edges.reduce((sum, e) => sum + e.weight, 0);
  assert.equal(totalCost, 18);
  console.log('  -> 보통 난이도 PERFECT CITY (18억, 7간선) 검증 통과!');
}

// 3. 어려움 난이도 플레이 시뮬레이션
{
  console.log('[3] 어려움 난이도 플레이 검증');
  const g = GRAPHS.HARD;
  const picks = ['e_H1H2', 'e_H3H5', 'e_H6H8', 'e_H9H10', 'e_H1H3', 'e_H3H4', 'e_H5H6', 'e_H7H9', 'e_H8H9'];
  const edges = picks.map(id => g.edges.find(e => e.id === id));

  assert.equal(hasCycle(edges, g.nodes), false);
  assert.equal(isConnected(edges, g.nodes), true);
  const totalCost = edges.reduce((sum, e) => sum + e.weight, 0);
  assert.equal(totalCost, 23);
  console.log('  -> 어려움 난이도 PERFECT CITY (23억, 9간선) 검증 통과!');
}

console.log('--- 모든 난이도 플레이 테스트 100% 통과! ---');
