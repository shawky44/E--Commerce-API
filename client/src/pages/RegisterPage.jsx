import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/verify", { state: { email: form.email, password: form.password } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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
          --accent-light: #f0e6d3;
          --text: #2c2416;
          --text-muted: #8a7560;
          --text-dim: #b5a48e;
          --danger: #c0392b;
          --danger-bg: #fdf0ee;
          --glow: rgba(176,125,74,0.12);
          --card-shadow: 0 2px 16px rgba(44,36,22,0.08);
        }

        .register-wrapper {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .register-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 44px 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: var(--card-shadow);
          animation: fadeInUp 0.4s ease both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* LOGO */
        .register-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 28px;
          cursor: pointer;
        }
        .register-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--accent), #d4a574);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 10px var(--glow);
        }
        .register-logo-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 20px;
          color: var(--text); letter-spacing: -0.3px;
        }
        .register-logo-dot { color: var(--accent); }

        /* TITLE */
        .register-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 700;
          color: var(--text); text-align: center;
          margin-bottom: 6px; letter-spacing: -0.4px;
        }
        .register-subtitle {
          font-size: 13px; color: var(--text-dim);
          text-align: center; margin-bottom: 28px;
        }

        /* DIVIDER */
        .card-divider {
          height: 1px; background: var(--border);
          margin: 0 0 24px;
        }

        /* ERROR */
        .error-box {
          background: var(--danger-bg);
          border: 1px solid #f0c8c2;
          border-radius: 9px;
          padding: 10px 14px;
          color: var(--danger);
          font-size: 13px; margin-bottom: 18px;
          display: flex; align-items: center; gap: 7px;
        }

        /* FORM */
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 7px;
        }
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: all 0.2s ease;
        }
        .form-input::placeholder { color: var(--text-dim); }
        .form-input:focus {
          border-color: var(--border-hover);
          box-shadow: 0 0 0 3px var(--glow);
          background: var(--surface);
        }

        /* PASSWORD */
        .password-wrapper { position: relative; }
        .password-wrapper .form-input { padding-right: 44px; }
        .eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 16px; color: var(--text-dim);
          padding: 2px 4px; border-radius: 4px;
          transition: color 0.2s; line-height: 1;
        }
        .eye-btn:hover { color: var(--accent); }

        /* SUBMIT */
        .submit-btn {
          width: 100%; padding: 13px; margin-top: 8px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 11px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 4px 14px var(--glow);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #9a6b39;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--glow);
        }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* LOADING DOTS */
        .loading-dots span {
          display: inline-block;
          width: 5px; height: 5px; border-radius: 50%;
          background: #fff; margin: 0 2px;
          animation: dot-bounce 1.2s infinite ease-in-out;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* FOOTER */
        .register-footer {
          text-align: center; margin-top: 20px;
          font-size: 13px; color: var(--text-dim);
        }
        .register-footer a {
          color: var(--accent); font-weight: 600;
          text-decoration: none; transition: opacity 0.2s;
        }
        .register-footer a:hover { opacity: 0.75; }
      `}</style>

      <div className="register-wrapper">
        <div className="register-card">

          {/* LOGO */}
          <div className="register-logo" onClick={() => navigate("/")}>
            <div className="register-logo-icon">🛒</div>
            <span className="register-logo-text">
              Shawky<span className="register-logo-dot">·</span>Market
            </span>
          </div>

          <h2 className="register-title">Create account</h2>
          <p className="register-subtitle">Join us and start shopping today</p>

          <div className="card-divider" />

          {error && (
            <div className="error-box">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  Creating account
                  <span className="loading-dots">
                    <span /><span /><span />
                  </span>
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}