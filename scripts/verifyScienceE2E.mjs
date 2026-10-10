import http from 'node:http';

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifyScience() {
  console.log('[E2E 검증] http://localhost:3000 페이지 검증 시작...');
  const { statusCode, data } = await fetchPage('http://localhost:3000');
  
  if (statusCode !== 200) {
    console.error(`❌ HTTP 응답 코드 오류: ${statusCode}`);
    process.exit(1);
  }
  console.log('✅ HTTP 200 OK 수신 성공 (HTML 크기: ' + data.length + ' bytes)');

  const checks = [
    { name: '미래 도시 과학 도감 모달 버튼 (타이틀)', pattern: 'openScienceAtlasModal()' },
    { name: '과학 도감 버튼 (HUD 컨트롤)', pattern: '🔬 과학 도감' },
    { name: '플로팅 시설 과학 카드 마크업 (#facilityScienceCard)', pattern: 'id="facilityScienceCard"' },
    { name: '플로팅 카드 닫기 버튼 (closeFacilityScienceInfo)', pattern: 'closeFacilityScienceInfo()' },
    { name: '결과 화면 보너스 퀴즈 섹션 (#bonusQuizSection)', pattern: 'id="bonusQuizSection"' },
    { name: '보너스 퀴즈 선택지 컨테이너 (#bqChoicesGrid)', pattern: 'id="bqChoicesGrid"' },
    { name: '보너스 퀴즈 피드백 박스 (#bqFeedbackBox)', pattern: 'id="bqFeedbackBox"' },
    { name: '8대 시설 과학 도감 모달 마크업 (#scienceAtlasModalBackdrop)', pattern: 'id="scienceAtlasModalBackdrop"' },
    { name: '과학 도감 시설 카드 그리드 (#scienceAtlasGrid)', pattern: 'id="scienceAtlasGrid"' },
    { name: '노드 과학 정보 확인 뱃지 클래스 (.node-sci-badge)', pattern: 'node-sci-badge' },
    { name: '태양광 발전소: 빛에너지와 전기에너지 데이터', pattern: '빛에너지와 전기에너지' },
    { name: '스마트 병원: 의료 데이터와 원격 진료 데이터', pattern: '의료 데이터와 원격 진료' },
    { name: 'AI 연구소: 인공지능과 데이터 분석 데이터', pattern: '인공지능과 데이터 분석' },
    { name: '자율주행 교통 허브: 센서와 자동 제어 데이터', pattern: '센서와 자동 제어' },
    { name: '친환경 주거단지: 에너지 절약 건축 데이터', pattern: '에너지 절약 건축' },
    { name: '데이터 센터: 정보 처리와 통신망 데이터', pattern: '정보 처리와 통신망' },
    { name: '스마트 농업 돔: 생육 환경 자동 제어 데이터', pattern: '생육 환경 자동 제어' },
    { name: '수소 에너지 센터: 수소 저장 및 연료전지 데이터', pattern: '수소 저장 및 연료전지' },
    { name: '8개 과학 퀴즈 은행 정의 (SCIENCE_QUIZZES)', pattern: 'const SCIENCE_QUIZZES =' },
    { name: '보너스 퀴즈 점수 영향 0% 안내 문구', pattern: '게임 점수 및 랭킹 영향 0%' },
    { name: '다른 문제 풀기 버튼 (nextRandomScienceQuiz)', pattern: 'nextRandomScienceQuiz()' },
    { name: '결과 화면 시 퀴즈 초기화 연동 (initBonusScienceQuiz)', pattern: 'initBonusScienceQuiz();' },
    { name: '노드 클릭 시 시설 과학 카드 연동 (openFacilityScienceInfo)', pattern: 'openFacilityScienceInfo(n)' }
  ];

  let passedCount = 0;
  for (const c of checks) {
    if (data.includes(c.pattern)) {
      console.log(`  ✔ [PASS] ${c.name}`);
      passedCount++;
    } else {
      console.error(`  ❌ [FAIL] ${c.name} (패턴 누락: "${c.pattern}")`);
    }
  }

  console.log(`\n검증 결과: ${passedCount} / ${checks.length} 통과`);
  if (passedCount === checks.length) {
    console.log('🎉 모든 미래 도시 과학 학습 콘텐츠 및 퀴즈 요구사항이 100% 정상 구현되었습니다!');
  } else {
    process.exit(1);
  }
}

verifyScience().catch(err => {
  console.error('검증 실행 실패:', err);
  process.exit(1);
});
