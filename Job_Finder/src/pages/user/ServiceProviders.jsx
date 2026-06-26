import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getProvidersByService, createBooking } from "../../lib/api.js";

const MOCK = {
  Plumber: [
    { id: 1, firstName: "Raju Patil",  firmName: "Raju Plumbing",  city: "Pune", location: "Kothrud",      mobileNo: "9876543210", emailId: "raju@email.com",   rating: 4.8, jobs: 142 },
    { id: 2, firstName: "Suresh Kumar",firmName: "Suresh Services", city: "Pune", location: "Hadapsar",     mobileNo: "9823456789", emailId: "suresh@email.com", rating: 4.6, jobs: 98  },
  ],
  Electrician: [
    { id: 3, firstName: "Amol Shinde", firmName: "Amol Electricals",city: "Pune", location: "Wakad",        mobileNo: "9988776655", emailId: "amol@email.com",   rating: 4.7, jobs: 76  },
  ],
};

const AVATAR_COLORS = [
  { bg: "#e0e7ff", text: "#4338ca" },
  { bg: "#d1fae5", text: "#065f46" },
  { bg: "#fef3c7", text: "#92400e" },
  { bg: "#fce7f3", text: "#9d174d" },
  { bg: "#e0f2fe", text: "#075985" },
];

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const ServiceProviders = () => {
  const { serviceName } = useParams();
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();

  const [providers,   setProviders]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [cityFilter,  setCityFilter]  = useState(searchParams.get("city") || "");
  const [locFilter,   setLocFilter]   = useState("");
  const [sortBy,      setSortBy]      = useState("rating");
  const [toast,       setToast]       = useState({ msg: "", type: "" });
  const [booking,     setBooking]     = useState({}); // { [providerId]: { desc, address } }
  const [mailEnabled, setMailEnabled] = useState({});

  const decodedService = decodeURIComponent(serviceName);
  const userName  = localStorage.getItem("userName") || "";
  const userId    = localStorage.getItem("userId");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await getProvidersByService({
        serviceType: decodedService,
        city:        cityFilter || undefined,
        location:    locFilter  || undefined,
      });
      const list = data?.responseMap?.data || data?.data || data || [];
      setProviders(Array.isArray(list) ? list : []);
    } catch {
      // fall back to mock data so UI is never empty during development
      const key = Object.keys(MOCK).find(
        (k) => k.toLowerCase() === decodedService.toLowerCase()
      );
      setProviders(key ? MOCK[key] : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviders(); }, [decodedService]);

  const sorted = [...providers].sort((a, b) =>
    sortBy === "rating"
      ? (b.rating ?? 0) - (a.rating ?? 0)
      : (b.jobs ?? 0) - (a.jobs ?? 0)
  );

  const filtered = sorted.filter((p) => {
    const matchCity = !cityFilter || (p.city ?? "").toLowerCase().includes(cityFilter.toLowerCase());
    const matchLoc  = !locFilter  || (p.location ?? "").toLowerCase().includes(locFilter.toLowerCase());
    return matchCity && matchLoc;
  });

  const handleBook = async (provider) => {

    if (!userId) {
      navigate("/auth/user/login");
      return;
    }

    try {

      await createBooking({
        providerId: provider.id,
        userId: Number(userId),
        userName: userName,
        providerName: provider.firstName,
        serviceName: decodedService,
        description: booking[provider.id]?.desc || "",
        address: booking[provider.id]?.address || "",
        city: provider.city || cityFilter || "",
        location: provider.location || locFilter || "",
      });

      // OPTIONAL MAIL
      if (mailEnabled[provider.id]) {

        await sendMailToProvider(provider);
      }

      showToast(
        `✅ Booking sent to ${provider.firstName}!`,
        "success"
      );

    } catch (err) {

      showToast(
        err.message || "Booking failed. Please try again.",
        "error"
      );
    }
  };

  const sendMailToProvider = async (provider) => {
    console.log("MAIL API CALLED");
    console.log(provider);

    try {

      const response = await fetch(
        "http://localhost:8092/LocalJobApp/request/send-provider-mail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            providerEmail: provider.emailId,
            customerName: userName,
            serviceName: decodedService
          })
        }
      );

      const data = await response.json();

      showToast(data.message || "Mail Sent Successfully");

    } catch (error) {

      showToast("Error Sending Mail", "error");
    }
  };

  return (
    <div style={s.page}>

      {/* Top bar */}
      <div style={s.topbar}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <div style={s.logo} onClick={() => navigate("/")}>
          Local<span style={{ color: "#818cf8" }}>Jobs</span>
        </div>
        <div style={{ width: "60px" }} />
      </div>

      <div style={s.body}>

        {/* Header */}
        <div style={s.header}>
          <h1 style={s.h1}>{decodedService} providers</h1>
          <p style={s.sub}>
            {loading ? "Finding professionals..." : `${filtered.length} verified professional${filtered.length !== 1 ? "s" : ""} found`}
          </p>
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

        {/* Filters */}
        <div style={s.filters}>
          <div style={s.filterInput}>
            <input style={s.filterInputEl} value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Filter by city..." />
          </div>
          <div style={s.filterInput}>
            <input style={s.filterInputEl} value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              placeholder="Filter by area / locality..." />
          </div>
          <button style={s.searchBtn} onClick={fetchProviders}>Search</button>
          <select style={s.sortSelect} value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">Sort: Top rated</option>
            <option value="jobs">Sort: Most jobs</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div style={s.empty}>Finding providers...</div>
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
              const bk = booking[p.id] || {};
              return (
                <div key={p.id} style={s.card}>
                  <div style={s.cardTop}>
                    {/* Avatar */}
                    <div style={{ ...s.avatar, background: color.bg, color: color.text }}>
                      {initials(p.firstName)}
                    </div>

                    {/* Info */}
                    <div style={s.info}>
                      <div style={s.name}>{p.firstName}</div>
                      {p.firmName && <div style={s.firm}>{p.firmName}</div>}
                      <div style={s.location}>
                        📍 {p.location}{p.city ? `, ${p.city}` : ""}
                      </div>
                      <div style={s.badges}>
                        {p.rating && (
                          <span style={{ ...s.badge, background: "#0f2d1e", color: "#34d399" }}>
                            ★ {p.rating}
                          </span>
                        )}
                        {p.jobs && (
                          <span style={{ ...s.badge, background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                            {p.jobs} jobs
                          </span>
                        )}
                        <span style={{ ...s.badge, background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Call button */}
                    <div style={s.actions}>
                      <a href={`tel:${p.mobileNo}`} style={s.callBtn}>
                        📞 Call
                      </a>
                    </div>
                  </div>

                  {/* Booking form */}
                  <div style={s.bookForm}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#cbd5e1",
                      fontSize: "13px"
                    }}>
                      <input
                        type="checkbox"
                        checked={mailEnabled[p.id] || false}
                        onChange={(e) =>
                          setMailEnabled((prev) => ({
                            ...prev,
                            [p.id]: e.target.checked
                          }))
                        }
                      />
                      Send mail notification to provider
                  </label>

                    <input
                      style={s.bookInput}
                      placeholder="Describe what you need (optional)"
                      value={bk.desc || ""}
                      onChange={(e) => setBooking((prev) => ({
                        ...prev, [p.id]: { ...prev[p.id], desc: e.target.value }
                      }))}
                    />
                    <input
                      style={s.bookInput}
                      placeholder="Your address for service"
                      value={bk.address || ""}
                      onChange={(e) => setBooking((prev) => ({
                        ...prev, [p.id]: { ...prev[p.id], address: e.target.value }
                      }))}
                    />
                    <button style={s.bookBtn} onClick={() => handleBook(p)}>
                      Book now
                    </button>
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
  filterInput:  { flex: "1 1 180px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px" },
  filterInputEl:{ background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: "13px", fontFamily: "inherit", width: "100%" },
  searchBtn:    { background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  sortSelect:   { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#94a3b8", fontSize: "13px", fontFamily: "inherit", cursor: "pointer", outline: "none", flexShrink: 0 },
  empty:        { textAlign: "center", color: "#475569", fontSize: "15px", padding: "80px 0" },
  list:         { display: "flex", flexDirection: "column", gap: "16px" },
  card:         { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px", transition: "border-color 0.2s" },
  cardTop:      { display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "16px" },
  avatar:       { width: "52px", height: "52px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 600, flexShrink: 0 },
  info:         { flex: 1, minWidth: "160px" },
  name:         { fontSize: "15px", fontWeight: 500, color: "#e2e8f0", marginBottom: "2px" },
  firm:         { fontSize: "12px", color: "#64748b", marginBottom: "4px" },
  location:     { fontSize: "12px", color: "#64748b", marginBottom: "8px" },
  badges:       { display: "flex", gap: "6px", flexWrap: "wrap" },
  badge:        { fontSize: "11px", padding: "3px 9px", borderRadius: "100px", fontWeight: 500 },
  actions:      { display: "flex", gap: "8px", flexShrink: 0 },
  callBtn:      { display: "flex", alignItems: "center", gap: "5px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#94a3b8", fontSize: "13px", textDecoration: "none", fontFamily: "inherit" },
  bookForm:     { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  bookInput:    { flex: "1 1 180px", height: "38px", padding: "0 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e2e8f0", fontSize: "13px", fontFamily: "inherit", outline: "none" },
  bookBtn:      { padding: "9px 20px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
};