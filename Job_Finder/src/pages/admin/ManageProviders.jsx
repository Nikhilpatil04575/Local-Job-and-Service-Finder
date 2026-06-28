import React, { useEffect, useState } from "react";

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch("http://localhost:8092/LocalJobApp/admin/providers");
      const data = await res.json();
      if (data && data.obj) {
        setProviders(data.obj);
      }
    } catch (err) {
      console.error("Failed to fetch providers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (providerId, currentStatus) => {
    try {
      const endpoint = currentStatus === "Y" ? "block" : "unblock";
      await fetch(`http://localhost:8092/LocalJobApp/admin/providers/${providerId}/${endpoint}`, {
        method: "POST"
      });
      fetchProviders();
    } catch (err) {
      console.error("Failed to change provider status", err);
    }
  };

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h2>Manage Providers</h2>
        <button className="refresh-btn" onClick={fetchProviders}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="admin-loader">Loading providers...</div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Provider Name</th>
                <th>Service Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td>#{provider.id}</td>
                  <td>{provider.firstName}</td>
                  <td>{provider.serviceName}</td>
                  <td>{provider.mobileNo}</td>
                  <td>{provider.city}</td>
                  <td>
                    <span className={`status-badge ${provider.isActive === 'Y' ? 'active' : 'inactive'}`}>
                      {provider.isActive === 'Y' ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`action-btn ${provider.isActive === 'Y' ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(provider.id, provider.isActive)}
                    >
                      {provider.isActive === 'Y' ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">No providers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProviders;
