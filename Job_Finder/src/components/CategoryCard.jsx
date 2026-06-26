import React from "react";

const CategoryCard = ({ title, icon, count, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={s.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
        e.currentTarget.style.background = "rgba(99,102,241,0.08)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={s.iconWrap}>{icon}</div>
      <div style={s.title}>{title}</div>
      {count !== undefined && (
        <div style={s.count}>{count} providers</div>
      )}
    </div>
  );
};

export default CategoryCard;

const s = {
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px 16px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'DM Sans', sans-serif",
  },
  iconWrap: {
    fontSize: "36px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#e2e8f0",
    marginBottom: "4px",
  },
  count: {
    fontSize: "12px",
    color: "#475569",
  },
};