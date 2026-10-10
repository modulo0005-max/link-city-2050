import type { CityGraph, DifficultyLevel } from '../core/types.ts';

/**
 * 쉬움 난이도: 정점 6개, 간선 9개
 * 도시명: 네오 송도 스마트 아일랜드 (Neo Songdo Smart Island)
 */
export const EASY_GRAPH: CityGraph = {
  id: 'graph-easy',
  name: '네오 송도 스마트 아일랜드',
  nodes: [
    { id: 'A', name: '중앙 통제 센터', type: 'ADMIN', x: 200, y: 200 },
    { id: 'B', name: '해상 풍력 발전소', type: 'ENERGY', x: 500, y: 150 },
    { id: 'C', name: '바이오 연구 허브', type: 'RESEARCH', x: 800, y: 250 },
    { id: 'D', name: '수직형 에코 팜', type: 'ECO_FARM', x: 300, y: 500 },
    { id: 'E', name: '하이퍼루프 중앙역', type: 'TRANSPORT', x: 650, y: 450 },
    { id: 'F', name: '스마트 담수화 센터', type: 'WATER', x: 500, y: 750 },
  ],
  edges: [
    { id: 'e_AB', source: 'A', target: 'B', weight: 2, name: '에코 송전선', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_BC', source: 'B', target: 'C', weight: 4, name: '연구망 케이블', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_AD', source: 'A', target: 'D', weight: 3, name: '자율주행 도로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_BE', source: 'B', target: 'E', weight: 3, name: '급속 충전 그리드', badgeT: 0.48, badgeOffset: 0 },
    { id: 'e_CE', source: 'C', target: 'E', weight: 2, name: '자기부상 피더', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_DE', source: 'D', target: 'E', weight: 4, name: '물류 바이오 라인', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_DF', source: 'D', target: 'F', weight: 5, name: '수자원 배관망', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_EF', source: 'E', target: 'F', weight: 3, name: '하이퍼루프 지선', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_AE', source: 'A', target: 'E', weight: 6, name: '중앙 간선대로', badgeT: 0.45, badgeOffset: 0 },
  ],
};

/**
 * 보통 난이도: 정점 8개, 간선 13개
 * 도시명: 판교 테크노 실리콘 밸리 2050 (Pangyo Techno Valley 2050)
 */
export const NORMAL_GRAPH: CityGraph = {
  id: 'graph-normal',
  name: '판교 테크노 밸리 2050',
  nodes: [
    { id: 'N1', name: 'AI 데이터 관제탑', type: 'ADMIN', x: 160, y: 160 },
    { id: 'N2', name: '태양광 솔라 타워', type: 'ENERGY', x: 500, y: 120 },
    { id: 'N3', name: '모빌리티 관제 허브', type: 'TRANSPORT', x: 280, y: 420 },
    { id: 'N4', name: '양자 컴퓨팅 단지', type: 'RESEARCH', x: 560, y: 360 },
    { id: 'N5', name: '수소 발전 스테이션', type: 'ENERGY', x: 160, y: 720 },
    { id: 'N6', name: '아쿠아포닉스 팜', type: 'ECO_FARM', x: 860, y: 320 },
    { id: 'N7', name: '탄소 순환 정화 센터', type: 'WATER', x: 480, y: 740 },
    { id: 'N8', name: '도심 UAM 버티포트', type: 'TRANSPORT', x: 860, y: 740 },
  ],
  edges: [
    { id: 'e_N1N2', source: 'N1', target: 'N2', weight: 3, name: '솔라 그리드', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N1N3', source: 'N1', target: 'N3', weight: 2, name: '광통신 케이블', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N2N4', source: 'N2', target: 'N4', weight: 4, name: '양자 전력선', badgeT: 0.45, badgeOffset: 0 },
    { id: 'e_N3N4', source: 'N3', target: 'N4', weight: 3, name: '도심 데이터망', badgeT: 0.45, badgeOffset: 0 },
    { id: 'e_N3N5', source: 'N3', target: 'N5', weight: 5, name: '수소 수송로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N4N6', source: 'N4', target: 'N6', weight: 2, name: '생태 바이오망', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N2N6', source: 'N2', target: 'N6', weight: 6, name: '외곽 송전로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N5N6', source: 'N5', target: 'N6', weight: 4, name: '에너지 연결관', badgeT: 0.32, badgeOffset: 0 },
    { id: 'e_N5N7', source: 'N5', target: 'N7', weight: 3, name: '친환경 순환선', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N6N8', source: 'N6', target: 'N8', weight: 3, name: '스마트 항공로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N7N8', source: 'N7', target: 'N8', weight: 2, name: '수자원 배관망', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N1N5', source: 'N1', target: 'N5', weight: 7, name: '서부 순환대로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_N4N8', source: 'N4', target: 'N8', weight: 5, name: '동부 고속망', badgeT: 0.72, badgeOffset: 0 },
  ],
};

/**
 * 어려움 난이도: 정점 10개, 간선 17개
 * 도시명: 메가 에코폴리스 센트럴 2050 (Mega Ecopolis Central 2050)
 * 가중치가 같은 복수의 최소 신장 트리(Multiple MSTs) 생성 가능 구조
 */
export const HARD_GRAPH: CityGraph = {
  id: 'graph-hard',
  name: '메가 에코폴리스 센트럴 2050',
  nodes: [
    { id: 'H1', name: '글로벌 기후청', type: 'ADMIN', x: 160, y: 160 },
    { id: 'H2', name: '핵융합 발전소', type: 'ENERGY', x: 480, y: 120 },
    { id: 'H3', name: '초전도 변전소', type: 'ENERGY', x: 260, y: 340 },
    { id: 'H4', name: '나노 바이오 파크', type: 'RESEARCH', x: 620, y: 260 },
    { id: 'H5', name: '하이퍼 터미널', type: 'TRANSPORT', x: 240, y: 540 },
    { id: 'H6', name: '수직 삼림 타워', type: 'ECO_FARM', x: 840, y: 380 },
    { id: 'H7', name: '지열 에너지원', type: 'ENERGY', x: 160, y: 740 },
    { id: 'H8', name: '로봇 물류 기지', type: 'TRANSPORT', x: 480, y: 740 },
    { id: 'H9', name: '탄소 재활용 타워', type: 'WATER', x: 740, y: 640 },
    { id: 'H10', name: '해양 생태 복원원', type: 'WATER', x: 880, y: 780 },
  ],
  edges: [
    { id: 'e_H1H2', source: 'H1', target: 'H2', weight: 2, name: '초전도 선로 1', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H1H3', source: 'H1', target: 'H3', weight: 3, name: '기후 제어망', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H2H4', source: 'H2', target: 'H4', weight: 4, name: '융합 에너지관', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H3H4', source: 'H3', target: 'H4', weight: 3, name: '연구망 케이블', badgeT: 0.72, badgeOffset: 0 },
    { id: 'e_H3H5', source: 'H3', target: 'H5', weight: 2, name: '터미널 전력선', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H4H6', source: 'H4', target: 'H6', weight: 4, name: '바이오 브릿지', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H5H6', source: 'H5', target: 'H6', weight: 3, name: '하이퍼 에코선', badgeT: 0.68, badgeOffset: 0 },
    { id: 'e_H5H7', source: 'H5', target: 'H7', weight: 5, name: '지열 연결로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H6H8', source: 'H6', target: 'H8', weight: 2, name: '자동 물류 파이프', badgeT: 0.45, badgeOffset: 0 },
    { id: 'e_H7H8', source: 'H7', target: 'H8', weight: 4, name: '남부 에너지선', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H7H9', source: 'H7', target: 'H9', weight: 3, name: '순환 정화관', badgeT: 0.35, badgeOffset: 0 },
    { id: 'e_H8H9', source: 'H8', target: 'H9', weight: 3, name: '스마트 공급선', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H8H10', source: 'H8', target: 'H10', weight: 4, name: '생태 배송로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H9H10', source: 'H9', target: 'H10', weight: 2, name: '해양 정화 수로', badgeT: 0.5, badgeOffset: 0 },
    { id: 'e_H2H5', source: 'H2', target: 'H5', weight: 6, name: '중앙 백본망', badgeT: 0.28, badgeOffset: 0 },
    { id: 'e_H4H7', source: 'H4', target: 'H7', weight: 5, name: '서브 그리드', badgeT: 0.28, badgeOffset: 0 },
    { id: 'e_H6H10', source: 'H6', target: 'H10', weight: 6, name: '동부 간선망', badgeT: 0.5, badgeOffset: 0 },
  ],
};

export const PRESET_GRAPHS: Record<DifficultyLevel, CityGraph> = {
  EASY: EASY_GRAPH,
  NORMAL: NORMAL_GRAPH,
  HARD: HARD_GRAPH,
};
