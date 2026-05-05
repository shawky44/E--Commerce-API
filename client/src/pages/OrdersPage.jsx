import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const statusColors = {
  pending: "#f59e0b",
  paid: "#2563eb",
  shipped: "#7c3aed",
  delivered: "#16a34a",
  cancelled: "#dc2626",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const handlePay = async (orderId) => {
    try {
      const res = await api.post("/payment/create-checkout-session", {
        orderId,
      });
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  if (loading) return <p style={styles.center}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h2 style={styles.title}>My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>No orders yet.</p>
          <button style={styles.shopBtn} onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              {/* Order Header */}
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={styles.date}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  style={{
                    ...styles.status,
                    backgroundColor:
                      statusColors[order.status] + "20",
                    color: statusColors[order.status],
                  }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Order Items */}
              <div style={styles.items}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.item}>
                    <span style={styles.itemName}>
                      {item.product?.name || "Product"}
                    </span>
                    <span style={styles.itemQty}>x{item.quantity}</span>
                    <span style={styles.itemPrice}>
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div style={styles.cardFooter}>
                <span style={styles.total}>
                  Total: <strong>${order.totalPrice}</strong>
                </span>
                <div style={styles.actions}>
                  {order.status === "pending" && (
                    <>
                      <button
                        style={styles.payBtn}
                        onClick={() => handlePay(order._id)}
                      >
                        Pay Now
                      </button>
                      <button
                        style={styles.cancelBtn}
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "32px", maxWidth: "800px", margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "32px",
  },
  title: { margin: 0 },
  backBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  empty: { textAlign: "center", padding: "60px", color: "#666" },
  shopBtn: {
    marginTop: "16px",
    padding: "12px 32px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
  },
  orderId: { margin: 0, fontWeight: "bold", fontSize: "14px" },
  date: { margin: 0, color: "#666", fontSize: "12px", marginTop: "4px" },
  status: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  items: { padding: "12px 20px" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "14px",
    borderBottom: "1px solid #f9f9f9",
  },
  itemName: { flex: 1, color: "#444" },
  itemQty: { color: "#666", marginRight: "16px" },
  itemPrice: { fontWeight: "bold" },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: "1px solid #f0f0f0",
    backgroundColor: "#fafafa",
  },
  total: { fontSize: "16px" },
  actions: { display: "flex", gap: "8px" },
  payBtn: {
    padding: "8px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelBtn: {
    padding: "8px 20px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  center: { textAlign: "center", padding: "60px", color: "#666" },
};