import React, { useState } from "react";
import FormInput from "../../../components/form/FormInput.jsx";
import PasswordInput from "../../../components/form/PasswordInput.jsx";
import { userLogin } from "../../../lib/api.js";

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UserLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await userLogin({ userName, password });
      console.log("Login response:", res);

      // Save to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName",   userName);
      localStorage.setItem("role",       "USER");

      const uid = res?.responseMap?.userId;
      if (uid) {
        localStorage.setItem("userId", String(uid));
        console.log("✅ userId saved:", uid);
      }

      window.location.href = "/user/dashboard";
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

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <ShieldIcon />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white text-center mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 text-center mb-5">Sign in to your account to continue</p>

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
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              required
            />
            <PasswordInput
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="/auth/user/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            ✓ Secured with 256-bit encryption
          </p>
          <p className="text-center text-sm text-gray-400 mt-3">
            New here?{" "}
            <a href="/auth/user/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;