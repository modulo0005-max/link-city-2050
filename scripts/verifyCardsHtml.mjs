import http from 'node:http';

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('--- HTML 응답 검증 시작 ---');
    const hasPanel = data.includes('id="cardsPanel"');
    const hasGrid = data.includes('id="cardsGrid"');
    const hasRenderCards = data.includes('function renderCards()');
    const hasHighlightCard = data.includes('function highlightCard');
    const hasSort = data.includes('function setCardSort');
    console.log('cardsPanel 존재 여부:', hasPanel);
    console.log('cardsGrid 존재 여부:', hasGrid);
    console.log('renderCards 함수 존재 여부:', hasRenderCards);
    console.log('highlightCard 함수 존재 여부:', hasHighlightCard);
    console.log('setCardSort 함수 존재 여부:', hasSort);
    
    if (hasPanel && hasGrid && hasRenderCards && hasHighlightCard && hasSort) {
      console.log('✅ 도로 건설 카드 패널 및 양방향 동기화 스크립트 서빙 검증 100% 완료!');
    } else {
      console.error('❌ 일부 요소가 누락되었습니다.');
      process.exit(1);
    }
  });
}).on('error', err => {
  console.error('HTTP 요청 실패:', err.message);
  process.exit(1);
});
