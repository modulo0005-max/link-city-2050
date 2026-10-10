import type { CityEdge, CityGraph, KruskalResult, MstValidationResult } from './types.ts';
import { UnionFind } from './unionFind.ts';

/**
 * 간선들의 총 건설 비용(가중치 합)을 계산
 */
export function calculateTotalCost(edges: readonly CityEdge[]): number {
  return edges.reduce((acc, edge) => acc + edge.weight, 0);
}

/**
 * 주어진 간선 집합에 사이클(순환선)이 존재하는지 판정
 */
export function hasCycle(
  edges: readonly CityEdge[],
  nodeIds: readonly string[]
): boolean {
  const uf = new UnionFind(nodeIds);
  for (const edge of edges) {
    // union이 false를 반환하면 이미 같은 집합에 속해 있다는 뜻이므로 사이클 발생!
    if (!uf.union(edge.source, edge.target)) {
      return true;
    }
  }
  return false;
}

/**
 * 주어진 간선 집합으로 모든 노드가 하나의 연결 성분을 이루는지 판정
 */
export function isConnected(
  edges: readonly CityEdge[],
  nodeIds: readonly string[]
): boolean {
  if (nodeIds.length === 0) return true;
  if (nodeIds.length === 1) return true;
  if (edges.length < nodeIds.length - 1) return false;

  const uf = new UnionFind(nodeIds);
  for (const edge of edges) {
    uf.union(edge.source, edge.target);
  }

  // 모든 노드가 동일한 루트를 가지는지 확인
  const root = uf.find(nodeIds[0]);
  for (let i = 1; i < nodeIds.length; i++) {
    if (uf.find(nodeIds[i]) !== root) {
      return false;
    }
  }
  return true;
}

/**
 * 크루스칼(Kruskal) 알고리즘으로 최소 신장 트리(MST) 계산
 * - 입력 그래프 데이터를 직접 변경하지 않음 (불변성 보장)
 */
export function kruskal(graph: CityGraph): KruskalResult {
  const nodeIds = graph.nodes.map((n) => n.id);
  const targetEdgeCount = Math.max(0, nodeIds.length - 1);

  // 1. 원본 배열을 복제한 뒤 가중치 오름차순으로 정렬 (Pure Function)
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);

  const uf = new UnionFind(nodeIds);
  const mstEdges: CityEdge[] = [];
  let totalCost = 0;

  // 2. 가중치가 가장 작은 간선부터 순회하며 사이클을 만들지 않는 간선 채택
  for (const edge of sortedEdges) {
    if (uf.union(edge.source, edge.target)) {
      mstEdges.push(edge);
      totalCost += edge.weight;

      // 정점 N개일 때 간선 N-1개가 모이면 조기 종료
      if (mstEdges.length === targetEdgeCount) {
        break;
      }
    }
  }

  const fullyConnected = isConnected(mstEdges, nodeIds);

  return {
    mstEdges,
    totalCost,
    edgeCount: mstEdges.length,
    isConnected: fullyConnected,
  };
}

/**
 * 사용자가 선택한 간선 집합이 유효한 최소 신장 트리인지 검증
 * - 중요 규칙: 가중치가 같은 복수의 최소 신장 트리를 모두 정답으로 인정
 */
export function validateMst(
  selectedEdges: readonly CityEdge[],
  graph: CityGraph
): MstValidationResult {
  const nodeIds = graph.nodes.map((n) => n.id);
  const expectedEdgeCount = Math.max(0, nodeIds.length - 1);
  const actualCost = calculateTotalCost(selectedEdges);
  const optimalMst = kruskal(graph);
  const expectedCost = optimalMst.totalCost;

  // 1. 간선 개수 확인 (정점 n개이면 반드시 n-1개)
  if (selectedEdges.length !== expectedEdgeCount) {
    return {
      isValid: false,
      actualCost,
      expectedCost,
      edgeCount: selectedEdges.length,
      expectedEdgeCount,
      hasCycle: hasCycle(selectedEdges, nodeIds),
      isFullyConnected: isConnected(selectedEdges, nodeIds),
      reason: `간선 개수는 정점(${nodeIds.length}개)보다 1개 적은 ${expectedEdgeCount}개여야 하지만, ${selectedEdges.length}개가 선택되었습니다.`,
    };
  }

  // 2. 사이클 유무 확인
  const cycleDetected = hasCycle(selectedEdges, nodeIds);
  if (cycleDetected) {
    return {
      isValid: false,
      actualCost,
      expectedCost,
      edgeCount: selectedEdges.length,
      expectedEdgeCount,
      hasCycle: true,
      isFullyConnected: isConnected(selectedEdges, nodeIds),
      reason: '순환선(사이클)이 형성되어 트리가 아닙니다. 불필요한 연결이 존재합니다.',
    };
  }

  // 3. 전체 연결 여부 확인
  const fullyConnected = isConnected(selectedEdges, nodeIds);
  if (!fullyConnected) {
    return {
      isValid: false,
      actualCost,
      expectedCost,
      edgeCount: selectedEdges.length,
      expectedEdgeCount,
      hasCycle: false,
      isFullyConnected: false,
      reason: '모든 도시 시설이 하나로 연결되지 않았습니다. 고립된 시설이 있습니다.',
    };
  }

  // 4. 최소 비용 일치 여부 확인 (동일 가중치를 가진 복수의 MST도 이 조건으로 완벽 인정)
  if (actualCost !== expectedCost) {
    return {
      isValid: false,
      actualCost,
      expectedCost,
      edgeCount: selectedEdges.length,
      expectedEdgeCount,
      hasCycle: false,
      isFullyConnected: true,
      reason: `최소 건설 비용(${expectedCost}억)으로 연결해야 하지만, 현재 선택 비용은 ${actualCost}억입니다.`,
    };
  }

  // 모든 조건을 통과하면 유효한 MST!
  return {
    isValid: true,
    actualCost,
    expectedCost,
    edgeCount: selectedEdges.length,
    expectedEdgeCount,
    hasCycle: false,
    isFullyConnected: true,
  };
}

/**
 * 미검토 간선 중 가중치가 가장 작은 후보 간선 목록을 반환
 * - 동일한 최소 가중치를 가진 간선들은 어느 순서로 검토해도 인정하기 위함
 */
export function getAvailableMinimumEdges(
  unreviewedEdges: readonly CityEdge[]
): CityEdge[] {
  if (unreviewedEdges.length === 0) return [];
  const minWeight = Math.min(...unreviewedEdges.map((e) => e.weight));
  return unreviewedEdges.filter((e) => e.weight === minWeight);
}

/**
 * 크루스칼 알고리즘을 단계별로 실행하며 상세 판단 기록(로그 및 이유)을 생성
 * - 교육용 단계별 재생(Replay) 및 학습 모드 시뮬레이터에서 사용
 */
export function kruskalWithHistory(graph: CityGraph): import('./types.ts').KruskalExecutionHistory {
  const nodeIds = graph.nodes.map((n) => n.id);
  const targetEdgeCount = Math.max(0, nodeIds.length - 1);
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);

  const uf = new UnionFind(nodeIds);
  const steps: import('./types.ts').KruskalStepRecord[] = [];
  const currentMstEdges: CityEdge[] = [];
  let currentTotalCost = 0;

  let stepNumber = 1;
  for (const edge of sortedEdges) {
    const isUnionSuccess = uf.union(edge.source, edge.target);

    if (isUnionSuccess) {
      currentMstEdges.push(edge);
      currentTotalCost += edge.weight;
      const targetReached = currentMstEdges.length === targetEdgeCount;

      steps.push({
        stepNumber,
        edge,
        decision: 'ACCEPTED',
        reason: `[${edge.source}]와 [${edge.target}] 시설이 속한 독립 그룹을 결합했습니다. (사이클 없음)`,
        createsCycle: false,
        currentMstEdges: [...currentMstEdges],
        currentTotalCost,
        targetReached,
      });

      if (targetReached) {
        break;
      }
    } else {
      steps.push({
        stepNumber,
        edge,
        decision: 'SKIPPED',
        reason: `[${edge.source}]와 [${edge.target}]는 이미 다른 경로로 연결되어 있어 순환선(사이클)이 발생하므로 제외합니다.`,
        createsCycle: true,
        currentMstEdges: [...currentMstEdges],
        currentTotalCost,
        targetReached: false,
      });
    }

    stepNumber++;
  }

  return {
    steps,
    finalMstEdges: currentMstEdges,
    finalCost: currentTotalCost,
    targetEdgeCount,
  };
}

/**
 * 게임 종료 종합 학습/비교 리포트 데이터 생성
 */
export function generateGameReport(
  playerEdges: readonly CityEdge[],
  graph: CityGraph
): import('./types.ts').GameReportData {
  const validation = validateMst(playerEdges, graph);
  const history = kruskalWithHistory(graph);
  const playerCost = calculateTotalCost(playerEdges);
  const optimalCost = history.finalCost;
  const costDifference = playerCost - optimalCost;
  const isOptimal = validation.isValid && costDifference === 0;

  return {
    playerEdges,
    playerCost,
    optimalMstEdges: history.finalMstEdges,
    optimalCost,
    costDifference,
    isOptimal,
    validation,
    history,
  };
}
