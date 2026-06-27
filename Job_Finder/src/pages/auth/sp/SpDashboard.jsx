import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { spUpdate, logoutUser, getBookingsByProvider, confirmBooking, rejectBooking, completeBooking, getReviewsByProvider } from "../../../lib/api.js";

const SERVICE_TYPES = [
  "Plumber", "Electrician", "Housemaid", "Carpenter",
  "AC Repair", "Appliance Repair", "Painter", "Driver",
  "Nurse / Caretaker", "Tutor", "Pest Control", "IT Support", "Handyman",
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

const SpDashboard = () => {
  const navigate    = useNavigate();
  const userName    = localStorage.getItem("userName") || "Provider";
  const providerId  = localStorage.getItem("providerId");
  const firstName   = userName.split(" ")[0];

  const [activeTab,     setActiveTab]     = useState("orders");
  const [reviews,       setReviews]       = useState(null);  // null = not loaded yet
  const [loadingRev,    setLoadingRev]    = useState(false);
  const [orders,        setOrders]        = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [toast,         setToast]         = useState({ msg: "", type: "" });

  // Confirm-with-charge state
  const [confirmingId,  setConfirmingId]  = useState(null);   // bookingId currently in "set charge" mode
  const [chargeMap,     setChargeMap]     = useState({});      // { [bookingId]: "chargeValue" }

  // Settings state
  const [activeService, setActiveService] = useState(SERVICE_TYPES[0]);
  const [availability,  setAvailability]  = useState(true);
  const [city,          setCity]          = useState("");
  const [location,      setLocation]      = useState("");
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [saveError,     setSaveError]     = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
    window.location.reload();
  };

  // Load bookings when Orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && providerId) {
      setLoadingOrders(true);
      getBookingsByProvider(providerId)
        .then((bookingsArray) => {
          setOrders(Array.isArray(bookingsArray) ? bookingsArray : []);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  // Load reviews when Reviews tab is active (fetch once)
  useEffect(() => {
    if (activeTab === "reviews" && providerId && reviews === null) {
      setLoadingRev(true);
      getReviewsByProvider(Number(providerId))
        .then((data) => setReviews(data))
        .catch(() => setReviews({ reviews: [], avgRating: null, count: 0 }))
        .finally(() => setLoadingRev(false));
    }
  }, [activeTab]);

  // Step 1 — open the charge panel for this booking
  const openConfirmPanel = (bookingId) => {
    setConfirmingId(bookingId);
    setChargeMap((prev) => ({ ...prev, [bookingId]: prev[bookingId] ?? "" }));
  };

  // Step 2 — actually confirm with the entered charge
  const handleConfirm = async (bookingId) => {
    const serviceCharge = chargeMap[bookingId] ?? "";
    try {
      await confirmBooking({ bookingId, serviceCharge });
      showToast("Booking confirmed!", "success");
      setOrders((prev) => prev.map((b) =>
        b.id === bookingId
          ? { ...b, bookingStatus: "CONFIRMED", serviceCharge }
          : b
      ));
      setConfirmingId(null);
      setChargeMap((prev) => { const n = { ...prev }; delete n[bookingId]; return n; });
    } catch (err) {
      showToast(err.message || "Failed to confirm.", "error");
    }
  };

  // Cancel the charge panel without confirming
  const cancelConfirmPanel = () => setConfirmingId(null);

  const handleReject = async (bookingId) => {
    try {
      await rejectBooking({ bookingId });
      showToast("Booking rejected.", "error");
      setOrders((prev) => prev.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "REJECTED" } : b
      ));
    } catch (err) {
      showToast(err.message || "Failed to reject.", "error");
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await completeBooking({ bookingId });
      showToast("Job marked as completed!", "success");
      setOrders((prev) => prev.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "COMPLETED" } : b
      ));
    } catch (err) {
      showToast(err.message || "Failed to complete.", "error");
    }
  };

  const handleSave = async () => {
    setSaveError("");
    setSaving(true);
    try {
      await spUpdate({ serviceType: activeService, city, location });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.page}>

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => navigate("/")}>
          Local<span style={{ color: "#34d399" }}>Jobs</span>
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

        {/* Welcome */}
        <div style={s.welcome}>
          <div>
            <h1 style={s.h1}>Welcome back, {firstName}</h1>
            <p style={s.sub}>Manage incoming orders and your service listing</p>
          </div>
          <div style={{
            ...s.statusBadge,
            background: availability ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${availability ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            color: availability ? "#34d399" : "#f87171",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: availability ? "#34d399" : "#f87171", flexShrink: 0 }} />
            {availability ? "Available for bookings" : "Unavailable"}
          </div>
        </div>

        {/* Toast */}
        {toast.msg && (
          <div style={{
            ...s.toast,
            background: toast.type === "error" ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)",
            border: `1px solid ${toast.type === "error" ? "rgba(248,113,113,0.3)" : "rgba(52,211,153,0.3)"}`,
            color: toast.type === "error" ? "#f87171" : "#34d399",
          }}>
            {toast.msg}
          </div>
        )}

        {/* Tabs */}
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(activeTab === "orders"   ? s.tabActive : {}) }}
            onClick={() => setActiveTab("orders")}>Incoming Orders</button>
          <button style={{ ...s.tab, ...(activeTab === "reviews"  ? s.tabActive : {}) }}
            onClick={() => setActiveTab("reviews")}>⭐ My Reviews</button>
          <button style={{ ...s.tab, ...(activeTab === "settings" ? s.tabActive : {}) }}
            onClick={() => setActiveTab("settings")}>Settings</button>
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <>
            {loadingOrders ? (
              <div style={s.empty}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
                <p>No orders yet. When users book you, they will appear here.</p>
              </div>
            ) : (
              <div style={s.orderList}>
                {orders.map((b) => {
                  const st = STATUS_STYLE[b.bookingStatus] || STATUS_STYLE.PENDING;
                  return (
                    <div key={b.id} style={s.orderCard}>
                      <div style={s.orderTop}>
                        <div>
                          <div style={s.orderService}>{b.serviceName}</div>
                          <div style={s.orderUser}>Customer: {b.userName || "—"}</div>
                          <div style={s.orderMeta}>📍 {b.location}{b.city ? `, ${b.city}` : ""}</div>
                          {b.address && (
                            <div style={s.orderMeta}>🏠 {b.address}</div>
                          )}
                          {b.description && (
                            <div style={s.orderMeta}>📝 {b.description}</div>
                          )}
                          <div style={s.orderMeta}>📅 {b.createdDate ? new Date(b.createdDate).toLocaleDateString("en-IN") : "—"}</div>
                          {b.serviceCharge && (
                            <div style={s.orderMeta}>💰 Charge: ₹{b.serviceCharge}</div>
                          )}
                        </div>
                        <span style={{ ...s.statusBadgeSmall, background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                          {b.bookingStatus}
                        </span>
                      </div>

                      {/* Action buttons — only for PENDING */}
                      {b.bookingStatus === "PENDING" && (
                        confirmingId === b.id ? (
                          /* ── Charge panel ── */
                          <div style={s.chargePanel}>
                            <div style={s.chargePanelLabel}>💰 Set service charge (optional)</div>
                            <div style={s.chargePanelRow}>
                              <div style={s.chargeInputWrap}>
                                <span style={s.rupeeSymbol}>₹</span>
                                <input
                                  id={`charge_${b.id}`}
                                  style={s.chargeInput}
                                  type="number"
                                  min="0"
                                  placeholder="e.g. 500"
                                  value={chargeMap[b.id] ?? ""}
                                  onChange={(e) =>
                                    setChargeMap((prev) => ({ ...prev, [b.id]: e.target.value }))
                                  }
                                  onFocus={(e) => {
                                    e.target.style.borderColor = "#34d399";
                                    e.target.style.boxShadow  = "0 0 0 3px rgba(52,211,153,0.12)";
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(255,255,255,0.12)";
                                    e.target.style.boxShadow  = "none";
                                  }}
                                  autoFocus
                                />
                              </div>
                              <button
                                style={s.confirmFinalBtn}
                                onClick={() => handleConfirm(b.id)}
                              >
                                ✓ Set & Confirm
                              </button>
                              <button
                                style={s.cancelChargeBtn}
                                onClick={cancelConfirmPanel}
                              >
                                Cancel
                              </button>
                            </div>
                            <div style={s.chargeHint}>
                              Leave blank to confirm without specifying a price.
                            </div>
                          </div>
                        ) : (
                          /* ── Default action buttons ── */
                          <div style={s.orderActions}>
                            <button style={s.confirmBtn} onClick={() => openConfirmPanel(b.id)}>
                              ✓ Confirm
                            </button>
                            <button style={s.rejectBtn} onClick={() => handleReject(b.id)}>
                              ✗ Reject
                            </button>
                          </div>
                        )
                      )}

                      {/* Complete button — only for CONFIRMED */}
                      {b.bookingStatus === "CONFIRMED" && (
                        <div style={s.orderActions}>
                          <button style={s.completeBtn} onClick={() => handleComplete(b.id)}>
                            ✓ Mark Complete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === "reviews" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>My Reviews & Ratings</h2>
            <p style={s.sectionSub}>Feedback submitted by customers for your completed services</p>

            {loadingRev ? (
              <div style={s.empty}>Loading reviews…</div>
            ) : !reviews || reviews.count === 0 ? (
              <div style={{ ...s.empty, padding: "60px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>⭐</div>
                <p style={{ color: "#475569", fontSize: "15px" }}>No reviews yet.</p>
                <p style={{ color: "#334155", fontSize: "13px", marginTop: "4px" }}>Complete more jobs to start receiving feedback!</p>
              </div>
            ) : (
              <>
                {/* ── Summary card ── */}
                <div style={s.revSummary}>
                  <div style={s.revSummaryLeft}>
                    <div style={s.revAvgNum}>{reviews.avgRating?.toFixed(1) ?? "—"}</div>
                    <div style={s.revStarRow}>
                      {[1,2,3,4,5].map((n) => (
                        <span key={n} style={{
                          fontSize: "22px",
                          color: n <= Math.round(reviews.avgRating || 0) ? "#fbbf24" : "rgba(255,255,255,0.1)",
                          transition: "color 0.1s",
                        }}>★</span>
                      ))}
                    </div>
                    <div style={s.revTotalCnt}>{reviews.count} review{reviews.count !== 1 ? "s" : ""}</div>
                  </div>

                  {/* Star distribution bars */}
                  <div style={s.revBars}>
                    {[5,4,3,2,1].map((star) => {
                      const cnt = reviews.reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.count > 0 ? (cnt / reviews.count) * 100 : 0;
                      return (
                        <div key={star} style={s.revBarRow}>
                          <span style={s.revBarLabel}>{star}★</span>
                          <div style={s.revBarTrack}>
                            <div style={{ ...s.revBarFill, width: `${pct}%`,
                              background: star >= 4 ? "#34d399" : star === 3 ? "#fbbf24" : "#f87171" }} />
                          </div>
                          <span style={s.revBarCnt}>{cnt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Individual reviews ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
                  {reviews.reviews.map((r) => (
                    <div key={r.id} style={s.revCard}>
                      <div style={s.revCardTop}>
                        <div style={s.revCardAvatar}>
                          {(r.userName || "U")[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={s.revCardName}>{r.userName || "Customer"}</div>
                          <div style={s.revCardMeta}>{r.serviceName} · {r.createdDate ? new Date(r.createdDate).toLocaleDateString("en-IN") : ""}</div>
                        </div>
                        <div style={s.revCardStars}>
                          {[1,2,3,4,5].map((n) => (
                            <span key={n} style={{ fontSize: "14px", color: n <= r.rating ? "#fbbf24" : "rgba(255,255,255,0.1)" }}>★</span>
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p style={s.revCardComment}>"{r.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Your service listing</h2>
            <p style={s.sectionSub}>Update your service type, area, and availability</p>

            {saved && (
              <div style={s.toastGreen}>✅ Settings saved successfully!</div>
            )}
            {saveError && (
              <div style={s.toastRed}>⚠️ {saveError}</div>
            )}

            <div style={s.formGrid}>
              {/* Service type */}
              <div style={s.formGroup}>
                <label style={s.lbl}>Service type</label>
                <div style={s.tagGrid}>
                  {SERVICE_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => setActiveService(t)}
                      style={{
                        ...s.tag,
                        background: activeService === t ? "#1a3d2b" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${activeService === t ? "#34d399" : "rgba(255,255,255,0.08)"}`,
                        color: activeService === t ? "#34d399" : "#64748b",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div style={s.formGroup}>
                <label style={s.lbl}>Service area</label>
                <div style={s.inputRow}>
                  <input style={s.input} value={city} onChange={(e) => setCity(e.target.value)}
                    placeholder="City (e.g. Pune)"
                    onFocus={(e) => { e.target.style.borderColor = "#34d399"; e.target.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                  />
                  <input style={s.input} value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area / Locality (e.g. Kothrud)"
                    onFocus={(e) => { e.target.style.borderColor = "#34d399"; e.target.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Availability */}
              <div style={s.formGroup}>
                <label style={s.lbl}>Availability</label>
                <div style={s.toggleRow}>
                  <button type="button" onClick={() => setAvailability(true)}
                    style={{ ...s.toggleBtn, background: availability ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${availability ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`, color: availability ? "#34d399" : "#64748b" }}>
                    Available
                  </button>
                  <button type="button" onClick={() => setAvailability(false)}
                    style={{ ...s.toggleBtn, background: !availability ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${!availability ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`, color: !availability ? "#f87171" : "#64748b" }}>
                    Unavailable
                  </button>
                </div>
              </div>
            </div>

            <button style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1 }}
              onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpDashboard;

const s = {
  page:            { background: "#0B0F1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
  nav:             { background: "#0B0F1A", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
  logo:            { fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: 700, color: "#f1f5f9", cursor: "pointer", userSelect: "none" },
  navRight:        { display: "flex", alignItems: "center", gap: "12px" },
  userChip:        { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", padding: "4px 12px 4px 6px" },
  avatar:          { width: "28px", height: "28px", borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "#34d399" },
  logoutBtn:       { fontSize: "12.5px", fontWeight: 500, color: "#f87171", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" },
  body:            { maxWidth: "900px", margin: "0 auto", padding: "36px 24px 80px" },
  welcome:         { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" },
  h1:              { fontFamily: "'Sora', sans-serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#f1f5f9", marginBottom: "6px" },
  sub:             { fontSize: "14px", color: "#64748b" },
  statusBadge:     { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 500, flexShrink: 0 },
  statusBadgeSmall:{ display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "100px" },
  toast:           { marginBottom: "16px", padding: "10px 16px", borderRadius: "10px", fontSize: "13px" },
  toastGreen:      { marginBottom: "20px", padding: "10px 14px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "10px", color: "#34d399", fontSize: "13px" },
  toastRed:        { marginBottom: "20px", padding: "10px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "10px", color: "#f87171", fontSize: "13px" },
  tabs:            { display: "flex", gap: "4px", marginBottom: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "4px" },
  tab:             { flex: 1, padding: "9px 16px", borderRadius: "9px", border: "none", background: "transparent", color: "#64748b", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  tabActive:       { background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" },
  empty:           { textAlign: "center", color: "#475569", fontSize: "15px", padding: "80px 0" },
  orderList:       { display: "flex", flexDirection: "column", gap: "12px" },
  orderCard:       { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px 24px" },
  orderTop:        { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" },
  orderService:    { fontSize: "16px", fontWeight: 600, color: "#e2e8f0", marginBottom: "4px" },
  orderUser:       { fontSize: "13px", color: "#94a3b8", marginBottom: "4px" },
  orderMeta:       { fontSize: "12px", color: "#475569", marginBottom: "2px" },
  orderActions:      { display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  confirmBtn:        { padding: "7px 16px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", borderRadius: "8px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit" },
  rejectBtn:         { padding: "7px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", borderRadius: "8px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit" },
  completeBtn:       { padding: "7px 16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", borderRadius: "8px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit" },

  // ── Charge panel ──────────────────────────────────────────────────────────────
  chargePanel:       { marginTop: "12px", paddingTop: "14px", borderTop: "1px solid rgba(52,211,153,0.15)", background: "rgba(52,211,153,0.04)", borderRadius: "0 0 12px 12px", margin: "12px -24px -20px", padding: "16px 24px 18px" },
  chargePanelLabel:  { fontSize: "12px", fontWeight: 600, color: "#34d399", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" },
  chargePanelRow:    { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
  chargeInputWrap:   { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "9px", overflow: "hidden", transition: "border-color 0.15s, box-shadow 0.15s", flexShrink: 0 },
  rupeeSymbol:       { padding: "0 10px", fontSize: "14px", color: "#34d399", fontWeight: 600, background: "rgba(52,211,153,0.08)", borderRight: "1px solid rgba(255,255,255,0.08)", lineHeight: "38px", userSelect: "none" },
  chargeInput:       { height: "38px", padding: "0 12px", background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: "14px", fontFamily: "inherit", width: "110px", MozAppearance: "textfield" },
  confirmFinalBtn:   { padding: "8px 18px", background: "linear-gradient(135deg, #059669, #065f46)", border: "none", color: "#fff", borderRadius: "9px", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  cancelChargeBtn:   { padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", borderRadius: "9px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  chargeHint:        { marginTop: "8px", fontSize: "11px", color: "#475569" },
  section:         { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "28px" },
  sectionTitle:    { fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 600, color: "#e2e8f0", marginBottom: "4px" },
  sectionSub:      { fontSize: "13px", color: "#64748b", marginBottom: "24px" },
  formGrid:        { display: "flex", flexDirection: "column", gap: "24px" },
  formGroup:       {},
  lbl:             { display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" },
  tagGrid:         { display: "flex", flexWrap: "wrap", gap: "8px" },
  tag:             { padding: "7px 14px", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  inputRow:        { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" },
  input:           { width: "100%", height: "42px", padding: "0 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box" },
  toggleRow:       { display: "flex", gap: "10px", flexWrap: "wrap" },
  toggleBtn:       { padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  saveBtn:         { marginTop: "28px", padding: "12px 28px", background: "#1a3d2b", color: "#fff", border: "none", borderRadius: "11px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },

  // ── Reviews tab ────────────────────────────────────────────────────────────────
  revSummary:      { display: "flex", gap: "28px", flexWrap: "wrap", background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)", borderRadius: "16px", padding: "22px 24px", marginBottom: "4px" },
  revSummaryLeft:  { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "90px" },
  revAvgNum:       { fontFamily: "'Sora', sans-serif", fontSize: "48px", fontWeight: 700, color: "#fbbf24", lineHeight: 1 },
  revStarRow:      { display: "flex", gap: "3px", margin: "6px 0 4px" },
  revTotalCnt:     { fontSize: "12px", color: "#64748b" },
  revBars:         { flex: 1, display: "flex", flexDirection: "column", gap: "6px", justifyContent: "center", minWidth: "180px" },
  revBarRow:       { display: "flex", alignItems: "center", gap: "8px" },
  revBarLabel:     { fontSize: "11px", color: "#94a3b8", width: "22px", textAlign: "right", flexShrink: 0 },
  revBarTrack:     { flex: 1, height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" },
  revBarFill:      { height: "100%", borderRadius: "100px", transition: "width 0.4s ease" },
  revBarCnt:       { fontSize: "11px", color: "#475569", width: "18px", flexShrink: 0 },
  revCard:         { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px 18px" },
  revCardTop:      { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  revCardAvatar:   { width: "36px", height: "36px", borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "#a5b4fc", flexShrink: 0 },
  revCardName:     { fontSize: "13px", fontWeight: 600, color: "#e2e8f0", marginBottom: "2px" },
  revCardMeta:     { fontSize: "11px", color: "#475569" },
  revCardStars:    { display: "flex", gap: "2px", marginLeft: "auto" },
  revCardComment:  { fontSize: "13px", color: "#64748b", fontStyle: "italic", lineHeight: 1.6, margin: 0, paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" },
};