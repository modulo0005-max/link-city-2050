# LINK CITY 2050 - AI 개발 원칙 및 협업 가이드 (AGENTS.md)

## 1. 프로젝트 개요
- **프로젝트명**: LINK CITY 2050
- **목표**: 크루스칼 알고리즘(MST)을 활용한 수학·과학 융합형 2050 친환경 스마트시티 건설 전략 게임
- **대상**: 중·고등학생 교육용 웹 애플리케이션
- **기술 스택**: React, TypeScript, Vite, SVG, Vitest
- **배포 타겟**: GitHub Pages (정적 호스팅, 무서버)

## 2. 핵심 개발 원칙 (Core Principles)
1. **관심사의 철저한 분리 (Separation of Concerns)**
   - `src/core`: 순수 수학 알고리즘 (Kruskal, Union-Find, 검증 로직). React/DOM 의존성 0% 유지.
   - `src/data`: 고정 지도 및 시나리오 메타데이터.
   - `src/engine`: 게임 턴/상태/점수 관리.
   - `src/components`: SVG 렌더링 및 UI.
2. **복수 최소 신장 트리(Multiple MSTs) 인정**
   - 가중치가 같은 간선이 존재할 때 여러 유효한 해가 존재할 수 있음.
   - 단순 간선 ID 비교가 아닌 **(1) 간선 수 $n-1$개, (2) 사이클 없음, (3) 전체 연결, (4) 총 가중치 합이 최적 비용과 일치**를 기준으로 검증.
3. **불변성(Immutability) 보장**
   - 알고리즘 계산 시 원본 그래프의 노드/간선 배열을 직접 변형(in-place sort/splice)하지 않고 복사본 사용.
4. **점진적 개발 (Incremental Delivery)**
   - 1인용 코어 엔진 완성 후 2~4인용 확장.
   - 정상 작동하는 기존 코드는 임의로 대규모 재작성 금지.
5. **GitHub Pages 배포 호환성**
   - `vite.config.js`의 `base: './'` 유지 (상대 경로 참조).

## 3. 유효성 검증 규칙
- 쉬움: 정점 6개, 간선 9개 (MST 간선 5개)
- 보통: 정점 8개, 간선 13개 (MST 간선 7개)
- 어려움: 정점 10개, 간선 17개 (MST 간선 9개)
