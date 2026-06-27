import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getProvidersByService, createBooking, getReviewsByProvider } from "../../lib/api.js";

// ── Avatar colours ────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "rgba(99,102,241,0.15)",  text: "#818cf8" },
  { bg: "rgba(52,211,153,0.15)",  text: "#34d399" },
  { bg: "rgba(251,191,36,0.15)",  text: "#fbbf24" },
  { bg: "rgba(248,113,113,0.15)", text: "#f87171" },
  { bg: "rgba(14,165,233,0.15)",  text: "#38bdf8" },
];

const initials = (name) =>
  (name || "").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

// ── Star renderer ─────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 13, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || rating || 0) : (rating || 0);
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => interactive && onRate && onRate(n)}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            fontSize: `${size}px`,
            color: n <= display ? "#fbbf24" : "rgba(255,255,255,0.15)",
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.12s",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
};

// ── Review Panel for one provider ─────────────────────────────────────────────
const ReviewPanel = ({ providerId }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [shown,   setShown]   = useState(3); // show 3 initially

  useEffect(() => {
    getReviewsByProvider(providerId)
      .then(setData)
      .catch(() => setData({ reviews: [], avgRating: null, count: 0 }))
      .finally(() => setLoading(false));
  }, [providerId]);

  if (loading) return <div style={rp.loading}>Loading reviews…</div>;
  if (!data || data.count === 0)
    return <div style={rp.empty}>No reviews yet. Be the first to rate!</div>;

  return (
    <div style={rp.wrap}>
      <div style={rp.header}>
        <Stars rating={Math.round(data.avgRating || 0)} size={14} />
        <span style={rp.avgNum}>{data.avgRating?.toFixed(1)}</span>
        <span style={rp.cnt}>({data.count} review{data.count !== 1 ? "s" : ""})</span>
      </div>
      <div style={rp.list}>
        {data.reviews.slice(0, shown).map((r) => (
          <div key={r.id} style={rp.item}>
            <div style={rp.itemTop}>
              <span style={rp.reviewer}>{r.userName || "User"}</span>
              <Stars rating={r.rating} size={11} />
              <span style={rp.date}>
                {r.createdDate ? new Date(r.createdDate).toLocaleDateString("en-IN") : ""}
              </span>
            </div>
            {r.comment && <p style={rp.comment}>{r.comment}</p>}
          </div>
        ))}
      </div>
      {data.count > shown && (
        <button style={rp.more} onClick={() => setShown((s) => s + 5)}>
          Show more reviews ↓
        </button>
      )}
    </div>
  );
};

// ── Review panel styles ───────────────────────────────────────────────────────
const rp = {
  wrap:     { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  loading:  { fontSize: "12px", color: "#475569", padding: "8px 0" },
  empty:    { fontSize: "12px", color: "#475569", padding: "8px 0", fontStyle: "italic" },
  header:   { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" },
  avgNum:   { fontSize: "14px", fontWeight: 700, color: "#fbbf24" },
  cnt:      { fontSize: "12px", color: "#64748b" },
  list:     { display: "flex", flexDirection: "column", gap: "8px" },
  item:     { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px 12px" },
  itemTop:  { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" },
  reviewer: { fontSize: "12px", fontWeight: 600, color: "#94a3b8" },
  date:     { fontSize: "11px", color: "#475569", marginLeft: "auto" },
  comment:  { fontSize: "12.5px", color: "#64748b", margin: 0, lineHeight: 1.5 },
  more:     { marginTop: "8px", background: "none", border: "none", color: "#6366f1", fontSize: "12px", cursor: "pointer", padding: 0, fontFamily: "inherit" },
};

// ─────────────────────────────────────────────────────────────────────────────
const ServiceProviders = () => {
  const { serviceName } = useParams();
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();

  const [providers,    setProviders]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [cityFilter,   setCityFilter]   = useState(searchParams.get("city") || "");
  const [locFilter,    setLocFilter]    = useState("");
  const [sortBy,       setSortBy]       = useState("rating");
  const [toast,        setToast]        = useState({ msg: "", type: "" });
  const [booking,      setBooking]      = useState({});
  const [addressErrors,setAddressErrors] = useState({});
  const [mailEnabled,  setMailEnabled]  = useState({});
  const [expandedReviews, setExpandedReviews] = useState({}); // { [providerId]: bool }

  const decodedService = decodeURIComponent(serviceName);
  const userName  = localStorage.getItem("userName") || "";
  const userId    = localStorage.getItem("userId");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProvidersByService({
        serviceType: decodedService,
        city:        cityFilter  || undefined,
        location:    locFilter   || undefined,
      });
      const list = data?.responseMap?.data || data?.data || data || [];
      setProviders(Array.isArray(list) ? list : []);
    } catch {
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [decodedService, cityFilter, locFilter]);

  useEffect(() => { fetchProviders(); }, [decodedService]);

  // Client-side sort (backend already sorts by rating; this lets user override)
  const sorted = [...providers].sort((a, b) => {
    if (sortBy === "rating") {
      const rA = a.rating ?? -1, rB = b.rating ?? -1;
      return rB - rA;
    }
    return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
  });

  const filtered = sorted.filter((p) => {
    const matchCity = !cityFilter || (p.city ?? "").toLowerCase().includes(cityFilter.toLowerCase());
    const matchLoc  = !locFilter  || (p.location ?? "").toLowerCase().includes(locFilter.toLowerCase());
    return matchCity && matchLoc;
  });

  const handleBook = async (provider) => {
    if (!userId) { navigate("/auth/user/login"); return; }

    const userAddress = booking[provider.id]?.address?.trim();
    if (!userAddress) {
      setAddressErrors((prev) => ({ ...prev, [provider.id]: "Address for service is mandatory." }));
      return;
    }

    try {
      await createBooking({
        providerId:   provider.id,
        userId:       Number(userId),
        userName,
        providerName: provider.firstName,
        serviceName:  decodedService,
        description:  booking[provider.id]?.desc    || "",
        address:      booking[provider.id]?.address || "",
        city:         provider.city     || cityFilter || "",
        location:     provider.location || locFilter  || "",
      });

      if (mailEnabled[provider.id]) {
        // Fire and forget - don't block the UI while SMTP connects
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8092/LocalJobApp/request"}/send-provider-mail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerEmail: provider.emailId, customerName: userName, serviceName: decodedService }),
        }).catch(() => {});
      }

      showToast(`✅ Booking sent to ${provider.firstName}!`, "success");
    } catch (err) {
      showToast(err.message || "Booking failed. Please try again.", "error");
    }
  };

  const toggleReviews = (pid) =>
    setExpandedReviews((prev) => ({ ...prev, [pid]: !prev[pid] }));

  return (
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={s.topbar}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <div style={s.logo} onClick={() => navigate("/")}>
          Local<span style={{ color: "#818cf8" }}>Jobs</span>
        </div>
        <div style={{ width: "60px" }} />
      </div>

      <div style={s.body}>

        {/* ── Header ── */}
        <div style={s.header}>
          <h1 style={s.h1}>{decodedService} providers</h1>
          <p style={s.sub}>
            {loading
              ? "Finding professionals near you…"
              : `${filtered.length} verified professional${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* ── Toast ── */}
        {toast.msg && (
          <div style={{
            ...s.toast,
            background: toast.type === "error" ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)",
            border: `1px solid ${toast.type === "error" ? "rgba(248,113,113,0.3)" : "rgba(52,211,153,0.3)"}`,
            color:  toast.type === "error" ? "#f87171" : "#34d399",
          }}>
            {toast.msg}
          </div>
        )}

        {/* ── Filters + Sort ── */}
        <div style={s.filters}>
          <div style={s.filterInput}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z"/></svg>
            <input style={s.filterInputEl} value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="City (e.g. Pune)" />
          </div>
          <div style={s.filterInput}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            <input style={s.filterInputEl} value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              placeholder="Area / Locality (e.g. Kothrud)" />
          </div>
          <button style={s.searchBtn} onClick={fetchProviders}>Search</button>
          <select style={s.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating" style={{ background: "#0B0F1A", color: "#e2e8f0" }}>Sort: Top rated</option>
            <option value="reviews" style={{ background: "#0B0F1A", color: "#e2e8f0" }}>Sort: Most reviewed</option>
          </select>
        </div>

        {/* ── Provider list ── */}
        {loading ? (
          <div style={s.empty}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
            Finding providers near you…
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
            <p>No providers found for "{decodedService}"{cityFilter ? ` in ${cityFilter}` : ""}.</p>
            <p style={{ fontSize: "13px", color: "#475569", marginTop: "6px" }}>
              Try removing filters or check back later.
            </p>
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map((p, idx) => {
              const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const bk    = booking[p.id] || {};
              const showRev = expandedReviews[p.id] || false;
              return (
                <div key={p.id} style={s.card}>
                  <div style={s.cardTop}>

                    {/* Avatar */}
                    <div style={{ ...s.avatar, background: color.bg, color: color.text }}>
                      {initials(p.firstName || "Unknown")}
                    </div>

                    {/* Info */}
                    <div style={s.info}>
                      <div style={s.name}>{p.firstName || "Unknown Provider"}</div>
                      {p.firmName && <div style={s.firm}>{p.firmName}</div>}
                      <div style={s.location}>📍 {p.location}{p.city ? `, ${p.city}` : ""}</div>
                      {p.visitingCharge && (
                        <div style={s.charge}>💰 Visiting Charge: ₹{p.visitingCharge}</div>
                      )}

                      {/* Badges */}
                      <div style={s.badges}>
                        {p.rating != null ? (
                          <span style={{ ...s.badge, background: "#0f2d1e", color: "#34d399", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Stars rating={Math.round(p.rating)} size={11} />
                            {p.rating.toFixed(1)}
                            {p.reviewCount > 0 && (
                              <span style={{ color: "#475569", fontSize: "10px" }}>
                                ({p.reviewCount})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span style={{ ...s.badge, background: "rgba(255,255,255,0.04)", color: "#475569" }}>
                            No ratings yet
                          </span>
                        )}
                        <span style={{ ...s.badge, background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>
                          Verified ✓
                        </span>
                      </div>
                    </div>

                    {/* Call */}
                    <div style={s.actions}>
                      <a href={`tel:${p.mobileNo}`} style={s.callBtn}>📞 Call</a>
                    </div>
                  </div>

                  {/* Reviews toggle */}
                  <button style={s.reviewToggle} onClick={() => toggleReviews(p.id)}>
                    {showRev ? "▲ Hide reviews" : "▼ View reviews"}
                  </button>
                  {showRev && <ReviewPanel providerId={p.id} />}

                  {/* Booking form */}
                  <div style={s.bookForm}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "13px", width: "100%" }}>
                      <input type="checkbox" checked={mailEnabled[p.id] || false}
                        onChange={(e) => setMailEnabled((prev) => ({ ...prev, [p.id]: e.target.checked }))} />
                      Notify provider by email
                    </label>
                    <input style={s.bookInput} placeholder="Describe what you need (optional)"
                      value={bk.desc || ""}
                      onChange={(e) => setBooking((prev) => ({ ...prev, [p.id]: { ...prev[p.id], desc: e.target.value } }))} />
                    <input style={s.bookInput} placeholder="Your address for service"
                      value={bk.address || ""}
                      onChange={(e) => {
                        setBooking((prev) => ({ ...prev, [p.id]: { ...prev[p.id], address: e.target.value } }));
                        if (addressErrors[p.id]) {
                          setAddressErrors((prev) => ({ ...prev, [p.id]: "" }));
                        }
                      }} />
                    <button style={s.bookBtn} onClick={() => handleBook(p)}>Book now</button>
                    {addressErrors[p.id] && (
                      <div style={{ width: "100%", color: "#f87171", fontSize: "12px", marginTop: "2px", marginLeft: "4px" }}>
                        {addressErrors[p.id]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviders;

const s = {
  page:         { background: "#0B0F1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
  topbar:       { background: "#0B0F1A", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
  backBtn:      { background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit" },
  logo:         { fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 700, color: "#f1f5f9", cursor: "pointer" },
  body:         { maxWidth: "860px", margin: "0 auto", padding: "32px 24px 80px" },
  header:       { marginBottom: "20px" },
  h1:           { fontFamily: "'Sora', sans-serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#f1f5f9", marginBottom: "6px" },
  sub:          { fontSize: "14px", color: "#64748b" },
  toast:        { marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", fontSize: "14px" },
  filters:      { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px", alignItems: "center" },
  filterInput:  { flex: "1 1 160px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px" },
  filterInputEl:{ background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: "13px", fontFamily: "inherit", width: "100%" },
  searchBtn:    { background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  sortSelect:   { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#94a3b8", fontSize: "13px", fontFamily: "inherit", cursor: "pointer", outline: "none", flexShrink: 0 },
  empty:        { textAlign: "center", color: "#475569", fontSize: "15px", padding: "80px 0" },
  list:         { display: "flex", flexDirection: "column", gap: "16px" },
  card:         { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px", transition: "border-color 0.2s" },
  cardTop:      { display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "4px" },
  avatar:       { width: "52px", height: "52px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 600, flexShrink: 0 },
  info:         { flex: 1, minWidth: "160px" },
  name:         { fontSize: "15px", fontWeight: 600, color: "#e2e8f0", marginBottom: "2px" },
  firm:         { fontSize: "12px", color: "#64748b", marginBottom: "4px" },
  location:     { fontSize: "12px", color: "#64748b", marginBottom: "8px" },
  charge:       { fontSize: "12.5px", color: "#34d399", marginBottom: "8px", fontWeight: 500 },
  badges:       { display: "flex", gap: "6px", flexWrap: "wrap" },
  badge:        { fontSize: "11px", padding: "3px 9px", borderRadius: "100px", fontWeight: 500 },
  actions:      { display: "flex", gap: "8px", flexShrink: 0 },
  callBtn:      { display: "flex", alignItems: "center", gap: "5px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#94a3b8", fontSize: "13px", textDecoration: "none", fontFamily: "inherit" },
  reviewToggle: { background: "none", border: "none", color: "#6366f1", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", padding: "6px 0", marginBottom: "2px" },
  bookForm:     { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  bookInput:    { flex: "1 1 180px", height: "38px", padding: "0 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e2e8f0", fontSize: "13px", fontFamily: "inherit", outline: "none" },
  bookBtn:      { padding: "9px 20px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
};