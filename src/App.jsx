import { useState, useEffect } from "react";

const COMPETENCIES = [
  { key: "analytics", label: "Data Analytics", weight: 0.25, critical: true, icon: "◈" },
  { key: "paid_ads", label: "Paid Advertising", weight: 0.20, critical: true, icon: "◎" },
  { key: "seo", label: "SEO & Content", weight: 0.10, critical: false, icon: "◇" },
  { key: "copywriting", label: "Strategic Copywriting", weight: 0.12, critical: false, icon: "◆" },
  { key: "ab_testing", label: "A/B Testing & CRO", weight: 0.10, critical: false, icon: "◉" },
  { key: "email", label: "Email Automation", weight: 0.10, critical: false, icon: "○" },
  { key: "social", label: "Social Media Strategy", weight: 0.08, critical: false, icon: "◐" },
  { key: "pm", label: "Project Management", weight: 0.05, critical: false, icon: "▣" },
];

const IDEAL_SCORES = {
  analytics: 5, paid_ads: 4.5, seo: 3.5, copywriting: 4.5,
  ab_testing: 3.5, email: 3.5, social: 4, pm: 3.5,
};

const SALARY_BANDS = {
  min: 165000000, max: 225000000,
  market_min: 108000000, market_median: 144000000, market_max: 192000000,
};

const CULTURE_DIMENSIONS = ["Growth Mindset", "Data Storytelling", "Adaptability", "Collaboration", "Ethical Judgment"];

// ─── Radar Chart ────────────────────────────────────────────────────────────
function RadarChart({ scores, ideal, size = 300 }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.35;
  const n = COMPETENCIES.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const toXY = (i, val, maxVal = 5) => {
    const ratio = val / maxVal;
    return { x: cx + r * ratio * Math.cos(angle(i)), y: cy + r * ratio * Math.sin(angle(i)) };
  };

  const candidatePoints = COMPETENCIES.map((c, i) => toXY(i, scores[c.key] ?? 0));
  const idealPoints = COMPETENCIES.map((c, i) => toXY(i, ideal[c.key] ?? 5));
  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: "drop-shadow(0 0 20px rgba(251,191,36,0.12))" }}>
      <defs>
        <radialGradient id="cGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.04" />
        </radialGradient>
        <radialGradient id="iGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
        </radialGradient>
      </defs>

      {[1,2,3,4,5].map((level) => {
        const pts = COMPETENCIES.map((_, i) => toXY(i, level));
        return <polygon key={level} points={pts.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>;
      })}

      {COMPETENCIES.map((_, i) => {
        const o = toXY(i, 5);
        return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>;
      })}

      <path d={toPath(idealPoints)} fill="url(#iGrad)" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65"/>
      <path d={toPath(candidatePoints)} fill="url(#cGrad)" stroke="#f59e0b" strokeWidth="2"/>

      {candidatePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f59e0b" stroke="#0f0f0f" strokeWidth="2"/>
      ))}

      {COMPETENCIES.map((c, i) => {
        const o = toXY(i, 6.1);
        const anchor = o.x < cx - 5 ? "end" : o.x > cx + 5 ? "start" : "middle";
        return (
          <text key={i} x={o.x} y={o.y} textAnchor={anchor} dominantBaseline="middle"
            fill="rgba(255,255,255,0.5)" fontSize="8.5" fontFamily="'Courier New',monospace" letterSpacing="0.4">
            {c.icon} {c.label.split(" ")[0].toUpperCase()}
          </text>
        );
      })}
      <circle cx={cx} cy={cy} r="3" fill="#f59e0b" opacity="0.4"/>
    </svg>
  );
}

// ─── Score Bar ───────────────────────────────────────────────────────────────
function ScoreGauge({ score, max = 5, label, critical }) {
  const pct = (score / max) * 100;
  const color = score < 3 ? "#ef4444" : score < 3.5 ? "#f97316" : score < 4 ? "#eab308" : "#22c55e";
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>
          {critical && <span style={{ color: "#ef4444", marginRight: "4px" }}>●</span>}
          {label}
        </span>
        <span style={{ fontSize: "12px", color, fontFamily: "monospace", fontWeight: "700" }}>{score.toFixed(1)}</span>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 0.45s ease" }}/>
      </div>
    </div>
  );
}

// ─── Slider ──────────────────────────────────────────────────────────────────
function Slider({ label, value, onChange, min = 0, max = 5, step = 0.1, unit = "", critical }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <label style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontFamily: "monospace", letterSpacing: "0.8px", textTransform: "uppercase" }}>
          {critical && <span style={{ color: "#ef4444", marginRight: "4px" }}>★</span>}
          {label}
        </label>
        <span style={{ fontSize: "13px", color: "#f59e0b", fontFamily: "monospace", fontWeight: "700" }}>
          {unit === "IDR" ? `Rp ${(value/1000000).toFixed(0)}jt` : value.toFixed(1)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1px" }}>
        <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>
          {unit === "IDR" ? `Rp ${(min/1000000).toFixed(0)}jt` : min}
        </span>
        <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>
          {unit === "IDR" ? `Rp ${(max/1000000).toFixed(0)}jt` : max}
        </span>
      </div>
    </div>
  );
}

// ─── Salary Meter ────────────────────────────────────────────────────────────
function SalaryMeter({ requested }) {
  const { min, max, market_min, market_median } = SALARY_BANDS;
  const fmt = n => `Rp ${(n/1000000).toFixed(0)}jt`;
  const overallMax = Math.max(max, requested) * 1.08;
  const base = market_min * 0.8;

  const pct = v => Math.min(((v - base) / (overallMax - base)) * 100, 100);
  const bandLeft = pct(min);
  const bandW    = pct(max) - pct(min);
  const reqPct   = pct(requested);

  const status =
    requested <= min ? "BELOW_BAND" :
    requested <= max ? "IN_BAND" :
    requested <= max * 1.15 ? "ABOVE_BAND" : "OUT_OF_RANGE";

  const sc = {
    BELOW_BAND:  { label: "Below Budget — Room to Negotiate", color: "#22c55e" },
    IN_BAND:     { label: "Within Budget Range — Ideal",      color: "#f59e0b" },
    ABOVE_BAND:  { label: "Slightly Above Budget — Discuss",  color: "#f97316" },
    OUT_OF_RANGE:{ label: "Exceeds Budget — Escalate",        color: "#ef4444" },
  }[status];

  return (
    <div>
      <div style={{ padding: "10px 14px", borderRadius: "8px", background: `${sc.color}12`,
        border: `1px solid ${sc.color}35`, marginBottom: "18px" }}>
        <span style={{ fontSize: "11px", color: sc.color, fontFamily: "monospace", fontWeight: "700" }}>{sc.label}</span>
      </div>

      {/* Visual bar */}
      <div style={{ position: "relative", height: "50px", marginBottom: "28px" }}>
        {/* Track */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "6px",
          transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", borderRadius: "3px" }}/>
        {/* Company band */}
        <div style={{ position: "absolute", top: "50%", left: `${bandLeft}%`, width: `${bandW}%`, height: "6px",
          transform: "translateY(-50%)", background: "rgba(245,158,11,0.45)", borderRadius: "3px",
          border: "1px solid rgba(245,158,11,0.6)" }}/>
        {/* Market median tick */}
        <div style={{ position: "absolute", left: `${pct(market_median)}%`, top: "20%", bottom: "20%",
          width: "1px", background: "rgba(255,255,255,0.2)" }}/>
        <span style={{ position: "absolute", left: `${pct(market_median)}%`, top: "-16px",
          transform: "translateX(-50%)", fontSize: "8px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", whiteSpace: "nowrap" }}>
          MKT MED {fmt(market_median)}
        </span>
        {/* Requested marker */}
        <div style={{ position: "absolute", left: `${reqPct}%`, top: "50%",
          transform: "translate(-50%,-50%)", width: "14px", height: "14px",
          borderRadius: "50%", background: sc.color, border: "2px solid #0f0f0f",
          boxShadow: `0 0 12px ${sc.color}`, zIndex: 10 }}/>
        <span style={{ position: "absolute", left: `${reqPct}%`, bottom: "-18px",
          transform: "translateX(-50%)", fontSize: "8px", color: sc.color, fontFamily: "monospace", whiteSpace: "nowrap" }}>
          ▲ {fmt(requested)}
        </span>
        {/* Min / Max labels */}
        <span style={{ position: "absolute", left: `${bandLeft}%`, top: "-16px",
          transform: "translateX(-50%)", fontSize: "8px", color: "#f59e0b", fontFamily: "monospace" }}>
          MIN
        </span>
        <span style={{ position: "absolute", left: `${pct(max)}%`, top: "-16px",
          transform: "translateX(-50%)", fontSize: "8px", color: "#f59e0b", fontFamily: "monospace" }}>
          MAX
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[
          { l: "Company Min",   v: fmt(min),            c: "#f59e0b" },
          { l: "Company Max",   v: fmt(max),            c: "#f59e0b" },
          { l: "Market Median", v: fmt(market_median),  c: "rgba(255,255,255,0.4)" },
          { l: "Candidate Ask", v: fmt(requested),      c: sc.color },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "2px" }}>{l}</div>
            <div style={{ fontSize: "12px", color: c, fontFamily: "monospace", fontWeight: "700" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [scores, setScores] = useState({
    analytics: 3.5, paid_ads: 3.0, seo: 3.0, copywriting: 3.5,
    ab_testing: 3.0, email: 3.0, social: 3.5, pm: 3.0,
  });
  const [cultureFit, setCultureFit]   = useState(3.5);
  const [salaryReq, setSalaryReq]     = useState(180000000);
  const [activeTab, setActiveTab]     = useState("overview");
  const [candName, setCandName]       = useState("Candidate #001");
  const [animKey, setAnimKey]         = useState(0);

  const setScore = key => val => setScores(s => ({ ...s, [key]: val }));

  const weightedScore   = COMPETENCIES.reduce((a, c) => a + (scores[c.key] ?? 0) * c.weight, 0);
  const criticalPassed  = COMPETENCIES.filter(c => c.critical).every(c => (scores[c.key] ?? 0) >= 3.5);
  const noCompBelow3    = COMPETENCIES.every(c => (scores[c.key] ?? 0) >= 3);
  const finalScore      = weightedScore * 0.75 + cultureFit * 0.25;

  const decision =
    !criticalPassed  ? "REJECT" :
    !noCompBelow3    ? "MAYBE"  :
    finalScore >= 4  ? "STRONG_HIRE" :
    finalScore >= 3.5? "HIRE"   :
    finalScore >= 3  ? "MAYBE"  : "REJECT";

  const DC = {
    STRONG_HIRE: { label: "STRONG HIRE", sub: "Extend offer immediately",        color: "#22c55e", glow: "rgba(34,197,94,0.2)"  },
    HIRE:        { label: "HIRE",         sub: "Proceed with offer",              color: "#86efac", glow: "rgba(134,239,172,0.15)"},
    MAYBE:       { label: "MAYBE",        sub: "Team calibration required",       color: "#f59e0b", glow: "rgba(245,158,11,0.18)"},
    REJECT:      { label: "REJECT",       sub: criticalPassed ? "Score below threshold" : "Critical hurdle failed",
                   color: "#ef4444", glow: "rgba(239,68,68,0.18)" },
  }[decision];

  useEffect(() => setAnimKey(k => k + 1), [decision]);

  const tabs = ["overview", "competencies", "salary", "report"];

  return (
    <div style={{ minHeight: "100vh", background: "#080b10", color: "#e2e8f0", fontFamily: "'Courier New', monospace" }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 70% 15%, rgba(99,102,241,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(245,158,11,0.04) 0%, transparent 70%)" }}/>
      {/* Scanlines */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.025,
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.5) 2px,rgba(255,255,255,0.5) 4px)",
        backgroundSize: "100% 4px" }}/>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", padding: "24px 18px" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ fontSize: "9px", color: "#f59e0b", letterSpacing: "4px", marginBottom: "3px", opacity: 0.8 }}>
              PULSE DIGITAL — TALENT ACQUISITION SYSTEM v2.1
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#f8fafc", letterSpacing: "-0.3px" }}>
              Hiring Assessment Dashboard
            </h1>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", marginTop: "3px", letterSpacing: "0.8px" }}>
              T-SHAPED MARKETER · NON-COMPENSATORY MODEL · DIGITAL MARKETING SPECIALIST
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e",
              boxShadow: "0 0 8px #22c55e", animation: "blink 2s infinite" }}/>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>LIVE</span>
          </div>
        </div>

        {/* Grid: sidebar + main */}
        <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", gap: "18px" }}>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Candidate name */}
            <div style={card}>
              <SectionLabel>CANDIDATE</SectionLabel>
              <input value={candName} onChange={e => setCandName(e.target.value)} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px", padding: "7px 10px", color: "#f8fafc",
                fontSize: "13px", fontFamily: "monospace", width: "100%",
                outline: "none", letterSpacing: "0.4px",
              }}/>
            </div>

            {/* Competency sliders */}
            <div style={card}>
              <SectionLabel>
                COMPETENCY SCORES &nbsp;
                <span style={{ color: "#ef4444", fontSize: "8px" }}>★ = CRITICAL</span>
              </SectionLabel>
              {COMPETENCIES.map(c => (
                <Slider key={c.key} label={c.label} value={scores[c.key]} onChange={setScore(c.key)} critical={c.critical}/>
              ))}
            </div>

            {/* Culture */}
            <div style={card}>
              <SectionLabel>CULTURE & SOFT SKILLS</SectionLabel>
              <Slider label="Overall Culture Fit" value={cultureFit} onChange={setCultureFit}/>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "4px" }}>
                {CULTURE_DIMENSIONS.map(d => (
                  <span key={d} style={{ fontSize: "8px", padding: "3px 7px", borderRadius: "4px",
                    background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div style={card}>
              <SectionLabel>SALARY EXPECTATION</SectionLabel>
              <Slider label="Annual Request (IDR)" value={salaryReq} onChange={setSalaryReq}
                min={80000000} max={300000000} step={5000000} unit="IDR"/>
              <div style={{ textAlign: "center", fontSize: "16px", color: "#f59e0b", fontWeight: "800", marginTop: "4px" }}>
                Rp {(salaryReq/1000000).toFixed(0)}jt / yr
              </div>
            </div>
          </div>

          {/* ── MAIN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Decision banner */}
            <div key={animKey} style={{
              padding: "22px 26px",
              background: `${DC.color}09`,
              border: `1px solid ${DC.color}35`,
              borderRadius: "14px",
              boxShadow: `0 0 40px ${DC.glow}`,
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px",
            }}>
              <div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "2px", marginBottom: "5px" }}>HIRING DECISION</div>
                <div style={{ fontSize: "34px", fontWeight: "900", color: DC.color, letterSpacing: "-1px", lineHeight: 1 }}>{DC.label}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "5px" }}>{DC.sub}</div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[
                  { lbl: "Technical",   val: weightedScore.toFixed(2), sub: "Weighted ×0.75" },
                  { lbl: "Culture",     val: cultureFit.toFixed(1),    sub: "Soft Skills ×0.25" },
                  { lbl: "Final",       val: finalScore.toFixed(2),    sub: "Composite",  hi: true },
                  { lbl: "Min Hire",    val: "3.50",                   sub: "Threshold" },
                ].map(({ lbl, val, sub, hi }) => (
                  <div key={lbl} style={{
                    textAlign: "center", padding: "10px 14px", minWidth: "80px",
                    background: hi ? `${DC.color}18` : "rgba(255,255,255,0.04)",
                    borderRadius: "10px",
                    border: hi ? `1px solid ${DC.color}45` : "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize: "20px", fontWeight: "800", fontFamily: "monospace", color: hi ? DC.color : "#f8fafc" }}>{val}</div>
                    <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>{lbl}</div>
                    <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.22)" }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hurdle chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {[
                { lbl: "Critical Hurdles",    pass: criticalPassed, detail: "Analytics & Paid Ads ≥ 3.5" },
                { lbl: "No Comp. Below 3",    pass: noCompBelow3,   detail: "Non-Compensatory Rule" },
                { lbl: "Culture Threshold",   pass: cultureFit >= 3, detail: "Soft Skills ≥ 3.0" },
              ].map(({ lbl, pass, detail }) => (
                <div key={lbl} style={{
                  padding: "12px 14px", borderRadius: "10px",
                  background: pass ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                  border: `1px solid ${pass ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "13px", color: pass ? "#22c55e" : "#ef4444" }}>{pass ? "✓" : "✗"}</span>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: pass ? "#86efac" : "#fca5a5" }}>{lbl}</span>
                  </div>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.28)" }}>{detail}</div>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: "3px", padding: "4px", background: "rgba(255,255,255,0.03)",
              borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  flex: 1, padding: "8px", borderRadius: "7px", border: "none", cursor: "pointer",
                  background: activeTab === t ? "rgba(245,158,11,0.14)" : "transparent",
                  color: activeTab === t ? "#f59e0b" : "rgba(255,255,255,0.35)",
                  fontSize: "9px", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase",
                  fontWeight: activeTab === t ? "700" : "400",
                  borderBottom: activeTab === t ? "2px solid #f59e0b" : "2px solid transparent",
                  transition: "all 0.2s",
                }}>
                  {t}
                </button>
              ))}
            </div>

            {/* ── TAB: OVERVIEW ── */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <SectionLabel style={{ alignSelf: "flex-start" }}>SKILL RADAR · vs IDEAL</SectionLabel>
                  <RadarChart scores={scores} ideal={IDEAL_SCORES} size={270}/>
                  <div style={{ display: "flex", gap: "14px", marginTop: "10px" }}>
                    {[{ c: "#f59e0b", l: "CANDIDATE" }, { c: "#6366f1", l: "IDEAL", dash: true }].map(({ c, l, dash }) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "18px", height: "2px", background: c, borderTop: dash ? "1px dashed" : "none", borderColor: c }}/>
                        <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={card}>
                  <SectionLabel>COMPETENCY BREAKDOWN</SectionLabel>
                  {COMPETENCIES.map(c => (
                    <ScoreGauge key={c.key} score={scores[c.key]} label={c.label} critical={c.critical}/>
                  ))}
                  <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <ScoreGauge score={cultureFit} label="Culture & Soft Skills"/>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: COMPETENCIES ── */}
            {activeTab === "competencies" && (
              <div style={card}>
                <SectionLabel>8-COMPETENCY FRAMEWORK ANALYSIS</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                  {COMPETENCIES.map(c => {
                    const s = scores[c.key];
                    const gap = IDEAL_SCORES[c.key] - s;
                    const st = s < 3 ? { l: "BELOW MINIMUM", c: "#ef4444" }
                      : s < 3.5 ? { l: "NEEDS DEV", c: "#f97316" }
                      : s < 4   ? { l: "MEETS STD", c: "#eab308" }
                      : s < 4.5 ? { l: "EXCEEDS STD", c: "#22c55e" }
                      : { l: "EXCEPTIONAL", c: "#86efac" };
                    return (
                      <div key={c.key} style={{
                        padding: "12px", borderRadius: "9px",
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${c.critical && s < 3.5 ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <div>
                            <div style={{ fontSize: "10px", color: "#f8fafc", fontWeight: "700" }}>{c.icon} {c.label}</div>
                            {c.critical && <div style={{ fontSize: "7px", color: "#ef4444", marginTop: "1px" }}>CRITICAL HURDLE</div>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "18px", fontWeight: "800", color: st.c }}>{s.toFixed(1)}</div>
                            <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.25)" }}>/ {IDEAL_SCORES[c.key]} ideal</div>
                          </div>
                        </div>
                        <div style={{ fontSize: "8px", color: st.c, marginBottom: "4px", letterSpacing: "0.4px" }}>{st.l}</div>
                        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>
                          Weight: {(c.weight*100).toFixed(0)}% · Gap: <span style={{ color: gap > 0 ? "#f97316" : "#22c55e" }}>
                            {gap > 0 ? "−" : "+"}{Math.abs(gap).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "12px 14px", borderRadius: "9px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div style={{ fontSize: "8px", color: "#a5b4fc", letterSpacing: "1px", marginBottom: "6px" }}>T-SHAPED PROFILE</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: "1.7" }}>
                    Deep expertise → Analytics <span style={{ color: "#f59e0b" }}>{scores.analytics.toFixed(1)}</span> · Paid Ads <span style={{ color: "#f59e0b" }}>{scores.paid_ads.toFixed(1)}</span>
                    <br/>Broad skills avg → <span style={{ color: "#f59e0b" }}>{((scores.copywriting + scores.social + scores.seo + scores.email)/4).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: SALARY ── */}
            {activeTab === "salary" && (
              <div style={card}>
                <SectionLabel>COMPENSATION ANALYSIS · IDR MARKET DATA Q1 2025</SectionLabel>
                <SalaryMeter requested={salaryReq}/>
                <div style={{ marginTop: "18px", padding: "14px", borderRadius: "9px",
                  background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <div style={{ fontSize: "8px", color: "#f59e0b", letterSpacing: "1px", marginBottom: "10px" }}>TOTAL COMPENSATION PACKAGE</div>
                  {[
                    { l: "Base Salary",          v: `Rp ${(salaryReq/1000000).toFixed(0)}jt/yr` },
                    { l: "Health Benefits (est.)",v: "Rp 26jt/yr" },
                    { l: "Professional Dev",      v: "Rp 23jt/yr" },
                    { l: "PTO Value (est.)",       v: "Rp 20jt/yr" },
                  ].map(({ l, v }) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between",
                      padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "11px" }}>
                      <span style={{ color: "rgba(255,255,255,0.45)" }}>{l}</span>
                      <span style={{ color: "#f8fafc", fontWeight: "700" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "700" }}>Total Package</span>
                    <span style={{ fontSize: "14px", color: "#f59e0b", fontWeight: "800" }}>
                      Rp {((salaryReq + 69000000)/1000000).toFixed(0)}jt/yr
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: REPORT ── */}
            {activeTab === "report" && (
              <div style={card}>
                <SectionLabel>HIRING COMMITTEE REPORT · AUTO-GENERATED</SectionLabel>
                <div style={{ padding: "16px", background: "rgba(0,0,0,0.35)", borderRadius: "8px",
                  fontFamily: "monospace", fontSize: "11px", lineHeight: "1.85",
                  color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "14px" }}>
                  <div style={{ color: "#f59e0b", marginBottom: "12px", fontSize: "13px", fontWeight: "700" }}>
                    PULSE DIGITAL — CANDIDATE ASSESSMENT REPORT
                  </div>
                  <Row lbl="Candidate"  val={candName}/>
                  <Row lbl="Position"   val="Digital Marketing Specialist"/>
                  <Row lbl="Date"       val={new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}/>
                  <Divider/>
                  <div style={{ color: "#a5b4fc", marginBottom: "5px" }}>SCORING SUMMARY</div>
                  <Row lbl="Technical (Weighted)" val={`${weightedScore.toFixed(3)} / 5.000`} valColor="#f59e0b"/>
                  <Row lbl="Culture Fit"          val={`${cultureFit.toFixed(1)} / 5.0`}      valColor="#f59e0b"/>
                  <Row lbl="Final Composite"      val={`${finalScore.toFixed(3)} / 5.000`}     valColor={DC.color}/>
                  <Divider/>
                  <div style={{ color: "#a5b4fc", marginBottom: "5px" }}>CRITICAL HURDLES</div>
                  <Row lbl="Analytics (≥3.5)"    val={`${scores.analytics >= 3.5 ? "PASS" : "FAIL"} (${scores.analytics.toFixed(1)})`} valColor={scores.analytics >= 3.5 ? "#22c55e" : "#ef4444"}/>
                  <Row lbl="Paid Ads (≥3.5)"     val={`${scores.paid_ads >= 3.5 ? "PASS" : "FAIL"} (${scores.paid_ads.toFixed(1)})`}   valColor={scores.paid_ads >= 3.5 ? "#22c55e" : "#ef4444"}/>
                  <Row lbl="No Comp Below 3"     val={noCompBelow3 ? "PASS" : "FAIL"}   valColor={noCompBelow3 ? "#22c55e" : "#ef4444"}/>
                  <Divider/>
                  <div style={{ color: "#a5b4fc", marginBottom: "5px" }}>SALARY</div>
                  <Row lbl="Requested"           val={`Rp ${(salaryReq/1000000).toFixed(0)}jt/yr`} valColor="#f59e0b"/>
                  <Row lbl="Budget Range"        val="Rp 165–225jt/yr"/>
                  <Row lbl="Within Budget"       val={salaryReq <= SALARY_BANDS.max ? "YES" : "NO — ESCALATE"} valColor={salaryReq <= SALARY_BANDS.max ? "#22c55e" : "#ef4444"}/>
                  <Divider/>
                  <div style={{ fontSize: "15px", fontWeight: "900", color: DC.color, letterSpacing: "1.5px" }}>
                    RECOMMENDATION: {DC.label}
                  </div>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                    Generated by Pulse Digital Hiring Assistant v2.1 · Schmidt & Hunter (2016) methodology
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { lbl: "Strengths",         items: COMPETENCIES.filter(c => scores[c.key] >= 4).map(c => c.label), color: "#22c55e" },
                    { lbl: "Development Areas", items: COMPETENCIES.filter(c => scores[c.key] < 3.5).map(c => c.label), color: "#f97316" },
                  ].map(({ lbl, items, color }) => (
                    <div key={lbl} style={{ padding: "12px", borderRadius: "8px",
                      background: `${color}07`, border: `1px solid ${color}22` }}>
                      <div style={{ fontSize: "8px", color, letterSpacing: "1px", marginBottom: "7px" }}>{lbl.toUpperCase()}</div>
                      {items.length === 0
                        ? <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>None identified</div>
                        : items.map(i => <div key={i} style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", marginBottom: "3px" }}>· {i}</div>)
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "8px",
          color: "rgba(255,255,255,0.12)", letterSpacing: "1.5px" }}>
          PULSE DIGITAL HIRING SYSTEM · D&I COMPLIANT · BLIND SCREENING ACTIVE · SCHMIDT & HUNTER (2016)
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        *{box-sizing:border-box}
        input[type=range]{height:4px}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#080b10}
        ::-webkit-scrollbar-thumb{background:#f59e0b40;border-radius:2px}
      `}</style>
    </div>
  );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const card = {
  padding: "16px", background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px",
};

function SectionLabel({ children }) {
  return <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.28)", letterSpacing: "2px", marginBottom: "12px" }}>{children}</div>;
}

function Row({ lbl, val, valColor = "#f8fafc" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "rgba(255,255,255,0.45)" }}>{lbl}:</span>
      <span style={{ color: valColor, fontWeight: "600" }}>{val}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ margin: "10px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}/>;
}

