/**
 * LINK CITY 2050 - 2~4인용 멀티플레이어 순위 및 게임 관리 코어 로직
 * 관심사의 분리: React 및 DOM 의존성 0% 순수 TypeScript 엔진
 */

export interface PlayerRecord {
  readonly id: number; // 플레이어 번호 (1, 2, 3, 4)
  readonly name: string; // 플레이어 닉네임
  readonly isCompleted: boolean; // 제한시간 내 모든 시설 연결 완료 여부
  readonly cost: number; // 총 도로 건설 비용
  readonly timeUsedSeconds: number; // 소요 시간 (제한시간 - 남은시간, 초 단위)
  readonly connectedNodesCount: number; // 연결된 시설 노드 개수
  readonly selectedEdgeIds: readonly string[]; // 개별 플레이어가 건설한 도로 ID 목록
  readonly isPerfect: boolean; // 수학적 MST 최적 비용 일치 여부
}

export interface RankedPlayer extends PlayerRecord {
  readonly rank: number; // 순위 (1, 2, 3, 4 / 공동 순위 지원)
  readonly isTie: boolean; // 공동 순위 여부
}

export type GameModeType = 1 | 2 | 3 | 4;

export const GAME_MODES: Record<GameModeType, { name: string; desc: string; icon: string }> = {
  1: { name: '스마트시티 챌린지', desc: '1인 싱글 솔로 기록 도전 모드', icon: '🏙️' },
  2: { name: '네트워크 듀얼', desc: '2인 1:1 진검승부 턴제 핫시트', icon: '⚔️' },
  3: { name: '스마트시티 리그', desc: '3인 친환경 도시 건설 전략 삼국지', icon: '🏆' },
  4: { name: 'LINK CITY 챔피언십', desc: '4인 마스터 토너먼트 종합 랭킹전', icon: '👑' },
};

/**
 * 2~4인용 승패 판정 및 순위 산정 함수
 * 
 * [승패 판정 규칙]
 * 1. 제한시간 내 연결망 완성 여부 (완성자 > 미완성자)
 * 2. 완성한 경우 건설비가 낮은 순서 (낮을수록 상위)
 * 3. 비용이 같으면 완료 시간이 빠른 순서 (소요 시간 적을수록 상위)
 * 4. 비용과 시간이 같으면 공동 순위
 * 5. 미완성자는 완성자보다 아래 배치, 미완성자끼리는 진행 상태(연결된 시설 수 > 비용) 비교
 */
export function rankPlayers(players: readonly PlayerRecord[]): RankedPlayer[] {
  if (!players || players.length === 0) return [];

  // 불변성 보장을 위해 복사본 생성 후 정렬
  const sorted = [...players].sort((a, b) => {
    // 1. 완성 여부 (완성자 우선)
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? -1 : 1;
    }

    // 2. 완성자 간의 순위 결정
    if (a.isCompleted && b.isCompleted) {
      // 2-1. 건설비 낮은 순서
      if (a.cost !== b.cost) {
        return a.cost - b.cost;
      }
      // 2-2. 소요 시간 빠른 순서
      if (a.timeUsedSeconds !== b.timeUsedSeconds) {
        return a.timeUsedSeconds - b.timeUsedSeconds;
      }
      return 0; // 공동 순위
    }

    // 3. 미완성자 간의 순위 결정 (진행 상태 비교)
    // 3-1. 연결된 시설 수 많은 순서
    if (a.connectedNodesCount !== b.connectedNodesCount) {
      return b.connectedNodesCount - a.connectedNodesCount;
    }
    // 3-2. 투입 비용 낮은 순서
    if (a.cost !== b.cost) {
      return a.cost - b.cost;
    }
    // 3-3. 소요 시간 비교
    if (a.timeUsedSeconds !== b.timeUsedSeconds) {
      return a.timeUsedSeconds - b.timeUsedSeconds;
    }
    return 0;
  });

  // 공동 순위 계산 (1위, 1위, 3위 형태의 스포츠 랭킹 표준)
  const ranked: RankedPlayer[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    let rank = i + 1;
    let isTie = false;

    if (i > 0) {
      const prev = sorted[i - 1];
      const isIdentical =
        current.isCompleted === prev.isCompleted &&
        current.cost === prev.cost &&
        current.timeUsedSeconds === prev.timeUsedSeconds &&
        current.connectedNodesCount === prev.connectedNodesCount;

      if (isIdentical) {
        rank = ranked[i - 1].rank;
        isTie = true;
        // 이전 선수도 isTie 표시
        (ranked[i - 1] as any).isTie = true;
      }
    }

    ranked.push({
      ...current,
      rank,
      isTie,
    });
  }

  return ranked;
}
