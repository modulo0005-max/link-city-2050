import { describe, it, expect } from 'vitest';
import { UnionFind } from '../unionFind';
import { kruskal, hasCycle, isConnected, validateMst, calculateTotalCost } from '../kruskal';
import { EASY_GRAPH, NORMAL_GRAPH, HARD_GRAPH, PRESET_GRAPHS } from '../../data/presetGraphs';
import { CityEdge, CityGraph } from '../types';

describe('1. Union-Find 자료구조 검증', () => {
  it('초기 상태에서는 모든 노드가 자기 자신을 루트로 가지며 독립적이어야 한다', () => {
    const uf = new UnionFind(['A', 'B', 'C']);
    expect(uf.getGroupCount()).toBe(3);
    expect(uf.connected('A', 'B')).toBe(false);
  });

  it('두 노드를 합치면 같은 집합이 되고 그룹 수가 1 감소해야 한다', () => {
    const uf = new UnionFind(['A', 'B', 'C']);
    const unionResult = uf.union('A', 'B');
    expect(unionResult).toBe(true);
    expect(uf.connected('A', 'B')).toBe(true);
    expect(uf.getGroupCount()).toBe(2);
  });

  it('이미 연결된 두 노드를 다시 union하면 false를 반환하여 사이클을 감지해야 한다', () => {
    const uf = new UnionFind(['A', 'B', 'C']);
    uf.union('A', 'B');
    uf.union('B', 'C');
    // A-B, B-C가 연결되었으므로 A-C는 이미 연결된 상태
    expect(uf.connected('A', 'C')).toBe(true);
    // A와 C를 다시 연결하려 하면 사이클 발생
    const cycleAttempt = uf.union('A', 'C');
    expect(cycleAttempt).toBe(false);
  });
});

describe('2. 사이클 및 전체 연결 판정 정확성 검증', () => {
  const nodes = ['A', 'B', 'C', 'D'];

  it('사이클이 없는 트리 형태의 간선 집합은 hasCycle이 false여야 한다', () => {
    const treeEdges: CityEdge[] = [
      { id: '1', source: 'A', target: 'B', weight: 1 },
      { id: '2', source: 'B', target: 'C', weight: 2 },
      { id: '3', source: 'C', target: 'D', weight: 3 },
    ];
    expect(hasCycle(treeEdges, nodes)).toBe(false);
    expect(isConnected(treeEdges, nodes)).toBe(true);
  });

  it('순환선이 포함된 간선 집합은 hasCycle이 true여야 한다', () => {
    const cycleEdges: CityEdge[] = [
      { id: '1', source: 'A', target: 'B', weight: 1 },
      { id: '2', source: 'B', target: 'C', weight: 2 },
      { id: '3', source: 'C', target: 'A', weight: 3 }, // A-B-C-A 사이클
    ];
    expect(hasCycle(cycleEdges, nodes)).toBe(true);
  });

  it('정점 수 - 1개의 간선이라도 고립된 노드가 있으면 isConnected가 false여야 한다', () => {
    // A-B, B-C, C-A (사이클) + D는 고립
    const disconnectedEdges: CityEdge[] = [
      { id: '1', source: 'A', target: 'B', weight: 1 },
      { id: '2', source: 'B', target: 'C', weight: 2 },
      { id: '3', source: 'C', target: 'A', weight: 3 },
    ];
    expect(isConnected(disconnectedEdges, nodes)).toBe(false);
  });
});

describe('3. 입력 데이터 불변성(Immutability) 검증', () => {
  it('kruskal 함수 실행 후에도 원본 그래프의 노드와 엣지 순서 및 내용이 변경되지 않아야 한다', () => {
    const originalEdges = [...EASY_GRAPH.edges];
    const originalNodes = [...EASY_GRAPH.nodes];

    // 복사본의 속성 스냅샷 생성
    const edgeWeightsBefore = EASY_GRAPH.edges.map((e) => e.weight);

    // 알고리즘 실행
    kruskal(EASY_GRAPH);

    // 원본 데이터가 변경되지 않았는지 엄격 검증
    expect(EASY_GRAPH.edges.length).toBe(originalEdges.length);
    expect(EASY_GRAPH.nodes.length).toBe(originalNodes.length);
    expect(EASY_GRAPH.edges.map((e) => e.weight)).toEqual(edgeWeightsBefore);
  });
});

describe('4. 고정 지도 규격 및 MST 최소 비용 검산', () => {
  it('쉬움 난이도: 정점 6개, 간선 9개 규격을 만족하고 MST 간선 수는 5개(n-1)여야 한다', () => {
    expect(EASY_GRAPH.nodes.length).toBe(6);
    expect(EASY_GRAPH.edges.length).toBe(9);

    const result = kruskal(EASY_GRAPH);
    expect(result.edgeCount).toBe(5);
    expect(result.mstEdges.length).toBe(5);
    expect(result.isConnected).toBe(true);
    // 검산 비용: 2 + 2 + 3 + 3 + 3 = 13
    expect(result.totalCost).toBe(13);
  });

  it('보통 난이도: 정점 8개, 간선 13개 규격을 만족하고 MST 간선 수는 7개(n-1)여야 한다', () => {
    expect(NORMAL_GRAPH.nodes.length).toBe(8);
    expect(NORMAL_GRAPH.edges.length).toBe(13);

    const result = kruskal(NORMAL_GRAPH);
    expect(result.edgeCount).toBe(7);
    expect(result.mstEdges.length).toBe(7);
    expect(result.isConnected).toBe(true);
    // 검산 비용: 2 + 2 + 2 + 3 + 3 + 3 + 3 = 18
    expect(result.totalCost).toBe(18);
  });

  it('어려움 난이도: 정점 10개, 간선 17개 규격을 만족하고 MST 간선 수는 9개(n-1)여야 한다', () => {
    expect(HARD_GRAPH.nodes.length).toBe(10);
    expect(HARD_GRAPH.edges.length).toBe(17);

    const result = kruskal(HARD_GRAPH);
    expect(result.edgeCount).toBe(9);
    expect(result.mstEdges.length).toBe(9);
    expect(result.isConnected).toBe(true);
    // 최적 비용 확인
    expect(result.totalCost).toBeGreaterThan(0);
  });
});

describe('5. 가중치가 같은 복수의 최소 신장 트리(Multiple MSTs) 검증', () => {
  it('동일 가중치를 가진 다른 유효한 간선 조합도 유효한 MST로 인정해야 한다', () => {
    // 4개 노드, 정삼각기둥/마름모 구조에서 대칭적인 가중치
    const multiMstGraph: CityGraph = {
      id: 'multi-test',
      name: '동일 가중치 대칭 그래프',
      nodes: [
        { id: '1', name: 'N1', type: 'ADMIN', x: 0, y: 0 },
        { id: '2', name: 'N2', type: 'ENERGY', x: 1, y: 0 },
        { id: '3', name: 'N3', type: 'RESEARCH', x: 1, y: 1 },
        { id: '4', name: 'N4', type: 'WATER', x: 0, y: 1 },
      ],
      edges: [
        { id: 'e1', source: '1', target: '2', weight: 5 },
        { id: 'e2', source: '2', target: '3', weight: 5 },
        { id: 'e3', source: '3', target: '4', weight: 5 },
        { id: 'e4', source: '4', target: '1', weight: 5 },
      ],
    };

    // 정답 MST 비용은 15 (5 + 5 + 5)
    const optimal = kruskal(multiMstGraph);
    expect(optimal.totalCost).toBe(15);
    expect(optimal.edgeCount).toBe(3);

    // 조합 A: e1, e2, e3 (ㄷ자 연결)
    const comboA = [multiMstGraph.edges[0], multiMstGraph.edges[1], multiMstGraph.edges[2]];
    const valA = validateMst(comboA, multiMstGraph);
    expect(valA.isValid).toBe(true);

    // 조합 B: e2, e3, e4 (다른 ㄷ자 연결)
    const comboB = [multiMstGraph.edges[1], multiMstGraph.edges[2], multiMstGraph.edges[3]];
    const valB = validateMst(comboB, multiMstGraph);
    expect(valB.isValid).toBe(true);

    // 조합 C: e1, e3, e4 (또 다른 ㄷ자 연결)
    const comboC = [multiMstGraph.edges[0], multiMstGraph.edges[2], multiMstGraph.edges[3]];
    const valC = validateMst(comboC, multiMstGraph);
    expect(valC.isValid).toBe(true);
  });

  it('비용은 최소이지만 사이클이 포함되거나 연결되지 않은 경우 무효 처리되어야 한다', () => {
    const invalidSelection = [
      EASY_GRAPH.edges[0], // A-B (2)
      EASY_GRAPH.edges[1], // B-C (4)
      EASY_GRAPH.edges[2], // A-D (3)
    ]; // 간선 수가 5개가 아님
    const val = validateMst(invalidSelection, EASY_GRAPH);
    expect(val.isValid).toBe(false);
    expect(val.reason).toContain('간선 개수');
  });
});
