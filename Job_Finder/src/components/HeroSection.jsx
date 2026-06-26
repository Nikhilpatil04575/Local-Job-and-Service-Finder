import React, { useState } from "react";

const CATEGORIES = [
  "Plumber", "Electrician", "Housemaid", "Carpenter",
  "Painter", "Driver", "Tutor", "Nurse", "Handyman",
];

// Capitals of Indian states (city names)
const INDIAN_STATE_CAPITALS = [
  "Amaravati", "Itanagar", "Dispur", "Patna", "Raipur",
  "Panaji", "Gandhinagar", "Chandigarh", "Shimla", "Ranchi",
  "Bengaluru", "Thiruvananthapuram", "Bhopal", "Mumbai",
  "Imphal", "Shillong", "Aizawl", "Kohima", "Bhubaneswar",
  "Chandigarh", "Jaipur", "Gangtok", "Chennai", "Hyderabad",
  "Agartala", "Lucknow", "Dehradun", "Kolkata",
];

// Major cities of Maharashtra
const MAHARASHTRA_CITIES = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad",
  "Thane", "Kolhapur", "Solapur", "Amravati", "Navi Mumbai",
];

const LOCATIONS = Array.from(new Set([...INDIAN_STATE_CAPITALS, ...MAHARASHTRA_CITIES]));

const QUICK_TAGS = [
  "AC Repair", "Plumber", "Electrician",
  "House Cleaning", "Carpenter", "Tutor", "Painter",
];

const STATS = [
  { num: "12,000+", label: "Verified providers" },
  { num: "50+",     label: "Service categories" },
  { num: "4.8★",   label: "Average rating" },
];

export default function HeroSection() {
  const [query, setQuery]       = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const handleSearch = () => {
    console.log({ query, location, category });
  };

  return (
    <section style={styles.hero}>
      {/* glow blobs */}
      <div style={styles.blobTop}    aria-hidden="true" />
      <div style={styles.blobBottom} aria-hidden="true" />

      {/* badge */}
      <div style={styles.badge}>
        <span style={styles.dot} />
        Trusted by 50,000+ homeowners
      </div>

      {/* headline */}
      <h1 style={styles.h1}>
        Find{" "}
        <span style={styles.gradient}>trusted local services</span>
        {" "}near you
      </h1>

      <p style={styles.sub}>
        Plumbers, electricians, tutors, and more — all in one place.
      </p>

      {/* search bar */}
      <div style={styles.bar}>
        {/* location */}
        <Field icon={<PinIcon />}>
          <div
            style={styles.dropdown}
            tabIndex={0}
            onBlur={() => setLocationOpen(false)}
          >
            <button
              type="button"
              style={{
                ...styles.dropdownToggle,
                color: location ? styles.dropdownToggle.color : '#9ca3af'
              }}
              onClick={() => setLocationOpen(v => !v)}
              aria-haspopup="listbox"
              aria-expanded={locationOpen}
            >
              {location || "Select location"}
              <span style={{ float: "right", opacity: 0.8, marginLeft: 8 }}>▾</span>
            </button>

            {locationOpen && (
              <div role="listbox" style={{ ...styles.options, width: 240 }}>
                <div
                  role="option"
                  style={styles.option}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, styles.optionHover)}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, styles.option)}
                  onClick={() => { setLocation(""); setLocationOpen(false); }}
                >
                  Any location
                </div>

                {LOCATIONS.map(loc => (
                  <div
                    key={loc}
                    role="option"
                    style={styles.option}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, styles.optionHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, styles.option)}
                    onMouseDown={e => { e.preventDefault(); setLocation(loc); setLocationOpen(false); }}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Field>

        {/* category */}
        <Field icon={<ListIcon />} divider>
          <div
            style={styles.dropdown}
            tabIndex={0}
            onBlur={() => setCategoryOpen(false)}
          >
            <button
              type="button"
              style={styles.dropdownToggle}
              onClick={() => setCategoryOpen(v => !v)}
              aria-haspopup="listbox"
              aria-expanded={categoryOpen}
            >
              {category || "All categories"}
              <span style={{ float: "right", opacity: 0.8, marginLeft: 8 }}>▾</span>
            </button>

            {categoryOpen && (
              <div role="listbox" style={styles.options}>
                <div
                  role="option"
                  style={styles.option}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, styles.optionHover)}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, styles.option)}
                  onClick={() => { setCategory(""); setCategoryOpen(false); }}
                >
                  All categories
                </div>

                {CATEGORIES.map(c => (
                  <div
                    key={c}
                    role="option"
                    style={styles.option}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, styles.optionHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, styles.option)}
                    onMouseDown={e => { e.preventDefault(); setCategory(c); setCategoryOpen(false); }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Field>

        {/* button */}
        <button style={styles.btn} onClick={handleSearch}>
          <SearchIcon color="#fff" />
          Search
        </button>
      </div>

      {/* quick tags */}
      <div style={styles.tags}>
        {QUICK_TAGS.map(tag => (
          <button
            key={tag}
            style={styles.tag}
            onClick={() => setQuery(tag)}
            onMouseEnter={e => Object.assign(e.currentTarget.style, styles.tagHover)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, styles.tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* stats */}
      <div style={styles.statRow}>
        {STATS.map((s, i) => (
          <React.Fragment key={s.num}>
            {i > 0 && <div style={styles.divider} />}
            <div style={styles.stat}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ── field wrapper ───────────────────────────────────── */
function Field({ icon, children, divider }) {
  return (
    <div style={{
      ...styles.field,
      borderRight: divider ? "1px solid rgba(255,255,255,0.07)" : "none",
    }}>
      <span style={styles.icon}>{icon}</span>
      {children}
    </div>
  );
}

/* ── icons ───────────────────────────────────────────── */
const PinIcon = ({ color = "#818cf8" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ListIcon = ({ color = "#818cf8" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6"  x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6"  x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const SearchIcon = ({ color = "#818cf8" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ── styles ──────────────────────────────────────────── */
const styles = {
  hero: {
    position: "relative",
    overflow: "hidden",
    background: "#0B0F1A",
    minHeight: "520px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px 72px",
    fontFamily: "'DM Sans', sans-serif",
  },
  blobTop: {
    position: "absolute",
    top: "-120px", left: "50%",
    transform: "translateX(-50%)",
    width: "700px", height: "700px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  blobBottom: {
    position: "absolute",
    bottom: "-80px", right: "-80px",
    width: "400px", height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.35)",
    color: "#a5b4fc",
    fontSize: "12px",
    fontWeight: 500,
    padding: "5px 14px",
    borderRadius: "100px",
    marginBottom: "20px",
    letterSpacing: "0.04em",
  },
  dot: {
    display: "inline-block",
    width: "6px", height: "6px",
    borderRadius: "50%",
    background: "#818cf8",
  },
  h1: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(28px, 5vw, 48px)",
    fontWeight: 700,
    color: "#f1f5f9",
    textAlign: "center",
    lineHeight: 1.15,
    maxWidth: "680px",
    marginBottom: "14px",
  },
  gradient: {
    background: "linear-gradient(90deg, #818cf8, #f59e0b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  sub: {
    fontSize: "15px",
    color: "#64748b",
    textAlign: "center",
    marginBottom: "36px",
  },
  bar: {
    width: "100%",
    maxWidth: "780px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    display: "flex",
    flexWrap: "wrap",
    overflow: "visible",
    backdropFilter: "blur(12px)",
  },
  field: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 18px",
    flex: 1,
    minWidth: "160px",
    borderRight: "1px solid rgba(255,255,255,0.07)",
  },
  icon: {
    flexShrink: 0,
    opacity: 0.9,
    display: "flex",
    alignItems: "center",
  },
  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e2e8f0",
    fontSize: "14px",
    fontFamily: "inherit",
    width: "100%",
  },
  // custom select styles
  dropdown: {
    position: "relative",
    width: "100%",
  },
  dropdownToggle: {
    background: "transparent",
    border: "none",
    color: "#e2e8f0",
    fontSize: "13px",
    textAlign: "left",
    width: "100%",
    cursor: "pointer",
    padding: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  options: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    width: "220px",
    background: "#0f1724",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(2,6,23,0.6)",
    zIndex: 60,
    maxHeight: "160px",
    overflowY: "auto",
  },
  option: {
    padding: "8px 12px",
    color: "#cbd5e1",
    fontSize: "13px",
    cursor: "pointer",
  },
  optionHover: {
    background: "#1f2937",
    color: "#fff",
  },
  btn: {
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff",
    border: "none",
    padding: "14px 26px",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "opacity 0.2s",
    minWidth: "140px",
    flex: "0 0 auto",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "28px",
    justifyContent: "center",
  },
  tag: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#94a3b8",
    fontSize: "12px",
    padding: "5px 13px",
    borderRadius: "100px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  tagHover: {
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.4)",
    color: "#a5b4fc",
    transform: "translateY(-2px)",
  },
  statRow: {
    display: "flex",
    gap: "32px",
    marginTop: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  stat: { textAlign: "center" },
  statNum: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    fontWeight: 700,
    color: "#e2e8f0",
  },
  statLabel: {
    fontSize: "12px",
    color: "#475569",
    marginTop: "2px",
  },
  divider: {
    width: "1px",
    height: "36px",
    background: "rgba(255,255,255,0.07)",
  },
};