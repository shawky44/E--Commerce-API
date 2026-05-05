import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const statusColors = {
  pending: "#f59e0b", paid: "#2563eb",
  shipped: "#7c3aed", delivered: "#16a34a", cancelled: "#dc2626",
};

const validTransitions = {
  pending: ["paid"], paid: ["shipped"],
  shipped: ["delivered"], delivered: [], cancelled: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Orders Management</h2>
        <div style={styles.navLinks}>
          <Link to="/admin/products" style={styles.navLink}>Products</Link>
          <Link to="/admin/users" style={styles.navLink}>Users</Link>
          <Link to="/" style={styles.navLink}>← Store</Link>
        </div>
      </div>

      {loading ? (
        <p style={styles.center}>Loading...</p>
      ) : orders.length === 0 ? (
        <p style={styles.center}>No orders yet.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={styles.tableRow}>
                  <td style={styles.td}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td style={styles.td}>
                    <div>{order.user?.name || "N/A"}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{order.user?.email}</div>
                  </td>
                  <td style={styles.td}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ fontSize: "13px" }}>
                        {item.product?.name || "Product"} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td style={styles.td}><strong>${order.totalPrice}</strong></td>
                  <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "12px", fontSize: "12px",
                      backgroundColor: statusColors[order.status] + "20",
                      color: statusColors[order.status],
                      fontWeight: "bold",
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {validTransitions[order.status]?.length > 0 && (
                      <select
                        style={styles.select}
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) handleStatusChange(order._id, e.target.value);
                        }}
                      >
                        <option value="">Update</option>
                        {validTransitions[order.status].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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
  tableWrapper: { backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHead: { backgroundColor: "#f8fafc" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "13px", color: "#666", fontWeight: "600", borderBottom: "1px solid #eee" },
  tableRow: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "14px", verticalAlign: "top" },
  select: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", cursor: "pointer" },
  center: { textAlign: "center", padding: "40px", color: "#666" },
};