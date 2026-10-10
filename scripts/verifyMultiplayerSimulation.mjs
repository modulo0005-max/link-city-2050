// verifyMultiplayerSimulation.mjs
// 2인, 3인, 4인 및 1인용 게임 모드 전체 플로우 정밀 시뮬레이션 및 검증

import { rankPlayers, GAME_MODES } from '../src/core/multiplayer.ts';

console.log('=== [LINK CITY 2050] 1~4인용 멀티플레이어 전체 시뮬레이션 검증 ===\n');

// 1. 게임 모드 명칭 및 설정 검증
console.log('--- 1. 게임 모드 메타데이터 검증 ---');
const expectedModes = {
  1: '스마트시티 챌린지',
  2: '네트워크 듀얼',
  3: '스마트시티 리그',
  4: 'LINK CITY 챔피언십'
};
for (const [mode, name] of Object.entries(expectedModes)) {
  if (GAME_MODES[Number(mode)].name === name) {
    console.log(`✅ ${mode}인용 모드 명칭 일치: ${GAME_MODES[Number(mode)].icon} ${name}`);
  } else {
    throw new Error(`모드 명칭 불일치: ${mode}`);
  }
}

// 2. 2인용 (네트워크 듀얼) 테스트: 비용 우선 원칙
console.log('\n--- 2. 2인용 (네트워크 듀얼) 시뮬레이션 ---');
const dualPlayers = [
  { id: 1, name: '송도설계자', isCompleted: true, cost: 13, timeUsedSeconds: 110, connectedNodesCount: 6, selectedEdgeIds: ['e1','e2','e3','e4','e5'], isPerfect: true },
  { id: 2, name: '스피드빌더', isCompleted: true, cost: 15, timeUsedSeconds: 45, connectedNodesCount: 6, selectedEdgeIds: ['e1','e2','e6','e7','e8'], isPerfect: false },
];
const dualResult = rankPlayers(dualPlayers);
console.log(`P1: ${dualPlayers[0].name} (13억, 110초)`);
console.log(`P2: ${dualPlayers[1].name} (15억, 45초)`);
if (dualResult[0].name === '송도설계자' && dualResult[0].rank === 1 && dualResult[1].rank === 2) {
  console.log('✅ [2인용 승패 판정 통과] 소요시간이 더 빨라도 건설비가 낮은(13억) 플레이어가 1위 우승!');
} else {
  throw new Error('2인용 순위 판정 오류');
}

// 3. 3인용 (스마트시티 리그) 테스트: 비용 동률 시 시간 판정 & 미완성자 순위
console.log('\n--- 3. 3인용 (스마트시티 리그) 시뮬레이션 ---');
const leaguePlayers = [
  { id: 1, name: '정밀수학', isCompleted: true, cost: 13, timeUsedSeconds: 95, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
  { id: 2, name: '광속완성', isCompleted: true, cost: 13, timeUsedSeconds: 70, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
  { id: 3, name: '타임오버', isCompleted: false, cost: 9, timeUsedSeconds: 180, connectedNodesCount: 4, selectedEdgeIds: [], isPerfect: false },
];
const leagueResult = rankPlayers(leaguePlayers);
console.log(`1위: ${leagueResult[0].name} (${leagueResult[0].cost}억, ${leagueResult[0].timeUsedSeconds}초) - Rank ${leagueResult[0].rank}`);
console.log(`2위: ${leagueResult[1].name} (${leagueResult[1].cost}억, ${leagueResult[1].timeUsedSeconds}초) - Rank ${leagueResult[1].rank}`);
console.log(`3위: ${leagueResult[2].name} (미완성) - Rank ${leagueResult[2].rank}`);

if (leagueResult[0].name === '광속완성' && leagueResult[1].name === '정밀수학' && leagueResult[2].name === '타임오버') {
  console.log('✅ [3인용 리그 판정 통과] 비용 동률 시 완료 시간 빠른 순 정렬 및 미완성자 하위 배치 완벽!');
} else {
  throw new Error('3인용 순위 판정 오류');
}

// 4. 4인용 (LINK CITY 챔피언십) 테스트: 공동 순위 및 복합 순위 판정
console.log('\n--- 4. 4인용 (LINK CITY 챔피언십) 시뮬레이션 ---');
const champPlayers = [
  { id: 1, name: '알파고', isCompleted: true, cost: 13, timeUsedSeconds: 80, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true },
  { id: 2, name: '베타고', isCompleted: true, cost: 13, timeUsedSeconds: 80, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: true }, // 완전 동점
  { id: 3, name: '감마고', isCompleted: true, cost: 16, timeUsedSeconds: 50, connectedNodesCount: 6, selectedEdgeIds: [], isPerfect: false },
  { id: 4, name: '델타고', isCompleted: false, cost: 10, timeUsedSeconds: 180, connectedNodesCount: 5, selectedEdgeIds: [], isPerfect: false },
];
const champResult = rankPlayers(champPlayers);
console.log(`1위: ${champResult[0].name} - Rank ${champResult[0].rank} (공동: ${champResult[0].isTie})`);
console.log(`1위: ${champResult[1].name} - Rank ${champResult[1].rank} (공동: ${champResult[1].isTie})`);
console.log(`3위: ${champResult[2].name} - Rank ${champResult[2].rank}`);
console.log(`4위: ${champResult[3].name} - Rank ${champResult[3].rank}`);

if (champResult[0].rank === 1 && champResult[1].rank === 1 && champResult[0].isTie && champResult[2].rank === 3 && champResult[3].rank === 4) {
  console.log('✅ [4인용 챔피언십 판정 통과] 공동 1위 및 다음 순위(3위) 부여, 미완성자 4위 배치 완벽!');
} else {
  throw new Error('4인용 순위 판정 오류');
}

// 5. 서버 HTML 응답 내 2~4인용 요소 탑재 검증
console.log('\n--- 5. dev-server.mjs 마크업 및 로직 서빙 검증 ---');
const res = await fetch('http://localhost:3000');
const html = await res.text();

const checks = [
  { name: 'mode-select-box', ok: html.includes('mode-select-box') },
  { name: 'mode-tab-1~4', ok: html.includes('mode-tab-1') && html.includes('mode-tab-4') },
  { name: 'playerInputsGrid', ok: html.includes('playerInputsGrid') },
  { name: 'hudPlayerBadge', ok: html.includes('hudPlayerBadge') },
  { name: 'screen-intermission', ok: html.includes('screen-intermission') },
  { name: 'multiResultBox', ok: html.includes('multiResultBox') },
  { name: 'rankingsList', ok: html.includes('rankingsList') },
  { name: 'rankAllPlayers 함수', ok: html.includes('rankAllPlayers') },
  { name: 'completePlayerTurn 함수', ok: html.includes('completePlayerTurn') },
];

checks.forEach(c => {
  if (c.ok) {
    console.log(`✅ [서버 서빙 확인] ${c.name} 정상 탑재`);
  } else {
    throw new Error(`누락된 요소: ${c.name}`);
  }
});

console.log('\n🎉 [최종 결과] 1인, 2인, 3인, 4인 모드 전체 엔진 및 UI 연동 테스트 100% PASS!');
