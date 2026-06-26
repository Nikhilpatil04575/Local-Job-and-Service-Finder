import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection  from "../components/HeroSection.jsx";
import HowItWorks   from "../components/HowItWorks.jsx";
import Footer       from "../components/Footer.jsx";
import CategoryCard from "../components/CategoryCard.jsx";

const CATEGORIES = [
  { title: "Plumber",     icon: "🔧", count: 12 },
  { title: "Electrician", icon: "⚡", count: 8  },
  { title: "Housemaid",   icon: "🧹", count: 15 },
  { title: "Painter",     icon: "🎨", count: 7  },
  { title: "Driver",      icon: "🚗", count: 11 },
];

const Home = () => {
  const navigate   = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleCategoryClick = (title) => {
    isLoggedIn
      ? navigate(`/user/services/${encodeURIComponent(title)}`)
      : navigate("/auth/user/login");
  };

  return (
    <>
      <HeroSection />

      {/* Popular Categories */}
      <section style={s.section}>
        <div style={s.inner}>
          <div style={s.head}>
            <span style={s.eyebrow}>Browse by category</span>
            <h2 style={s.h2}>Popular categories</h2>
            <p style={s.sub}>
              Tap any category to find verified providers near you
            </p>
          </div>

          <div style={s.grid}>
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.title}
                title={cat.title}
                icon={cat.icon}
                count={cat.count}
                onClick={() => handleCategoryClick(cat.title)}
              />
            ))}
          </div>

          {!isLoggedIn && (
            <p style={s.loginHint}>
              👋 Please{" "}
              <span
                onClick={() => navigate("/auth/user/login")}
                style={{ color: "#818cf8", cursor: "pointer", textDecoration: "underline" }}
              >
                sign in
              </span>{" "}
              to view available providers
            </p>
          )}
        </div>
      </section>

      <HowItWorks />
      <Footer />
    </>
  );
};

export default Home;

const s = {
  section: {
    background: "#0d1117",
    padding: "72px 24px 80px",
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  head: {
    textAlign: "center",
    marginBottom: "48px",
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
    fontSize: "clamp(24px, 3.5vw, 36px)",
    fontWeight: 700,
    color: "#f1f5f9",
    lineHeight: 1.2,
    marginBottom: "10px",
  },
  sub: {
    fontSize: "15px",
    color: "#64748b",
    maxWidth: "440px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "14px",
  },
  loginHint: {
    textAlign: "center",
    marginTop: "28px",
    fontSize: "14px",
    color: "#475569",
  },
};