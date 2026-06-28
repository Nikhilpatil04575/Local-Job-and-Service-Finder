import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsByUser, cancelBooking, submitReview } from "../../lib/api.js";

const SERVICES = [
  { name: "Plumber",           icon: "🔧" },
  { name: "Electrician",       icon: "⚡" },
  { name: "Housemaid",         icon: "🧹" },
  { name: "Carpenter",         icon: "🪚" },
  { name: "AC Repair",         icon: "❄️" },
  { name: "Appliance Repair",  icon: "🛠️" },
  { name: "Painter",           icon: "🎨" },
  { name: "Driver",            icon: "🚗" },
  { name: "Nurse / Caretaker", icon: "💊" },
  { name: "Tutor",             icon: "📚" },
  { name: "Pest Control",      icon: "🐛" },
  { name: "IT Support",        icon: "💻" },
  { name: "Handyman",          icon: "🔨" },
];

const STATUS_STYLE = {
  PENDING:   { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  color: "#fbbf24" },
  CONFIRMED: { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)",  color: "#34d399" },
  REJECTED:  { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", color: "#f87171" },
  COMPLETED: { bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.3)",  color: "#818cf8" },
  CANCELLED: { bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.3)", color: "#64748b" },
};

const initials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const Dashboard = () => {
  const navigate  = useNavigate();
  const [search,   setSearch]   = useState("");
  const [city,     setCity]     = useState("");
  const [tab,      setTab]      = useState("services");
  const [bookings, setBookings] = useState([]);
  const [loadingB, setLoadingB] = useState(false);
  const [toast,    setToast]    = useState("");

  // Rating modal state
  const [ratingModal, setRatingModal] = useState(null); // booking object or null
  const [starVal,     setStarVal]     = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewTxt,   setReviewTxt]   = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [ratedSet,    setRatedSet]    = useState(new Set()); // bookingIds already reviewed

  const userName  = localStorage.getItem("userName") || "User";
  const userId    = localStorage.getItem("userId");
  const firstName = userName.split(" ")[0];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // FIX: getBookingsByUser already returns the array directly (from api.js).
  // Do NOT access .responseMap.data on it — it IS the array.
  useEffect(() => {
    if (tab === "bookings" && userId) {
      setLoadingB(true);
      getBookingsByUser(userId)
        .then((bookingsArray) => {
          // bookingsArray is already the array (api.js extracts responseMap.bookings)
          setBookings(Array.isArray(bookingsArray) ? bookingsArray : []);
        })
        .catch(() => setBookings([]))
        .finally(() => setLoadingB(false));
    }
  }, [tab]);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking({ bookingId });
      setToast("Booking cancelled.");
      setBookings((prev) => prev.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "CANCELLED" } : b
      ));
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setToast(err.message || "Cancel failed.");
      setTimeout(() => setToast(""), 2500);
    }
  };

  const openRateModal = (b) => {
    setRatingModal(b);
    setStarVal(0);
    setHoveredStar(0);
    setReviewTxt("");
  };

  const handleSubmitReview = async () => {
    if (!starVal) { setToast("Please select a star rating."); setTimeout(() => setToast(""), 2000); return; }
    setSubmitting(true);
    try {
      await submitReview({
        bookingId:    ratingModal.id,
        providerId:   ratingModal.providerId,
        userId:       Number(userId),
        userName:     userName,
        providerName: ratingModal.providerName,
        serviceName:  ratingModal.serviceName,
        rating:       starVal,
        comment:      reviewTxt,
      });
      setRatedSet((prev) => new Set([...prev, ratingModal.id]));
      setRatingModal(null);
      setToast("⭐ Review submitted! Thank you.");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast(err.message || "Failed to submit review.");
      setTimeout(() => setToast(""), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceClick = (name) => {
    const cityParam = city ? `?city=${encodeURIComponent(city)}` : "";
    navigate(`/user/services/${encodeURIComponent(name)}${cityParam}`);
  };

  const filtered = SERVICES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={s.page}>

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.logo}>
          Local<span style={{ color: "#818cf8" }}>Jobs</span>
        </div>
        <div style={s.navRight}>
          <div style={s.userChip}>
            <div style={s.avatar}>{initials(userName)}</div>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Hi, {firstName}</span>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.14)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.06)")}>
            Logout
          </button>
        </div>
      </nav>

      <div style={s.body}>

        {/* Greeting */}
        <div style={s.greet}>
          <h1 style={s.h1}>Hello, {firstName} 👋</h1>
          <p style={s.sub}>Find services or track your bookings</p>
        </div>

        {/* Toast */}
        {toast && <div style={s.toast}>{toast}</div>}

        {/* Tabs */}
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === "services"  ? s.tabActive : {}) }}
            onClick={() => setTab("services")}>Browse Services</button>
          <button style={{ ...s.tab, ...(tab === "bookings"  ? s.tabActive : {}) }}
            onClick={() => setTab("bookings")}>My Bookings</button>
        </div>

        {/* ── SERVICES TAB ── */}
        {tab === "services" && (
          <>
            <div style={s.searchBar}>
              <div style={s.searchField}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input style={s.searchInput} value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search plumber, electrician..." />
              </div>
              <div style={s.divider} />
              <div style={s.cityField}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z"/></svg>
                <input style={s.searchInput} value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city..." />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={s.empty}>No services found for "{search}"</div>
            ) : (
              <div style={s.grid}>
                {filtered.map((svc) => (
                  <div key={svc.name} style={s.card}
                    onClick={() => handleServiceClick(svc.name)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(99,102,241,0.07)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={s.cardIcon}>{svc.icon}</div>
                    <div style={s.cardName}>{svc.name}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <>
            {loadingB ? (
              <div style={s.empty}>Loading your bookings...</div>
            ) : bookings.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
                <p>No bookings yet. Browse services to book a provider!</p>
                <button style={s.browseBtn} onClick={() => setTab("services")}>
                  Browse services
                </button>
              </div>
            ) : (
              <div style={s.bookingList}>
                {bookings.map((b) => {
                  const st = STATUS_STYLE[b.bookingStatus] || STATUS_STYLE.PENDING;
                  return (
                    <div key={b.id} style={s.bookingCard}>
                      <div style={s.bookingTop}>
                        <div>
                          <div style={s.bookingService}>{b.serviceName}</div>
                          <div style={s.bookingProvider}>Provider: {b.providerName || "—"}</div>
                          <div style={s.bookingMeta}>
                            📍 {b.location}{b.city ? `, ${b.city}` : ""}
                          </div>
                          {b.address && (
                            <div style={s.bookingMeta}>🏠 {b.address}</div>
                          )}
                          {b.description && (
                            <div style={s.bookingMeta}>📝 {b.description}</div>
                          )}
                          {b.serviceCharge && (
                            <div style={s.bookingMeta}>💰 Charge: ₹{b.serviceCharge}</div>
                          )}
                          <div style={s.bookingMeta}>
                            📅 {b.createdDate ? new Date(b.createdDate).toLocaleDateString("en-IN") : "—"}
                          </div>
                        </div>
                        <div>
                          <span style={{ ...s.statusBadge, background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                            {b.bookingStatus}
                          </span>
                        </div>
                      </div>

                      {/* Cancel — PENDING only */}
                      {b.bookingStatus === "PENDING" && (
                        <div style={s.bookingActions}>
                          <button style={s.cancelBtn} onClick={() => handleCancel(b.id)}>
                            Cancel booking
                          </button>
                        </div>
                      )}

                      {/* Rate — COMPLETED only, not yet rated */}
                      {b.bookingStatus === "COMPLETED" && !ratedSet.has(b.id) && (
                        <div style={s.bookingActions}>
                          <button style={s.rateBtn} onClick={() => openRateModal(b)}>
                            ⭐ Rate this service
                          </button>
                        </div>
                      )}
                      {b.bookingStatus === "COMPLETED" && ratedSet.has(b.id) && (
                        <div style={{ ...s.bookingActions }}>
                          <span style={s.ratedBadge}>✅ Reviewed</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>

    {/* ── Rating Modal ── */}
    {ratingModal && (
      <div style={s.modalOverlay} onClick={() => setRatingModal(null)}>
        <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
          <div style={s.modalTitle}>Rate your experience</div>
          <div style={s.modalSub}>
            {ratingModal.serviceName} · Provider: {ratingModal.providerName || "—"}
          </div>

          {/* Star picker */}
          <div style={s.starRow}>
            {[1,2,3,4,5].map((n) => (
              <span key={n}
                style={{ fontSize: "36px", color: n <= (hoveredStar || starVal) ? "#fbbf24" : "rgba(255,255,255,0.12)", cursor: "pointer", transition: "color 0.12s" }}
                onMouseEnter={() => setHoveredStar(n)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setStarVal(n)}
              >★</span>
            ))}
          </div>
          {starVal > 0 && (
            <div style={s.starLabel}>
              {["Terrible","Poor","Okay","Good","Excellent!"][starVal - 1]}
            </div>
          )}

          <textarea
            style={s.reviewInput}
            rows={3}
            placeholder="Share your experience (optional)…"
            value={reviewTxt}
            onChange={(e) => setReviewTxt(e.target.value)}
          />

          <div style={s.modalBtns}>
            <button style={s.modalCancel} onClick={() => setRatingModal(null)}>Cancel</button>
            <button style={{ ...s.modalSubmit, opacity: submitting ? 0.6 : 1 }}
              onClick={handleSubmitReview} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Dashboard;

const s = {
  page:        { background: "#0B0F1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
  nav:         { background: "#0B0F1A", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
  logo:        { fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: 700, color: "#f1f5f9", cursor: "pointer", userSelect: "none" },
  navRight:    { display: "flex", alignItems: "center", gap: "12px" },
  userChip:    { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", padding: "4px 12px 4px 6px" },
  avatar:      { width: "28px", height: "28px", borderRadius: "50%", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "#a5b4fc" },
  logoutBtn:   { fontSize: "12.5px", fontWeight: 500, color: "#f87171", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" },
  body:        { maxWidth: "1100px", margin: "0 auto", padding: "36px 24px 80px" },
  greet:       { marginBottom: "24px" },
  h1:          { fontFamily: "'Sora', sans-serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#f1f5f9", marginBottom: "6px" },
  sub:         { fontSize: "14px", color: "#64748b" },
  toast:       { marginBottom: "16px", padding: "10px 16px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "10px", color: "#34d399", fontSize: "13px" },
  tabs:        { display: "flex", gap: "4px", marginBottom: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "4px" },
  tab:         { flex: 1, padding: "9px 16px", borderRadius: "9px", border: "none", background: "transparent", color: "#64748b", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  tabActive:   { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" },
  searchBar:   { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", overflow: "hidden", marginBottom: "28px", flexWrap: "wrap" },
  searchField: { flex: "2 1 200px", display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px" },
  cityField:   { flex: "1 1 140px", display: "flex", alignItems: "center", gap: "8px", padding: "14px 18px" },
  divider:     { width: "1px", height: "24px", background: "rgba(255,255,255,0.07)", flexShrink: 0 },
  searchInput: { background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: "14px", fontFamily: "inherit", width: "100%" },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" },
  card:        { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s ease" },
  cardIcon:    { fontSize: "34px", marginBottom: "10px" },
  cardName:    { fontSize: "13.5px", fontWeight: 500, color: "#e2e8f0" },
  empty:       { textAlign: "center", color: "#475569", fontSize: "15px", padding: "60px 0" },
  browseBtn:   { marginTop: "16px", padding: "10px 24px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" },
  bookingList: { display: "flex", flexDirection: "column", gap: "12px" },
  bookingCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px 24px" },
  bookingTop:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" },
  bookingService: { fontSize: "16px", fontWeight: 600, color: "#e2e8f0", marginBottom: "4px" },
  bookingProvider:{ fontSize: "13px", color: "#94a3b8", marginBottom: "4px" },
  bookingMeta: { fontSize: "12px", color: "#475569", marginBottom: "2px" },
  statusBadge: { display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "100px" },
  bookingActions:{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  cancelBtn:   { padding: "7px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", borderRadius: "8px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit" },
  rateBtn:     { padding: "7px 18px", background: "linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,191,36,0.08))", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24", borderRadius: "8px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 },
  ratedBadge:  { fontSize: "12px", color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "100px", padding: "4px 12px" },

  // ── Rating Modal ────────────────────────────────────────────────────────────
  modalOverlay:{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "16px" },
  modalBox:    { background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "420px", fontFamily: "'DM Sans', sans-serif" },
  modalTitle:  { fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: 700, color: "#f1f5f9", marginBottom: "6px" },
  modalSub:    { fontSize: "13px", color: "#64748b", marginBottom: "24px" },
  starRow:     { display: "flex", gap: "8px", justifyContent: "center", marginBottom: "8px" },
  starLabel:   { textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "20px" },
  reviewInput: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e2e8f0", fontSize: "14px", fontFamily: "inherit", padding: "12px 14px", resize: "vertical", outline: "none", marginBottom: "20px" },
  modalBtns:   { display: "flex", gap: "10px", justifyContent: "flex-end" },
  modalCancel: { padding: "10px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", borderRadius: "10px", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" },
  modalSubmit: { padding: "10px 24px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", color: "#fff", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};