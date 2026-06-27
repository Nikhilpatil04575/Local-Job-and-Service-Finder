import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const ALL_SERVICES = [
  { name: "Plumber",          icon: "🔧", desc: "Pipe repairs, leaks, installations" },
  { name: "Electrician",      icon: "⚡", desc: "Wiring, fuse box, appliance fitting" },
  { name: "Housemaid",        icon: "🧹", desc: "Daily or part-time cleaning" },
  { name: "Carpenter",        icon: "🪚", desc: "Furniture, doors, custom woodwork" },
  { name: "AC Repair",        icon: "❄️", desc: "Servicing, gas refill, installation" },
  { name: "Appliance Repair", icon: "🛠️", desc: "Washing machine, fridge, microwave" },
  { name: "Painter",          icon: "🎨", desc: "Interior, exterior, texture painting" },
  { name: "Driver",           icon: "🚗", desc: "Daily driver, outstation trips" },
  { name: "Nurse / Caretaker",icon: "💊", desc: "Elder care, post-surgery support" },
  { name: "Tutor",            icon: "📚", desc: "Home tuition for all subjects" },
  { name: "Pest Control",     icon: "🐛", desc: "Cockroach, termite, bed bug treatment" },
  { name: "IT Support",       icon: "💻", desc: "PC setup, network, software help" },
  { name: "Handyman",         icon: "🔨", desc: "General repairs & installations" },
];

const CITIES = ["All cities", "Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];

const Services = () => {
  const navigate  = useNavigate();
  const [query, setQuery]   = useState("");
  const [city, setCity]     = useState("All cities");

  const filtered = ALL_SERVICES.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleServiceClick = (serviceName) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const cityParam  = city !== "All cities" ? `?city=${encodeURIComponent(city)}` : "";
    if (isLoggedIn) {
      navigate(`/user/services/${encodeURIComponent(serviceName)}${cityParam}`);
    } else {
      navigate("/auth/user/login");
    }
  };

  return (
    <div style={s.page}>

      {/* Hero */}
      <div style={s.hero}>
        <span style={s.eyebrow}>All services</span>
        <h1 style={s.h1}>What do you need help with?</h1>
        <p style={s.sub}>Browse from {ALL_SERVICES.length}+ service categories</p>

        {/* Search + city bar */}
        <div style={s.searchBar}>
          <div style={s.searchField}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              style={s.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a service (e.g. plumber, tutor...)"
            />
          </div>
          <div style={s.divider} />
          <div style={s.cityField}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z"/>
            </svg>
            <select
              style={s.citySelect}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {CITIES.map((c) => <option key={c} style={{ background: "#0B0F1A", color: "#e2e8f0" }}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={s.body}>
        {filtered.length === 0 ? (
          <div style={s.empty}>
            No services found for "{query}". Try a different keyword.
          </div>
        ) : (
          <>
            <p style={s.resultCount}>
              {filtered.length} service{filtered.length !== 1 ? "s" : ""} available
              {city !== "All cities" ? ` in ${city}` : ""}
            </p>
            <div style={s.grid}>
              {filtered.map((svc) => (
                <ServiceCard
                  key={svc.name}
                  svc={svc}
                  onClick={() => handleServiceClick(svc.name)}
                />
              ))}
            </div>
          </>
        )}

        {localStorage.getItem("isLoggedIn") !== "true" && (
          <div style={s.loginBanner}>
            <span>
              👋 Please{" "}
              <a href="/auth/user/login" style={{ color: "#818cf8", textDecoration: "none" }}>
                sign in
              </a>{" "}
              to view available providers near you
            </span>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const ServiceCard = ({ svc, onClick }) => (
  <div
    onClick={onClick}
    style={card.wrap}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
      e.currentTarget.style.background  = "rgba(99,102,241,0.07)";
      e.currentTarget.style.transform   = "translateY(-3px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      e.currentTarget.style.background  = "rgba(255,255,255,0.03)";
      e.currentTarget.style.transform   = "translateY(0)";
    }}
  >
    <div style={card.icon}>{svc.icon}</div>
    <div style={card.name}>{svc.name}</div>
    <div style={card.desc}>{svc.desc}</div>
    <div style={card.cta}>
      View providers
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </div>
  </div>
);

export default Services;

const s = {
  page: {
    background: "#0B0F1A",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
  },
  hero: {
    padding: "56px 24px 48px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  h1: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(26px, 4vw, 40px)",
    fontWeight: 700,
    color: "#f1f5f9",
    lineHeight: 1.2,
    marginBottom: "10px",
  },
  sub: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "32px",
  },
  searchBar: {
    width: "100%",
    maxWidth: "680px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    flexWrap: "wrap",
  },
  searchField: {
    flex: 2,
    minWidth: "200px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 18px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e2e8f0",
    fontSize: "14px",
    fontFamily: "inherit",
    width: "100%",
  },
  divider: {
    width: "1px",
    height: "24px",
    background: "rgba(255,255,255,0.07)",
    flexShrink: 0,
  },
  cityField: {
    flex: 1,
    minWidth: "140px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 18px",
  },
  citySelect: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e2e8f0",
    fontSize: "14px",
    fontFamily: "inherit",
    cursor: "pointer",
    width: "100%",
  },
  body: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px 80px",
  },
  resultCount: {
    fontSize: "13px",
    color: "#475569",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
  },
  empty: {
    textAlign: "center",
    color: "#475569",
    fontSize: "15px",
    padding: "80px 0",
  },
  loginBanner: {
    marginTop: "32px",
    padding: "14px 20px",
    background: "rgba(99,102,241,0.06)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "12px",
    color: "#64748b",
    fontSize: "14px",
    textAlign: "center",
  },
};

const card = {
  wrap: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px 20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  icon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  name: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#e2e8f0",
    marginBottom: "6px",
  },
  desc: {
    fontSize: "12px",
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: "14px",
  },
  cta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#818cf8",
    fontWeight: 500,
  },
};