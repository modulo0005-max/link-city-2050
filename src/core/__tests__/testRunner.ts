import test from 'node:test';
import assert from 'node:assert/strict';
import { UnionFind } from '../unionFind.ts';
import { kruskal, hasCycle, isConnected, validateMst, kruskalWithHistory, getAvailableMinimumEdges, generateGameReport } from '../kruskal.ts';
import { EASY_GRAPH, NORMAL_GRAPH, HARD_GRAPH } from '../../data/presetGraphs.ts';
import { FACILITY_SCIENCE_DATA, SCIENCE_QUIZZES } from '../../data/scienceData.ts';
import type { CityEdge, CityGraph } from '../types.ts';

test('1. Union-Find 자료구조 검증', async (t) => {
  await t.test('초기 상태에서는 모든 노드가 자기 자신을 루트로 가지며 독립적이어야 한다', () => {
    const uf = new UnionFind(['A', 'B', 'C']);
    assert.equal(uf.getGroupCount(), 3);
    assert.equal(uf.connected('A', 'B'), false);
  });

  await t.test('두 노드를 합치면 같은 집합이 되고 그룹 수가 1 감소해야 한다', () => {
    const uf = new UnionFind(['A', 'B', 'C']);
    const unionResult = uf.union('A', 'B');
    assert.equal(unionResult, true);
    assert.equal(uf.connected('A', 'B'), true);
    assert.equal(uf.getGroupCount(), 2);
  });

  await t.test('이미 연결된 두 노드를 다시 union하면 false를 반환하여 사이클을 감지해야 한다', () => {
    const uf = new UnionFind(['A', 'B', 'C']);
    uf.union('A', 'B');
    uf.union('B', 'C');
    assert.equal(uf.connected('A', 'C'), true);
    const cycleAttempt = uf.union('A', 'C');
    assert.equal(cycleAttempt, false);
  });
});

test('2. 사이클 및 전체 연결 판정 정확성 검증', async (t) => {
  const nodes = ['A', 'B', 'C', 'D'];

  await t.test('사이클이 없는 트리 형태의 간선 집합은 hasCycle이 false이고 isConnected가 true여야 한다', () => {
    const treeEdges: CityEdge[] = [
      { id: '1', source: 'A', target: 'B', weight: 1 },
      { id: '2', source: 'B', target: 'C', weight: 2 },
      { id: '3', source: 'C', target: 'D', weight: 3 },
    ];
    assert.equal(hasCycle(treeEdges, nodes), false);
    assert.equal(isConnected(treeEdges, nodes), true);
  });

  await t.test('순환선(사이클)이 포함된 간선 집합은 hasCycle이 true여야 한다', () => {
    const cycleEdges: CityEdge[] = [
      { id: '1', source: 'A', target: 'B', weight: 1 },
      { id: '2', source: 'B', target: 'C', weight: 2 },
      { id: '3', source: 'C', target: 'A', weight: 3 }, // A-B-C-A 사이클
    ];
    assert.equal(hasCycle(cycleEdges, nodes), true);
  });

  await t.test('간선 수가 n-1개라도 고립된 노드가 있으면 isConnected가 false여야 한다', () => {
    const disconnectedEdges: CityEdge[] = [
      { id: '1', source: 'A', target: 'B', weight: 1 },
      { id: '2', source: 'B', target: 'C', weight: 2 },
      { id: '3', source: 'C', target: 'A', weight: 3 }, // A-B-C 사이클, D 고립
    ];
    assert.equal(isConnected(disconnectedEdges, nodes), false);
  });
});

test('3. 입력 데이터 불변성(Immutability) 검증', () => {
  const originalEdges = [...EASY_GRAPH.edges];
  const originalNodes = [...EASY_GRAPH.nodes];
  const edgeWeightsBefore = EASY_GRAPH.edges.map((e) => e.weight);

  // 알고리즘 실행
  kruskal(EASY_GRAPH);

  // 원본 데이터 변경 여부 검증
  assert.equal(EASY_GRAPH.edges.length, originalEdges.length);
  assert.equal(EASY_GRAPH.nodes.length, originalNodes.length);
  assert.deepEqual(EASY_GRAPH.edges.map((e) => e.weight), edgeWeightsBefore);
});

test('4. 고정 지도 규격 및 MST 최소 비용 검산', async (t) => {
  await t.test('쉬움 난이도: 정점 6개, 간선 9개 규격 만족, MST 간선 5개(n-1), 최소 비용 13', () => {
    assert.equal(EASY_GRAPH.nodes.length, 6);
    assert.equal(EASY_GRAPH.edges.length, 9);

    const result = kruskal(EASY_GRAPH);
    assert.equal(result.edgeCount, 5);
    assert.equal(result.mstEdges.length, 5);
    assert.equal(result.isConnected, true);
    assert.equal(result.totalCost, 13);
  });

  await t.test('보통 난이도: 정점 8개, 간선 13개 규격 만족, MST 간선 7개(n-1), 최소 비용 18', () => {
    assert.equal(NORMAL_GRAPH.nodes.length, 8);
    assert.equal(NORMAL_GRAPH.edges.length, 13);

    const result = kruskal(NORMAL_GRAPH);
    assert.equal(result.edgeCount, 7);
    assert.equal(result.mstEdges.length, 7);
    assert.equal(result.isConnected, true);
    assert.equal(result.totalCost, 18);
  });

  await t.test('어려움 난이도: 정점 10개, 간선 17개 규격 만족, MST 간선 9개(n-1), 전체 연결 완료', () => {
    assert.equal(HARD_GRAPH.nodes.length, 10);
    assert.equal(HARD_GRAPH.edges.length, 17);

    const result = kruskal(HARD_GRAPH);
    assert.equal(result.edgeCount, 9);
    assert.equal(result.mstEdges.length, 9);
    assert.equal(result.isConnected, true);
    assert.equal(result.totalCost, 23); // 2*4 + 3*5 = 23 (수학적 최적 비용)
  });
});

test('5. 가중치가 같은 복수의 최소 신장 트리(Multiple MSTs) 인정 검증', async (t) => {
  const multiMstGraph: CityGraph = {
    id: 'multi-test',
    name: '동일 가중치 마름모 그래프',
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

  const optimal = kruskal(multiMstGraph);
  assert.equal(optimal.totalCost, 15);
  assert.equal(optimal.edgeCount, 3);

  await t.test('조합 A (e1, e2, e3)는 유효한 MST로 판정되어야 한다', () => {
    const comboA = [multiMstGraph.edges[0], multiMstGraph.edges[1], multiMstGraph.edges[2]];
    const valA = validateMst(comboA, multiMstGraph);
    assert.equal(valA.isValid, true);
    assert.equal(valA.actualCost, 15);
  });

  await t.test('조합 B (e2, e3, e4)도 유효한 MST로 판정되어야 한다', () => {
    const comboB = [multiMstGraph.edges[1], multiMstGraph.edges[2], multiMstGraph.edges[3]];
    const valB = validateMst(comboB, multiMstGraph);
    assert.equal(valB.isValid, true);
    assert.equal(valB.actualCost, 15);
  });

  await t.test('조합 C (e1, e3, e4)도 유효한 MST로 판정되어야 한다', () => {
    const comboC = [multiMstGraph.edges[0], multiMstGraph.edges[2], multiMstGraph.edges[3]];
    const valC = validateMst(comboC, multiMstGraph);
    assert.equal(valC.isValid, true);
    assert.equal(valC.actualCost, 15);
  });

  await t.test('간선 수가 부족하거나 넘치면 무효 처리되어야 한다', () => {
    const invalidSelection = [multiMstGraph.edges[0], multiMstGraph.edges[1]];
    const val = validateMst(invalidSelection, multiMstGraph);
    assert.equal(val.isValid, false);
    assert.match(val.reason || '', /간선 개수/);
  });
});

test('6. 2~4인용 멀티플레이어 승패 판정 및 순위 검증', async (t) => {
  const { rankPlayers } = await import('../multiplayer.ts');

  await t.test('완성자는 미완성자보다 항상 상위에 배치되어야 한다', () => {
    const players = [
      { id: 1, name: 'P1', isCompleted: false, cost: 10, timeUsedSeconds: 60, connectedNodesCount: 5, selectedEdgeIds: [], isPerfect: false },
      { id: 2, name: 'P2', isCompleted: true, cost: 20, timeUsedSeconds: 150, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: false },
    ];
    const ranked = rankPlayers(players);
    assert.equal(ranked[0].id, 2);
    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked[1].id, 1);
    assert.equal(ranked[1].rank, 2);
  });

  await t.test('완성자 간에는 건설비가 낮은 순서로 상위에 배치되어야 한다', () => {
    const players = [
      { id: 1, name: 'P1', isCompleted: true, cost: 16, timeUsedSeconds: 90, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: false },
      { id: 2, name: 'P2', isCompleted: true, cost: 13, timeUsedSeconds: 100, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
    ];
    const ranked = rankPlayers(players);
    assert.equal(ranked[0].id, 2); // 13억 (MST)
    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked[1].id, 1); // 16억
    assert.equal(ranked[1].rank, 2);
  });

  await t.test('완성자 간에 건설비가 같으면 완료 시간이 빠른 순서로 상위에 배치되어야 한다', () => {
    const players = [
      { id: 1, name: 'P1', isCompleted: true, cost: 13, timeUsedSeconds: 120, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
      { id: 2, name: 'P2', isCompleted: true, cost: 13, timeUsedSeconds: 85, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
    ];
    const ranked = rankPlayers(players);
    assert.equal(ranked[0].id, 2); // 85초 소요
    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked[1].id, 1); // 120초 소요
    assert.equal(ranked[1].rank, 2);
  });

  await t.test('건설비와 완료 시간이 모두 같으면 공동 순위를 부여해야 한다', () => {
    const players = [
      { id: 1, name: 'P1', isCompleted: true, cost: 13, timeUsedSeconds: 90, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
      { id: 2, name: 'P2', isCompleted: true, cost: 13, timeUsedSeconds: 90, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
      { id: 3, name: 'P3', isCompleted: true, cost: 15, timeUsedSeconds: 80, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: false },
    ];
    const ranked = rankPlayers(players);
    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked[1].rank, 1);
    assert.equal(ranked[0].isTie, true);
    assert.equal(ranked[1].isTie, true);
    assert.equal(ranked[2].rank, 3);
  });

  await t.test('미완성자 간에는 연결된 시설 수가 많은 순서로 상위에 배치되어야 한다', () => {
    const players = [
      { id: 1, name: 'P1', isCompleted: false, cost: 8, timeUsedSeconds: 180, connectedNodesCount: 3, selectedEdgeIds: [], isPerfect: false },
      { id: 2, name: 'P2', isCompleted: false, cost: 10, timeUsedSeconds: 180, connectedNodesCount: 5, selectedEdgeIds: [], isPerfect: false },
    ];
    const ranked = rankPlayers(players);
    assert.equal(ranked[0].id, 2); // 5개 연결
    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked[1].id, 1); // 3개 연결
    assert.equal(ranked[1].rank, 2);
  });

  await t.test('4인 챔피언십 복합 시나리오 랭킹이 정확해야 한다', () => {
    const players = [
      { id: 1, name: '최강건설', isCompleted: true, cost: 13, timeUsedSeconds: 110, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
      { id: 2, name: '스피드러너', isCompleted: true, cost: 15, timeUsedSeconds: 50, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: false },
      { id: 3, name: '알고리즘신', isCompleted: true, cost: 13, timeUsedSeconds: 70, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
      { id: 4, name: '시간부족', isCompleted: false, cost: 9, timeUsedSeconds: 180, connectedNodesCount: 4, selectedEdgeIds: [], isPerfect: false },
    ];
    const ranked = rankPlayers(players);
    // 1등: 알고리즘신 (13억, 70초)
    // 2등: 최강건설 (13억, 110초)
    // 3등: 스피드러너 (15억, 50초)
    // 4등: 시간부족 (미완성)
    assert.equal(ranked[0].id, 3);
    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked[1].id, 1);
    assert.equal(ranked[1].rank, 2);
    assert.equal(ranked[2].id, 2);
    assert.equal(ranked[2].rank, 3);
    assert.equal(ranked[3].id, 4);
    assert.equal(ranked[3].rank, 4);
  });
});

test('7. 크루스칼 알고리즘 단계별 학습 및 게임 종료 리포트 검증', async (t) => {
  await t.test('kruskalWithHistory: 쉬움 난이도에서 단계별 검토 및 사이클 스킵 기록이 정확해야 한다', () => {
    const history = kruskalWithHistory(EASY_GRAPH);
    assert.equal(history.targetEdgeCount, 5);
    assert.equal(history.finalCost, 13);
    assert.equal(history.finalMstEdges.length, 5);

    // 단계별 스텝이 순차적으로 기록되어야 함
    assert.ok(history.steps.length >= 5);
    const acceptedSteps = history.steps.filter((s) => s.decision === 'ACCEPTED');
    const skippedSteps = history.steps.filter((s) => s.decision === 'SKIPPED');

    assert.equal(acceptedSteps.length, 5);
    // 사이클 스킵된 간선이 존재하는지 확인
    for (const skip of skippedSteps) {
      assert.equal(skip.createsCycle, true);
      assert.ok(skip.reason.includes('사이클') || skip.reason.includes('순환선'));
    }
    // 마지막 채택 스텝은 targetReached === true 여야 함
    const lastAccepted = acceptedSteps[acceptedSteps.length - 1];
    assert.equal(lastAccepted.targetReached, true);
  });

  await t.test('getAvailableMinimumEdges: 미검토 간선 중 최소 가중치 간선들을 모두 반환해야 한다 (동일 가중치 지원)', () => {
    const edges: CityEdge[] = [
      { id: 'e1', source: 'A', target: 'B', weight: 3 },
      { id: 'e2', source: 'B', target: 'C', weight: 2 },
      { id: 'e3', source: 'C', target: 'D', weight: 2 },
      { id: 'e4', source: 'D', target: 'E', weight: 4 },
    ];
    const candidates = getAvailableMinimumEdges(edges);
    assert.equal(candidates.length, 2);
    assert.deepEqual(candidates.map((c) => c.id).sort(), ['e2', 'e3']);
  });

  await t.test('generateGameReport: 최적 해를 선택한 경우 isOptimal이 true이고 비용 차이가 0이어야 한다', () => {
    const optimalMst = kruskal(EASY_GRAPH);
    const report = generateGameReport(optimalMst.mstEdges, EASY_GRAPH);
    assert.equal(report.isOptimal, true);
    assert.equal(report.costDifference, 0);
    assert.equal(report.playerCost, 13);
    assert.equal(report.optimalCost, 13);
    assert.equal(report.validation.isValid, true);
    assert.ok(report.history.steps.length > 0);
  });

  await t.test('generateGameReport: 복수 MST 해(가중치 일치 다른 간선 조합)도 최적 해로 완벽 인정해야 한다', () => {
    // 4개 정점 사각형 그래프: AB(1), BC(2), CD(2), DA(1)
    // MST는 AB(1) + DA(1) + BC(2) = 4 또는 AB(1) + DA(1) + CD(2) = 4
    const nodes = [
      { id: '1', name: 'N1', type: 'ENERGY' as const, x: 0, y: 0 },
      { id: '2', name: 'N2', type: 'ADMIN' as const, x: 10, y: 0 },
      { id: '3', name: 'N3', type: 'RESEARCH' as const, x: 10, y: 10 },
      { id: '4', name: 'N4', type: 'WATER' as const, x: 0, y: 10 },
    ];
    const edges: CityEdge[] = [
      { id: 'e1', source: '1', target: '2', weight: 1 },
      { id: 'e2', source: '2', target: '3', weight: 2 },
      { id: 'e3', source: '3', target: '4', weight: 2 },
      { id: 'e4', source: '4', target: '1', weight: 1 },
    ];
    const altGraph = { id: 'ALT', name: '대안그래프', nodes, edges };

    // 사용자가 e1, e4, e3 조합 선택 (비용: 1 + 1 + 2 = 4)
    const userChoice = [edges[0], edges[3], edges[2]];
    const report = generateGameReport(userChoice, altGraph);
    assert.equal(report.isOptimal, true);
    assert.equal(report.costDifference, 0);
    assert.equal(report.validation.isValid, true);
  });
});

test('8. 미래 도시 과학 학습 콘텐츠 및 보너스 퀴즈 검증', async (t) => {
  await t.test('8대 핵심 시설 과학 데이터가 모두 정의되어 있고 주제가 요구사항과 일치해야 한다', () => {
    const requiredFacilities = [
      { key: 'SOLAR', name: '태양광 발전소', topic: '빛에너지와 전기에너지' },
      { key: 'HOSPITAL', name: '스마트 병원', topic: '의료 데이터와 원격 진료' },
      { key: 'AI_LAB', name: 'AI 연구소', topic: '인공지능과 데이터 분석' },
      { key: 'MOBILITY', name: '자율주행 교통 허브', topic: '센서와 자동 제어' },
      { key: 'RESIDENCE', name: '친환경 주거단지', topic: '에너지 절약 건축' },
      { key: 'DATA_CENTER', name: '데이터 센터', topic: '정보 처리와 통신망' },
      { key: 'AGRI_DOME', name: '스마트 농업 돔', topic: '생육 환경 자동 제어' },
      { key: 'HYDROGEN', name: '수소 에너지 센터', topic: '수소 저장 및 연료전지' },
    ];

    assert.equal(Object.keys(FACILITY_SCIENCE_DATA).length, 8);

    for (const req of requiredFacilities) {
      const data = FACILITY_SCIENCE_DATA[req.key];
      assert.ok(data, `${req.key} 시설 데이터가 존재해야 합니다.`);
      assert.equal(data.facilityName, req.name);
      assert.equal(data.topic, req.topic);
      assert.ok(data.keyConcept && data.keyConcept.length > 0);
    }
  });

  await t.test('모든 시설 설명은 2~3문장 이내 규격을 엄격히 준수해야 한다', () => {
    for (const [key, data] of Object.entries(FACILITY_SCIENCE_DATA)) {
      // 문장 종결 부호(.)를 기준으로 문장 분리 (공백 및 빈 토큰 제외)
      const sentences = data.summary
        .split(/(?<=\.)\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      assert.ok(
        sentences.length >= 2 && sentences.length <= 3,
        `${key} 시설 설명 문장 수(${sentences.length})는 2~3문장 이내여야 합니다.`
      );
    }
  });

  await t.test('과학 퀴즈 은행의 모든 문항은 유효한 선택지와 정답 인덱스를 가져야 한다', () => {
    assert.equal(SCIENCE_QUIZZES.length, 8);

    for (const quiz of SCIENCE_QUIZZES) {
      assert.ok(quiz.id && quiz.id.startsWith('quiz-'));
      assert.ok(quiz.question.length > 10);
      assert.equal(quiz.choices.length, 4, '선택지는 4개여야 합니다.');
      assert.ok(
        quiz.correctIndex >= 0 && quiz.correctIndex < quiz.choices.length,
        '정답 인덱스는 선택지 범위 내여야 합니다.'
      );
      assert.ok(quiz.explanation.length > 15, '상세 과학 해설이 포함되어야 합니다.');
    }
  });
});


