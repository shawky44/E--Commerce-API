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
          --warn: #f5a623; --warn-dim: rgba(245,166,35,0.1);
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
        .nav-link.active {
          color: var(--accent); background: var(--accent-dim);
          border-color: rgba(79,142,247,0.25);
        }
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

        /* STATS */
        .stats-row { display: flex; gap: 14px; margin-bottom: 24px; }
        .stat-card {
          flex: 1; background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 16px 20px; box-shadow: var(--card-shadow);
        }
        .stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;
        }
        .stat-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 26px; font-weight: 600; color: var(--text);
        }
        .stat-value.blue  { color: var(--accent); }
        .stat-value.green { color: var(--accent2); }
        .stat-value.red   { color: var(--danger); }
        .stat-value.warn  { color: var(--warn); }

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
        .users-count {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent);
          background: var(--accent-dim); border: 1px solid rgba(79,142,247,0.2);
          padding: 3px 10px; border-radius: 20px;
        }

        table { width: 100%; border-collapse: collapse; min-width: 780px; }
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
        td { padding: 12px 16px; font-size: 13px; color: var(--text-muted); vertical-align: middle; }

        .user-name { color: var(--text); font-weight: 500; font-size: 13px; }
        .user-email { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

        /* BADGES */
        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; border: 1px solid; white-space: nowrap;
          font-family: 'JetBrains Mono', monospace;
        }
        .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        .badge-admin {
          color: var(--warn);
          background: var(--warn-dim);
          border-color: rgba(245,166,35,0.25);
        }
        .badge-user {
          color: var(--text-dim);
          background: var(--bg3);
          border-color: var(--border);
        }
        .badge-verified {
          color: var(--accent2);
          background: rgba(56,217,169,0.1);
          border-color: rgba(56,217,169,0.25);
        }
        .badge-unverified {
          color: var(--danger);
          background: var(--danger-dim);
          border-color: rgba(240,107,107,0.25);
        }

        .td-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: var(--text-dim); white-space: nowrap;
        }

        /* DELETE BUTTON */
        .delete-btn {
          padding: 6px 14px; border-radius: 7px;
          background: var(--danger-dim); color: var(--danger);
          border: 1px solid rgba(240,107,107,0.25);
          cursor: pointer; font-size: 12px; font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.2s; letter-spacing: 0.3px;
        }
        .delete-btn:hover {
          background: rgba(240,107,107,0.2);
          border-color: var(--danger);
          box-shadow: 0 0 8px rgba(240,107,107,0.2);
        }
        .no-action { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }

        /* SKELETON */
        .skel {
          height: 12px; border-radius: 6px;
          background: linear-gradient(90deg, var(--bg3) 0%, var(--border) 50%, var(--bg3) 100%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite;
        }
        .skel.w40 { width: 40%; } .skel.w60 { width: 60%; }
        .skel.w25 { width: 25%; } .skel.w15 { width: 15%; }
        @keyframes shimmer { to { background-position: -200% 0; } }
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
            <span className="page-label">Users Management</span>
          </div>
          <nav className="topbar-nav">
            <Link to="/admin/products" className="nav-link">Products</Link>
            <Link to="/admin/orders" className="nav-link">Orders</Link>
            <Link to="/admin/users" className="nav-link active">Users</Link>
            <Link to="/" className="nav-link store">← Store</Link>
          </nav>
        </div>

        <div className="page-container">
          {/* HEADER */}
          <div className="page-header">
            <div className="page-title"><span>/</span> users</div>
            <div className="page-sub">{users.length} total records</div>
          </div>

          {/* STATS */}
          {!loading && (
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Total_Users</div>
                <div className="stat-value">{users.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Admins</div>
                <div className="stat-value warn">{users.filter(u => u.role === "admin").length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Verified</div>
                <div className="stat-value green">{users.filter(u => u.verified).length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Unverified</div>
                <div className="stat-value red">{users.filter(u => !u.verified).length}</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="center-state">
              <div className="loading-spinner" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="center-state">No users found.</div>
          ) : (
            <div className="table-card">
              <div className="table-header">
                <span className="table-label">USER_RECORDS</span>
                <span className="users-count">{users.length} users</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="table-row">
                        <td><div className="skel w40" /></td>
                        <td><div className="skel w60" /></td>
                        <td><div className="skel w25" /></td>
                        <td><div className="skel w15" /></td>
                        <td><div className="skel w25" /></td>
                        <td><div className="skel w15" /></td>
                      </tr>
                    ))
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="table-row">
                        {/* NAME */}
                        <td>
                          <div className="user-name">{user.name}</div>
                        </td>

                        {/* EMAIL */}
                        <td>
                          <div className="user-email">{user.email}</div>
                        </td>

                        {/* ROLE */}
                        <td>
                          <span className={`badge ${user.role === "admin" ? "badge-admin" : "badge-user"}`}>
                            <span className="badge-dot" />
                            {user.role}
                          </span>
                        </td>

                        {/* VERIFIED */}
                        <td>
                          <span className={`badge ${user.verified ? "badge-verified" : "badge-unverified"}`}>
                            <span className="badge-dot" />
                            {user.verified ? "verified" : "pending"}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="td-date">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric"
                          })}
                        </td>

                        {/* ACTION */}
                        <td>
                          {user.role !== "admin" ? (
                            <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                              rm user
                            </button>
                          ) : (
                            <span className="no-action">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}