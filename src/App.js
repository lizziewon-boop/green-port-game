import React, { useState } from "react";

const INITIAL_PORTS = {
  singapore: { name: "싱가포르", flag: "🇸🇬", ascBase: 0, methanol: 0.3, ammonia: 0.2, color: "#10b981", x: 160, y: 280 },
  rotterdam: { name: "로테르담", flag: "🇳🇱", ascBase: -0.76, methanol: 0.3, ammonia: 0.15, color: "#f97316", x: 40, y: 60 },
  korea: { name: "한국", flag: "🇰🇷", ascBase: -0.96, methanol: 0.1, ammonia: 0, color: "#eab308", x: 260, y: 100 },
  shanghai: { name: "상하이", flag: "🇨🇳", ascBase: -1.28, methanol: 0.05, ammonia: 0, color: "#ef4444", x: 240, y: 160 }
};

const EVENTS = {
  A: [
    { year: 2026, title: "FuelEU 시행 유예 논의", effect: "메탄올 수요 +2%", type: "normal", icon: "📋", mood: "neutral" },
    { year: 2027, title: "EU ETS 해운 적용 축소", effect: "전환 수요 +3%", type: "normal", icon: "📉", mood: "warning" },
    { year: 2028, title: "기술 개발 지연", effect: "변화 없음", type: "normal", icon: "🔧", mood: "neutral" },
    { year: 2029, title: "글로벌 경기 침체", effect: "전체 수요 -5%", type: "normal", icon: "📉", mood: "danger" },
    { year: 2030, title: "IMO 목표 완화 논의", effect: "전환 수요 +2%", type: "normal", icon: "🏛️", mood: "neutral" },
    { year: 2031, title: "메탄올 가격 급등", effect: "메탄올 수요 -5%", type: "normal", icon: "💰", mood: "danger" },
    { year: 2032, title: "암모니아 상용화 지연", effect: "변화 없음", type: "normal", icon: "⏳", mood: "warning" },
    { year: 2033, title: "기존 연료 가격 하락", effect: "전환 수요 -3%", type: "normal", icon: "⛽", mood: "warning" },
    { year: 2034, title: "싱가포르 투자 축소", effect: "경쟁 완화", type: "normal", icon: "📊", mood: "good", competitorBoost: { singapore: 0.05 } },
    { year: 2035, title: "EU 규제 2단계 유예", effect: "전환 수요 +3%", type: "normal", icon: "🇪🇺", mood: "neutral" },
    { year: 2036, title: "암모니아 기술 점진 발전", effect: "암모니아 수요 +5%", type: "normal", icon: "🔬", mood: "good" },
    { year: 2037, title: "시장 정체기", effect: "변화 없음", type: "normal", icon: "😐", mood: "neutral" },
    { year: 2038, title: "IMO 2040 규제 완화", effect: "전환 수요 +3%", type: "normal", icon: "🏛️", mood: "good" },
    { year: 2039, title: "점진적 회복세", effect: "전환 수요 +3%", type: "normal", icon: "📈", mood: "good" },
    { year: 2040, title: "IMO 2040 (완화된 목표)", effect: "최종 평가", type: "normal", icon: "🏁", mood: "neutral" }
  ],
  B: [
    { year: 2026, title: "EU FuelEU 본격 시행", effect: "메탄올 수요 +5%", type: "normal", icon: "🇪🇺", mood: "good" },
    { year: 2027, title: "EU ETS 해운 확대 적용", effect: "전환 수요 +8%", type: "normal", icon: "💹", mood: "good" },
    { year: 2028, title: "싱가포르 암모니아 상용화", effect: "싱가포르 경쟁력 ↑", type: "normal", icon: "🇸🇬", mood: "danger", competitorBoost: { singapore: 0.15 } },
    { year: 2029, title: "메탄올 선박 100척 돌파", effect: "메탄올 수요 +10%", type: "normal", icon: "🚢", mood: "good" },
    { year: 2030, title: "상하이가 협력을 제안합니다", effect: "선택에 따라 결과가 달라집니다", type: "special", icon: "🤝", mood: "special",
      choices: [
        { label: "협력 수락", desc: "공동 투자로 양측 +0.1 ASC", koreaBoost: 0.1, shanghaiBoost: 0.1 },
        { label: "협력 거절", desc: "독자 노선, 변화 없음", koreaBoost: 0, shanghaiBoost: 0 },
        { label: "역제안", desc: "우리 주도 협력, 한국 +0.15 / 상하이 +0.05", koreaBoost: 0.15, shanghaiBoost: 0.05 }
      ]
    },
    { year: 2031, title: "상하이 대규모 투자 발표!", effect: "상하이 경쟁력 급상승!", type: "normal", icon: "🇨🇳", mood: "danger", competitorBoost: { shanghai: 0.2 } },
    { year: 2032, title: "암모니아 선박 첫 상용 운항", effect: "암모니아 수요 +15%", type: "normal", icon: "⚗️", mood: "good" },
    { year: 2033, title: "울산 저장시설 화재 발생!", effect: "긴급 대응 필요", type: "special", icon: "🔥", mood: "crisis",
      choices: [
        { label: "긴급 복구 (200억)", desc: "1턴 후 정상화", kostMoney: 200, koreaBoost: -0.05 },
        { label: "부산으로 임시 이전", desc: "M3 강제 전환, 2턴 유지", forceM3: true, koreaBoost: -0.1 },
        { label: "해외 시설 임차", desc: "비용 높지만 즉시 대응", kostMoney: 300, koreaBoost: 0 }
      ]
    },
    { year: 2034, title: "로테르담 그린메탄올 대량 생산", effect: "로테르담 경쟁력 ↑", type: "normal", icon: "🇳🇱", mood: "warning", competitorBoost: { rotterdam: 0.15 } },
    { year: 2035, title: "EU 규제 2단계 강화", effect: "전환 수요 +10%", type: "normal", icon: "📜", mood: "good" },
    { year: 2036, title: "싱가포르가 가격 전쟁 선포!", effect: "대응 전략 선택", type: "special", icon: "⚔️", mood: "crisis",
      choices: [
        { label: "가격 대응", desc: "수익 -20%, 점유율 유지", koreaBoost: 0, revenueHit: true },
        { label: "품질 차별화", desc: "장기 경쟁력 +0.1 ASC", koreaBoost: 0.1 },
        { label: "틈새시장 공략", desc: "암모니아 특화 +0.15", koreaBoost: 0.15, ammoniaOnly: true }
      ]
    },
    { year: 2037, title: "싱가포르 허브 확장 완료", effect: "싱가포르 경쟁력 ↑", type: "normal", icon: "🏗️", mood: "warning", competitorBoost: { singapore: 0.1 } },
    { year: 2038, title: "한국 조선사 친환경 선박 대량 수주!", effect: "보너스 기회", type: "special", icon: "🎉", mood: "opportunity",
      choices: [
        { label: "벙커링 연계 계약", desc: "한국 기항 의무화, +0.2 ASC", koreaBoost: 0.2 },
        { label: "기술 협력", desc: "장기 경쟁력 +0.1, 조선사 시너지", koreaBoost: 0.1 },
        { label: "현상 유지", desc: "별도 대응 없음", koreaBoost: 0 }
      ]
    },
    { year: 2039, title: "글로벌 벙커링 표준화", effect: "시장 안정", type: "normal", icon: "🌐", mood: "neutral" },
    { year: 2040, title: "IMO 2040 목표 시점", effect: "최종 평가", type: "normal", icon: "🏁", mood: "neutral" }
  ],
  C: [
    { year: 2026, title: "EU 추가 규제 예고", effect: "메탄올 수요 +10%", type: "normal", icon: "⚠️", mood: "good" },
    { year: 2027, title: "탄소세 조기 적용", effect: "전환 수요 +15%", type: "normal", icon: "💰", mood: "good" },
    { year: 2028, title: "상하이가 저가 공세 선언!", effect: "긴급 대응 필요", type: "special", icon: "💥", mood: "crisis",
      choices: [
        { label: "맞대응", desc: "가격 인하, 수익 -30%", koreaBoost: 0, revenueHit: true },
        { label: "품질 승부", desc: "프리미엄 전략, +0.1 ASC", koreaBoost: 0.1 },
        { label: "정부 지원 요청", desc: "보조금으로 가격 경쟁력 확보", koreaBoost: 0.05 }
      ]
    },
    { year: 2029, title: "메탄올 선박 발주 폭증!", effect: "메탄올 수요 +15%", type: "normal", icon: "🚀", mood: "good" },
    { year: 2030, title: "IMO 목표 상향 조정", effect: "전환 수요 +10%", type: "normal", icon: "📈", mood: "good" },
    { year: 2031, title: "상하이 저가 공세 본격화!", effect: "상하이 경쟁력 급상승!", type: "normal", icon: "🇨🇳", mood: "danger", competitorBoost: { shanghai: 0.25 } },
    { year: 2032, title: "싱가포르 암모니아 허브 선언!", effect: "싱가포르 경쟁력 급상승!", type: "normal", icon: "🇸🇬", mood: "danger", competitorBoost: { singapore: 0.2 } },
    { year: 2033, title: "그린메탄올 가격 급락", effect: "메탄올 경쟁력 ↑", type: "normal", icon: "📉", mood: "good", globalBoost: { methanol: 0.1 } },
    { year: 2034, title: "글로벌 해운사가 한국에 러브콜!", effect: "전략적 선택", type: "special", icon: "💕", mood: "opportunity",
      choices: [
        { label: "독점 계약", desc: "특정 선사 전용, +0.25 ASC", koreaBoost: 0.25 },
        { label: "개방형 허브", desc: "다수 선사 유치, +0.15 ASC", koreaBoost: 0.15 },
        { label: "협상 지속", desc: "더 좋은 조건 노림 (리스크)", koreaBoost: 0.1, risk: true }
      ]
    },
    { year: 2035, title: "EU 탄소중립 선박 의무화!", effect: "전환 수요 폭발!", type: "normal", icon: "🇪🇺", mood: "good" },
    { year: 2036, title: "로테르담 암모니아 진출!", effect: "로테르담 경쟁력 급상승!", type: "normal", icon: "🇳🇱", mood: "danger", competitorBoost: { rotterdam: 0.2 } },
    { year: 2037, title: "싱가포르 추가 투자 발표", effect: "싱가포르 경쟁력 ↑", type: "normal", icon: "💰", mood: "warning", competitorBoost: { singapore: 0.15 } },
    { year: 2038, title: "암모니아 기술 혁신 기회!", effect: "투자 결정", type: "special", icon: "💡", mood: "opportunity",
      choices: [
        { label: "대규모 투자", desc: "500억 투자, 암모니아 +0.3", koreaBoost: 0.3, ammoniaOnly: true, kostMoney: 500 },
        { label: "중규모 투자", desc: "200억 투자, 암모니아 +0.15", koreaBoost: 0.15, ammoniaOnly: true, kostMoney: 200 },
        { label: "관망", desc: "투자 없음, 변화 없음", koreaBoost: 0 }
      ]
    },
    { year: 2039, title: "친환경 연료 완전 주류화!", effect: "암모니아 수요 폭발!", type: "normal", icon: "🌱", mood: "good" },
    { year: 2040, title: "IMO 2040 (강화된 목표)", effect: "최종 평가", type: "normal", icon: "🏁", mood: "neutral" }
  ]
};

// 경쟁자 반응 메시지
const COMPETITOR_MESSAGES = {
  singapore: [
    { action: "암모니아 인프라 추가 확충", message: "한국이 치고 올라오네... 우리도 투자 늘려야겠어!", icon: "😤" },
    { action: "가격 인하 단행", message: "가격으로 밀어붙이겠다!", icon: "💪" },
    { action: "현 전략 유지", message: "흥, 아직 위협이 안 돼.", icon: "😏" }
  ],
  shanghai: [
    { action: "메탄올 가격 인하", message: "가격전쟁이다! 버틸 수 있겠어?", icon: "🔥" },
    { action: "대규모 투자 발표", message: "국가 지원으로 밀어붙인다!", icon: "💰" },
    { action: "현 전략 유지", message: "두고 보자...", icon: "🧐" }
  ],
  rotterdam: [
    { action: "현 전략 유지", message: "유럽 시장은 우리가 지킨다.", icon: "🛡️" },
    { action: "그린메탄올 확대", message: "기술력으로 승부한다!", icon: "🔬" },
    { action: "암모니아 진출 검토", message: "암모니아도 고려해볼까...", icon: "🤔" }
  ]
};

const calculateShares = (ports) => {
  let sumExp = 0;
  const expValues = {};
  Object.keys(ports).forEach((key) => {
    const port = ports[key];
    const totalAsc = port.ascBase + port.methanol + port.ammonia;
    expValues[key] = Math.exp(totalAsc);
    sumExp += expValues[key];
  });
  const shares = {};
  Object.keys(ports).forEach((key) => {
    shares[key] = (expValues[key] / sumExp) * 100;
  });
  return shares;
};

// 지도 컴포넌트
const MapView = ({ shares, ports }) => {
  const width = 320;
  const height = 320;
  
  return (
    <svg width={width} height={height} style={{ display: "block", margin: "0 auto" }}>
      <rect width={width} height={height} fill="#0c4a6e" rx="10" />
      <path d="M20,40 Q60,30 100,50 L120,80 Q140,60 180,70 L200,50 Q240,40 280,60 L300,100 Q290,140 270,160 L250,200 Q230,180 200,190 L180,220 Q160,200 140,210 L100,190 Q80,170 60,180 L40,150 Q30,120 20,100 Z" fill="#1e3a5f" opacity="0.5" />
      <path d="M140,240 Q160,230 180,250 L200,280 Q180,300 150,290 L130,260 Q140,250 140,240 Z" fill="#1e3a5f" opacity="0.5" />
      
      {Object.keys(ports).map((key1) => 
        Object.keys(ports).map((key2) => {
          if (key1 < key2) {
            return (
              <line key={`${key1}-${key2}`} x1={INITIAL_PORTS[key1].x} y1={INITIAL_PORTS[key1].y} x2={INITIAL_PORTS[key2].x} y2={INITIAL_PORTS[key2].y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
            );
          }
          return null;
        })
      )}
      
      {Object.keys(shares).sort((a, b) => shares[a] - shares[b]).map((key) => {
        const port = INITIAL_PORTS[key];
        const share = shares[key];
        const radius = Math.max(15, Math.min(40, share * 0.8));
        
        return (
          <g key={key}>
            <circle cx={port.x} cy={port.y} r={radius} fill={port.color} opacity="0.8" stroke={key === "korea" ? "#fff" : "none"} strokeWidth={key === "korea" ? 3 : 0} />
            <text x={port.x} y={port.y + 5} textAnchor="middle" fontSize="20">{port.flag}</text>
            <text x={port.x} y={port.y + radius + 15} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{share.toFixed(1)}%</text>
            <text x={port.x} y={port.y + radius + 28} textAnchor="middle" fill="#94a3b8" fontSize="10">{port.name}</text>
          </g>
        );
      })}
      
      <text x="10" y="310" fill="#94a3b8" fontSize="9">원 크기 = 시장 점유율</text>
    </svg>
  );
};

// 꺾은선 그래프 컴포넌트 (전년대비 변화 추가 + 라벨 고정 간격)
const LineChart = ({ history, ports }) => {
  if (history.length < 2) return null;
  
  const width = 320;
  const height = 200;
  const padding = { top: 25, right: 85, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxValue = 70;
  const minValue = 0;
  
  const portKeys = ["korea", "singapore", "rotterdam", "shanghai"];
  
  const getX = (index) => padding.left + (index / (history.length - 1)) * chartWidth;
  const getY = (value) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  
  // 전년대비 변화 계산
  const getYearChange = (portKey) => {
    if (history.length < 2) return 0;
    const current = history[history.length - 1].shares[portKey];
    const previous = history[history.length - 2].shares[portKey];
    return current - previous;
  };
  
  // 점유율 순으로 정렬 (높은 순)
  const sortedPorts = [...portKeys].sort((a, b) => {
    const aShare = history[history.length - 1].shares[a];
    const bShare = history[history.length - 1].shares[b];
    return bShare - aShare;
  });
  
  // 고정 간격으로 라벨 위치 배치 (위에서 아래로)
  const labelStartY = padding.top + 15;
  const labelGap = 35;
  const labelPositions = {};
  sortedPorts.forEach((portKey, idx) => {
    labelPositions[portKey] = labelStartY + idx * labelGap;
  });
  
  return (
    <svg width={width} height={height} style={{ display: "block", margin: "0 auto" }}>
      {[0, 20, 40, 60].map((v) => (
        <g key={v}>
          <line x1={padding.left} y1={getY(v)} x2={width - padding.right} y2={getY(v)} stroke="#374151" strokeDasharray="3,3" />
          <text x={padding.left - 5} y={getY(v) + 4} fill="#9ca3af" fontSize="10" textAnchor="end">{v}%</text>
        </g>
      ))}
      
      {history.map((h, i) => {
        if (i === 0 || i === history.length - 1 || i === Math.floor(history.length / 2)) {
          return <text key={i} x={getX(i)} y={height - 10} fill="#9ca3af" fontSize="10" textAnchor="middle">{2025 + h.turn}</text>;
        }
        return null;
      })}
      
      {portKeys.map((portKey) => {
        const points = history.map((h, i) => `${getX(i)},${getY(h.shares[portKey])}`).join(" ");
        const color = INITIAL_PORTS[portKey].color;
        const change = getYearChange(portKey);
        const lastX = getX(history.length - 1);
        const lastY = getY(history[history.length - 1].shares[portKey]);
        const labelY = labelPositions[portKey];
        
        return (
          <g key={portKey}>
            <polyline points={points} fill="none" stroke={color} strokeWidth={portKey === "korea" ? 3 : 2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={lastX} cy={lastY} r={4} fill={color} />
            {/* 연결선 */}
            <line x1={lastX + 5} y1={lastY} x2={width - padding.right + 2} y2={labelY} stroke={color} strokeWidth="1" opacity="0.4" />
            {/* 국기 + 전년대비 변화 */}
            <text x={width - padding.right + 8} y={labelY + 4} fill={color} fontSize="12" fontWeight="bold">
              {INITIAL_PORTS[portKey].flag}
            </text>
            <text x={width - padding.right + 28} y={labelY + 4} fill={change >= 0 ? "#4ade80" : "#f87171"} fontSize="11" fontWeight="bold">
              {change >= 0 ? "+" : ""}{change.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// 뉴스 카드 컴포넌트
const NewsCard = ({ event }) => {
  const moodStyles = {
    neutral: { bg: "#1e3a8a", border: "none", textColor: "#93c5fd" },
    good: { bg: "#166534", border: "2px solid #4ade80", textColor: "#86efac" },
    warning: { bg: "#854d0e", border: "2px solid #facc15", textColor: "#fef08a" },
    danger: { bg: "#991b1b", border: "2px solid #f87171", textColor: "#fecaca" },
    crisis: { bg: "#7c2d12", border: "3px solid #f97316", textColor: "#fed7aa" },
    opportunity: { bg: "#1e3a8a", border: "3px solid #22d3ee", textColor: "#a5f3fc" },
    special: { bg: "#581c87", border: "3px solid #c084fc", textColor: "#e9d5ff" }
  };
  
  const style = moodStyles[event.mood] || moodStyles.neutral;
  
  return (
    <div style={{
      backgroundColor: style.bg,
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "15px",
      border: style.border,
      boxShadow: event.mood === "crisis" ? "0 0 20px rgba(249, 115, 22, 0.5)" : 
                 event.mood === "opportunity" ? "0 0 20px rgba(34, 211, 238, 0.5)" : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "40px", marginRight: "15px" }}>{event.icon}</span>
        <div>
          <div style={{ fontSize: "12px", color: style.textColor, marginBottom: "3px" }}>
            {event.type === "special" ? "⚡ 특별 이벤트!" : `📰 ${event.year}년 뉴스`}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "18px", lineHeight: "1.3" }}>
            "{event.title}"
          </div>
        </div>
      </div>
      <div style={{ 
        fontSize: "14px", 
        color: style.textColor,
        padding: "10px",
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: "8px"
      }}>
        → {event.effect}
      </div>
    </div>
  );
};

// 경쟁자 반응 카드 컴포넌트
const CompetitorReactionCard = ({ reactions }) => {
  if (reactions.length === 0) {
    return (
      <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>🎭 경쟁자 반응</div>
        <div style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
          <span style={{ fontSize: "30px" }}>😴</span>
          <div style={{ marginTop: "10px" }}>경쟁자들이 조용합니다...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
      <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>🎭 경쟁자 반응</div>
      {reactions.map((r, i) => {
        const messages = COMPETITOR_MESSAGES[r.port] || [];
        const msg = messages.find(m => m.action === r.action) || { message: r.action, icon: "💬" };
        
        return (
          <div key={i} style={{
            backgroundColor: "#374151",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "10px",
            borderLeft: `4px solid ${INITIAL_PORTS[r.port].color}`
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "24px", marginRight: "10px" }}>{INITIAL_PORTS[r.port].flag}</span>
              <span style={{ fontWeight: "bold", color: INITIAL_PORTS[r.port].color }}>{INITIAL_PORTS[r.port].name}</span>
            </div>
            <div style={{ 
              backgroundColor: "#1f2937", 
              padding: "12px 15px", 
              borderRadius: "15px",
              borderTopLeftRadius: "5px",
              position: "relative"
            }}>
              <span style={{ fontSize: "20px", marginRight: "8px" }}>{msg.icon}</span>
              <span style={{ fontSize: "14px" }}>"{msg.message}"</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState("start");
  const [scenario, setScenario] = useState(null);
  const [turn, setTurn] = useState(1);
  const [ports, setPorts] = useState(JSON.parse(JSON.stringify(INITIAL_PORTS)));
  const [shares, setShares] = useState(calculateShares(INITIAL_PORTS));
  const [history, setHistory] = useState([]);
  const [division, setDivision] = useState("M2");
  const [fuelRatio, setFuelRatio] = useState(50);
  const [investSize, setInvestSize] = useState("중");
  const [turnResult, setTurnResult] = useState(null);
  const [prevRanks, setPrevRanks] = useState({});

  const getInvestEffect = () => {
    const sizeEffect = { 소: 0.05, 중: 0.15, 대: 0.25 };
    const divisionBonus = { M1: 0, M2: 0.05, M3: -0.02 };
    const baseEffect = sizeEffect[investSize];
    const bonus = divisionBonus[division];
    const methanolRatio = fuelRatio / 100;
    const ammoniaRatio = 1 - methanolRatio;
    return {
      methanol: baseEffect * methanolRatio + bonus * methanolRatio,
      ammonia: baseEffect * ammoniaRatio + bonus * ammoniaRatio
    };
  };

  const getCompetitorReactions = (koreaGain) => {
    const reactions = [];
    if (koreaGain > 1 && Math.random() < 0.5) {
      reactions.push({ port: "singapore", action: "암모니아 인프라 추가 확충", boost: 0.1 });
    }
    if (koreaGain > 0.5 && Math.random() < 0.4) {
      reactions.push({ port: "shanghai", action: "메탄올 가격 인하", boost: 0.08 });
    }
    if (Math.random() < 0.3) {
      reactions.push({ port: "rotterdam", action: "현 전략 유지", boost: 0 });
    }
    return reactions;
  };

  const getRankChange = (key, currentShares) => {
    const currentRank = Object.keys(currentShares).sort((a, b) => currentShares[b] - currentShares[a]).indexOf(key);
    const prevRank = prevRanks[key];
    if (prevRank === undefined) return null;
    if (currentRank < prevRank) return "up";
    if (currentRank > prevRank) return "down";
    return null;
  };

  const executeTurn = (choiceIndex = null) => {
    const event = EVENTS[scenario][turn - 1];
    const prevShares = { ...shares };
    const newPorts = JSON.parse(JSON.stringify(ports));

    const currentRanks = {};
    Object.keys(shares).sort((a, b) => shares[b] - shares[a]).forEach((key, idx) => {
      currentRanks[key] = idx;
    });
    setPrevRanks(currentRanks);

    const investEffect = getInvestEffect();
    newPorts.korea.methanol += investEffect.methanol;
    newPorts.korea.ammonia += investEffect.ammonia;

    let specialChoice = null;
    if (event.type === "special" && choiceIndex !== null) {
      const choice = event.choices[choiceIndex];
      specialChoice = choice;
      if (choice.koreaBoost) {
        newPorts.korea.methanol += choice.koreaBoost * 0.5;
        newPorts.korea.ammonia += choice.koreaBoost * 0.5;
      }
      if (choice.shanghaiBoost) {
        newPorts.shanghai.methanol += choice.shanghaiBoost * 0.5;
        newPorts.shanghai.ammonia += choice.shanghaiBoost * 0.5;
      }
    }

    if (event.competitorBoost) {
      Object.keys(event.competitorBoost).forEach((port) => {
        if (port !== "korea") {
          newPorts[port].methanol += event.competitorBoost[port] * 0.5;
          newPorts[port].ammonia += event.competitorBoost[port] * 0.5;
        }
      });
    }

    if (event.globalBoost) {
      Object.keys(newPorts).forEach((port) => {
        if (event.globalBoost.methanol) newPorts[port].methanol += event.globalBoost.methanol;
        if (event.globalBoost.ammonia) newPorts[port].ammonia += event.globalBoost.ammonia;
      });
    }

    const newShares = calculateShares(newPorts);
    const koreaGain = newShares.korea - prevShares.korea;

    const reactions = getCompetitorReactions(koreaGain);
    reactions.forEach((r) => {
      if (r.boost > 0) {
        newPorts[r.port].methanol += r.boost * 0.5;
        newPorts[r.port].ammonia += r.boost * 0.5;
      }
    });

    const finalShares = calculateShares(newPorts);

    const newHistory = [...history, { 
      turn, 
      shares: { ...finalShares },
      decision: { division, fuelRatio, investSize } 
    }];

    setTurnResult({
      turn,
      year: 2025 + turn,
      event,
      prevShare: prevShares.korea,
      newShare: finalShares.korea,
      change: finalShares.korea - prevShares.korea,
      reactions,
      decision: { division, fuelRatio, investSize },
      specialChoice
    });

    setPorts(newPorts);
    setShares(finalShares);
    setHistory(newHistory);
    setScreen("result");
  };

  const nextTurn = () => {
    if (turn >= 15) setScreen("final");
    else {
      setTurn(turn + 1);
      setTurnResult(null);
      setScreen("game");
    }
  };

  const startGame = (s) => {
    setScenario(s);
    const initialPorts = JSON.parse(JSON.stringify(INITIAL_PORTS));
    const initialShares = calculateShares(initialPorts);
    setPorts(initialPorts);
    setShares(initialShares);
    setTurn(1);
    setHistory([{ turn: 0, shares: { ...initialShares }, decision: null }]);
    setDivision("M2");
    setFuelRatio(50);
    setInvestSize("중");
    setPrevRanks({});
    setScreen("game");
  };

  const resetGame = () => {
    setScreen("start");
    setPorts(JSON.parse(JSON.stringify(INITIAL_PORTS)));
    setShares(calculateShares(INITIAL_PORTS));
    setHistory([]);
  };

  const getGrade = () => {
    const k = shares.korea;
    if (k >= 25) return { grade: "🏆 대성공", msg: "동북아 친환경 벙커링 허브의 선두주자!" };
    if (k >= 20) return { grade: "🥈 성공", msg: "동북아 벙커링 시장의 강자로 자리매김" };
    if (k >= 15) return { grade: "🥉 보통", msg: "경쟁에서 현 위치를 유지" };
    return { grade: "❌ 실패", msg: "시장 점유율 하락, 전략 재검토 필요" };
  };

  // KMI 로고 base64 (투명 배경)
  const KMI_LOGO = "data:image/png;base64,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";

  // 시작 화면
  if (screen === "start") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* 배경 장식 */}
        <div style={{ position: "absolute", top: "10%", left: "10%", fontSize: "60px", opacity: 0.08 }}>🚢</div>
        <div style={{ position: "absolute", top: "20%", right: "15%", fontSize: "40px", opacity: 0.08 }}>⚓</div>
        <div style={{ position: "absolute", bottom: "25%", left: "20%", fontSize: "50px", opacity: 0.08 }}>🌊</div>
        <div style={{ position: "absolute", bottom: "15%", right: "10%", fontSize: "45px", opacity: 0.08 }}>🛢️</div>
        
        {/* 메인 콘텐츠 */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "35px 40px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          maxWidth: "360px",
          width: "100%"
        }}>
          <div style={{ 
            fontSize: "50px", 
            marginBottom: "12px",
            filter: "drop-shadow(0 0 15px rgba(234, 179, 8, 0.4))"
          }}>⚓</div>
          
          <div style={{ 
            fontSize: "11px", 
            color: "#94a3b8", 
            letterSpacing: "2px",
            marginBottom: "8px"
          }}>
            STRATEGY SIMULATION
          </div>
          
          <h1 style={{ 
            fontSize: "28px", 
            fontWeight: "bold", 
            marginBottom: "5px",
            color: "#fff"
          }}>
            GREEN <span style={{ color: "#eab308" }}>PORT</span>
          </h1>
          
          <p style={{ 
            fontSize: "14px", 
            marginBottom: "20px", 
            color: "#cbd5e1"
          }}>
            동북아 친환경 벙커링 허브를 선점하라
          </p>
          
          {/* VS 구도 - 더 세련되게 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
            padding: "10px 0"
          }}>
            <div style={{ fontSize: "28px" }}>🇰🇷</div>
            <div style={{ 
              fontSize: "11px", 
              color: "#64748b",
              padding: "3px 8px",
              borderRadius: "4px",
              backgroundColor: "rgba(255,255,255,0.05)"
            }}>vs</div>
            <div style={{ fontSize: "20px" }}>🇸🇬</div>
            <div style={{ fontSize: "20px" }}>🇨🇳</div>
            <div style={{ fontSize: "20px" }}>🇳🇱</div>
          </div>
          
          <button 
            onClick={() => setScreen("scenario")} 
            style={{ 
              background: "linear-gradient(90deg, #eab308, #f59e0b)",
              color: "#000",
              padding: "14px 40px", 
              borderRadius: "25px", 
              fontWeight: "bold", 
              fontSize: "16px", 
              border: "none", 
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(234, 179, 8, 0.35)",
              width: "100%"
            }}
          >
            🎮 게임 시작
          </button>
          
          <div style={{ 
            marginTop: "18px",
            fontSize: "11px", 
            color: "#94a3b8",
            display: "flex",
            gap: "12px",
            justifyContent: "center"
          }}>
            <span>📅 2026-2040</span>
            <span>🎯 15년 전략</span>
            <span>⚡ 실시간 경쟁</span>
          </div>
        </div>
        
        {/* KMI 로고 - 투명 배경 */}
        <div style={{ 
          marginTop: "35px"
        }}>
          <img src={KMI_LOGO} alt="KMI" style={{ height: "50px" }} />
        </div>
      </div>
    );
  }

  // 시나리오 선택
  if (screen === "scenario") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111827", color: "white", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>시나리오를 선택하세요</h2>
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <button onClick={() => startGame("A")} style={{ width: "100%", padding: "20px", backgroundColor: "#166534", borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left", color: "white", marginBottom: "15px" }}>
            <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>🌤️ EASY - 보수 시나리오</div>
            <div style={{ fontSize: "14px", color: "#86efac" }}>규제 지연 · 느린 전환 · 경쟁 완만</div>
          </button>
          <button onClick={() => startGame("B")} style={{ width: "100%", padding: "20px", backgroundColor: "#1e40af", borderRadius: "10px", border: "3px solid #eab308", cursor: "pointer", textAlign: "left", color: "white", marginBottom: "15px" }}>
            <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>
              ⛅ NORMAL - 기준 시나리오
              <span style={{ fontSize: "12px", backgroundColor: "#eab308", color: "black", padding: "3px 10px", borderRadius: "5px", marginLeft: "10px" }}>추천</span>
            </div>
            <div style={{ fontSize: "14px", color: "#93c5fd" }}>IMO/EU 예정대로 · 표준 전환 · 적정 경쟁</div>
            <div style={{ fontSize: "12px", color: "#fbbf24", marginTop: "5px" }}>⚡ 특별 이벤트 4개 포함</div>
          </button>
          <button onClick={() => startGame("C")} style={{ width: "100%", padding: "20px", backgroundColor: "#991b1b", borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left", color: "white", marginBottom: "15px" }}>
            <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>🌩️ HARD - 적극 시나리오</div>
            <div style={{ fontSize: "14px", color: "#fca5a5" }}>규제 강화 · 빠른 전환 · 치열한 경쟁</div>
            <div style={{ fontSize: "12px", color: "#fbbf24", marginTop: "5px" }}>⚡ 특별 이벤트 4개 포함</div>
          </button>
        </div>
        <button onClick={() => setScreen("start")} style={{ display: "block", margin: "20px auto", backgroundColor: "transparent", color: "#9ca3af", border: "none", cursor: "pointer", fontSize: "14px" }}>← 뒤로</button>
      </div>
    );
  }

  // 메인 게임
  if (screen === "game") {
    const event = EVENTS[scenario][turn - 1];
    const isSpecialEvent = event.type === "special";
    
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111827", color: "white", padding: "15px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>⚓ GREEN PORT</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>{2025 + turn}년</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>{turn}/15턴</div>
          </div>
        </div>

        <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>🗺️ 동북아 벙커링 허브 현황</div>
          <MapView shares={shares} ports={ports} />
        </div>

        <NewsCard event={event} />

        {isSpecialEvent ? (
          <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "14px", color: "#f97316", marginBottom: "15px", fontWeight: "bold" }}>⚡ 전략적 선택이 필요합니다!</div>
            {event.choices.map((choice, idx) => (
              <button key={idx} onClick={() => executeTurn(idx)} style={{ width: "100%", padding: "15px", marginBottom: "10px", backgroundColor: "#374151", borderRadius: "8px", border: "2px solid transparent", cursor: "pointer", textAlign: "left", color: "white", transition: "all 0.2s" }}
                onMouseOver={(e) => e.target.style.borderColor = "#eab308"}
                onMouseOut={(e) => e.target.style.borderColor = "transparent"}>
                <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "5px" }}>{choice.label}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>{choice.desc}</div>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "15px" }}>🎯 전략 결정</div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "14px", marginBottom: "10px" }}>분업 전략</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {["M1", "M2", "M3"].map((m) => (
                    <button key={m} onClick={() => setDivision(m)} style={{ padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: division === m ? "#eab308" : "#374151", color: division === m ? "black" : "white" }}>
                      <div style={{ fontWeight: "bold" }}>{m}</div>
                      <div style={{ fontSize: "11px" }}>{m === "M1" ? "울산단독" : m === "M2" ? "분업" : "부산단독"}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "14px", marginBottom: "10px" }}>투자 배분: 메탄올 {fuelRatio}% : 암모니아 {100 - fuelRatio}%</div>
                <input type="range" min="0" max="100" step="25" value={fuelRatio} onChange={(e) => setFuelRatio(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              <div>
                <div style={{ fontSize: "14px", marginBottom: "10px" }}>투자 규모</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {["소", "중", "대"].map((s) => (
                    <button key={s} onClick={() => setInvestSize(s)} style={{ padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: investSize === s ? "#eab308" : "#374151", color: investSize === s ? "black" : "white" }}>
                      <div style={{ fontWeight: "bold" }}>{s}</div>
                      <div style={{ fontSize: "11px" }}>{s === "소" ? "100억" : s === "중" ? "300억" : "500억"}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => executeTurn(null)} style={{ width: "100%", backgroundColor: "#eab308", color: "black", padding: "15px", borderRadius: "10px", fontWeight: "bold", fontSize: "18px", border: "none", cursor: "pointer" }}>턴 종료</button>
          </>
        )}
      </div>
    );
  }

  // 턴 결과
  if (screen === "result" && turnResult) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111827", color: "white", padding: "15px", fontFamily: "system-ui, sans-serif" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>📈 {turnResult.year}년 결과</h2>

        <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>당신의 선택</div>
          {turnResult.specialChoice ? (
            <div style={{ fontSize: "14px", color: "#f97316", fontWeight: "bold" }}>⚡ {turnResult.specialChoice.label}: {turnResult.specialChoice.desc}</div>
          ) : (
            <div style={{ fontSize: "14px" }}>{turnResult.decision.division} / 메탄올 {turnResult.decision.fuelRatio}% / {turnResult.decision.investSize}</div>
          )}
        </div>

        <CompetitorReactionCard reactions={turnResult.reactions} />

        <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
          <div style={{ textAlign: "center", marginBottom: "15px", padding: "15px", backgroundColor: turnResult.change >= 0 ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)", borderRadius: "10px" }}>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "5px" }}>🇰🇷 한국 점유율</div>
            <span style={{ fontSize: "28px", fontWeight: "bold" }}>
              {turnResult.prevShare.toFixed(1)}% → {turnResult.newShare.toFixed(1)}%
            </span>
            <div style={{ fontSize: "20px", marginTop: "5px", color: turnResult.change >= 0 ? "#4ade80" : "#f87171", fontWeight: "bold" }}>
              {turnResult.change >= 0 ? "📈" : "📉"} {turnResult.change >= 0 ? "+" : ""}{turnResult.change.toFixed(1)}%p
            </div>
          </div>
          
          {Object.keys(shares).sort((a, b) => shares[b] - shares[a]).map((key) => {
            const rankChange = getRankChange(key, shares);
            return (
              <div key={key} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
                  <span>
                    {INITIAL_PORTS[key].flag} {INITIAL_PORTS[key].name}
                    {rankChange === "up" && <span style={{ color: "#4ade80", marginLeft: "5px" }}>🔺</span>}
                    {rankChange === "down" && <span style={{ color: "#f87171", marginLeft: "5px" }}>🔻</span>}
                  </span>
                  <span style={{ color: INITIAL_PORTS[key].color }}>{shares[key].toFixed(1)}%</span>
                </div>
                <div style={{ width: "100%", backgroundColor: "#4b5563", borderRadius: "5px", height: "12px" }}>
                  <div style={{ width: `${Math.min(shares[key], 100)}%`, backgroundColor: INITIAL_PORTS[key].color, height: "100%", borderRadius: "5px" }} />
                </div>
              </div>
            );
          })}
        </div>

        {history.length >= 2 && (
          <div style={{ backgroundColor: "#1f2937", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>📊 점유율 추이 (전년대비)</div>
            <LineChart history={history} ports={INITIAL_PORTS} />
          </div>
        )}

        <button onClick={nextTurn} style={{ width: "100%", backgroundColor: "#eab308", color: "black", padding: "15px", borderRadius: "10px", fontWeight: "bold", fontSize: "18px", border: "none", cursor: "pointer" }}>
          {turn >= 15 ? "최종 결과 보기" : "내년으로 →"}
        </button>
      </div>
    );
  }

  // 최종 결과
  if (screen === "final") {
    const { grade, msg } = getGrade();
    const sorted = Object.keys(shares).sort((a, b) => shares[b] - shares[a]);
    const koreaRank = sorted.indexOf("korea") + 1;
    const isWin = shares.korea >= 20;
    
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: isWin 
          ? "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)" 
          : "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
        color: "white", 
        padding: "15px", 
        fontFamily: "system-ui, sans-serif" 
      }}>
        {/* 헤더 - 게임 종료 강조 */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: "15px"
        }}>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>🏁 GAME OVER</div>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>2040년, 15년간의 여정이 끝났습니다</div>
        </div>

        {/* 결과 카드 */}
        <div style={{ 
          backgroundColor: "rgba(255,255,255,0.1)", 
          borderRadius: "20px", 
          padding: "30px", 
          marginBottom: "15px", 
          textAlign: "center",
          border: isWin ? "3px solid #4ade80" : "3px solid #818cf8",
          boxShadow: isWin ? "0 0 30px rgba(74, 222, 128, 0.3)" : "0 0 30px rgba(129, 140, 248, 0.3)"
        }}>
          <div style={{ fontSize: "60px", marginBottom: "10px" }}>
            {shares.korea >= 25 ? "🏆" : shares.korea >= 20 ? "🎉" : shares.korea >= 15 ? "👍" : "😢"}
          </div>
          <div style={{ fontSize: "16px", color: "#d1d5db", marginBottom: "5px" }}>
            🇰🇷 대한민국 최종 점유율
          </div>
          <div style={{ 
            fontSize: "50px", 
            fontWeight: "bold", 
            margin: "10px 0", 
            color: "#eab308",
            textShadow: "0 0 20px rgba(234, 179, 8, 0.5)"
          }}>
            {shares.korea.toFixed(1)}%
          </div>
          <div style={{ 
            fontSize: "32px", 
            marginBottom: "10px",
            color: isWin ? "#4ade80" : "#c4b5fd"
          }}>
            {grade}
          </div>
          <div style={{ 
            fontSize: "14px", 
            color: "#9ca3af",
            padding: "10px 20px",
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            display: "inline-block"
          }}>
            {msg}
          </div>
        </div>

        {/* 최종 지도 */}
        <div style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "15px", padding: "15px", marginBottom: "15px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>🗺️ 2040년 동북아 벙커링 허브 판도</div>
          <MapView shares={shares} ports={ports} />
        </div>

        {/* 꺾은선 그래프 */}
        {history.length >= 2 && (
          <div style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "15px", padding: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>📊 15년간의 점유율 변화</div>
            <LineChart history={history} ports={INITIAL_PORTS} />
          </div>
        )}

        {/* 최종 순위 */}
        <div style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "15px", padding: "15px", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>🏅 최종 순위</div>
          {sorted.map((key, i) => (
            <div key={key} style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              padding: "12px 15px",
              marginBottom: "8px",
              backgroundColor: key === "korea" ? "rgba(234, 179, 8, 0.2)" : "rgba(255,255,255,0.05)",
              borderRadius: "10px",
              border: key === "korea" ? "2px solid #eab308" : "none"
            }}>
              <span style={{ color: INITIAL_PORTS[key].color, fontWeight: key === "korea" ? "bold" : "normal" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "4️⃣"} {INITIAL_PORTS[key].flag} {INITIAL_PORTS[key].name}
              </span>
              <span style={{ color: INITIAL_PORTS[key].color, fontWeight: "bold" }}>{shares[key].toFixed(1)}%</span>
            </div>
          ))}
        </div>

        {/* 버튼 - 게임 종료 느낌 */}
        <div style={{ 
          backgroundColor: "rgba(0,0,0,0.3)", 
          borderRadius: "15px", 
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "15px" }}>
            다른 전략으로 다시 도전해보세요!
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button onClick={resetGame} style={{ 
              padding: "15px", 
              borderRadius: "10px", 
              border: "none", 
              cursor: "pointer", 
              backgroundColor: "#475569", 
              color: "white", 
              fontWeight: "bold",
              fontSize: "15px"
            }}>
              🔄 처음부터
            </button>
            <button onClick={() => setScreen("scenario")} style={{ 
              padding: "15px", 
              borderRadius: "10px", 
              border: "none", 
              cursor: "pointer", 
              background: "linear-gradient(90deg, #eab308, #f59e0b)",
              color: "black", 
              fontWeight: "bold",
              fontSize: "15px"
            }}>
              🎯 다른 시나리오
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
