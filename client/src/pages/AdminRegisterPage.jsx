import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminRegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminInviteToken: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const key = params.get("key");
    if (key !== "122333") {
      navigate("/");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/verify", {
        state: { email: form.email, password: form.password },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
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
          --card-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        .ar-page {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        /* TOP BADGE */
        .ar-topbadge {
          display: flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; font-weight: 600; color: var(--accent);
          margin-bottom: 28px;
        }
        .ar-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 8px var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

        /* CARD */
        .ar-card {
          width: 100%; max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--card-shadow);
          overflow: hidden;
        }

        .ar-card-header {
          padding: 20px 24px 18px;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
        }
        .ar-card-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px; font-weight: 600; color: var(--text);
          letter-spacing: -0.3px;
        }
        .ar-card-title span { color: var(--accent); }
        .ar-card-sub {
          font-size: 12px; color: var(--text-dim); margin-top: 4px;
        }

        .ar-card-body { padding: 24px; }

        /* ERROR */
        .ar-error {
          display: flex; align-items: center; gap: 8px;
          background: var(--danger-dim);
          border: 1px solid rgba(240,107,107,0.25);
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; color: var(--danger);
          margin-bottom: 18px;
          font-family: 'JetBrains Mono', monospace;
        }

        /* FIELDS */
        .ar-field { margin-bottom: 14px; }
        .ar-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; color: var(--text-dim);
          margin-bottom: 6px;
        }
        .ar-input {
          width: 100%; padding: 10px 14px;
          background: var(--bg3); border: 1px solid var(--border);
          border-radius: 8px; color: var(--text);
          font-size: 13px; font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .ar-input::placeholder { color: var(--text-dim); }
        .ar-input:hover { border-color: var(--border-light); }
        .ar-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        .ar-divider {
          height: 1px; background: var(--border);
          margin: 18px 0;
        }

        /* SUBMIT */
        .ar-submit {
          width: 100%; padding: 11px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer; letter-spacing: 0.5px;
          transition: all 0.2s; margin-top: 4px;
        }
        .ar-submit:hover:not(:disabled) {
          background: #6b9ef8;
          box-shadow: 0 0 16px rgba(79,142,247,0.35);
        }
        .ar-submit:disabled {
          opacity: 0.5; cursor: not-allowed;
        }

        .ar-footer {
          text-align: center; margin-top: 20px;
          font-size: 12px; color: var(--text-dim);
          font-family: 'JetBrains Mono', monospace;
        }
        .ar-footer a {
          color: var(--accent); text-decoration: none;
        }
        .ar-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="ar-page">
        <div className="ar-topbadge">
          <div className="ar-dot" />
          ADMIN · SECURE REGISTRATION
        </div>

        <div className="ar-card">
          <div className="ar-card-header">
            <div className="ar-card-title"><span>/</span> create_admin</div>
            <div className="ar-card-sub">Restricted access — invite token required</div>
          </div>

          <div className="ar-card-body">
            {error && (
              <div className="ar-error">
                ✕ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="ar-field">
                <label className="ar-label">Name</label>
                <input
                  className="ar-input"
                  name="name"
                  placeholder="Full name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ar-field">
                <label className="ar-label">Email</label>
                <input
                  className="ar-input"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ar-field">
                <label className="ar-label">Password</label>
                <input
                  className="ar-input"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ar-divider" />

              <div className="ar-field">
                <label className="ar-label">Admin Invite Token</label>
                <input
                  className="ar-input"
                  name="adminInviteToken"
                  placeholder="Enter invite token"
                  onChange={handleChange}
                />
              </div>

              <button className="ar-submit" type="submit" disabled={loading}>
                {loading ? "Creating..." : "→ Create Admin Account"}
              </button>
            </form>
          </div>
        </div>

        <div className="ar-footer">
          <a href="/">← Back to store</a>
        </div>
      </div>
    </>
  );
}