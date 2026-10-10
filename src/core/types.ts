/**
 * LINK CITY 2050 - 코어 그래프 및 게임 데이터 타입 정의
 */

// 도시 시설 분류 (수학 + 친환경 과학 융합 테마)
export type FacilityType =
  | 'ENERGY'     // 청정 에너지 (태양광/수소/핵융합)
  | 'ADMIN'      // 스마트 시청 / 중앙 제어소
  | 'ECO_FARM'   // 수직 스마트 팜 / 식량 생산
  | 'RESEARCH'   // 바이오 리서치 허브 / R&D
  | 'TRANSPORT'  // 하이퍼루프 환승역 / 도심 항공 교통(UAM)
  | 'WATER';     // 스마트 수자원 정수 센터

// 그래프 정점 (도시 시설 노드)
export interface CityNode {
  readonly id: string;
  readonly name: string;
  readonly type: FacilityType;
  readonly x: number; // SVG 지도 배치용 2D 좌표 (0~1000)
  readonly y: number;
}

// 그래프 간선 (스마트 인프라 도로/케이블)
export interface CityEdge {
  readonly id: string;
  readonly source: string; // 시작 시설 노드 id
  readonly target: string; // 도착 시설 노드 id
  readonly weight: number; // 건설 비용 (수학적 가중치, 양의 정수)
  readonly name?: string;  // 인프라 명칭 (예: "초전도 송전선로")
  readonly badgeT?: number; // 가중치 뱃지 보간 비율 (0.0 ~ 1.0, 기본 0.5)
  readonly badgeOffset?: number; // 간선 수직 법선 오프셋 (픽셀, 기본 0)
}

// 도시 그래프 모델
export interface CityGraph {
  readonly id: string;
  readonly name: string;
  readonly nodes: readonly CityNode[];
  readonly edges: readonly CityEdge[];
}

// 게임 난이도
export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD';

// MST 계산 결과
export interface KruskalResult {
  readonly mstEdges: readonly CityEdge[];
  readonly totalCost: number;
  readonly edgeCount: number;
  readonly isConnected: boolean;
}

// 사용자 선택 MST 유효성 검증 결과
export interface MstValidationResult {
  readonly isValid: boolean;
  readonly actualCost: number;
  readonly expectedCost: number;
  readonly edgeCount: number;
  readonly expectedEdgeCount: number;
  readonly hasCycle: boolean;
  readonly isFullyConnected: boolean;
  readonly reason?: string;
}

// 크루스칼 알고리즘 단계별 검토 판정 결과
export type KruskalStepDecision = 'ACCEPTED' | 'SKIPPED';

// 크루스칼 알고리즘 단계별 실행 로그 레코드
export interface KruskalStepRecord {
  readonly stepNumber: number;
  readonly edge: CityEdge;
  readonly decision: KruskalStepDecision;
  readonly reason: string;
  readonly createsCycle: boolean;
  readonly currentMstEdges: readonly CityEdge[];
  readonly currentTotalCost: number;
  readonly targetReached: boolean;
}

// 크루스칼 알고리즘 전체 실행 기록 (리포트 및 리플레이용)
export interface KruskalExecutionHistory {
  readonly steps: readonly KruskalStepRecord[];
  readonly finalMstEdges: readonly CityEdge[];
  readonly finalCost: number;
  readonly targetEdgeCount: number;
}

// 게임 종료 학습/비교 리포트 데이터
export interface GameReportData {
  readonly playerEdges: readonly CityEdge[];
  readonly playerCost: number;
  readonly optimalMstEdges: readonly CityEdge[];
  readonly optimalCost: number;
  readonly costDifference: number;
  readonly isOptimal: boolean;
  readonly validation: MstValidationResult;
  readonly history: KruskalExecutionHistory;
}

// 8대 미래 도시 시설 과학 원리 데이터
export interface FacilityScienceInfo {
  readonly icon: string;
  readonly facilityName: string;
  readonly topic: string;
  readonly summary: string; // 2~3문장 이내 설명
  readonly keyConcept: string; // 핵심 과학 개념 태그
  readonly iconSymbol: string; // 이모지 또는 기호
}

// 선택형 과학 퀴즈 문항 모델
export interface ScienceQuizItem {
  readonly id: string;
  readonly facilityIcon: string;
  readonly facilityName: string;
  readonly question: string;
  readonly choices: readonly string[];
  readonly correctIndex: number;
  readonly explanation: string;
}

