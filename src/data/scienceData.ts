import type { FacilityScienceInfo, ScienceQuizItem } from '../core/types.ts';

/**
 * LINK CITY 2050 - 8대 미래 도시 시설 과학 원리 데이터 (중·고등학생 수준, 2~3문장 이내)
 */
export const FACILITY_SCIENCE_DATA: Record<string, FacilityScienceInfo> = {
  SOLAR: {
    icon: 'SOLAR',
    facilityName: '태양광 발전소',
    topic: '빛에너지와 전기에너지',
    summary: '태양 전지판의 반도체 물질이 빛에너지를 흡수하면 전자가 방출되는 광전효과(광기전력 효과)를 통해 전기에너지를 직접 생산합니다. 생산된 전기는 고효율 에너지 저장 장치(ESS)에 저장되어 날씨 변화와 상관없이 도시에 안정적으로 공급됩니다. 온실가스를 전혀 배출하지 않는 대표적인 친환경 청정 발전 기술입니다.',
    keyConcept: '광전효과 & 에너지 저장 시스템(ESS)',
    iconSymbol: '☀️'
  },
  HOSPITAL: {
    icon: 'HOSPITAL',
    facilityName: '스마트 병원',
    topic: '의료 데이터와 원격 진료',
    summary: '웨어러블 센서와 사물인터넷(IoT) 장비로 수집된 환자의 생체 신호가 초고속 네트워크를 통해 실시간 의료 데이터로 전송됩니다. 인공지능이 환자의 상태 이상을 감지하고, 원격지의 전문의가 고해상도 영상 데이터를 보며 실시간 비대면 진료를 진행합니다. 응급 상황에서도 골든타임을 확보할 수 있는 지능형 의료 인프라입니다.',
    keyConcept: 'IoT 생체 신호 & AI 원격 협진',
    iconSymbol: '🏥'
  },
  AI_LAB: {
    icon: 'AI_LAB',
    facilityName: 'AI 연구소',
    topic: '인공지능과 데이터 분석',
    summary: '도시 전역에서 수집되는 방대한 빅데이터를 인공신경망과 머신러닝 알고리즘으로 초고속 병렬 분석합니다. 에너지 소비량, 교통 흐름, 기후 이상 징후를 스스로 예측하고 도시 시스템을 최적의 상태로 제어합니다. 데이터 분석을 통해 인간의 의사결정을 보조하고 도시의 자율 운영을 이끕니다.',
    keyConcept: '딥러닝 알고리즘 & 빅데이터 예측',
    iconSymbol: '🧠'
  },
  MOBILITY: {
    icon: 'MOBILITY',
    facilityName: '자율주행 교통 허브',
    topic: '센서와 자동 제어',
    summary: '라이다(LiDAR), 레이더, 고성능 카메라 센서가 360도 주변 환경과 장애물 거리를 마이크로초 단위로 정밀 측정합니다. 차량과 도로 인프라 간 실시간 통신(V2X)을 바탕으로 제어 컴퓨터가 가속, 제동, 조향을 자동으로 정밀 조절합니다. 운전자 없이도 교통 체증과 사고를 획기적으로 줄이는 스마트 모빌리티의 중심입니다.',
    keyConcept: '라이다(LiDAR) 센서 & V2X 자동 제어',
    iconSymbol: '🚗'
  },
  RESIDENCE: {
    icon: 'RESIDENCE',
    facilityName: '친환경 주거단지',
    topic: '에너지 절약 건축',
    summary: '고성능 3중 로이(Low-E) 유리와 고단열 건축 외장재를 적용한 패시브 설계로 실내 열 손실을 차단합니다. 건물 일체형 태양광(BIPV)과 열회수 환기장치로 에너지를 자체 생산하고 냉난방 효율을 극대화합니다. 자연 채광과 빗물 재활용 시스템이 결합된 탄소중립 제로에너지 주거 공간입니다.',
    keyConcept: '패시브 하우스 & 제로에너지 빌딩(ZEB)',
    iconSymbol: '🏡'
  },
  DATA_CENTER: {
    icon: 'DATA_CENTER',
    facilityName: '데이터 센터',
    topic: '정보 처리와 통신망',
    summary: '수천 대의 고성능 서버가 양자 암호 광통신망을 통해 도시 전체의 정보 연산과 데이터 저장을 24시간 중단 없이 처리합니다. 연산 과정에서 발생하는 막대한 열은 친환경 지열 쿨링 및 외기 수랭식 냉각 기술로 신속히 식힙니다. 도시의 두뇌 역할을 하며 지능형 디지털 서비스의 기반이 됩니다.',
    keyConcept: '양자 광통신 & 친환경 수랭식 쿨링',
    iconSymbol: '🖥️'
  },
  AGRI_DOME: {
    icon: 'AGRI_DOME',
    facilityName: '스마트 농업 돔',
    topic: '생육 환경 자동 제어',
    summary: '환경 센서가 온·습도, 이산화탄소 농도, 토양 수분을 실시간 측정하고, 컴퓨터가 최적의 생육 환경을 자동으로 제어합니다. 식물 광합성에 가장 적합한 특정 파장의 LED 인공광과 순환식 영양액을 공급하여 기후 변화와 상관없이 작물을 재배합니다. 도시 내부에서 안전한 먹거리를 365일 생산하는 친환경 수직 농장입니다.',
    keyConcept: 'LED 광합성 파장 & 스마트 팜 IoT',
    iconSymbol: '🌿'
  },
  HYDROGEN: {
    icon: 'HYDROGEN',
    facilityName: '수소 에너지 센터',
    topic: '수소 저장 및 연료전지',
    summary: '신재생 전력으로 물을 전기분해(수전해)하여 만든 청정 수소를 고압 압축 및 특수 복합소재 탱크에 안전하게 저장합니다. 전력이 필요할 때 수소와 산소의 전기화학 반응을 유도하는 수소 연료전지로 순수한 물만 배출하며 고효율 전기를 생산합니다. 장기간 대용량 에너지 저장이 가능한 차세대 분산 전원입니다.',
    keyConcept: '수전해 청정 수소 & 수소 연료전지(Fuel Cell)',
    iconSymbol: '⚡'
  }
};

/**
 * 게임 종료 후 제시되는 선택형 과학 퀴즈 은행 (8문항)
 */
export const SCIENCE_QUIZZES: ScienceQuizItem[] = [
  {
    id: 'quiz-solar',
    facilityIcon: 'SOLAR',
    facilityName: '태양광 발전소',
    question: '태양광 발전소에서 태양의 빛에너지를 전기에너지로 직접 변환할 때 일어나는 핵심 과학 원리는 무엇일까요?',
    choices: [
      '광전효과 (광기전력 효과)',
      '핵융합 반응',
      '전자기 유도 현상',
      '물의 전기분해 반응'
    ],
    correctIndex: 0,
    explanation: '태양광 발전은 특정 반도체에 빛을 비추었을 때 전자가 튀어나와 전류가 흐르는 광전효과(광기전력 효과)를 통해 빛에너지를 전기에너지로 직접 변환합니다.'
  },
  {
    id: 'quiz-hospital',
    facilityIcon: 'HOSPITAL',
    facilityName: '스마트 병원',
    question: '스마트 병원에서 원격지의 환자 상태를 실시간 진단하고 진료하는 데 필수적인 핵심 기술은 무엇일까요?',
    choices: [
      '수경재배 순환 기술',
      'IoT 생체 센서와 초고속 의료 데이터 통신',
      '패시브 단열 공법',
      '초전도 자기부상 기술'
    ],
    correctIndex: 1,
    explanation: '스마트 병원은 환자의 IoT 웨어러블 센서로 맥박, 혈압, 체온 데이터를 수집하고, 초고속 통신망을 통해 전문의에게 실시간 전송하여 원격 진료를 수행합니다.'
  },
  {
    id: 'quiz-ailab',
    facilityIcon: 'AI_LAB',
    facilityName: 'AI 연구소',
    question: 'AI 연구소에서 스마트시티의 전력 분배와 교통 흐름을 최적화하기 위해 활용하는 핵심 데이터 분석 기술은 무엇일까요?',
    choices: [
      '광합성 파장 제어',
      '머신러닝과 딥러닝 빅데이터 분석',
      '3중 복층 유리 단열 공법',
      '지열 냉각 쿨링 기술'
    ],
    correctIndex: 1,
    explanation: 'AI 연구소는 도시 곳곳에서 수집되는 방대한 데이터를 인공신경망과 머신러닝 알고리즘으로 분석하여 미래 수요를 예측하고 도시 시스템을 스스로 제어합니다.'
  },
  {
    id: 'quiz-mobility',
    facilityIcon: 'MOBILITY',
    facilityName: '자율주행 교통 허브',
    question: '자율주행 차량이 레이저 빛을 쏘아 주변 물체와의 거리를 360도로 정밀 측정하는 핵심 센서는 무엇일까요?',
    choices: [
      '라이다 (LiDAR) 센서',
      '온·습도 바이오 센서',
      '지열 열교환 센서',
      '수소 압력 감지 센서'
    ],
    correctIndex: 0,
    explanation: '라이다(LiDAR)는 레이저 펄스가 물체에 반사되어 돌아오는 시간을 측정하여 주변의 3차원 공간 지도를 마이크로초 단위로 정밀하게 그리는 핵심 센서입니다.'
  },
  {
    id: 'quiz-residence',
    facilityIcon: 'RESIDENCE',
    facilityName: '친환경 주거단지',
    question: '친환경 주거단지(패시브 하우스)에서 실내 냉난방 에너지 유출을 차단하기 위해 적용하는 대표적인 건축 기술은 무엇일까요?',
    choices: [
      '양자 암호 병렬 연산',
      '고단열 외장재와 열회수 환기장치',
      '수소 연료전지 수전해',
      '식물 광합성 LED 공급'
    ],
    correctIndex: 1,
    explanation: '패시브 하우스는 고단열 3중 창호와 열회수 환기장치로 실내 열 손실을 차단하여 아주 적은 에너지만으로도 쾌적한 실내 온도를 유지합니다.'
  },
  {
    id: 'quiz-datacenter',
    facilityIcon: 'DATA_CENTER',
    facilityName: '데이터 센터',
    question: '데이터 센터의 서버가 연산할 때 발생하는 막대한 열을 친환경적으로 냉각하기 위해 사용하는 기술은 무엇일까요?',
    choices: [
      'BIPV 건물 일체형 발전',
      '지열 쿨링 및 외기 수랭식 냉각 시스템',
      '광전효과 집광판',
      '차량사물통신(V2X) 센서'
    ],
    correctIndex: 1,
    explanation: '데이터 센터는 지하의 서늘한 지열이나 자연 바람, 냉각수를 순환시키는 수랭식 쿨링 기술을 통해 대규모 전력을 아끼며 서버의 열을 신속히 식힙니다.'
  },
  {
    id: 'quiz-agridome',
    facilityIcon: 'AGRI_DOME',
    facilityName: '스마트 농업 돔',
    question: '스마트 농업 돔에서 외부 날씨와 상관없이 최적의 식물 광합성을 유도하기 위해 인공적으로 공급하는 것은 무엇일까요?',
    choices: [
      '식물 생장용 특정 파장의 LED 인공광',
      '초고압 수소 기체',
      '라이다 전파 신호',
      '양자 암호 레이저'
    ],
    correctIndex: 0,
    explanation: '스마트 팜은 식물의 엽록소가 가장 활발하게 흡수하는 청색·적색 파장의 LED 인공광과 순환식 영양액을 공급하여 365일 사계절 고품질 작물을 재배합니다.'
  },
  {
    id: 'quiz-hydrogen',
    facilityIcon: 'HYDROGEN',
    facilityName: '수소 에너지 센터',
    question: '수소 에너지 센터의 연료전지에서 수소와 산소가 반응하여 전기를 생산할 때 배출되는 유일한 물질은 무엇일까요?',
    choices: [
      '이산화탄소 (CO₂)',
      '순수한 물 (H₂O)',
      '초미세먼지 (PM2.5)',
      '일산화탄소 (CO)'
    ],
    correctIndex: 1,
    explanation: '수소 연료전지는 수소(H₂)와 공기 중 산소(O₂)의 전기화학 반응을 통해 전기를 만들며, 유해 배출물 없이 오직 순수한 물(H₂O)만 생성됩니다.'
  }
];
