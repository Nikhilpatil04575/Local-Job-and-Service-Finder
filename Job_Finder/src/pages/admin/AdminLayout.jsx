import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Admin.css"; // We'll create this file

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Providers", path: "/admin/providers", icon: "👷" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-logo">🛠️</span>
          <h2>AdminPanel</h2>
        </div>
        
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`admin-nav-item ${pathname.includes(item.path) ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search across panel..." />
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn">🔔</button>
            <div className="admin-profile">
              <div className="avatar">A</div>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
