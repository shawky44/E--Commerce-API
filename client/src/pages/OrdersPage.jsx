import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const statusConfig = {
  pending:   { color: "#b07d4a", bg: "rgba(176,125,74,0.1)",  border: "rgba(176,125,74,0.25)",  label: "Pending"   },
  paid:      { color: "#4a7eb0", bg: "rgba(74,126,176,0.1)",  border: "rgba(74,126,176,0.25)",  label: "Paid"      },
  shipped:   { color: "#7a5eb0", bg: "rgba(122,94,176,0.1)",  border: "rgba(122,94,176,0.25)",  label: "Shipped"   },
  delivered: { color: "#7a9e7e", bg: "rgba(122,158,126,0.1)", border: "rgba(122,158,126,0.25)", label: "Delivered" },
  cancelled: { color: "#c0392b", bg: "rgba(192,57,43,0.08)",  border: "rgba(192,57,43,0.2)",    label: "Cancelled" },
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
        prev.map((o) => o._id === orderId ? { ...o, status: "cancelled" } : o)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const handlePay = async (orderId) => {
    try {
      const res = await api.post("/payment/create-checkout-session", { orderId });
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f5f0e8;
          font-family: 'DM Sans', sans-serif;
        }

        :root {
          --bg: #f5f0e8;
          --bg2: #ede7db;
          --surface: #fff9f2;
          --border: #e8dece;
          --border-hover: #c9a87c;
          --accent: #b07d4a;
          --accent2: #7a9e7e;
          --accent-light: #f0e6d3;
          --text: #2c2416;
          --text-muted: #8a7560;
          --text-dim: #b5a48e;
          --danger: #c0392b;
          --danger-bg: #fdf0ee;
          --glow: rgba(176,125,74,0.12);
          --card-shadow: 0 2px 16px rgba(44,36,22,0.08);
        }

        .orders-wrapper {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* NAVBAR */
        .navbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 40px;
          background: rgba(245,240,232,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 2px 20px rgba(44,36,22,0.08);
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 20px;
          color: var(--text);
          display: flex; align-items: center; gap: 10px;
          cursor: pointer;
        }
        .logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--accent), #d4a574);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; box-shadow: 0 2px 10px var(--glow);
        }
        .logo-dot { color: var(--accent); }

        /* PAGE */
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 36px 40px 60px;
        }

        /* HEADER */
        .page-header {
          display: flex; align-items: center;
          gap: 20px; margin-bottom: 32px;
        }
        .back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 9px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; white-space: nowrap;
        }
        .back-btn:hover {
          background: var(--accent-light);
          border-color: var(--border-hover); color: var(--accent);
        }
        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700; letter-spacing: -0.5px;
        }
        .orders-count {
          margin-left: auto;
          font-size: 13px; color: var(--text-dim);
          background: var(--bg2); border: 1px solid var(--border);
          padding: 4px 12px; border-radius: 20px;
        }

        /* LOADING */
        .center-state {
          text-align: center; padding: 80px 40px;
          color: var(--text-muted); font-size: 15px;
        }
        .loading-spinner {
          width: 36px; height: 36px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; padding: 80px 40px; text-align: center;
        }
        .empty-icon { font-size: 40px; opacity: 0.2; }
        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 600; color: var(--text-muted);
        }
        .empty-sub { font-size: 14px; color: var(--text-dim); }
        .shop-btn {
          margin-top: 8px; padding: 11px 28px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; box-shadow: 0 4px 14px var(--glow);
        }
        .shop-btn:hover { background: #9a6b39; transform: translateY(-1px); }

        /* ORDER LIST */
        .orders-list {
          display: flex; flex-direction: column; gap: 16px;
        }

        /* ORDER CARD */
        .order-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
          box-shadow: var(--card-shadow);
          animation: cardIn 0.35s ease both;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .order-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 6px 24px rgba(44,36,22,0.1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* CARD HEADER */
        .card-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }
        .order-id {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: var(--text); letter-spacing: 0.3px;
          margin-bottom: 3px;
        }
        .order-date {
          font-size: 12px; color: var(--text-dim);
        }
        .status-badge {
          padding: 5px 13px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.8px; text-transform: uppercase;
          border: 1px solid;
        }

        /* CARD ITEMS */
        .card-items { padding: 12px 20px; }
        .order-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 7px 0;
          border-bottom: 1px solid var(--bg2);
          font-size: 13px;
        }
        .order-item:last-child { border-bottom: none; }
        .item-name { flex: 1; color: var(--text-muted); }
        .item-qty {
          font-size: 11px; font-weight: 600;
          color: var(--text-dim);
          background: var(--bg2); border: 1px solid var(--border);
          padding: 2px 8px; border-radius: 10px;
          margin-right: 14px;
        }
        .item-price { font-weight: 600; color: var(--text); font-size: 13px; }

        /* CARD FOOTER */
        .card-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 20px;
          border-top: 1px solid var(--border);
          background: var(--bg2);
        }
        .order-total {
          font-size: 14px; color: var(--text-muted);
        }
        .order-total strong {
          font-family: 'Playfair Display', serif;
          font-size: 17px; color: var(--accent);
        }
        .card-actions { display: flex; gap: 8px; }

        .pay-btn {
          padding: 8px 18px; border-radius: 9px;
          background: var(--accent); color: #fff;
          border: none; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; box-shadow: 0 2px 8px var(--glow);
        }
        .pay-btn:hover { background: #9a6b39; transform: translateY(-1px); }

        .cancel-btn {
          padding: 8px 18px; border-radius: 9px;
          background: var(--danger-bg); color: var(--danger);
          border: 1px solid #f0c8c2;
          font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .cancel-btn:hover { background: #fce0dc; border-color: #e0a09a; }
      `}</style>

      <div className="orders-wrapper">
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🛒</div>
            <span>Shawky<span className="logo-dot">·</span>Market</span>
          </div>
        </nav>

        {loading ? (
          <div className="center-state">
            <div className="loading-spinner" />
            Loading your orders...
          </div>
        ) : (
          <div className="page-container">
            {/* HEADER */}
            <div className="page-header">
              <button className="back-btn" onClick={() => navigate("/")}>
                ← Back to Home
              </button>
              <h2 className="page-title">My Orders</h2>
              {orders.length > 0 && (
                <span className="orders-count">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {/* EMPTY */}
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <div className="empty-title">No orders yet</div>
                <div className="empty-sub">Start shopping to see your orders here</div>
                <button className="shop-btn" onClick={() => navigate("/")}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order, i) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <div
                      key={order._id}
                      className="order-card"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {/* HEADER */}
                      <div className="card-header">
                        <div>
                          <div className="order-id">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="order-date">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric"
                            })}
                          </div>
                        </div>
                        <span
                          className="status-badge"
                          style={{
                            color: status.color,
                            background: status.bg,
                            borderColor: status.border,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* ITEMS */}
                      <div className="card-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <span className="item-name">{item.product?.name || "Product"}</span>
                            <span className="item-qty">×{item.quantity}</span>
                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* FOOTER */}
                      <div className="card-footer">
                        <span className="order-total">
                          Total: <strong>${order.totalPrice}</strong>
                        </span>
                        <div className="card-actions">
                          {order.status === "pending" && (
                            <>
                              <button className="pay-btn" onClick={() => handlePay(order._id)}>
                                Pay Now
                              </button>
                              <button className="cancel-btn" onClick={() => handleCancel(order._id)}>
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}