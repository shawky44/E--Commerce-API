import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      console.log("Users Response:", JSON.stringify(res.data));
      setUsers(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Users Management</h2>
        <div style={styles.navLinks}>
          <Link to="/admin/products" style={styles.navLink}>Products</Link>
          <Link to="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link to="/" style={styles.navLink}>← Store</Link>
        </div>
      </div>

      {loading ? (
        <p style={styles.center}>Loading...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Verified</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={styles.tableRow}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "12px", fontSize: "12px",
                      backgroundColor: user.role === "admin" ? "#dbeafe" : "#f3f4f6",
                      color: user.role === "admin" ? "#2563eb" : "#374151",
                      fontWeight: "bold",
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "12px", fontSize: "12px",
                      backgroundColor: user.verified ? "#dcfce7" : "#fee2e2",
                      color: user.verified ? "#16a34a" : "#dc2626",
                    }}>
                      {user.verified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    {user.role !== "admin" && (
                      <button style={styles.deleteBtn} onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", padding: "16px 24px", backgroundColor: "#1e40af", borderRadius: "8px" },
  title: { margin: 0, color: "#fff", fontSize: "20px" },
  navLinks: { display: "flex", gap: "12px" },
  navLink: { color: "#fff", textDecoration: "none", padding: "8px 16px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.2)", fontSize: "14px" },
  tableWrapper: { backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHead: { backgroundColor: "#f8fafc" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "13px", color: "#666", fontWeight: "600", borderBottom: "1px solid #eee" },
  tableRow: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "14px" },
  deleteBtn: { padding: "6px 14px", backgroundColor: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  center: { textAlign: "center", padding: "40px", color: "#666" },
};