import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const initials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName   = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      {/* Logo */}
      <div style={s.logo}>
        Local<span style={s.accent}>Jobs</span>
      </div>

      {/* Desktop links */}
      <div style={s.links}>
        {[
          { label: "Home",     path: "/" },
          { label: "Services", path: "/services" },
        ].map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              ...s.link,
              color: isActive(path) ? "#e2e8f0" : "#94a3b8",
              background: isActive(path) ? "rgba(255,255,255,0.06)" : "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "#e2e8f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isActive(path)
                ? "rgba(255,255,255,0.06)" : "transparent";
              e.currentTarget.style.color = isActive(path) ? "#e2e8f0" : "#94a3b8";
            }}
          >
            {label}
          </button>
        ))}

        <div style={s.divider} />

        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/user/dashboard")}
              style={{
                ...s.link,
                color: isActive("/user/dashboard") ? "#e2e8f0" : "#94a3b8",
                background: isActive("/user/dashboard") ? "rgba(255,255,255,0.06)" : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isActive("/user/dashboard")
                  ? "rgba(255,255,255,0.06)" : "transparent";
                e.currentTarget.style.color = isActive("/user/dashboard") ? "#e2e8f0" : "#94a3b8";
              }}
            >
              Dashboard
            </button>
            <div style={s.userChip}>
              <div style={s.avatar}>{initials(userName)}</div>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                {userName.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={s.btnLogout}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.14)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.06)"}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/auth/user/login")}
              style={s.btnLogin}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.18)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/sp/register")}
              style={s.btnJoin}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Join Now
            </button>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        style={s.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        )}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          {[
            { label: "Home",     path: "/" },
            { label: "Services", path: "/services" },
          ].map(({ label, path }) => (
            <button key={path} style={s.mobileLink}
              onClick={() => { navigate(path); setMenuOpen(false); }}>
              {label}
            </button>
          ))}
          {isLoggedIn ? (
            <>
              <button style={s.mobileLink}
                onClick={() => { navigate("/user/dashboard"); setMenuOpen(false); }}>
                Dashboard
              </button>
              <button style={{ ...s.mobileLink, color: "#f87171" }}
                onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button style={s.mobileLink}
                onClick={() => { navigate("/auth/user/login"); setMenuOpen(false); }}>
                Login
              </button>
              <button style={{ ...s.mobileLink, color: "#818cf8" }}
                onClick={() => { navigate("/auth/sp/register"); setMenuOpen(false); }}>
                Join as Provider
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

const s = {
  nav: {
    background: "#0B0F1A",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    padding: "0 24px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "'DM Sans', sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "20px",
    fontWeight: 700,
    color: "#f1f5f9",
    letterSpacing: "-0.3px",
    userSelect: "none",
    flexShrink: 0,
  },
  accent: { color: "#818cf8" },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    "@media (max-width: 768px)": { display: "none" },
  },
  link: {
    fontSize: "13.5px",
    fontWeight: 400,
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.15s, color 0.15s",
    background: "transparent",
  },
  divider: {
    width: "1px",
    height: "20px",
    background: "rgba(255,255,255,0.08)",
    margin: "0 6px",
  },
  btnLogin: {
    fontSize: "13.5px",
    fontWeight: 500,
    color: "#818cf8",
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.35)",
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.15s, border-color 0.15s",
  },
  btnJoin: {
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#fff",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    border: "none",
    padding: "7px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.15s",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "100px",
    padding: "4px 12px 4px 6px",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "rgba(99,102,241,0.2)",
    border: "1px solid rgba(99,102,241,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    color: "#a5b4fc",
    flexShrink: 0,
  },
  btnLogout: {
    fontSize: "12.5px",
    fontWeight: 500,
    color: "#f87171",
    background: "rgba(248,113,113,0.06)",
    border: "1px solid rgba(248,113,113,0.25)",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.15s",
  },
  hamburger: {
    display: "none",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    "@media (max-width: 768px)": { display: "flex" },
  },
  mobileMenu: {
    position: "absolute",
    top: "60px",
    left: 0,
    right: 0,
    background: "#0f1420",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    padding: "12px 0",
    zIndex: 99,
  },
  mobileLink: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "14px",
    padding: "12px 24px",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
};