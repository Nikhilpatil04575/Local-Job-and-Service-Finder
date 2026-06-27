import React, { useState } from "react";
import FormInput from "../../../components/form/FormInput.jsx";
import PasswordInput from "../../../components/form/PasswordInput.jsx";
import { userRegister } from "../../../lib/api.js";

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2 mb-3 mt-1">
    <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
      {children}
    </span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const UserRegister = () => {
  const [form, setForm] = useState({
    name: "",
    userName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    location: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const passwordsMatch =
    form.confirm.length > 0 && form.password === form.confirm;
  const passwordsMismatch =
    form.confirm.length > 0 && form.password !== form.confirm;

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!form.userName.trim() || form.userName.length < 3) newErrors.userName = "Username must be at least 3 characters";
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be exactly 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.location.trim()) newErrors.location = "Area/Locality is required";
    if (!form.address.trim()) newErrors.address = "Full address is required";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await userRegister({
        name: form.name,
        userName: form.userName,
        phone: form.phone,
        city: form.city,
        address: form.address,
        location: form.location,
        email: form.email,
        password: form.password,
      });

      alert(res?.msg || "Account created successfully! Please sign in.");
      window.location.href = "/auth/user/login";
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-[#f5f6fa] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-sm">

        {/* Header */}
        <div className="bg-[#1e3a5f] px-8 py-7">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-1">Create your account</h1>
          <p className="text-sm text-white/60">Join us — it only takes a minute</p>
          {/* Step indicator */}
          <div className="flex gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 h-1 rounded-full bg-white/80" />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">

          {/* Error Banner */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={submit} noValidate>

            {/* Personal Info */}
            <SectionLabel>Personal info</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Full name"
                id="ur_name"
                value={form.name}
                onChange={set("name")}
                placeholder="John Doe"
                required
                error={errors.name}
              />
              <FormInput
                label="Username"
                id="ur_username"
                value={form.userName}
                onChange={set("userName")}
                placeholder="johndoe"
                required
                error={errors.userName}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Phone"
                id="ur_phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 98765 43210"
                required
                error={errors.phone}
              />
              <FormInput
                label="Email"
                id="ur_email"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="john@email.com"
                required
                error={errors.email}
              />
            </div>

            {/* Location */}
            <SectionLabel>Location</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="City"
                id="ur_city"
                value={form.city}
                onChange={set("city")}
                placeholder="Mumbai"
                required
                error={errors.city}
              />
              <FormInput
                label="Area / Locality"
                id="ur_location"
                value={form.location}
                onChange={set("location")}
                placeholder="Andheri West"
                required
                error={errors.location}
              />
            </div>
            <FormInput
              label="Full address"
              id="ur_address"
              value={form.address}
              onChange={set("address")}
              placeholder="Flat 4B, Rose Garden Apartments, MG Road"
              required
              error={errors.address}
            />

            {/* Security */}
            <SectionLabel>Security</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <PasswordInput
                label="Password"
                id="ur_pass"
                value={form.password}
                onChange={set("password")}
                placeholder="Min. 8 characters"
                required
                error={errors.password}
              />
              <div>
                <PasswordInput
                  label="Confirm password"
                  id="ur_cpass"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Re-enter password"
                  required
                  error={errors.confirm}
                />
                {passwordsMatch && (
                  <p className="text-[11px] text-green-600 mt-1">Passwords match</p>
                )}
                {passwordsMismatch && (
                  <p className="text-[11px] text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || passwordsMismatch}
              className="w-full h-11 mt-2 bg-[#1e3a5f] hover:bg-[#16305a] active:scale-[0.99] text-white text-[15px] font-medium rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Trust */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-gray-400">
            <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Your data is encrypted and never shared
          </div>

          {/* Sign in link */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/auth/user/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserRegister;