import React from "react";

const Footer = () => {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>

        {/* Brand */}
        <div style={s.col}>
          <div style={s.logo}>
            Local<span style={{ color: "#818cf8" }}>Jobs</span>
          </div>
          <p style={s.brandText}>
            Your trusted platform to connect with nearby service professionals —
            plumbers, electricians, cleaners, tutors, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div style={s.col}>
          <h3 style={s.colTitle}>Quick links</h3>
          <ul style={s.list}>
            {[
              { label: "Home",     href: "/" },
              { label: "Services", href: "/services" },
              { label: "About",    href: "/about" },
              { label: "Contact",  href: "/contact" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} style={s.footLink}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div style={s.col}>
          <h3 style={s.colTitle}>Popular services</h3>
          <ul style={s.list}>
            {["Plumber", "Electrician", "Housemaid", "Painter", "Tutor"].map((s) => (
              <li key={s} style={{ color: "#64748b", fontSize: "13px", padding: "3px 0" }}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div style={s.col}>
          <h3 style={s.colTitle}>Contact us</h3>
          <p style={s.contactText}>
            <a href="mailto:support@localjobs.com" style={{ color: "#818cf8" }}>
              support@localjobs.com
            </a>
          </p>
          <p style={s.contactText}>+91 98765 43210</p>
          <div style={s.socials}>
            {["FB", "TW", "IN", "IG"].map((icon) => (
              <a key={icon} href="#" style={s.socialBtn}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={s.bottom}>
        <p style={{ color: "#334155", fontSize: "12px" }}>
          © {new Date().getFullYear()} LocalJobs. All rights reserved.
        </p>
        <p style={{ color: "#1e293b", fontSize: "11px", marginTop: "4px" }}>
          Designed with ♥ by the LocalJobs Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;

const s = {
  footer: {
    background: "#080c14",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "60px 24px 24px",
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    marginBottom: "48px",
  },
  col: {},
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "20px",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "12px",
  },
  brandText: {
    fontSize: "13px",
    color: "#475569",
    lineHeight: 1.7,
    maxWidth: "260px",
  },
  colTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "16px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  footLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "13px",
    display: "block",
    padding: "3px 0",
    transition: "color 0.15s",
  },
  contactText: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "6px",
  },
  socials: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
  },
  socialBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "border-color 0.15s",
  },
  bottom: {
    maxWidth: "1100px",
    margin: "0 auto",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255,255,255,0.04)",
    textAlign: "center",
  },
};