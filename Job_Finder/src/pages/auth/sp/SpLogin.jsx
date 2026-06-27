import React, { useState } from "react";
import FormInput from "../../../components/form/FormInput.jsx";
import PasswordInput from "../../../components/form/PasswordInput.jsx";
import { spLogin } from "../../../lib/api.js";

const ToolIcon = () => (
  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const SpLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!userName.trim()) newErrors.userName = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await spLogin({ userName, password });
      console.log("SP Login response:", res);

      // Save to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName",   userName);
      localStorage.setItem("role",       "SP");

      const pid = res?.responseMap?.providerId;
      if (pid) {
        localStorage.setItem("providerId", String(pid));
        console.log("✅ providerId saved:", pid);
      }

      window.location.href = "/sp/dashboard";
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center">
              <ToolIcon />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white text-center mb-1">Provider Login</h2>
          <p className="text-sm text-gray-400 text-center mb-5">Sign in to your provider account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Username"
              id="userName"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (errors.userName) setErrors(prev => ({ ...prev, userName: "" }));
              }}
              placeholder="Enter your username"
              required
              error={errors.userName}
            />
            <PasswordInput
              label="Password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
              }}
              placeholder="Enter your password"
              required
              error={errors.password}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg
                text-sm font-medium transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            Not registered?{" "}
            <a href="/auth/sp/register" className="text-green-400 hover:text-green-300 font-medium">
              Join as provider
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpLogin;