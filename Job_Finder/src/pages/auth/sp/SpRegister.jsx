import React, { useState } from "react";
import FormInput from "../../../components/form/FormInput.jsx";
import PasswordInput from "../../../components/form/PasswordInput.jsx";
import { spRegister } from "../../../lib/api.js";

const SERVICE_TYPES = [
  "Plumber", "Electrician", "Housemaid", "Carpenter",
  "AC Repair", "Appliance Repair", "Painter", "Driver",
  "Nurse / Caretaker", "Tutor", "Pest Control", "IT Support", "Handyman",
];

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2 mb-3 mt-1">
    <span className="text-[10px] font-bold tracking-[.08em] text-[#6b7a6b] uppercase">
      {children}
    </span>
    <div className="flex-1 h-px bg-[#e5ebe5]" />
  </div>
);

const SpRegister = () => {
  const [form, setForm] = useState({
    name: "", userName: "", phone: "", email: "",
    city: "", address: "", location: "", password: "", confirm: "",
  });
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const passwordsMatch = form.confirm.length > 0 && form.password === form.confirm;
  const passwordsMismatch = form.confirm.length > 0 && form.password !== form.confirm;

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await spRegister({
        name: form.name,
        userName: form.userName,
        phone: form.phone,
        city: form.city,
        address: form.address,
        location: form.location,
        email: form.email,
        serviceType,
        password: form.password,
      });
      alert(res?.msg || "Provider registered! Please sign in.");
      window.location.href = "/auth/sp/login";
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-[#f0f4f0] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-[500px] bg-white border border-[#dde5dd] rounded-[24px] overflow-hidden shadow-sm">

        {/* Header */}
        <div className="bg-[#1a3d2b] px-8 py-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[19px] font-semibold text-white mb-0.5">
                Join as a service provider
              </h1>
              <p className="text-xs text-white/55">Reach thousands of customers near you</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Verified listings", "Instant bookings", "Secure payments"].map((b) => (
              <span key={b}
                className="text-[11px] px-3 py-1 rounded-full bg-white/10 border border-white/18 text-white/80">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">

          {/* Error banner */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={submit} noValidate>

            {/* Business details */}
            <SectionLabel>Business details</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              <FormInput label="Full / Business name" id="spr_name"
                value={form.name} onChange={set("name")}
                placeholder="Ramesh Electricals" required />
              <FormInput label="Username" id="spr_username"
                value={form.userName} onChange={set("userName")}
                placeholder="ramesh_elec" required />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <FormInput label="Phone" id="spr_phone" type="tel"
                value={form.phone} onChange={set("phone")}
                placeholder="+91 98765 43210" required />
              <FormInput label="Email" id="spr_email" type="email"
                value={form.email} onChange={set("email")}
                placeholder="ramesh@email.com" required />
            </div>

            {/* Service type */}
            <SectionLabel>Service type</SectionLabel>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {SERVICE_TYPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setServiceType(s)}
                  className={`py-2 px-2 text-[12px] rounded-[10px] border text-center transition-all duration-150
                    ${serviceType === s
                      ? "bg-[#1a3d2b] text-white border-[#1a3d2b]"
                      : "bg-[#f7faf7] text-[#4a6b4a] border-[#dde5dd] hover:border-[#1a3d2b] hover:text-[#1a3d2b]"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Location */}
            <SectionLabel>Location</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              <FormInput label="City" id="spr_city"
                value={form.city} onChange={set("city")}
                placeholder="Mumbai" required />
              <FormInput label="Area / Locality" id="spr_location"
                value={form.location} onChange={set("location")}
                placeholder="Andheri West" required />
            </div>
            <FormInput label="Full address" id="spr_address"
              value={form.address} onChange={set("address")}
              placeholder="Shop 3, Krishna Complex, MG Road" required />

            {/* Security */}
            <SectionLabel>Security</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              <PasswordInput label="Password" id="spr_pass"
                value={form.password} onChange={set("password")}
                placeholder="Min. 8 characters" required />
              <div>
                <PasswordInput label="Confirm password" id="spr_cpass"
                  value={form.confirm} onChange={set("confirm")}
                  placeholder="Re-enter" required />
                {passwordsMatch && (
                  <p className="text-[11px] text-green-600 mt-1">Passwords match</p>
                )}
                {passwordsMismatch && (
                  <p className="text-[11px] text-red-500 mt-1">Do not match</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || passwordsMismatch}
              className="w-full h-11 mt-2 bg-[#1a3d2b] hover:bg-[#153324] active:scale-[0.99] text-white text-[15px] font-medium rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create provider account"}
            </button>
          </form>

          {/* Trust note */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-[#8fa68f]">
            <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Your profile is reviewed within 24 hours of registration
          </div>

          {/* Sign in link */}
          <div className="mt-4 pt-4 border-t border-[#eef2ee] text-center text-sm text-[#6b7a6b]">
            Already registered?{" "}
            <a href="/auth/sp/login" className="text-[#1a3d2b] font-semibold hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpRegister;