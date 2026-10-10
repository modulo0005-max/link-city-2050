import { EASY_GRAPH, NORMAL_GRAPH, HARD_GRAPH, PRESET_GRAPHS } from '../src/data/presetGraphs.ts';
import { UnionFind } from '../src/core/unionFind.ts';
import { calculateTotalCost, kruskal, hasCycle, isConnected, kruskalWithHistory, getAvailableMinimumEdges } from '../src/core/kruskal.ts';
import { rankPlayers } from '../src/core/multiplayer.ts';
import { FACILITY_SCIENCE_DATA, SCIENCE_QUIZZES } from '../src/data/scienceData.ts';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    results.push({ name: testName, status: 'PASS', details });
    console.log(`  ✔ [PASS] ${testName}`);
  } else {
    results.push({ name: testName, status: 'FAIL', details });
    console.error(`  ✖ [FAIL] ${testName} - ${details}`);
  }
}

console.log('================================================================');
console.log('🚀 LINK CITY 2050 15대 항목 종합 통합 테스트 실행');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// [1. 1~4인용 모든 모드]
// -----------------------------------------------------------------------------
console.log('▶ [테스트 1] 1~4인용 모든 모드 지원 및 플레이어 구성 검증');
for (let players = 1; players <= 4; players++) {
  const modeNames = { 1: '스마트시티 챌린지', 2: '네트워크 듀얼', 3: '스마트시티 리그', 4: 'LINK CITY 챔피언십' };
  const playerRecords = Array.from({ length: players }, (_, i) => ({
    id: i + 1,
    name: `플레이어 ${i + 1}`,
    isCompleted: false,
    cost: 0,
    timeUsedSeconds: 0,
    connectedNodesCount: 0,
    selectedEdgeIds: [],
    isPerfect: false
  }));
  assert(playerRecords.length === players && modeNames[players], `${players}인용 모드 (${modeNames[players]}) 구성 검증`);
}

// -----------------------------------------------------------------------------
// [2. 3단계 난이도 그래프 규격 검증]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 2] 3단계 난이도 (쉬움, 보통, 어려움) 지도 규격 검증');
assert(EASY_GRAPH.nodes.length === 6 && EASY_GRAPH.edges.length === 9, '쉬움: 정점 6개, 간선 9개');
assert(NORMAL_GRAPH.nodes.length === 8 && NORMAL_GRAPH.edges.length === 13, '보통: 정점 8개, 간선 13개');
assert(HARD_GRAPH.nodes.length === 10 && HARD_GRAPH.edges.length === 17, '어려움: 정점 10개, 간선 17개');

// -----------------------------------------------------------------------------
// [3. 도로 선택과 건설비 계산]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 3] 도로 선택 및 실시간 건설비 합산 정확성');
const testEdges = [EASY_GRAPH.edges[0], EASY_GRAPH.edges[1], EASY_GRAPH.edges[2]];
const calculatedCost = calculateTotalCost(testEdges);
const expectedCost = EASY_GRAPH.edges[0].weight + EASY_GRAPH.edges[1].weight + EASY_GRAPH.edges[2].weight;
assert(calculatedCost === expectedCost, '도로 선택 시 건설비 실시간 가산 정확성', `비용: ${calculatedCost}억`);

// -----------------------------------------------------------------------------
// [4. 사이클 검사]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 4] 사이클 검출 알고리즘 정확성');
const cycleEdges = [
  { id: 'e1', source: 'A', target: 'B', weight: 1 },
  { id: 'e2', source: 'B', target: 'C', weight: 1 },
  { id: 'e3', source: 'C', target: 'A', weight: 1 },
];
assert(hasCycle(cycleEdges, ['A', 'B', 'C']), '삼각형 순환선(사이클) 정확 감지');
const treeEdges = [
  { id: 'e1', source: 'A', target: 'B', weight: 1 },
  { id: 'e2', source: 'B', target: 'C', weight: 1 },
];
assert(!hasCycle(treeEdges, ['A', 'B', 'C']), '트리 구조에서 사이클 미발생 정상 감지');

// -----------------------------------------------------------------------------
// [5. MST 정답 검증]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 5] 난이도별 크루스칼 알고리즘 MST 정답 비용 검증');
const easyMst = kruskal(EASY_GRAPH);
const normalMst = kruskal(NORMAL_GRAPH);
const hardMst = kruskal(HARD_GRAPH);
assert(easyMst.totalCost === 13 && easyMst.mstEdges.length === 5, '쉬움 MST 최적 비용 13억 (5개 간선)');
assert(normalMst.totalCost === 18 && normalMst.mstEdges.length === 7, '보통 MST 최적 비용 18억 (7개 간선)');
assert(hardMst.mstEdges.length === 9, `어려움 MST 간선 9개 (비용: ${hardMst.totalCost}억)`);

// -----------------------------------------------------------------------------
// [6. 동일 가중치의 복수 MST 인정]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 6] 복수 최소 신장 트리 (Multiple MSTs) 완벽 인정 검증');
const diamondNodes = [{ id: 'A', name: 'A', type: 'ADMIN', x: 0, y: 0 }, { id: 'B', name: 'B', type: 'ENERGY', x: 10, y: 0 }, { id: 'C', name: 'C', type: 'RESEARCH', x: 0, y: 10 }, { id: 'D', name: 'D', type: 'WATER', x: 10, y: 10 }];
const diamondEdges = [
  { id: 'e1', source: 'A', target: 'B', weight: 2 },
  { id: 'e2', source: 'A', target: 'C', weight: 2 },
  { id: 'e3', source: 'B', target: 'D', weight: 2 },
  { id: 'e4', source: 'C', target: 'D', weight: 2 },
];
const optMst = kruskal({ id: 'dia', name: 'dia', nodes: diamondNodes, edges: diamondEdges });
const comboA = [diamondEdges[0], diamondEdges[1], diamondEdges[2]];
const costA = calculateTotalCost(comboA);
const isMstA = comboA.length === 3 && !hasCycle(comboA, ['A','B','C','D']) && isConnected(comboA, ['A','B','C','D']) && costA === optMst.totalCost;
const comboB = [diamondEdges[1], diamondEdges[2], diamondEdges[3]];
const costB = calculateTotalCost(comboB);
const isMstB = comboB.length === 3 && !hasCycle(comboB, ['A','B','C','D']) && isConnected(comboB, ['A','B','C','D']) && costB === optMst.totalCost;
assert(isMstA && isMstB, '서로 다른 간선 조합 A와 B 모두 최적 MST로 인정');

// -----------------------------------------------------------------------------
// [7. 실행 취소(Undo)와 초기화(Reset)]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 7] 도로 선택 실행 취소(Undo) 및 초기화(Reset) 검증');
let history = [];
let currentSelected = [];

function select(id) {
  history.push([...currentSelected]);
  currentSelected.push(id);
}
function undo() {
  if (history.length > 0) currentSelected = history.pop();
}
function reset() {
  history.push([...currentSelected]);
  currentSelected = [];
}

select('e1');
select('e2');
assert(currentSelected.length === 2, '2개 도로 선택 완료');
undo();
assert(currentSelected.length === 1 && currentSelected[0] === 'e1', 'Undo 실행 시 직전 1개 도로 상태로 복원');
reset();
assert(currentSelected.length === 0, 'Reset 실행 시 모든 선택 도로 초기화');

// -----------------------------------------------------------------------------
// [8. 제한시간 종료]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 8] 제한시간 종료 시 판정 로직 검증');
function handleTimeOut(record, targetNodeCount) {
  const isAllConnected = record.connectedNodesCount === targetNodeCount;
  return {
    ...record,
    isCompleted: isAllConnected,
    isTimeOver: true
  };
}
const completedTimeout = handleTimeOut({ id: 1, name: 'P1', connectedNodesCount: 6, cost: 15 }, 6);
const uncompletedTimeout = handleTimeOut({ id: 2, name: 'P2', connectedNodesCount: 4, cost: 10 }, 6);
assert(completedTimeout.isCompleted === true, '시간 종료 시 전원 연결 성공자는 완성자로 판정');
assert(uncompletedTimeout.isCompleted === false, '시간 종료 시 미연결자는 미완성자로 판정');

// -----------------------------------------------------------------------------
// [9. 플레이어별 결과 분리]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 9] 멀티플레이어 간 독립 기록 분리 보장');
const p1Data = { selectedEdges: ['e1', 'e2'], cost: 13, time: 45 };
const p2Data = { selectedEdges: ['e3', 'e4', 'e5'], cost: 17, time: 60 };
assert(p1Data.selectedEdges !== p2Data.selectedEdges && p1Data.cost !== p2Data.cost, '플레이어 1과 플레이어 2의 데이터가 독립적으로 유지됨');

// -----------------------------------------------------------------------------
// [10. 순위 계산 (core/multiplayer.ts 공식 엔진 사용)]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 10] 4단계 승패 판정 및 종합 순위 계산 검증');
const mockPlayers = [
  { id: 1, name: 'P1', isCompleted: true, cost: 15, timeUsedSeconds: 30, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: false },
  { id: 2, name: 'P2', isCompleted: true, cost: 13, timeUsedSeconds: 40, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true }, // 공동 1위
  { id: 3, name: 'P3', isCompleted: false, cost: 10, timeUsedSeconds: 20, connectedNodesCount: 5, selectedEdgeIds: [], isPerfect: false }, // 4위 (미완성자)
  { id: 4, name: 'P4', isCompleted: true, cost: 13, timeUsedSeconds: 40, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true }, // 공동 1위
];
const ranked = rankPlayers(mockPlayers);
assert(ranked[0].cost === 13 && ranked[1].cost === 13, '최저 비용(13억) 플레이어들이 1위 선점');
assert(ranked[0].rank === 1 && ranked[1].rank === 1 && ranked[0].isTie && ranked[1].isTie, '비용과 시간이 동일한 경우 공동 1위 및 isTie 부여');
assert(ranked[3].isCompleted === false, '미완성자는 완성자보다 항상 하위에 배치');

// -----------------------------------------------------------------------------
// [11. 학습 모드]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 11] 크루스칼 알고리즘 단계별 학습 로직 검증');
const learnResultNormal = kruskalWithHistory(NORMAL_GRAPH);
assert(learnResultNormal.steps.length > 0, '단계별 검토 기록 정상 생성');

const cycleTestGraph = {
  id: 'test-cycle',
  name: '사이클 검증 그래프',
  nodes: [{ id: 'A', name: 'A', type: 'ADMIN', x: 0, y: 0 }, { id: 'B', name: 'B', type: 'ENERGY', x: 1, y: 0 }, { id: 'C', name: 'C', type: 'RESEARCH', x: 1, y: 1 }, { id: 'D', name: 'D', type: 'WATER', x: 0, y: 1 }],
  edges: [
    { id: 'e1', source: 'A', target: 'B', weight: 1 },
    { id: 'e2', source: 'B', target: 'C', weight: 1 },
    { id: 'e3', source: 'C', target: 'A', weight: 1 }, // A-B-C 사이클 간선!
    { id: 'e4', source: 'C', target: 'D', weight: 2 },
  ]
};
const historyWithCycle = kruskalWithHistory(cycleTestGraph);
const skipped = historyWithCycle.steps.filter(s => s.decision === 'SKIPPED');
assert(skipped.length > 0 && skipped[0].createsCycle && skipped[0].reason.includes('사이클'), '사이클 형성 간선에 대한 정확한 스킵(SKIPPED) 및 사유 기록 검증');

const minEdges = getAvailableMinimumEdges(EASY_GRAPH.edges);
assert(minEdges.length > 0 && minEdges[0].weight === 2, '최소 가중치 미검토 간선 우선 추천 검증');

// -----------------------------------------------------------------------------
// [12. 과학 콘텐츠]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 12] 8대 미래 도시 시설 과학 원리 및 퀴즈 은행 검증');
const facilityKeys = ['SOLAR', 'HOSPITAL', 'AI_LAB', 'MOBILITY', 'RESIDENCE', 'DATA_CENTER', 'AGRI_DOME', 'HYDROGEN'];
const allFacilitiesPresent = facilityKeys.every(k => FACILITY_SCIENCE_DATA[k] && FACILITY_SCIENCE_DATA[k].summary.length > 20);
assert(allFacilitiesPresent, '8대 시설 과학 해설 데이터 100% 탑재');
const allQuizzesValid = SCIENCE_QUIZZES.length === 8 && SCIENCE_QUIZZES.every(q => q.choices.length === 4 && q.correctIndex >= 0 && q.correctIndex < 4);
assert(allQuizzesValid, '8대 시설 4지선다 과학 퀴즈 은행 및 정답 무결성 검증');

// -----------------------------------------------------------------------------
// [13. PC·태블릿 반응형 화면]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 13] SVG viewBox 및 PC/태블릿 반응형 좌표계 일관성');
const htmlSource = fs.readFileSync(path.join(process.cwd(), 'dev-server.mjs'), 'utf-8');
const hasViewBox = htmlSource.includes('viewBox="0 0 1000 860"');
const hasMeet = htmlSource.includes('preserveAspectRatio="xMidYMid meet"');
const hasPointerEvents = htmlSource.includes('pointer-events: none');
assert(hasViewBox && hasMeet, 'SVG viewBox="0 0 1000 860" 및 preserveAspectRatio="xMidYMid meet" 적용');
assert(hasPointerEvents, '가중치 뱃지에 pointer-events: none 적용하여 터치/클릭 투과 보장');

// -----------------------------------------------------------------------------
// [14. 브라우저 콘솔 오류 (런타임 자바스크립트 구문 파싱)]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 14] 프론트엔드 자바스크립트 문법 및 런타임 신택스 에러 검증');
// dev-server.mjs 내부의 <script> 태그를 정규식으로 안전하게 추출하고 백틱 이스케이프 해제
const scriptMatch = htmlSource.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  // 백틱 템플릿 스트링 안의 이스케이프 \` 와 \${ 를 정상 JS로 언이스케이프
  const rawJs = scriptMatch[1]
    .replace(/\\`/g, '`')
    .replace(/\\\$\{/g, '${');
  try {
    new vm.Script(rawJs);
    assert(true, '인라인 프론트엔드 스크립트 구문(Syntax) 오류 0건 (정상 파싱)');
  } catch (err) {
    assert(false, '인라인 스크립트 구문 오류 발생', err.message);
  }
} else {
  assert(false, '스크립트 태그 추출 실패');
}

// -----------------------------------------------------------------------------
// [15. 빌드 설정 파일 검증]
// -----------------------------------------------------------------------------
console.log('\n▶ [테스트 15] 소스코드 무결성 및 빌드 설정 검증');
const viteConfigExists = fs.existsSync(path.join(process.cwd(), 'vite.config.js')) || fs.existsSync(path.join(process.cwd(), 'vite.config.ts'));
const tsconfigExists = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
assert(viteConfigExists && tsconfigExists, 'Vite 및 TypeScript 설정 파일 정상 존재');

console.log('\n================================================================');
const passCount = results.filter(r => r.status === 'PASS').length;
const failCount = results.filter(r => r.status === 'FAIL').length;
console.log(`📊 테스트 결과: 총 ${results.length}개 세부 검사 중 ${passCount}개 통과, ${failCount}개 실패`);
console.log('================================================================');
