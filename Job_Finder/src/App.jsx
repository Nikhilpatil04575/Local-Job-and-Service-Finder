import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

// Pages
import Home             from "./pages/Home.jsx";
import Services         from "./pages/Services.jsx";

// User Auth
import UserLogin        from "./pages/auth/user/UserLogin.jsx";
import UserRegister     from "./pages/auth/user/UserRegister.jsx";

// SP Auth
import SpLogin          from "./pages/auth/sp/SpLogin.jsx";
import SpRegister       from "./pages/auth/sp/SpRegister.jsx";

// Shared Auth
import ForgotPassword   from "./pages/auth/ForgotPassword.jsx";

// User Pages (own navbar)
import Dashboard        from "./pages/user/Dashboard.jsx";
import ServiceProviders from "./pages/user/ServiceProviders.jsx";

// SP Pages (own navbar)
import SpDashboard      from "./pages/auth/sp/SpDashboard.jsx";

// Routes that manage their OWN top navbar
const SELF_NAVBAR_ROUTES = ["/user/", "/sp/"];

const App = () => {
  const { pathname } = useLocation();
  const hideNavbar = SELF_NAVBAR_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/"        element={<Home />} />
        <Route path="/services" element={<Services />} />

        {/* User Auth */}
        <Route path="/auth/user/login"           element={<UserLogin />} />
        <Route path="/auth/user/register"        element={<UserRegister />} />
        <Route path="/auth/user/forgot-password" element={<ForgotPassword />} />

        {/* SP Auth */}
        <Route path="/auth/sp/login"           element={<SpLogin />} />
        <Route path="/auth/sp/register"        element={<SpRegister />} />
        <Route path="/auth/sp/forgot-password" element={<ForgotPassword />} />

        {/* User protected pages */}
        <Route path="/user/dashboard"             element={<Dashboard />} />
        <Route path="/user/services/:serviceName" element={<ServiceProviders />} />

        {/* SP protected pages */}
        <Route path="/sp/dashboard" element={<SpDashboard />} />

        {/* 404 fallback */}
        <Route path="*" element={
          <div style={{
            minHeight: "80vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "#0B0F1A", fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🔍</div>
            <h1 style={{ color: "#f1f5f9", fontSize: "24px", marginBottom: "8px" }}>
              Page not found
            </h1>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              The page you're looking for doesn't exist.
            </p>
            <a href="/" style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", borderRadius: "10px",
              textDecoration: "none", fontSize: "14px",
            }}>
              Go home
            </a>
          </div>
        } />
      </Routes>
    </>
  );
};

export default App;