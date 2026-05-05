import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const statusConfig = {
  pending:   { color: "#f5a623", bg: "rgba(245,166,35,0.1)",   border: "rgba(245,166,35,0.25)"   },
  paid:      { color: "#4f8ef7", bg: "rgba(79,142,247,0.1)",   border: "rgba(79,142,247,0.25)"   },
  shipped:   { color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.25)"  },
  delivered: { color: "#38d9a9", bg: "rgba(56,217,169,0.1)",   border: "rgba(56,217,169,0.25)"   },
  cancelled: { color: "#f06b6b", bg: "rgba(240,107,107,0.1)",  border: "rgba(240,107,107,0.25)"  },
};

const validTransitions = {
  pending: ["paid"],
  paid: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0d0f12; font-family: 'Inter', sans-serif; }

        :root {
          --bg: #0d0f12; --bg2: #13161b; --bg3: #1a1e26;
          --surface: #1e2330; --surface2: #252b38;
          --border: #2a3040; --border-light: #343d52;
          --accent: #4f8ef7; --accent2: #38d9a9;
          --accent-dim: rgba(79,142,247,0.12);
          --text: #e8ecf4; --text-muted: #7a8499; --text-dim: #4a5268;
          --danger: #f06b6b; --danger-dim: rgba(240,107,107,0.1);
          --glow: rgba(79,142,247,0.15);
          --card-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        .admin-wrapper { min-height: 100vh; background: var(--bg); color: var(--text); }

        /* TOPBAR */
        .topbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 32px; height: 58px;
          background: var(--bg2); border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 100;
        }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .admin-badge {
          display: flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; font-weight: 600; color: var(--accent);
        }
        .admin-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 8px var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .topbar-divider { width: 1px; height: 20px; background: var(--border); }
        .page-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .topbar-nav { display: flex; align-items: center; gap: 6px; }
        .nav-link {
          padding: 6px 14px; border-radius: 7px;
          font-size: 13px; font-weight: 500;
          color: var(--text-muted); text-decoration: none;
          border: 1px solid transparent; transition: all 0.2s;
        }
        .nav-link:hover { color: var(--text); background: var(--surface); border-color: var(--border); }
        .nav-link.store {
          color: var(--accent); border-color: var(--accent-dim); background: var(--accent-dim);
        }
        .nav-link.store:hover { background: rgba(79,142,247,0.2); border-color: var(--accent); }

        /* PAGE */
        .page-container { max-width: 1200px; margin: 0 auto; padding: 28px 32px 60px; }

        .page-header { margin-bottom: 24px; }
        .page-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px; font-weight: 600; color: var(--text); letter-spacing: -0.5px;
        }
        .page-title span { color: var(--accent); }
        .page-sub { font-size: 13px; color: var(--text-dim); margin-top: 4px; }

        /* LOADING */
        .center-state { text-align: center; padding: 60px; color: var(--text-dim); font-size: 14px; }
        .loading-spinner {
          width: 32px; height: 32px;
          border: 2px solid var(--border); border-top-color: var(--accent);
          border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* TABLE CARD */
        .table-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; overflow: auto; box-shadow: var(--card-shadow);
        }
        .table-header {
          padding: 14px 20px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .table-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: var(--text-dim); font-weight: 500;
        }
        .orders-count {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent);
          background: var(--accent-dim); border: 1px solid rgba(79,142,247,0.2);
          padding: 3px 10px; border-radius: 20px;
        }

        table { width: 100%; border-collapse: collapse; min-width: 860px; }
        thead tr { background: var(--bg3); }
        th {
          padding: 11px 16px; text-align: left;
          font-size: 11px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; color: var(--text-dim);
          border-bottom: 1px solid var(--border); white-space: nowrap;
        }
        .table-row { border-bottom: 1px solid var(--border); transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: var(--surface2); }
        td { padding: 12px 16px; font-size: 13px; color: var(--text-muted); vertical-align: top; }

        .td-order-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: var(--accent); font-weight: 600;
        }
        .customer-name { color: var(--text); font-weight: 500; font-size: 13px; margin-bottom: 3px; }
        .customer-email { font-size: 11px; color: var(--text-dim); }
        .item-line { font-size: 12px; color: var(--text-muted); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
        .item-qty-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          background: var(--bg3); border: 1px solid var(--border);
          color: var(--text-dim); padding: 1px 6px; border-radius: 4px;
        }
        .td-total {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px; color: var(--accent2); font-weight: 600;
        }
        .td-date { font-size: 12px; color: var(--text-dim); white-space: nowrap; }

        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; border: 1px solid; white-space: nowrap;
        }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        /* STATUS SELECT */
        .status-select {
          padding: 6px 10px; border-radius: 7px;
          background: var(--bg3); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 12px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.2s; min-width: 110px;
        }
        .status-select:hover { border-color: var(--accent); color: var(--text); }
        .status-select:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-dim); }
        .status-select option { background: var(--bg3); }
        .no-action { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="admin-wrapper">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="admin-badge">
              <div className="admin-badge-dot" />
              ADMIN
            </div>
            <div className="topbar-divider" />
            <span className="page-label">Orders Management</span>
          </div>
          <nav className="topbar-nav">
            <Link to="/admin/products" className="nav-link">Products</Link>
            <Link to="/admin/users" className="nav-link">Users</Link>
            <Link to="/" className="nav-link store">← Store</Link>
          </nav>
        </div>

        <div className="page-container">
          {/* HEADER */}
          <div className="page-header">
            <div className="page-title"><span>/</span> orders</div>
            <div className="page-sub">{orders.length} total records</div>
          </div>

          {loading ? (
            <div className="center-state">
              <div className="loading-spinner" />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="center-state">No orders yet.</div>
          ) : (
            <div className="table-card">
              <div className="table-header">
                <span className="table-label">ORDER_RECORDS</span>
                <span className="orders-count">{orders.length} orders</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const s = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <tr key={order._id} className="table-row">
                        {/* ORDER ID */}
                        <td>
                          <span className="td-order-id">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* CUSTOMER */}
                        <td>
                          <div className="customer-name">{order.user?.name || "N/A"}</div>
                          <div className="customer-email">{order.user?.email}</div>
                        </td>

                        {/* ITEMS */}
                        <td>
                          {order.items.map((item, i) => (
                            <div key={i} className="item-line">
                              {item.product?.name || "Product"}
                              <span className="item-qty-badge">×{item.quantity}</span>
                            </div>
                          ))}
                        </td>

                        {/* TOTAL */}
                        <td className="td-total">${order.totalPrice}</td>

                        {/* DATE */}
                        <td className="td-date">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric"
                          })}
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className="status-badge"
                            style={{ color: s.color, background: s.bg, borderColor: s.border }}
                          >
                            <span className="status-dot" />
                            {order.status}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td>
                          {validTransitions[order.status]?.length > 0 ? (
                            <select
                              className="status-select"
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) handleStatusChange(order._id, e.target.value);
                              }}
                            >
                              <option value="">Update →</option>
                              {validTransitions[order.status].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="no-action">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}