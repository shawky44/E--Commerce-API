import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";

export default function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/payment/create-checkout-session", {
        orderId,
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
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

        .checkout-wrapper {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          flex-direction: column;
        }

        /* NAVBAR */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 40px;
          background: rgba(245,240,232,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 2px 20px rgba(44,36,22,0.08);
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 20px;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--accent), #d4a574);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 10px var(--glow);
        }
        .logo-dot { color: var(--accent); }

        /* CENTER LAYOUT */
        .checkout-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        /* CARD */
        .checkout-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 44px 40px;
          width: 100%;
          max-width: 440px;
          text-align: center;
          box-shadow: var(--card-shadow);
          animation: fadeInUp 0.4s ease both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* STRIPE ICON */
        .checkout-icon {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, var(--accent-light), #e8dece);
          border: 1px solid var(--border);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          margin: 0 auto 24px;
          box-shadow: 0 4px 14px var(--glow);
        }

        .checkout-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--text);
          margin-bottom: 10px;
        }

        /* ORDER ID BADGE */
        .order-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 20px;
          background: var(--accent-light);
          border: 1px solid var(--border);
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .order-badge strong {
          color: var(--accent);
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.3px;
        }

        /* DIVIDER */
        .card-divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }

        /* INFO BOX */
        .info-box {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 28px;
          text-align: left;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .info-box-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .info-box-text {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* ERROR */
        .error-box {
          background: var(--danger-bg);
          border: 1px solid #f0c8c2;
          border-radius: 9px;
          padding: 11px 14px;
          color: var(--danger);
          font-size: 13px;
          margin-bottom: 18px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* PAY BUTTON */
        .pay-btn {
          width: 100%;
          padding: 15px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 11px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 4px 14px var(--glow);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pay-btn:hover:not(:disabled) {
          background: #9a6b39;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--glow);
        }
        .pay-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* LOADING DOTS */
        .loading-dots span {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fff;
          margin: 0 2px;
          animation: dot-bounce 1.2s infinite ease-in-out;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* CANCEL BUTTON */
        .cancel-btn {
          width: 100%;
          padding: 13px;
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: 11px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .cancel-btn:hover {
          background: var(--accent-light);
          border-color: var(--border-hover);
          color: var(--accent);
        }

        /* SECURE NOTE */
        .secure-note {
          margin-top: 20px;
          font-size: 12px;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
      `}</style>

      <div className="checkout-wrapper">
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🛒</div>
            <span>Shawky<span className="logo-dot">·</span>Market</span>
          </div>
        </nav>

        {/* CENTER */}
        <div className="checkout-center">
          <div className="checkout-card">
            <div className="checkout-icon">💳</div>

            <h2 className="checkout-title">Complete Payment</h2>

            <div className="order-badge">
              Order ID: <strong>{orderId}</strong>
            </div>

            <div className="card-divider" />

            <div className="info-box">
              <span className="info-box-icon">🔒</span>
              <p className="info-box-text">
                You'll be redirected to Stripe's secure checkout to complete your payment safely.
              </p>
            </div>

            {error && (
              <div className="error-box">
                <span>⚠</span> {error}
              </div>
            )}

            <button className="pay-btn" onClick={handlePay} disabled={loading}>
              {loading ? (
                <>
                  Redirecting
                  <span className="loading-dots">
                    <span /><span /><span />
                  </span>
                </>
              ) : (
                "Pay with Stripe →"
              )}
            </button>

            <button className="cancel-btn" onClick={() => navigate("/orders")}>
              Pay Later
            </button>

            <div className="secure-note">
              🔐 Secured by Stripe — your data is safe
            </div>
          </div>
        </div>
      </div>
    </>
  );
}