import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// File: src/pages/auth/ForgotPassword.jsx
// Usage:
//   <Route path="/auth/user/forgot-password" element={<ForgotPassword role="user" />} />
//   <Route path="/auth/sp/forgot-password"   element={<ForgotPassword role="sp"   />} />
//
// When your Java backend is ready, uncomment the fetch calls
// inside sendOtp(), verifyOtp(), resetPass() below.
// ─────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8092/LocalJobApp/request";

/* Uncomment when backend ready:
const apiPost = async (path, body) => {
  const res  = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || (data.status && data.status !== "SUCCESS"))
    throw new Error(data?.msg || "Request failed");
  return data;
};
*/

// Mock delay — remove when backend ready
const mockDelay = () => new Promise(r => setTimeout(r, 900));

const ForgotPassword = ({ role = "user" }) => {
  const navigate = useNavigate();

  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [newPass, setNewPass]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const isProvider   = role === "sp";
  const accentColor  = isProvider ? "#1a3d2b" : "#1e3a5f";
  const loginPath    = isProvider ? "/auth/sp/login" : "/auth/user/login";

  const clear = () => { setError(""); setSuccess(""); };

  /* OTP box handling */
  const handleOtp = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) document.getElementById(`otp_${idx + 1}`)?.focus();
  };
  const handleOtpKey = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`otp_${idx - 1}`)?.focus();
  };

  /* Step 1 — send OTP */
  const sendOtp = async (e) => {
    e?.preventDefault(); clear();
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await mockDelay();
      // await apiPost("/forgot-password", { emailId: email });   ← uncomment
      setSuccess(`OTP sent to ${email}. Check your inbox.`);
      setTimeout(() => { setSuccess(""); setStep(2); }, 1400);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Try again.");
    } finally { setLoading(false); }
  };

  /* Step 2 — verify OTP */
  const verifyOtp = async (e) => {
    e.preventDefault(); clear();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setLoading(true);
    try {
      await mockDelay();
      // await apiPost("/verify-otp", { emailId: email, otp: code });   ← uncomment
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally { setLoading(false); }
  };

  /* Step 3 — reset password */
  const resetPass = async (e) => {
    e.preventDefault(); clear();
    if (newPass.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPass !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await mockDelay();
      // await apiPost("/reset-password", { emailId: email, otp: otp.join(""), newPassword: newPass });  ← uncomment
      setSuccess("Password reset successful! Redirecting to login…");
      setTimeout(() => navigate(loginPath), 1800);
    } catch (err) {
      setError(err.message || "Failed to reset password. Try again.");
    } finally { setLoading(false); }
  };

  const passMismatch = confirm.length > 0 && newPass !== confirm;
  const passOk       = confirm.length > 0 && newPass === confirm;

  /* ── styles ── */
  const s = {
    page: {
      minHeight: "calc(100vh - 60px)",
      background: isProvider ? "#f0f4f0" : "#f5f6fa",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px", fontFamily: "'DM Sans', sans-serif",
    },
    card: {
      width: "100%", maxWidth: "420px", background: "#fff",
      border: "1px solid #e2e8f0", borderRadius: "20px",
      overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)",
    },
    header: { background: accentColor, padding: "32px 36px 28px" },
    iconWrap: {
      width: "48px", height: "48px", borderRadius: "14px",
      background: "rgba(255,255,255,.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      marginBottom: "18px",
    },
    body: { padding: "28px 36px 32px" },
    stepRow: { display: "flex", gap: "6px", marginBottom: "24px" },
    stepBar: (active, done) => ({
      flex: 1, height: "4px", borderRadius: "100px",
      background: done ? "#22c55e" : active ? "#3b82f6" : "#e2e8f0",
      transition: "background .3s",
    }),
    lbl: { fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px", display: "block" },
    inp: {
      width: "100%", boxSizing: "border-box",
      border: "1px solid #d1d5db", borderRadius: "10px",
      padding: "10px 14px", fontSize: "14px", color: "#1f2937",
      outline: "none", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px",
      background: "#fafafa",
    },
    btn: {
      width: "100%", height: "44px", border: "none", borderRadius: "12px",
      fontSize: "15px", fontWeight: 500, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", color: "#fff",
      background: accentColor, transition: "opacity .15s",
    },
    err: {
      fontSize: "13px", color: "#dc2626", background: "#fef2f2",
      border: "1px solid #fecaca", borderRadius: "10px",
      padding: "12px 14px", marginBottom: "14px",
    },
    ok: {
      fontSize: "13px", color: "#15803d", background: "#f0fdf4",
      border: "1px solid #bbf7d0", borderRadius: "10px",
      padding: "12px 14px", marginBottom: "14px",
    },
    backBtn: {
      display: "flex", alignItems: "center", gap: "6px",
      fontSize: "13px", color: "#6b7280", background: "none", border: "none",
      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
      marginBottom: "18px", padding: 0,
    },
    otpRow: { display: "flex", gap: "8px", marginBottom: "16px" },
    otpBox: {
      flex: 1, height: "52px", textAlign: "center",
      fontSize: "22px", fontWeight: 600, color: "#1f2937",
      border: "1.5px solid #d1d5db", borderRadius: "10px",
      outline: "none", fontFamily: "'DM Sans', sans-serif",
    },
    hint: { fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "14px" },
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');`}</style>
      <section style={s.page}>
        <div style={s.card}>

          {/* Header */}
          <div style={s.header}>
            <div style={s.iconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "19px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
              Reset your password
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,.55)" }}>
              {step === 1 && "Enter your registered email to receive an OTP"}
              {step === 2 && "Enter the 6-digit OTP sent to your email"}
              {step === 3 && "Create a new strong password"}
            </div>
          </div>

          {/* Body */}
          <div style={s.body}>

            {/* Step progress */}
            <div style={s.stepRow}>
              {[1, 2, 3].map(n => <div key={n} style={s.stepBar(step === n, step > n)} />)}
            </div>

            {/* Back button */}
            {step > 1 && (
              <button style={s.backBtn} onClick={() => { setStep(p => p - 1); clear(); }}>
                ← Back
              </button>
            )}

            {error   && <div style={s.err}>{error}</div>}
            {success && <div style={s.ok}>{success}</div>}

            {/* ── Step 1: Email ── */}
            {step === 1 && (
              <form onSubmit={sendOtp} noValidate>
                <label style={s.lbl} htmlFor="fp_email">
                  Email address <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input id="fp_email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={s.inp} />
                <button type="submit" disabled={loading}
                  style={{ ...s.btn, opacity: loading ? .6 : 1 }}>
                  {loading ? "Sending OTP…" : "Send OTP"}
                </button>
              </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 2 && (
              <form onSubmit={verifyOtp} noValidate>
                <label style={{ ...s.lbl, marginBottom: "12px" }}>
                  OTP sent to <strong>{email}</strong>
                </label>
                <div style={s.otpRow}>
                  {otp.map((val, idx) => (
                    <input key={idx} id={`otp_${idx}`} style={s.otpBox}
                      maxLength={1} value={val} inputMode="numeric" autoComplete="one-time-code"
                      onChange={e => handleOtp(idx, e.target.value)}
                      onKeyDown={e => handleOtpKey(idx, e)} />
                  ))}
                </div>
                <button type="submit" disabled={loading}
                  style={{ ...s.btn, opacity: loading ? .6 : 1 }}>
                  {loading ? "Verifying…" : "Verify OTP"}
                </button>
                <p style={s.hint}>
                  Didn't receive?{" "}
                  <button type="button" onClick={sendOtp}
                    style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer",
                      fontFamily: "inherit", fontSize: "12px", fontWeight: 500, padding: 0 }}>
                    Resend OTP
                  </button>
                </p>
              </form>
            )}

            {/* ── Step 3: New Password ── */}
            {step === 3 && (
              <form onSubmit={resetPass} noValidate>
                <label style={s.lbl} htmlFor="fp_np">
                  New password <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative", marginBottom: 0 }}>
                  <input id="fp_np" type={showPass ? "text" : "password"} value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="Min. 8 characters" required
                    style={{ ...s.inp, paddingRight: "52px" }} />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: "absolute", right: "14px", top: "11px", background: "none",
                      border: "none", fontSize: "12px", color: "#6b7280", cursor: "pointer",
                      fontFamily: "inherit" }}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>

                <label style={s.lbl} htmlFor="fp_cp">
                  Confirm password <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input id="fp_cp" type="password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter new password" required
                  style={{ ...s.inp, borderColor: passMismatch ? "#ef4444" : "#d1d5db" }} />
                {passMismatch && <p style={{ fontSize:"11px",color:"#ef4444",marginTop:"-12px",marginBottom:"10px" }}>Passwords do not match</p>}
                {passOk       && <p style={{ fontSize:"11px",color:"#16a34a",marginTop:"-12px",marginBottom:"10px" }}>✓ Passwords match</p>}

                <button type="submit" disabled={loading || passMismatch}
                  style={{ ...s.btn, opacity: (loading || passMismatch) ? .6 : 1 }}>
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
              </form>
            )}

            <p style={s.hint}>
              Remembered it?{" "}
              <a href={loginPath} style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>
                Back to login
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;