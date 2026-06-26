import React from "react";

/* ── data ─────────────────────────────────────────────── */
const steps = [
  {
    id: 1,
    badge: "Step 1",
    title: "Search service",
    desc: "Find verified professionals near you using location, price, and rating filters.",
    points: [
      "Enable location or enter your area",
      "Filter by category & budget",
      "See distance & ETA on map",
    ],
    tip: 'Use "Near me" for the fastest matches.',
    accent: {
      dot: "#818cf8",
      badge: { color: "#818cf8", bg: "rgba(99,102,241,.12)", border: "rgba(99,102,241,.25)" },
      icon:  { bg: "rgba(99,102,241,.15)", stroke: "#818cf8" },
    },
    icon: (stroke) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  {
    id: 2,
    badge: "Step 2",
    title: "Book instantly",
    desc: "Pick a slot that works for you and confirm with one click — no back-and-forth.",
    points: [
      "Real-time provider availability",
      "Secure payment (COD / Online)",
      "Instant booking confirmation",
    ],
    tip: "No hidden fees — all charges shown upfront.",
    accent: {
      dot: "#fbbf24",
      badge: { color: "#fbbf24", bg: "rgba(245,158,11,.10)", border: "rgba(245,158,11,.22)" },
      icon:  { bg: "rgba(245,158,11,.12)", stroke: "#fbbf24" },
    },
    icon: (stroke) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <polyline points="9 16 11 18 15 14"/>
      </svg>
    ),
  },
  {
    id: 3,
    badge: "Step 3",
    title: "Get it done",
    desc: "Track the job live, receive a digital invoice, and rate your experience.",
    points: [
      "Live updates: on the way / started",
      "Digital invoice & warranty",
      "Rate & review to help others",
    ],
    tip: "Reschedule or cancel anytime from My Bookings.",
    accent: {
      dot: "#34d399",
      badge: { color: "#34d399", bg: "rgba(52,211,153,.10)", border: "rgba(52,211,153,.22)" },
      icon:  { bg: "rgba(52,211,153,.12)", stroke: "#34d399" },
    },
    icon: (stroke) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <polyline points="9 15 11 17 15 13"/>
      </svg>
    ),
  },
];

/* ── InfoIcon ─────────────────────────────────────────── */
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="#475569" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

/* ── StepCard ─────────────────────────────────────────── */
const StepCard = ({ step }) => {
  const { accent } = step;
  return (
    <div style={s.card}>
      {/* big ghost number */}
      <span style={s.ghost}>0{step.id}</span>

      {/* icon */}
      <div style={{ ...s.iconWrap, background: accent.icon.bg }}>
        {step.icon(accent.icon.stroke)}
      </div>

      {/* badge */}
      <span style={{
        ...s.badge,
        color: accent.badge.color,
        background: accent.badge.bg,
        border: `1px solid ${accent.badge.border}`,
      }}>
        {step.badge}
      </span>

      <h3 style={s.h3}>{step.title}</h3>
      <p style={s.desc}>{step.desc}</p>

      {/* bullet points */}
      <ul style={s.list}>
        {step.points.map((pt, i) => (
          <li key={i} style={s.listItem}>
            <span style={{ ...s.dot, background: accent.dot }} />
            {pt}
          </li>
        ))}
      </ul>

      {/* tip */}
      <div style={s.tip}>
        <InfoIcon />
        <span>{step.tip}</span>
      </div>
    </div>
  );
};

/* ── HowItWorks ───────────────────────────────────────── */
const HowItWorks = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');`}</style>
    <section style={s.section}>
      {/* header */}
      <div style={s.head}>
        <span style={s.eyebrow}>Simple process</span>
        <h2 style={s.h2}>How it works</h2>
        <p style={s.sub}>From search to service completion — in three simple steps.</p>
      </div>

      {/* grid */}
      <div style={s.grid}>
        {steps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>
    </section>
  </>
);

export default HowItWorks;

/* ── styles ───────────────────────────────────────────── */
const s = {
  section: {
    background: "#0B0F1A",
    padding: "72px 24px 80px",
    fontFamily: "'DM Sans', sans-serif",
  },
  head: {
    textAlign: "center",
    marginBottom: "52px",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "#818cf8",
    background: "rgba(99,102,241,.12)",
    border: "1px solid rgba(99,102,241,.28)",
    borderRadius: "100px",
    padding: "4px 14px",
    marginBottom: "16px",
  },
  h2: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(26px, 4vw, 40px)",
    fontWeight: 700,
    color: "#f1f5f9",
    lineHeight: 1.15,
    marginBottom: "12px",
  },
  sub: {
    fontSize: "15px",
    color: "#64748b",
    maxWidth: "480px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "2px",
    maxWidth: "960px",
    margin: "0 auto",
    background: "rgba(255,255,255,.06)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.07)",
  },
  card: {
    background: "#0f1420",
    padding: "36px 28px 32px",
    position: "relative",
    transition: "background .2s",
  },
  ghost: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "56px",
    fontWeight: 700,
    color: "rgba(99,102,241,.10)",
    lineHeight: 1,
    position: "absolute",
    top: "20px",
    right: "24px",
    userSelect: "none",
    pointerEvents: "none",
  },
  iconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".06em",
    borderRadius: "100px",
    padding: "3px 10px",
    marginBottom: "14px",
  },
  h3: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "18px",
    fontWeight: 600,
    color: "#e2e8f0",
    marginBottom: "8px",
  },
  desc: {
    fontSize: "13.5px",
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: "20px",
  },
  list: {
    listStyle: "none",
    marginBottom: "20px",
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "13px",
    color: "#94a3b8",
    padding: "5px 0",
    borderBottom: "1px solid rgba(255,255,255,.04)",
  },
  dot: {
    marginTop: "5px",
    flexShrink: 0,
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  tip: {
    fontSize: "12px",
    color: "#475569",
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    lineHeight: 1.5,
  },
};