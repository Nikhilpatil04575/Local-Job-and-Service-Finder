import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalProviders: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8092/LocalJobApp/admin/stats");
        const data = await res.json();
        if (data && data.obj) {
          setStats(data.obj);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="admin-loader">Loading stats...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-details">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon providers-icon">👷</div>
            <div className="stat-details">
              <h3>Total Providers</h3>
              <p className="stat-value">{stats.totalProviders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bookings-icon">📅</div>
            <div className="stat-details">
              <h3>Total Bookings</h3>
              <p className="stat-value">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        <div className="dashboard-section chart-section">
          <h2>Activity Chart</h2>
          <div className="chart-placeholder">
            {/* Placeholder for future charting library integration */}
            <p>User activity visualization will appear here.</p>
          </div>
        </div>
        <div className="dashboard-section recent-section">
          <h2>Recent Alerts</h2>
          <ul className="alert-list">
            <li><span className="alert-dot info"></span> New provider registered: John Plumber</li>
            <li><span className="alert-dot warning"></span> 5 new bookings pending review</li>
            <li><span className="alert-dot success"></span> System update completed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
