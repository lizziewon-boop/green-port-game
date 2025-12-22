import React, { useState, useEffect, useRef } from 'react';

// CSS 애니메이션 스타일 - 더 크고 눈에 띄게
const animationStyles = `
  @keyframes slideInFromRight {
    from { transform: translateX(150px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInFromLeft {
    from { transform: translateX(-150px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInFromTop {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  @keyframes shipFadeIn {
    0% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 0.5; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes shipFadeOut {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.9); }
    100% { opacity: 0.2; transform: scale(0.7); }
  }
  @keyframes shakeSmall {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
  @keyframes shakeMedium {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(-8px) rotate(-1deg); }
    75% { transform: translateX(8px) rotate(1deg); }
  }
  @keyframes shakeLarge {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-15px) rotate(-2deg); }
    20%, 40%, 60%, 80% { transform: translateX(15px) rotate(2deg); }
  }
  @keyframes glowSmall {
    0%, 100% { box-shadow: 0 0 5px rgba(234,179,8,0.3); }
    50% { box-shadow: 0 0 15px rgba(234,179,8,0.6); }
  }
  @keyframes glowMedium {
    0%, 100% { box-shadow: 0 0 10px rgba(234,179,8,0.4); }
    50% { box-shadow: 0 0 30px rgba(234,179,8,0.8); }
  }
  @keyframes glowLarge {
    0%, 100% { box-shadow: 0 0 15px rgba(234,179,8,0.5); }
    50% { box-shadow: 0 0 50px rgba(234,179,8,1), 0 0 70px rgba(234,179,8,0.5); }
  }
  @keyframes zoomPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }
  @keyframes dangerPulse {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.2); filter: brightness(1.5); }
  }
  @keyframes newsAlert {
    0% { transform: translateX(200px) rotate(5deg); opacity: 0; }
    60% { transform: translateX(-20px) rotate(-2deg); opacity: 1; }
    80% { transform: translateX(10px) rotate(1deg); }
    100% { transform: translateX(0) rotate(0deg); opacity: 1; }
  }
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    40% { transform: scale(1.2); }
    60% { transform: scale(0.9); }
    80% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes flyIn {
    0% { transform: translateX(-100vw) rotate(-20deg); }
    70% { transform: translateX(20px) rotate(5deg); }
    100% { transform: translateX(0) rotate(0deg); }
  }
  @keyframes numberPop {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes successFlash {
    0% { background-color: rgba(34,197,94,0); }
    30% { background-color: rgba(34,197,94,0.5); }
    100% { background-color: rgba(34,197,94,0); }
  }
  @keyframes dangerFlash {
    0% { background-color: rgba(239,68,68,0); }
    30% { background-color: rgba(239,68,68,0.5); }
    100% { background-color: rgba(239,68,68,0); }
  }
`;

// 스타일 태그 삽입 컴포넌트
const StyleInjector = () => {
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = animationStyles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);
  return null;
};

// 카운트업 애니메이션 훅
const useCountUp = (end, duration = 1500, start = 0) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = countRef.current;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (end - startValue) * easeOut;
      
      setCount(current);
      countRef.current = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return count;
};

// 애니메이션 숫자 컴포넌트
const AnimatedNumber = ({ value, decimals = 1, suffix = '', prefix = '', duration = 1500 }) => {
  const animatedValue = useCountUp(value, duration);
  return <span style={{ display: 'inline-block', animation: 'numberPop 0.5s ease-out' }}>{prefix}{animatedValue.toFixed(decimals)}{suffix}</span>;
};

// 선박 이동 애니메이션 컴포넌트 - 증가: 흐렸다가 진해짐, 감소: 진했다가 흐려짐
const ShipAnimation = ({ change, delay = 0 }) => {
  const isPositive = change >= 0;
  const absChange = Math.abs(change);
  // 최대 4개, 변화량에 비례
  const shipCount = Math.min(4, Math.max(1, Math.ceil(absChange / 15)));
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '2px'
    }}>
      {[...Array(shipCount)].map((_, i) => (
        <span 
          key={i} 
          style={{ 
            fontSize: '16px',
            display: 'inline-block',
            animation: isPositive 
              ? `shipFadeIn 1.2s ease-out ${delay + i * 0.2}s both`
              : `shipFadeOut 1.2s ease-out ${delay + i * 0.2}s both`
          }}
        >
          🚢
        </span>
      ))}
      <span style={{ 
        marginLeft: '6px',
        fontWeight: 'bold',
        fontSize: '15px',
        color: isPositive ? '#4ade80' : '#f87171'
      }}>
        {isPositive ? '+' : ''}{change}척
      </span>
    </div>
  );
};

const INITIAL_PORTS = {
  singapore: { name: '싱가포르', flag: '🇸🇬', code: 'SG', ascBase: 0, methanol: 0.3, ammonia: 0.2, budget: 500, personality: 'aggressive' },
  rotterdam: { name: '로테르담', flag: '🇳🇱', code: 'NL', ascBase: -0.76, methanol: 0.3, ammonia: 0.15, budget: 400, personality: 'tech' },
  korea: { name: '한국', flag: '🇰🇷', code: 'KR', ascBase: -0.96, methanol: 0.1, ammonia: 0, budget: 300, personality: 'player' },
  shanghai: { name: '상하이', flag: '🇨🇳', code: 'CN', ascBase: -1.28, methanol: 0.05, ammonia: 0, budget: 350, personality: 'price' }
};

const PORT_COLORS = {
  korea: '#eab308',
  singapore: '#22c55e', 
  rotterdam: '#f97316',
  shanghai: '#ef4444'
};

const EVENTS = {
  A: [
    { year: 2026, title: "FuelEU 시행 유예 논의", effect: "메탄올 수요 +2%", mood: 'neutral' },
    { year: 2027, title: "EU ETS 해운 적용 축소", effect: "전환 수요 +3%", mood: 'neutral' },
    { year: 2028, title: "기술 개발 지연", effect: "변화 없음", mood: 'warning' },
    { year: 2029, title: "글로벌 경기 침체", effect: "전체 수요 -5%", mood: 'danger' },
    { year: 2030, title: "IMO 목표 완화 논의", effect: "전환 수요 +2%", mood: 'neutral' },
    { year: 2031, title: "메탄올 가격 급등", effect: "메탄올 수요 -5%", mood: 'danger' },
    { year: 2032, title: "암모니아 상용화 지연", effect: "변화 없음", mood: 'warning' },
    { year: 2033, title: "기존 연료 가격 하락", effect: "전환 수요 -3%", mood: 'warning' },
    { year: 2034, title: "싱가포르 투자 축소", effect: "경쟁 완화", mood: 'good', competitorBoost: { singapore: 0.05 } },
    { year: 2035, title: "EU 규제 2단계 유예", effect: "전환 수요 +3%", mood: 'neutral' },
    { year: 2036, title: "암모니아 기술 점진 발전", effect: "암모니아 수요 +5%", mood: 'good' },
    { year: 2037, title: "시장 정체기", effect: "변화 없음", mood: 'neutral' },
    { year: 2038, title: "IMO 2040 규제 완화", effect: "전환 수요 +3%", mood: 'neutral' },
    { year: 2039, title: "점진적 회복세", effect: "전환 수요 +3%", mood: 'good' },
    { year: 2040, title: "IMO 2040 (완화된 목표)", effect: "최종 평가", mood: 'neutral' }
  ],
  B: [
    { year: 2026, title: "EU FuelEU 본격 시행", effect: "메탄올 수요 +5%", mood: 'good' },
    { year: 2027, title: "EU ETS 해운 확대 적용", effect: "전환 수요 +8%", mood: 'good' },
    { year: 2028, title: "싱가포르 암모니아 상용화", effect: "싱가포르 경쟁력 ↑", mood: 'danger', competitorBoost: { singapore: 0.15 } },
    { year: 2029, title: "메탄올 선박 100척 돌파", effect: "메탄올 수요 +10%", mood: 'good' },
    { year: 2030, title: "IMO 중간 목표 점검", effect: "전환 수요 +5%", mood: 'neutral' },
    { year: 2031, title: "상하이 대규모 투자", effect: "상하이 경쟁력 ↑", mood: 'danger', competitorBoost: { shanghai: 0.2 } },
    { year: 2032, title: "암모니아 선박 첫 상용 운항", effect: "암모니아 수요 +15%", mood: 'good' },
    { year: 2033, title: "메탄올 가격 안정화", effect: "메탄올 경쟁력 ↑", mood: 'good', globalBoost: { methanol: 0.05 } },
    { year: 2034, title: "로테르담 그린메탄올 생산", effect: "로테르담 경쟁력 ↑", mood: 'warning', competitorBoost: { rotterdam: 0.15 } },
    { year: 2035, title: "EU 규제 2단계 강화", effect: "전환 수요 +10%", mood: 'good' },
    { year: 2036, title: "암모니아 가격 경쟁력 확보", effect: "암모니아 경쟁력 ↑", mood: 'good', globalBoost: { ammonia: 0.1 } },
    { year: 2037, title: "싱가포르 허브 확장 완료", effect: "싱가포르 경쟁력 ↑", mood: 'warning', competitorBoost: { singapore: 0.1 } },
    { year: 2038, title: "IMO 2040 규제 확정", effect: "전환 수요 +10%", mood: 'good' },
    { year: 2039, title: "글로벌 벙커링 표준화", effect: "시장 안정", mood: 'neutral' },
    { year: 2040, title: "IMO 2040 목표 시점", effect: "최종 평가", mood: 'neutral' }
  ],
  C: [
    { year: 2026, title: "EU 추가 규제 예고", effect: "메탄올 수요 +10%", mood: 'good' },
    { year: 2027, title: "탄소세 조기 적용", effect: "전환 수요 +15%", mood: 'good' },
    { year: 2028, title: "암모니아 기술 돌파", effect: "암모니아 경쟁력 ↑", mood: 'good', globalBoost: { ammonia: 0.1 } },
    { year: 2029, title: "메탄올 선박 발주 폭증", effect: "메탄올 수요 +15%", mood: 'good' },
    { year: 2030, title: "IMO 목표 상향 조정", effect: "전환 수요 +10%", mood: 'good' },
    { year: 2031, title: "상하이 저가 공세", effect: "상하이 경쟁력 ↑↑", mood: 'danger', competitorBoost: { shanghai: 0.25 } },
    { year: 2032, title: "싱가포르 암모니아 허브 선언", effect: "싱가포르 경쟁력 ↑↑", mood: 'danger', competitorBoost: { singapore: 0.2 } },
    { year: 2033, title: "그린메탄올 가격 급락", effect: "메탄올 경쟁력 ↑", mood: 'good', globalBoost: { methanol: 0.1 } },
    { year: 2034, title: "암모니아 선박 대량 발주", effect: "암모니아 수요 +20%", mood: 'good' },
    { year: 2035, title: "EU 탄소중립 선박 의무화", effect: "전환 수요 +15%", mood: 'good' },
    { year: 2036, title: "로테르담 암모니아 진출", effect: "로테르담 경쟁력 ↑↑", mood: 'danger', competitorBoost: { rotterdam: 0.2 } },
    { year: 2037, title: "싱가포르 추가 투자", effect: "싱가포르 경쟁력 ↑", mood: 'warning', competitorBoost: { singapore: 0.15 } },
    { year: 2038, title: "IMO 2040 초과 달성 전망", effect: "전환 수요 +10%", mood: 'good' },
    { year: 2039, title: "친환경 연료 완전 주류화", effect: "암모니아 수요 +10%", mood: 'good' },
    { year: 2040, title: "IMO 2040 (강화된 목표)", effect: "최종 평가", mood: 'neutral' }
  ]
};

const SPECIAL_EVENTS = {
  B: {
    5: { title: "상하이가 협력을 제안합니다", choices: [
      { text: "협력 수락 (+점유율 안정, -자율성)", effect: { korea: 0.05, shanghai: 0.05 } },
      { text: "거절하고 독자 노선", effect: { korea: -0.02 } },
      { text: "협상으로 유리한 조건 획득", effect: { korea: 0.08, shanghai: 0.02 }, risk: 0.4 }
    ]},
    8: { title: "울산 저장시설 화재 발생!", choices: [
      { text: "긴급 복구 (300억 추가 투자)", effect: { korea: 0 }, cost: 300 },
      { text: "부산으로 우회 (-효율)", effect: { korea: -0.1 } },
      { text: "해외 시설 임시 임대", effect: { korea: -0.05 }, cost: 100 }
    ]},
    11: { title: "싱가포르가 가격 전쟁을 선포!", choices: [
      { text: "가격 대응 (-수익)", effect: { korea: 0 }, cost: 200 },
      { text: "품질/서비스 차별화", effect: { korea: 0.05 } },
      { text: "틈새시장 집중", effect: { korea: -0.03 } }
    ]},
    13: { title: "국내 조선사 대량 수주 성공!", choices: [
      { text: "협력 MOU 체결", effect: { korea: 0.15 } },
      { text: "인프라 우선 확충", effect: { korea: 0.1 }, cost: 150 },
      { text: "기회 활용 보류", effect: { korea: 0.05 } }
    ]}
  },
  C: {
    5: { title: "상하이 저가 공세 시작!", choices: [
      { text: "가격전쟁 참전", effect: { korea: -0.05 }, cost: 250 },
      { text: "품질 프리미엄 전략", effect: { korea: 0.05 } },
      { text: "정부 지원 요청", effect: { korea: 0.08 }, risk: 0.3 }
    ]},
    11: { title: "글로벌 해운사가 러브콜!", choices: [
      { text: "독점 계약 체결", effect: { korea: 0.2 } },
      { text: "비독점으로 유연성 확보", effect: { korea: 0.1 } },
      { text: "협상 지연 (더 좋은 조건)", effect: { korea: 0.15 }, risk: 0.5 }
    ]},
    13: { title: "암모니아 기술 혁신!", choices: [
      { text: "즉시 도입 (선점)", effect: { korea: 0.15 }, cost: 200 },
      { text: "안정화 후 도입", effect: { korea: 0.08 } },
      { text: "기존 메탄올 집중", effect: { korea: 0 } }
    ]}
  }
};

const COMPETITOR_REACTIONS = {
  singapore: [
    { action: "암모니아 인프라 대폭 확충 선언", emoji: "😤", boost: 0.1 },
    { action: "가격 인하로 맞대응", emoji: "💢", boost: 0.08 },
    { action: "아시아 해운사 독점 계약 추진", emoji: "🔥", boost: 0.12 }
  ],
  shanghai: [
    { action: "정부 보조금 투입해 저가 공세", emoji: "💰", boost: 0.1 },
    { action: "메탄올 생산시설 대규모 증설", emoji: "🏭", boost: 0.08 },
    { action: "한국 물량 빼앗기 작전 개시", emoji: "⚔️", boost: 0.15 }
  ],
  rotterdam: [
    { action: "그린메탄올 생산 확대", emoji: "🌱", boost: 0.08 },
    { action: "유럽 규제 선점 전략 강화", emoji: "🇪🇺", boost: 0.1 },
    { action: "현 전략 유지 (관망)", emoji: "🤔", boost: 0 }
  ]
};

const INVEST_COSTS = { '없음': 0, '소': 100, '중': 300, '대': 500 };

const calculateShares = (ports) => {
  let sumExp = 0;
  const expValues = {};
  Object.keys(ports).forEach(key => {
    const port = ports[key];
    const totalAsc = port.ascBase + port.methanol + port.ammonia;
    expValues[key] = Math.exp(totalAsc);
    sumExp += expValues[key];
  });
  const shares = {};
  Object.keys(ports).forEach(key => {
    shares[key] = (expValues[key] / sumExp) * 100;
  });
  return shares;
};

// AI 투자 결정 함수
const getAIInvestment = (port, portKey, shares, scenario) => {
  const budget = port.budget;
  const share = shares[portKey];
  
  // 성향별 투자 전략
  let investSize = '중';
  let investAmount = 300;
  
  if (port.personality === 'aggressive') {
    // 싱가포르: 공격적, 점유율 지키기 위해 적극 투자
    if (share < 40 && budget >= 500) {
      investSize = '대';
      investAmount = 500;
    } else if (budget >= 300) {
      investSize = '중';
      investAmount = 300;
    } else {
      investSize = '소';
      investAmount = 100;
    }
  } else if (port.personality === 'tech') {
    // 로테르담: 기술 중심, 꾸준한 중간 투자
    if (budget >= 300) {
      investSize = '중';
      investAmount = 300;
    } else {
      investSize = '소';
      investAmount = 100;
    }
  } else if (port.personality === 'price') {
    // 상하이: 가격 경쟁, 점유율 낮으면 공격적
    if (share < 15 && budget >= 500) {
      investSize = '대';
      investAmount = 500;
    } else if (share < 20 && budget >= 300) {
      investSize = '중';
      investAmount = 300;
    } else {
      investSize = '소';
      investAmount = 100;
    }
  }
  
  // 예산 부족 시 하향 조정
  if (investAmount > budget) {
    if (budget >= 300) {
      investSize = '중';
      investAmount = 300;
    } else if (budget >= 100) {
      investSize = '소';
      investAmount = 100;
    } else {
      investSize = null;
      investAmount = 0;
    }
  }
  
  return { investSize, investAmount };
};

// 연간 수익 계산
const getAnnualRevenue = (share) => {
  const baseRevenue = 200;
  const shareBonus = Math.floor(share * 10);
  return baseRevenue + shareBonus;
};

export default function GreenPortStrategy() {
  const [screen, setScreen] = useState('start');
  const [scenario, setScenario] = useState(null);
  const [turn, setTurn] = useState(1);
  const [ports, setPorts] = useState(JSON.parse(JSON.stringify(INITIAL_PORTS)));
  const [shares, setShares] = useState(calculateShares(INITIAL_PORTS));
  const [shareHistory, setShareHistory] = useState([calculateShares(INITIAL_PORTS)]);
  const [prevShares, setPrevShares] = useState(null);
  const [division, setDivision] = useState('M2');
  const [fuelRatio, setFuelRatio] = useState(50);
  const [investSize, setInvestSize] = useState('중');
  const [turnResult, setTurnResult] = useState(null);
  const [specialEvent, setSpecialEvent] = useState(null);
  const [totalInvested, setTotalInvested] = useState(0);
  const [aiActions, setAiActions] = useState({}); // AI 행동 기록
  const [bankruptYear, setBankruptYear] = useState(null);
  
  // CSS 애니메이션 스타일 삽입 (컴포넌트 마운트 시 한번)
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'green-port-animations';
    styleEl.textContent = animationStyles;
    if (!document.getElementById('green-port-animations')) {
      document.head.appendChild(styleEl);
    }
    return () => {
      const el = document.getElementById('green-port-animations');
      if (el) document.head.removeChild(el);
    };
  }, []);
  
  // 예산 부족 시 자동으로 가능한 최대 투자 규모로 조정
  useEffect(() => {
    const canAfford = (size) => INVEST_COSTS[size] <= ports.korea.budget;
    if (!canAfford(investSize)) {
      if (canAfford('대')) setInvestSize('대');
      else if (canAfford('중')) setInvestSize('중');
      else if (canAfford('소')) setInvestSize('소');
      else setInvestSize('없음');
    }
  }, [ports.korea.budget, investSize]);

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '16px', fontFamily: 'system-ui, sans-serif' },
    startContainer: { 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white', 
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    },
    card: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '16px', marginBottom: '12px' },
    button: { width: '100%', backgroundColor: '#eab308', color: 'black', padding: '14px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' },
    buttonSecondary: { backgroundColor: '#374151', color: 'white', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', margin: '4px' },
    buttonSelected: { backgroundColor: '#eab308', color: 'black' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    label: { fontSize: '12px', color: '#94a3b8', marginBottom: '8px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
    vsBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '16px 24px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      marginBottom: '24px'
    },
    flagEmoji: { fontSize: '32px' },
    vsText: { fontSize: '14px', color: '#94a3b8', fontWeight: 'bold' }
  };

  const getMoodStyle = (mood) => {
    const moodStyles = {
      good: { backgroundColor: '#166534', borderLeft: '4px solid #22c55e' },
      warning: { backgroundColor: '#854d0e', borderLeft: '4px solid #eab308' },
      danger: { backgroundColor: '#991b1b', borderLeft: '4px solid #ef4444' },
      crisis: { backgroundColor: '#7c2d12', borderLeft: '4px solid #f97316', boxShadow: '0 0 20px rgba(249,115,22,0.3)' },
      opportunity: { backgroundColor: '#0f766e', borderLeft: '4px solid #2dd4bf', boxShadow: '0 0 20px rgba(45,212,191,0.3)' },
      neutral: { backgroundColor: '#1e3a8a', borderLeft: '4px solid #3b82f6' }
    };
    return moodStyles[mood] || moodStyles.neutral;
  };

  const getInvestEffect = () => {
    const sizeEffect = { '없음': 0, '소': 0.05, '중': 0.15, '대': 0.25 };
    const divisionBonus = { 'M1': 0, 'M2': 0.05, 'M3': -0.02 };
    const baseEffect = sizeEffect[investSize];
    const bonus = divisionBonus[division];
    const methanolRatio = fuelRatio / 100;
    const ammoniaRatio = 1 - methanolRatio;
    return {
      methanol: baseEffect * methanolRatio + bonus * methanolRatio,
      ammonia: baseEffect * ammoniaRatio + bonus * ammoniaRatio
    };
  };

  const executeTurn = () => {
    if (SPECIAL_EVENTS[scenario] && SPECIAL_EVENTS[scenario][turn]) {
      setSpecialEvent(SPECIAL_EVENTS[scenario][turn]);
      setScreen('special');
      return;
    }
    processNormalTurn();
  };

  const processNormalTurn = (specialEffect = null, specialCost = 0) => {
    const event = EVENTS[scenario][turn - 1];
    const oldShares = { ...shares };
    setPrevShares(oldShares);
    const newPorts = JSON.parse(JSON.stringify(ports));
    
    // 플레이어(한국) 투자
    const playerInvestCost = INVEST_COSTS[investSize] + specialCost;
    const playerRevenue = getAnnualRevenue(oldShares.korea);
    const newBudget = newPorts.korea.budget - playerInvestCost + playerRevenue;
    newPorts.korea.budget = newBudget;
    setTotalInvested(prev => prev + playerInvestCost);
    
    // 파산 체크
    if (newBudget <= 0) {
      setPorts(newPorts);
      setBankruptYear(2025 + turn);
      setScreen('bankrupt');
      return;
    }
    
    const investEffect = getInvestEffect();
    newPorts.korea.methanol += investEffect.methanol;
    newPorts.korea.ammonia += investEffect.ammonia;
    
    // 특별 이벤트 효과 적용
    if (specialEffect) {
      Object.keys(specialEffect).forEach(port => {
        if (newPorts[port]) {
          newPorts[port].methanol += specialEffect[port] * 0.5;
          newPorts[port].ammonia += specialEffect[port] * 0.5;
        }
      });
    }
    
    // AI 투자 및 수익 처리
    const aiActionsThisTurn = {};
    ['singapore', 'rotterdam', 'shanghai'].forEach(portKey => {
      const port = newPorts[portKey];
      const revenue = getAnnualRevenue(oldShares[portKey]);
      
      // AI 투자 결정
      const aiDecision = getAIInvestment(port, portKey, oldShares, scenario);
      
      if (aiDecision.investSize) {
        const sizeEffect = { '소': 0.05, '중': 0.15, '대': 0.25 };
        const effect = sizeEffect[aiDecision.investSize];
        newPorts[portKey].methanol += effect * 0.5;
        newPorts[portKey].ammonia += effect * 0.5;
        newPorts[portKey].budget = port.budget - aiDecision.investAmount + revenue;
        
        aiActionsThisTurn[portKey] = {
          investSize: aiDecision.investSize,
          investAmount: aiDecision.investAmount,
          revenue: revenue
        };
      } else {
        newPorts[portKey].budget = port.budget + revenue;
        aiActionsThisTurn[portKey] = {
          investSize: '없음',
          investAmount: 0,
          revenue: revenue
        };
      }
    });
    
    setAiActions(aiActionsThisTurn);
    
    // 이벤트 효과
    if (event.competitorBoost) {
      Object.keys(event.competitorBoost).forEach(port => {
        if (port !== 'korea') {
          newPorts[port].methanol += event.competitorBoost[port] * 0.5;
          newPorts[port].ammonia += event.competitorBoost[port] * 0.5;
        }
      });
    }
    
    if (event.globalBoost) {
      Object.keys(newPorts).forEach(port => {
        if (event.globalBoost.methanol) newPorts[port].methanol += event.globalBoost.methanol;
        if (event.globalBoost.ammonia) newPorts[port].ammonia += event.globalBoost.ammonia;
      });
    }
    
    const finalShares = calculateShares(newPorts);
    
    // 경쟁자 추가 반응 (한국 성장 시)
    const koreaGain = finalShares.korea - oldShares.korea;
    const reactions = [];
    
    if (koreaGain > 1.5 && Math.random() < 0.5) {
      const r = COMPETITOR_REACTIONS.singapore[Math.floor(Math.random() * COMPETITOR_REACTIONS.singapore.length)];
      reactions.push({ port: 'singapore', ...r });
      if (r.boost > 0) {
        newPorts.singapore.methanol += r.boost * 0.3;
        newPorts.singapore.ammonia += r.boost * 0.3;
      }
    }
    if (koreaGain > 1 && Math.random() < 0.4) {
      const r = COMPETITOR_REACTIONS.shanghai[Math.floor(Math.random() * COMPETITOR_REACTIONS.shanghai.length)];
      reactions.push({ port: 'shanghai', ...r });
      if (r.boost > 0) {
        newPorts.shanghai.methanol += r.boost * 0.3;
        newPorts.shanghai.ammonia += r.boost * 0.3;
      }
    }
    
    const finalSharesAfterReaction = calculateShares(newPorts);
    
    setTurnResult({
      turn, year: 2025 + turn, event,
      prevShare: oldShares.korea, newShare: finalSharesAfterReaction.korea,
      change: finalSharesAfterReaction.korea - oldShares.korea,
      reactions, 
      decision: { division, fuelRatio, investSize },
      playerRevenue,
      playerInvestCost,
      aiActions: aiActionsThisTurn,
      prevShares: oldShares
    });
    
    setPorts(newPorts);
    setShares(finalSharesAfterReaction);
    setShareHistory([...shareHistory, finalSharesAfterReaction]);
    setSpecialEvent(null);
    setScreen('result');
  };

  const handleSpecialChoice = (choice) => {
    if (choice.risk && Math.random() < choice.risk) {
      processNormalTurn({ korea: -0.05 }, choice.cost || 0);
    } else {
      processNormalTurn(choice.effect, choice.cost || 0);
    }
  };

  const nextTurn = () => {
    if (turn >= 15) setScreen('final');
    else { setTurn(turn + 1); setTurnResult(null); setScreen('game'); }
  };

  const startGame = (s) => {
    setScenario(s);
    const initialPorts = JSON.parse(JSON.stringify(INITIAL_PORTS));
    const initialShares = calculateShares(initialPorts);
    setPorts(initialPorts);
    setShares(initialShares);
    setShareHistory([initialShares]);
    setPrevShares(null);
    setTurn(1);
    setDivision('M2');
    setFuelRatio(50);
    setInvestSize('중');
    setTotalInvested(0);
    setAiActions({});
    setBankruptYear(null);
    setScreen('game');
  };

  const resetGame = () => {
    setScreen('start');
    const initialPorts = JSON.parse(JSON.stringify(INITIAL_PORTS));
    setPorts(initialPorts);
    setShares(calculateShares(initialPorts));
    setShareHistory([calculateShares(initialPorts)]);
    setPrevShares(null);
    setBankruptYear(null);
  };

  const getGrade = () => {
    const k = shares.korea;
    if (k >= 25) return { grade: '🏆 대성공', msg: '동북아 친환경 벙커링 허브의 선두주자!', color: '#22c55e' };
    if (k >= 20) return { grade: '🥈 성공', msg: '동북아 벙커링 시장의 강자로 자리매김', color: '#3b82f6' };
    if (k >= 15) return { grade: '🥉 보통', msg: '경쟁에서 현 위치를 유지', color: '#eab308' };
    return { grade: '❌ 실패', msg: '시장 점유율 하락, 전략 재검토 필요', color: '#ef4444' };
  };

  const ProgressBar = ({ value, portKey }) => (
    <div style={{ width: '100%', backgroundColor: '#374151', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: '6px', backgroundColor: PORT_COLORS[portKey], width: `${Math.min(value, 100)}%`, transition: 'width 0.5s ease' }} />
    </div>
  );

  const MiniLineChart = ({ history, showChange = false }) => {
    if (!history || history.length < 2) return null;
    
    const width = 200;
    const height = 80;
    const padding = 10;
    
    const allValues = history.flatMap(h => Object.values(h));
    const maxVal = Math.max(...allValues);
    const minVal = Math.min(...allValues);
    const range = maxVal - minVal || 1;
    
    const getY = (val) => height - padding - ((val - minVal) / range) * (height - 2 * padding);
    const getX = (i) => padding + (i / (history.length - 1)) * (width - 2 * padding);
    
    const sortedPorts = Object.keys(INITIAL_PORTS).sort((a, b) => 
      (history[history.length - 1][b] || 0) - (history[history.length - 1][a] || 0)
    );
    
    const labelHeight = 20;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width={width} height={height} style={{ backgroundColor: '#1e293b', borderRadius: '8px' }}>
          {sortedPorts.map(key => {
            const points = history.map((h, i) => `${getX(i)},${getY(h[key] || 0)}`).join(' ');
            return (
              <polyline
                key={key}
                points={points}
                fill="none"
                stroke={PORT_COLORS[key]}
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {showChange && history.length >= 2 && (
          <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
            {sortedPorts.map((key) => {
              const current = history[history.length - 1][key] || 0;
              const prev = history[history.length - 2][key] || 0;
              const change = current - prev;
              return (
                <div key={key} style={{ 
                  color: PORT_COLORS[key], 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  marginBottom: '2px'
                }}>
                  <span>{INITIAL_PORTS[key].flag}</span>
                  <span style={{ color: change >= 0 ? '#4ade80' : '#f87171' }}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const MiniMap = ({ shares, ports: currentPorts }) => {
    const getRadius = (share) => Math.max(16, Math.min(45, share / 1.2));
    
    return (
      <svg width="100%" height="260" viewBox="0 0 400 260" style={{ backgroundColor: '#0c4a6e', borderRadius: '12px', maxWidth: '400px' }}>
        {/* 제목 - 상단 가운데 */}
        <text x="200" y="24" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="bold">글로벌 벙커링 허브 현황</text>
        
        {/* 세계지도 배경 (간략화된 대륙) */}
        {/* 유럽 */}
        <path d="M65 60 Q75 50 90 54 L108 63 Q118 72 114 85 L104 94 Q92 98 80 93 L70 82 Q62 72 65 60" 
              fill="#1e3a5f" opacity="0.5"/>
        {/* 아프리카 */}
        <path d="M90 100 Q100 96 112 102 L118 125 Q114 150 104 160 L88 155 Q80 143 85 122 L90 100" 
              fill="#1e3a5f" opacity="0.5"/>
        {/* 아시아 */}
        <path d="M125 55 Q150 46 195 50 L240 62 Q265 72 272 94 L268 118 Q255 135 228 138 L185 132 Q155 125 135 110 L125 88 Q118 70 125 55" 
              fill="#1e3a5f" opacity="0.5"/>
        {/* 동남아/인도네시아 */}
        <path d="M238 145 Q258 140 275 148 L290 165 Q298 180 290 193 L265 198 Q245 193 240 180 L238 145" 
              fill="#1e3a5f" opacity="0.5"/>
        {/* 호주 */}
        <path d="M300 175 Q325 167 350 175 L365 200 Q370 225 358 238 L325 242 Q298 235 294 210 L300 175" 
              fill="#1e3a5f" opacity="0.5"/>
        {/* 북미 */}
        <path d="M-5 50 Q25 40 52 50 L72 75 Q82 100 72 120 L45 136 Q20 132 2 110 L-5 78 Q-15 62 -5 50" 
              fill="#1e3a5f" opacity="0.5"/>
        {/* 남미 */}
        <path d="M35 155 Q52 146 70 155 L78 188 Q74 228 62 250 L42 255 Q28 243 35 210 L35 155" 
              fill="#1e3a5f" opacity="0.5"/>
        
        {/* 항로 연결선 */}
        <line x1="88" y1="78" x2="295" y2="195" stroke="#1e40af" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>
        <line x1="210" y1="90" x2="295" y2="195" stroke="#1e40af" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>
        <line x1="210" y1="90" x2="245" y2="122" stroke="#1e40af" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>
        <line x1="88" y1="78" x2="210" y2="90" stroke="#1e40af" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>
        
        {/* 로테르담 (유럽) - 애니메이션 */}
        <circle cx="88" cy="78" r={getRadius(shares.rotterdam)} fill={PORT_COLORS.rotterdam} style={{ transition: 'r 0.8s ease-out' }}>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="88" y="52" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">NL</text>
        <text x="60" y="82" textAnchor="end" fill="white" fontSize="13">{shares.rotterdam.toFixed(1)}%</text>
        
        {/* 한국 - 강조 테두리 + 펄스 애니메이션 */}
        <circle cx="210" cy="90" r={getRadius(shares.korea) + 6} fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="6,3">
          <animate attributeName="stroke-dashoffset" values="0;18" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="210" cy="90" r={getRadius(shares.korea)} fill={PORT_COLORS.korea} style={{ transition: 'r 0.8s ease-out' }}>
          <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="210" y="62" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">KR</text>
        <text x="240" y="86" textAnchor="start" fill="#eab308" fontSize="14" fontWeight="bold">{shares.korea.toFixed(1)}%</text>
        
        {/* 상하이 - 애니메이션 */}
        <circle cx="245" cy="122" r={getRadius(shares.shanghai)} fill={PORT_COLORS.shanghai} style={{ transition: 'r 0.8s ease-out' }}>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <text x="275" y="118" textAnchor="start" fill="white" fontSize="13">CN</text>
        <text x="275" y="134" textAnchor="start" fill="white" fontSize="13">{shares.shanghai.toFixed(1)}%</text>
        
        {/* 싱가포르 - 애니메이션 */}
        <circle cx="295" cy="195" r={getRadius(shares.singapore)} fill={PORT_COLORS.singapore} style={{ transition: 'r 0.8s ease-out' }}>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>
        <text x="295" y="168" textAnchor="middle" fill="white" fontSize="14">SG</text>
        <text x="295" y="228" textAnchor="middle" fill="white" fontSize="13">{shares.singapore.toFixed(1)}%</text>
        
        {/* 설명 - 우측 하단 */}
        <text x="392" y="252" textAnchor="end" fill="#64748b" fontSize="11">원 크기 = 시장 점유율</text>
      </svg>
    );
  };

  // 시나리오별 성장률 설정
  const GROWTH_CONFIG = {
    A: { base: 100, variance: 30, name: '안정 성장' },   // 보통 성장
    B: { base: 150, variance: 50, name: '급속 성장' },   // IMO 강화 → 빠른 성장  
    C: { base: 80, variance: 40, name: '불확실 성장' }   // 경쟁 심화 → 변동 큼
  };
  
  // 이벤트별 선박 수 영향
  const getEventShipEffect = (event) => {
    if (!event) return 0;
    const title = event.title;
    
    // 긍정적 이벤트 → 선박 증가
    if (title.includes('발주 폭증') || title.includes('수요 급증')) return 80;
    if (title.includes('수요') && title.includes('+')) return 40;
    if (title.includes('IMO') && title.includes('강화')) return 60;
    if (title.includes('의무화')) return 50;
    
    // 부정적 이벤트 → 선박 감소/정체
    if (title.includes('침체') || title.includes('위기')) return -40;
    if (title.includes('지연') || title.includes('연기')) return -20;
    if (title.includes('사고') || title.includes('폭발')) return -30;
    
    // 중립
    return 0;
  };
  
  // 전체 선박 수 계산 (시나리오 + 이벤트 반영)
  const getTotalShips = (currentTurn, currentScenario) => {
    const baseShips = 1000; // 2026년 기준
    
    if (!currentScenario || currentTurn <= 1) return baseShips;
    
    const config = GROWTH_CONFIG[currentScenario] || GROWTH_CONFIG.A;
    let totalShips = baseShips;
    
    // 각 턴별 성장 계산 (이벤트 영향 포함)
    for (let t = 1; t < currentTurn; t++) {
      const event = EVENTS[currentScenario]?.[t - 1];
      const eventEffect = getEventShipEffect(event);
      
      // 기본 성장 + 랜덤 변동 (시드 기반으로 일관성 유지)
      const seed = t * 1000 + currentScenario.charCodeAt(0);
      const pseudoRandom = Math.sin(seed) * 0.5 + 0.5; // 0~1
      const variance = (pseudoRandom - 0.5) * 2 * config.variance;
      
      const yearlyGrowth = Math.round(config.base + variance + eventEffect);
      totalShips += Math.max(0, yearlyGrowth); // 음수 방지
    }
    
    return totalShips;
  };
  
  // 점유율 기반 선박 수 계산
  const getShipCount = (share, totalShips) => {
    return Math.round(totalShips * share / 100);
  };
  
  // 선박 아이콘 바 생성
  const ShipBar = ({ count, maxCount, color, isKorea }) => {
    const shipCount = Math.min(10, Math.ceil(count / maxCount * 10)); // 최대 10개 아이콘
    return (
      <div style={{ display: 'flex', gap: '1px', alignItems: 'center' }}>
        {[...Array(shipCount)].map((_, i) => (
          <span key={i} style={{ 
            fontSize: '10px', 
            opacity: isKorea ? 1 : 0.7,
            filter: isKorea ? 'none' : 'grayscale(30%)'
          }}>🚢</span>
        ))}
        <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '4px' }}>{count}척</span>
      </div>
    );
  };

  // 국가별 현황 테이블
  const CountryStatusTable = ({ shares, ports: currentPorts, prevShares: oldShares, currentTurn, currentScenario }) => {
    const sortedKeys = Object.keys(shares).sort((a, b) => shares[b] - shares[a]);
    const totalShips = getTotalShips(currentTurn || 1, currentScenario);
    const prevTotalShips = getTotalShips((currentTurn || 1) - 1, currentScenario);
    const shipGrowth = totalShips - prevTotalShips;
    const maxShipCount = getShipCount(Math.max(...Object.values(shares)), totalShips);
    
    return (
      <div style={{ ...styles.card, padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>📊 각국 현황</span>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>🚢 친환경 급유선박 {totalShips.toLocaleString()}척</span>
            {shipGrowth !== 0 && (
              <span style={{ 
                fontSize: '11px', 
                marginLeft: '6px',
                color: shipGrowth > 0 ? '#4ade80' : '#f87171' 
              }}>
                ({shipGrowth > 0 ? '+' : ''}{shipGrowth})
              </span>
            )}
          </div>
        </div>
        <div style={{ fontSize: '13px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 2.5fr 0.8fr 1fr 0.8fr', gap: '6px', marginBottom: '10px', color: '#64748b', borderBottom: '1px solid #374151', paddingBottom: '8px' }}>
            <span>국가</span>
            <span>급유선박</span>
            <span style={{ textAlign: 'right' }}>점유율</span>
            <span style={{ textAlign: 'right' }}>예산</span>
            <span style={{ textAlign: 'right' }}>변동</span>
          </div>
          {sortedKeys.map(key => {
            const change = oldShares ? shares[key] - oldShares[key] : 0;
            const shipCount = getShipCount(shares[key], totalShips);
            return (
              <div key={key} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.8fr 2.5fr 0.8fr 1fr 0.8fr', 
                gap: '6px', 
                padding: '8px 0',
                backgroundColor: key === 'korea' ? 'rgba(234,179,8,0.1)' : 'transparent',
                borderRadius: '6px',
                alignItems: 'center'
              }}>
                <span style={{ color: PORT_COLORS[key], fontWeight: key === 'korea' ? 'bold' : 'normal', fontSize: '13px' }}>
                  {INITIAL_PORTS[key].flag} {INITIAL_PORTS[key].name}
                </span>
                <ShipBar count={shipCount} maxCount={maxShipCount} color={PORT_COLORS[key]} isKorea={key === 'korea'} />
                <span style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>{shares[key].toFixed(1)}%</span>
                <span style={{ textAlign: 'right', color: '#fbbf24', fontSize: '13px' }}>{currentPorts[key].budget}억</span>
                <span style={{ textAlign: 'right', color: change >= 0 ? '#4ade80' : '#f87171', fontSize: '13px' }}>
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 국기 컴포넌트 (물방울 스타일)
  const FlagBubble = ({ country, size = 40 }) => {
    const flagStyles = {
      korea: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          {/* 태극 */}
          <circle cx="20" cy="20" r="8" fill="#c60c30"/>
          <path d="M20 12 A8 8 0 0 1 20 28 A4 4 0 0 1 20 20 A4 4 0 0 0 20 12" fill="#003478"/>
          {/* 건곤감리 간략화 */}
          <rect x="6" y="8" width="6" height="2" fill="#000"/>
          <rect x="6" y="12" width="6" height="2" fill="#000"/>
          <rect x="28" y="26" width="6" height="2" fill="#000"/>
          <rect x="28" y="30" width="6" height="2" fill="#000"/>
        </svg>
      ),
      singapore: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <path d="M2 20 A18 18 0 0 1 38 20 Z" fill="#ed2939"/>
          {/* 초승달 */}
          <circle cx="14" cy="14" r="5" fill="white"/>
          <circle cx="16" cy="14" r="4" fill="#ed2939"/>
          {/* 별들 */}
          <circle cx="22" cy="10" r="1.2" fill="white"/>
          <circle cx="26" cy="12" r="1.2" fill="white"/>
          <circle cx="28" cy="16" r="1.2" fill="white"/>
          <circle cx="24" cy="18" r="1.2" fill="white"/>
          <circle cx="20" cy="16" r="1.2" fill="white"/>
        </svg>
      ),
      china: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="#de2910" stroke="#e5e7eb" strokeWidth="1"/>
          {/* 큰 별 */}
          <polygon points="10,14 12,18 16,18 13,21 14,25 10,22 6,25 7,21 4,18 8,18" fill="#ffde00"/>
          {/* 작은 별들 */}
          <circle cx="18" cy="8" r="2" fill="#ffde00"/>
          <circle cx="22" cy="10" r="2" fill="#ffde00"/>
          <circle cx="22" cy="15" r="2" fill="#ffde00"/>
          <circle cx="18" cy="18" r="2" fill="#ffde00"/>
        </svg>
      ),
      netherlands: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <defs>
            <clipPath id="nlCircle">
              <circle cx="20" cy="20" r="18"/>
            </clipPath>
          </defs>
          <circle cx="20" cy="20" r="18" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <g clipPath="url(#nlCircle)">
            <rect x="0" y="2" width="40" height="12" fill="#ae1c28"/>
            <rect x="0" y="14" width="40" height="12" fill="white"/>
            <rect x="0" y="26" width="40" height="12" fill="#21468b"/>
          </g>
        </svg>
      )
    };
    
    return (
      <div style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {flagStyles[country]}
      </div>
    );
  };

  // 시작 화면
  if (screen === 'start') {
    return (
      <div style={styles.startContainer}>
        <div style={{ position: 'absolute', top: '8%', left: '5%', fontSize: '60px', opacity: 0.15, animation: 'flyIn 2s ease-out, pulse 3s infinite 2s' }}>🚢</div>
        <div style={{ position: 'absolute', top: '18%', right: '8%', fontSize: '50px', opacity: 0.15, animation: 'bounceIn 1s ease-out 0.3s both, pulse 3s infinite 1.3s' }}>⚓</div>
        <div style={{ position: 'absolute', bottom: '28%', left: '6%', fontSize: '55px', opacity: 0.15, animation: 'bounceIn 1s ease-out 0.6s both, pulse 3s infinite 1.6s' }}>🛢️</div>
        <div style={{ position: 'absolute', bottom: '12%', right: '5%', fontSize: '65px', opacity: 0.15, animation: 'bounceIn 1s ease-out 0.9s both, pulse 3s infinite 1.9s' }}>🌊</div>
        <div style={{ position: 'absolute', top: '50%', left: '3%', fontSize: '45px', opacity: 0.1, animation: 'flyIn 2.5s ease-out 0.5s both, pulse 4s infinite 2.5s' }}>🚢</div>
        <div style={{ position: 'absolute', bottom: '35%', right: '3%', fontSize: '40px', opacity: 0.1, animation: 'flyIn 2.5s ease-out 0.8s both, pulse 4s infinite 2.8s' }}>🚢</div>
        
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '360px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚓</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '3px', marginBottom: '4px' }}>STRATEGY SIMULATION</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(90deg, #eab308, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GREEN PORT</h1>
          <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '24px' }}>동북아 친환경 벙커링 허브를 선점하라</p>
          
          {/* 국기 물방울 스타일 VS 구도 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            marginBottom: '24px'
          }}>
            <FlagBubble country="korea" size={44} />
            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 'bold' }}>vs</span>
            <FlagBubble country="singapore" size={36} />
            <FlagBubble country="china" size={36} />
            <FlagBubble country="netherlands" size={36} />
          </div>
          
          <button 
            onClick={() => setScreen('scenario')} 
            style={{ 
              ...styles.button, 
              background: 'linear-gradient(90deg, #eab308, #f59e0b)',
              fontSize: '18px',
              padding: '16px 32px',
              borderRadius: '50px'
            }}
          >
            🎮 게임 시작
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
            <span>📅 2026-2040</span>
            <span>🎯 15년 전략</span>
            <span>⚡ 실시간 경쟁</span>
          </div>
        </div>
        
        {/* KMI 로고 - 물방울 스타일 원형 */}
        <div style={{ 
          marginTop: '32px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <img 
            src="data:image/webp;base64,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" 
            alt="KMI 로고" 
            style={{ height: '45px', objectFit: 'contain' }}
          />
        </div>
      </div>
    );
  }

  // 시나리오 선택
  if (screen === 'scenario') {
    return (
      <div style={styles.container}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>시나리오 선택</h2>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <button onClick={() => startGame('A')} style={{ width: '100%', padding: '20px', backgroundColor: '#166534', borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '12px', color: 'white' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>🌤️ EASY - 보수 시나리오</div>
            <div style={{ fontSize: '13px', color: '#86efac' }}>규제 지연 · 느린 전환 · 경쟁 완만</div>
          </button>
          <button onClick={() => startGame('B')} style={{ width: '100%', padding: '20px', backgroundColor: '#1e40af', borderRadius: '12px', border: '2px solid #eab308', cursor: 'pointer', textAlign: 'left', marginBottom: '12px', color: 'white' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>⛅ NORMAL - 기준 시나리오 <span style={{ fontSize: '10px', backgroundColor: '#eab308', color: 'black', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>추천</span></div>
            <div style={{ fontSize: '13px', color: '#93c5fd' }}>IMO/EU 예정대로 · 표준 전환 · 적정 경쟁</div>
          </button>
          <button onClick={() => startGame('C')} style={{ width: '100%', padding: '20px', backgroundColor: '#991b1b', borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '12px', color: 'white' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>🌩️ HARD - 적극 시나리오</div>
            <div style={{ fontSize: '13px', color: '#fca5a5' }}>규제 강화 · 빠른 전환 · 치열한 경쟁</div>
          </button>
        </div>
        <button onClick={() => setScreen('start')} style={{ ...styles.buttonSecondary, display: 'block', margin: '16px auto' }}>← 뒤로</button>
      </div>
    );
  }

  // 특별 이벤트
  if (screen === 'special' && specialEvent) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>특별 상황 발생!</h2>
        </div>
        
        <div style={{ ...styles.card, ...getMoodStyle('crisis'), padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{specialEvent.title}</h3>
          <p style={{ color: '#fbbf24', marginBottom: '8px' }}>현재 예산: {ports.korea.budget}억원</p>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          {specialEvent.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => handleSpecialChoice(choice)}
              disabled={choice.cost && choice.cost > ports.korea.budget}
              style={{
                ...styles.card,
                width: '100%',
                textAlign: 'left',
                cursor: choice.cost && choice.cost > ports.korea.budget ? 'not-allowed' : 'pointer',
                opacity: choice.cost && choice.cost > ports.korea.budget ? 0.5 : 1,
                border: 'none',
                marginBottom: '8px'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{choice.text}</div>
              {choice.cost && <div style={{ fontSize: '12px', color: '#ef4444' }}>비용: {choice.cost}억원</div>}
              {choice.risk && <div style={{ fontSize: '12px', color: '#eab308' }}>⚠️ 실패 위험: {choice.risk * 100}%</div>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 메인 게임
  if (screen === 'game') {
    const event = EVENTS[scenario][turn - 1];
    const currentBudget = ports.korea.budget;
    const canAfford = (size) => INVEST_COSTS[size] <= currentBudget;
    const annualRevenue = getAnnualRevenue(shares.korea);
    
    // 현재 선택한 투자가 예산 초과인지 확인
    const currentInvestCost = INVEST_COSTS[investSize];
    const canProceed = currentInvestCost <= currentBudget;
    
    // M1/M2/M3별 연료 배분 설명
    const getDivisionFuelDesc = (m) => {
      if (m === 'M1') return `메탄올 ${fuelRatio}%`;
      if (m === 'M2') return `메탄올 ${fuelRatio}% + 암모니아 ${100-fuelRatio}%`;
      if (m === 'M3') return `암모니아 ${100-fuelRatio}%`;
      return '';
    };
    
    return (
      <div style={{ ...styles.container, paddingBottom: '100px' }}>
        <div style={{ ...styles.header, marginBottom: '20px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>⚓ GREEN PORT</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '24px' }}>{2025 + turn}년</div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>{turn}/15턴</div>
          </div>
        </div>
        
        {/* 국가별 현황 테이블 */}
        <CountryStatusTable shares={shares} ports={ports} prevShares={prevShares} currentTurn={turn} currentScenario={scenario} />
        
        {/* 지도 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <MiniMap shares={shares} ports={ports} />
        </div>
        
        {/* 뉴스 - 슬라이드 애니메이션 (더 화려하게) */}
        <div style={{ 
          ...styles.card, 
          ...getMoodStyle(event.mood), 
          padding: '20px', 
          marginBottom: '16px',
          animation: 'newsAlert 0.8s ease-out'
        }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>📰 {2025 + turn}년 뉴스</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ 
              fontSize: '48px',
              display: 'inline-block',
              animation: event.mood === 'good' ? 'zoomPulse 1s infinite' : event.mood === 'danger' ? 'dangerPulse 0.5s infinite' : 'pulse 2s infinite'
            }}>
              {event.mood === 'good' ? '📈' : event.mood === 'danger' ? '🚨' : event.mood === 'warning' ? '⚡' : '📰'}
            </span>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px', animation: 'fadeIn 0.5s ease-out 0.3s both' }}>"{event.title}"</div>
              <div style={{ fontSize: '15px', opacity: 0.9, marginTop: '6px', animation: 'fadeIn 0.5s ease-out 0.5s both' }}>→ {event.effect}</div>
            </div>
          </div>
        </div>
        
        {/* 전략 결정 */}
        <div style={{ ...styles.card, padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🎯 전략 결정</span>
            <div style={{ fontSize: '15px' }}>
              <span style={{ color: currentBudget < 100 ? '#ef4444' : '#fbbf24', fontWeight: 'bold' }}>💰 {currentBudget}억</span>
              <span style={{ color: '#4ade80', marginLeft: '12px' }}>+{annualRevenue}억/년</span>
            </div>
          </div>
          
          {/* 예산 부족 경고 (100억 미만일 때만) */}
          {currentBudget < 100 && (
            <div style={{ 
              backgroundColor: '#7f1d1d', 
              border: '1px solid #ef4444',
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '16px',
              fontSize: '14px',
              color: '#fca5a5'
            }}>
              ⚠️ 예산 부족! 이번 턴은 투자 없이 수익만 받습니다.
            </div>
          )}
          
          {/* 분업 전략 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>분업 전략</div>
            <div style={styles.grid3}>
              {['M1', 'M2', 'M3'].map(m => (
                <button key={m} onClick={() => setDivision(m)}
                  style={{ 
                    ...styles.buttonSecondary, 
                    ...(division === m ? styles.buttonSelected : {}),
                    padding: '14px 8px'
                  }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{m}</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>{m === 'M1' ? '울산단독' : m === 'M2' ? '분업' : '부산단독'}</div>
                  <div style={{ 
                    fontSize: '10px', 
                    marginTop: '6px', 
                    color: division === m ? '#000' : '#94a3b8',
                    fontWeight: division === m ? 'bold' : 'normal',
                    lineHeight: '1.3'
                  }}>
                    {m === 'M1' && `메탄올 ${fuelRatio}%`}
                    {m === 'M1' && <br />}
                    {m === 'M1' && `암모니아 ${100-fuelRatio}%`}
                    {m === 'M2' && `부산-메탄올 ${fuelRatio}%`}
                    {m === 'M2' && <br />}
                    {m === 'M2' && `울산-암모니아 ${100-fuelRatio}%`}
                    {m === 'M3' && `메탄올 ${fuelRatio}%`}
                    {m === 'M3' && <br />}
                    {m === 'M3' && `암모니아 ${100-fuelRatio}%`}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* 투자 배분 슬라이더 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>투자 배분:</span> 메탄올 {fuelRatio}% : 암모니아 {100-fuelRatio}%
            </div>
            <input type="range" min="0" max="100" step="25" value={fuelRatio}
              onChange={(e) => setFuelRatio(Number(e.target.value))} 
              style={{ width: '100%', height: '8px' }} />
          </div>
          
          {/* 투자 규모 */}
          <div>
            <div style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>투자 규모</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { key: '없음', label: '없음', cost: 0 },
                { key: '소', label: '소형', cost: 100 },
                { key: '중', label: '중형', cost: 300 },
                { key: '대', label: '대형', cost: 500 }
              ].map(s => (
                <button key={s.key} onClick={() => canAfford(s.key) && setInvestSize(s.key)}
                  style={{ 
                    ...styles.buttonSecondary, 
                    ...(investSize === s.key ? styles.buttonSelected : {}),
                    opacity: canAfford(s.key) ? 1 : 0.4,
                    cursor: canAfford(s.key) ? 'pointer' : 'not-allowed',
                    padding: '14px 8px'
                  }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{s.label}</div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>{s.cost}억</div>
                  {!canAfford(s.key) && s.key !== '없음' && (
                    <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>예산부족</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 하단 고정 버튼 */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          padding: '16px',
          backgroundColor: '#0f172a',
          borderTop: '1px solid #1e293b'
        }}>
          <button 
            onClick={canProceed ? executeTurn : undefined} 
            disabled={!canProceed}
            style={{ 
              ...styles.button,
              opacity: canProceed ? 1 : 0.5,
              cursor: canProceed ? 'pointer' : 'not-allowed',
              backgroundColor: canProceed ? '#eab308' : '#6b7280',
              fontSize: '18px',
              padding: '18px',
              borderRadius: '50px'
            }}
          >
            {canProceed ? '내년으로 →' : '⚠️ 투자 규모를 조정하세요'}
          </button>
        </div>
      </div>
    );
  }

  // 턴 결과
  if (screen === 'result' && turnResult) {
    const totalShips = getTotalShips(turn, scenario);
    const prevTotalShips = getTotalShips(turn - 1, scenario);
    const newShips = totalShips - prevTotalShips;
    
    // 이벤트 영향 표시
    const eventEffect = getEventShipEffect(turnResult.event);
    
    // 각 항만별 선박 변화 계산
    const getShipChange = (key) => {
      const prevShipCount = Math.round(prevTotalShips * turnResult.prevShares[key] / 100);
      const newShipCount = Math.round(totalShips * shares[key] / 100);
      return newShipCount - prevShipCount;
    };
    
    const koreaShipChange = getShipChange('korea');
    const isSuccess = koreaShipChange >= 0;
    
    // 한국 카드 애니메이션 (결과 크기에 따라 강도 조절, 딜레이 0.8초)
    const getKoreaAnimation = () => {
      const absChange = Math.abs(koreaShipChange);
      if (isSuccess) {
        if (absChange >= 20) return 'glowLarge 1.5s infinite 0.8s';
        if (absChange >= 10) return 'glowMedium 2s infinite 0.8s';
        return 'glowSmall 2.5s infinite 0.8s';
      } else {
        if (absChange >= 20) return 'shakeLarge 0.6s ease-in-out 0.8s 3';
        if (absChange >= 10) return 'shakeMedium 0.8s ease-in-out 0.8s 2';
        return 'shakeSmall 1s ease-in-out 0.8s 2';
      }
    };
    
    return (
      <div style={styles.container}>
        {/* 제목 - 0초 */}
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          textAlign: 'center'
        }}>
          {isSuccess ? '🎉' : '😰'} {turnResult.year}년 결과
        </h2>
        
        {/* 선박 이동 현황 카드 - 고정 위치 */}
        <div style={{ 
          ...styles.card, 
          background: isSuccess 
            ? 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(30,41,59,1) 100%)' 
            : 'linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(30,41,59,1) 100%)',
          border: isSuccess ? '2px solid rgba(34,197,94,0.5)' : '2px solid rgba(239,68,68,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🚢 급유선박 선택 현황</span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>총 {totalShips.toLocaleString()}척</span>
          </div>
          
          {/* 시장 변화 요약 - 0.3초 후 */}
          <div style={{ 
            fontSize: '14px', 
            color: newShips > 100 ? '#4ade80' : newShips < 50 ? '#f87171' : '#94a3b8',
            marginBottom: '12px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '8px'
          }}>
            {newShips > 0 ? '📈' : '📉'} 올해 {newShips > 0 ? '+' : ''}{newShips}척 
            {eventEffect !== 0 && (
              <span style={{ marginLeft: '8px', color: eventEffect > 0 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
                (이벤트 영향: {eventEffect > 0 ? '+' : ''}{eventEffect})
              </span>
            )}
          </div>
          
          {/* 한국 선박 변화 - 0.8초 후 글로우/흔들림 시작 */}
          <div style={{ 
            backgroundColor: 'rgba(234,179,8,0.25)', 
            borderRadius: '12px', 
            padding: '14px',
            marginBottom: '12px',
            border: '2px solid rgba(234,179,8,0.5)',
            animation: getKoreaAnimation()
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '32px' }}>🇰🇷</span>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#eab308', fontSize: '16px' }}>한국</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {getShipCount(turnResult.prevShare, prevTotalShips)}척 → {getShipCount(turnResult.newShare, totalShips)}척
                  </div>
                </div>
              </div>
              <div>
                {/* 선박 페이드 애니메이션 - 1.0초 후 */}
                <ShipAnimation change={koreaShipChange} delay={1.0} />
              </div>
            </div>
          </div>
          
          {/* 다른 항만 선박 변화 - 모바일 대응 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['singapore', 'shanghai', 'rotterdam'].map((key, index) => {
              const shipChange = getShipChange(key);
              return (
                <div key={key} style={{ 
                  backgroundColor: '#374151', 
                  borderRadius: '10px', 
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: PORT_COLORS[key], fontWeight: 'bold' }}>
                    {INITIAL_PORTS[key].flag} {INITIAL_PORTS[key].name}
                  </div>
                  <ShipAnimation change={shipChange} delay={1.5 + index * 0.3} />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 당신의 선택 - 고정 위치 */}
        <div style={styles.card}>
          <div style={styles.label}>🇰🇷 당신의 선택</div>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>{turnResult.decision.division} / 메탄올 {turnResult.decision.fuelRatio}% / {turnResult.decision.investSize}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            투자: -{turnResult.playerInvestCost}억 | 수익: +{turnResult.playerRevenue}억 | 잔액: {ports.korea.budget}억
          </div>
        </div>
        
        {/* 경쟁국 투자 현황 - 고정 위치 */}
        <div style={styles.card}>
          <div style={styles.label}>🌍 경쟁국 투자 현황</div>
          {['singapore', 'shanghai', 'rotterdam'].map((key, index) => {
            const action = turnResult.aiActions[key];
            if (!action) return null;
            return (
              <div key={key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px',
                backgroundColor: '#374151',
                borderRadius: '8px',
                marginBottom: '6px'
              }}>
                <span style={{ color: PORT_COLORS[key] }}>
                  {INITIAL_PORTS[key].flag} {INITIAL_PORTS[key].name}
                </span>
                <div style={{ fontSize: '12px', textAlign: 'right' }}>
                  <div>투자: {action.investSize} ({action.investAmount}억)</div>
                  <div style={{ color: '#4ade80' }}>수익: +{action.revenue}억</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 경쟁자 추가 반응 - 고정 위치, 2.5초 후 흔들림 */}
        {turnResult.reactions.length > 0 && (
          <div style={styles.card}>
            <div style={styles.label}>⚔️ 경쟁자 특별 반응</div>
            {turnResult.reactions.map((r, i) => (
              <div key={i} style={{ 
                backgroundColor: '#374151', 
                borderRadius: '12px', 
                padding: '14px', 
                marginBottom: '8px',
                border: '1px solid rgba(239,68,68,0.3)',
                animation: `shakeMedium 0.8s ease-in-out ${2.5 + i * 0.4}s 2`
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '6px', color: PORT_COLORS[r.port], fontSize: '16px' }}>
                  {INITIAL_PORTS[r.port].flag} {INITIAL_PORTS[r.port].name}
                </div>
                <div style={{ fontSize: '15px' }}>
                  "{r.action}"
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 점유율 변화 + 그래프 - 고정 위치, 3.0초 후 숫자 카운트업 */}
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
              한국: {turnResult.prevShare.toFixed(1)}% → <AnimatedNumber value={turnResult.newShare} suffix="%" duration={1500} />
            </span>
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '18px', 
              color: turnResult.change >= 0 ? '#4ade80' : '#f87171'
            }}>
              ({turnResult.change >= 0 ? '+' : ''}{turnResult.change.toFixed(1)}%p)
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <MiniLineChart history={shareHistory} showChange={true} />
          </div>
          
          {Object.keys(shares).sort((a, b) => shares[b] - shares[a]).map((key, index) => (
            <div key={key} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                <span style={{ color: PORT_COLORS[key] }}>{INITIAL_PORTS[key].flag} {INITIAL_PORTS[key].name}</span>
                <span><AnimatedNumber value={shares[key]} suffix="%" duration={1200} /></span>
              </div>
              <ProgressBar value={shares[key]} portKey={key} />
            </div>
          ))}
        </div>
        
        <button onClick={nextTurn} style={styles.button}>
          {turn >= 15 ? '최종 결과 보기' : '내년으로 →'}
        </button>
      </div>
    );
  }

  // 파산 화면
  if (screen === 'bankrupt') {
    return (
      <div style={{ 
        ...styles.container, 
        background: 'linear-gradient(180deg, #450a0a 0%, #0f172a 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>💀</div>
        <div style={{ 
          fontSize: '14px', 
          color: '#ef4444', 
          letterSpacing: '4px', 
          marginBottom: '8px' 
        }}>
          GAME OVER
        </div>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#fca5a5',
          marginBottom: '16px'
        }}>
          파산
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#fecaca',
          marginBottom: '32px'
        }}>
          {bankruptYear}년, 한국 항만은 재정 파탄으로<br/>
          벙커링 사업에서 철수했습니다.
        </p>
        
        <div style={{ 
          ...styles.card, 
          backgroundColor: 'rgba(127, 29, 29, 0.5)',
          border: '1px solid #ef4444',
          padding: '24px',
          marginBottom: '24px',
          maxWidth: '320px'
        }}>
          <div style={{ color: '#fca5a5', marginBottom: '12px' }}>📊 최종 기록</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
            <div>
              <div style={{ color: '#94a3b8' }}>생존 기간</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{turn}년</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8' }}>최종 점유율</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{shares.korea.toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8' }}>총 투자액</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>{totalInvested}억</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8' }}>최종 예산</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>{ports.korea.budget}억</div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: '#94a3b8',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '8px'
        }}>
          💡 <strong>교훈:</strong> 과도한 투자는 재정 위기를 초래합니다.<br/>
          점유율과 예산의 균형을 맞추세요.
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', maxWidth: '320px' }}>
          <button onClick={resetGame} style={styles.buttonSecondary}>
            🔄 처음부터
          </button>
          <button onClick={() => setScreen('scenario')} style={styles.button}>
            🎯 재도전
          </button>
        </div>
      </div>
    );
  }

  // 최종 결과
  if (screen === 'final') {
    const { grade, msg, color } = getGrade();
    const sorted = Object.keys(shares).sort((a, b) => shares[b] - shares[a]);
    
    return (
      <div style={{ 
        ...styles.container, 
        background: shares.korea >= 20 ? 'linear-gradient(180deg, #14532d 0%, #0f172a 100%)' : 'linear-gradient(180deg, #581c87 0%, #0f172a 100%)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', letterSpacing: '3px', marginBottom: '8px' }}>🏁 GAME OVER</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>2040년 최종 결과</h2>
        </div>
        
        <div style={{ 
          ...styles.card, 
          textAlign: 'center', 
          padding: '32px',
          border: `2px solid ${color}`,
          boxShadow: `0 0 30px ${color}40`
        }}>
          <div style={{ color: '#94a3b8', marginBottom: '8px' }}>최종 점유율</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px', color }}>{shares.korea.toFixed(1)}%</div>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>{grade}</div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>{msg}</div>
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#94a3b8' }}>
            총 투자: {totalInvested}억원 | 최종 예산: {ports.korea.budget}억원
          </div>
        </div>
        
        {/* 최종 국가별 현황 */}
        <div style={styles.card}>
          <div style={styles.label}>💰 최종 재정 현황</div>
          {sorted.map((key, i) => (
            <div key={key} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px 0', 
              color: key === 'korea' ? '#eab308' : 'white',
              borderBottom: i < 3 ? '1px solid #374151' : 'none'
            }}>
              <span>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}위`} {INITIAL_PORTS[key].flag} {INITIAL_PORTS[key].name}
              </span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 'bold' }}>{shares[key].toFixed(1)}%</span>
                <span style={{ marginLeft: '12px', color: '#fbbf24', fontSize: '12px' }}>{ports[key].budget}억</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* 점유율 추이 그래프 */}
        <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={styles.label}>📈 15년간 점유율 추이</div>
          <MiniLineChart history={shareHistory} showChange={true} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button onClick={resetGame} style={styles.buttonSecondary}>🔄 처음부터</button>
          <button onClick={() => setScreen('scenario')} style={styles.button}>🎯 다른 시나리오</button>
        </div>
      </div>
    );
  }

  return null;
}
