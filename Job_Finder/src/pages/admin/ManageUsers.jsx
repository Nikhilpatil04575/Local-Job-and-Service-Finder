import React, { useEffect, useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8092/LocalJobApp/admin/users");
      const data = await res.json();
      if (data && data.obj) {
        setUsers(data.obj);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus === "Y" ? "block" : "unblock";
      await fetch(`http://localhost:8092/LocalJobApp/admin/users/${userId}/${endpoint}`, {
        method: "POST"
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to change user status", err);
    }
  };

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h2>Manage Users</h2>
        <button className="refresh-btn" onClick={fetchUsers}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="admin-loader">Loading users...</div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.userName}</td>
                  <td>{user.emailId}</td>
                  <td>{user.mobileNo}</td>
                  <td>
                    <span className={`status-badge ${user.isActive === 'Y' ? 'active' : 'inactive'}`}>
                      {user.isActive === 'Y' ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`action-btn ${user.isActive === 'Y' ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                    >
                      {user.isActive === 'Y' ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
