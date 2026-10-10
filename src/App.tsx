import React, { useState } from 'react';
import { PRESET_GRAPHS } from './data/presetGraphs';
import { kruskal } from './core/kruskal';
import { DifficultyLevel } from './core/types';

export const App: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('EASY');
  const currentGraph = PRESET_GRAPHS[selectedDifficulty];
  const mstResult = kruskal(currentGraph);

  return (
    <main style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', color: '#1a202c' }}>
      <header>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>LINK CITY 2050 - 코어 엔진 검증</h1>
        <p style={{ color: '#4a5568', margin: 0 }}>
          크루스칼 알고리즘 및 그래프 데이터 모델 1단계 구현 검증 콘솔
        </p>
      </header>

      <section style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
        {(['EASY', 'NORMAL', 'HARD'] as DifficultyLevel[]).map((level) => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: selectedDifficulty === level ? 'bold' : 'normal',
              backgroundColor: selectedDifficulty === level ? '#0B132B' : '#E2E8F0',
              color: selectedDifficulty === level ? '#ffffff' : '#1A202C',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            {level === 'EASY' ? '쉬움 (6정점 9간선)' : level === 'NORMAL' ? '보통 (8정점 13간선)' : '어려움 (10정점 17간선)'}
          </button>
        ))}
      </section>

      <section style={{ marginTop: '24px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>도시 정보: {currentGraph.name}</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>정점 수(시설): <strong>{currentGraph.nodes.length}개</strong></li>
          <li>전체 간선 수(도로망 후보): <strong>{currentGraph.edges.length}개</strong></li>
          <li>최소 신장 트리(MST) 간선 수: <strong>{mstResult.edgeCount}개</strong> (정점 수 - 1)</li>
          <li>전체 연결 여부: <strong>{mstResult.isConnected ? '연결 완료 (Connected)' : '미연결'}</strong></li>
          <li>최소 건설 비용: <strong>{mstResult.totalCost}억 원</strong></li>
        </ul>

        <h3 style={{ fontSize: '1rem', marginTop: '16px' }}>MST로 채택된 최적 간선 목록 ({mstResult.mstEdges.length}개):</h3>
        <ol style={{ paddingLeft: '20px' }}>
          {mstResult.mstEdges.map((e) => (
            <li key={e.id}>
              {e.source} ↔ {e.target} ({e.name || '인프라'}, 비용: {e.weight}억)
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
};

export default App;
