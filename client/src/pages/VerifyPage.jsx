import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 60000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const code = otp.join("");
    try {
      await api.patch("/auth/verifyVerificationCode", {
        email,
        providedCode: code,
      });
      const loginRes = await api.post("/auth/signin", {
        email,
        password: location.state?.password || "",
      });
      login(
        { name: loginRes.data.name, role: loginRes.data.role },
        loginRes.data.token
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await api.patch("/auth/resendVerificationCode", { email });
      setCooldown(5);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  const isFilled = otp.every((d) => d !== "");

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

        .verify-wrapper {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .verify-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 44px 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          box-shadow: var(--card-shadow);
          animation: fadeInUp 0.4s ease both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* LOGO */
        .verify-logo {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 28px; cursor: pointer;
        }
        .verify-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--accent), #d4a574);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; box-shadow: 0 2px 10px var(--glow);
        }
        .verify-logo-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 20px;
          color: var(--text); letter-spacing: -0.3px;
        }
        .verify-logo-dot { color: var(--accent); }

        /* ICON */
        .verify-icon {
          width: 60px; height: 60px;
          background: var(--accent-light);
          border: 1px solid var(--border);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin: 0 auto 20px;
          box-shadow: 0 4px 14px var(--glow);
        }

        .verify-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 700;
          color: var(--text); margin-bottom: 8px;
          letter-spacing: -0.4px;
        }
        .verify-subtitle {
          font-size: 13px; color: var(--text-muted);
          line-height: 1.5; margin-bottom: 28px;
        }
        .verify-subtitle strong { color: var(--accent); font-weight: 600; }

        /* DIVIDER */
        .card-divider { height: 1px; background: var(--border); margin-bottom: 24px; }

        /* ERROR */
        .error-box {
          background: var(--danger-bg); border: 1px solid #f0c8c2;
          border-radius: 9px; padding: 10px 14px;
          color: var(--danger); font-size: 13px; margin-bottom: 18px;
          display: flex; align-items: center; gap: 7px;
          text-align: left;
        }

        /* OTP INPUTS */
        .otp-container {
          display: flex; justify-content: center; gap: 10px;
          margin-bottom: 28px;
        }
        .otp-box {
          width: 46px; height: 54px;
          font-size: 22px; font-weight: 700;
          text-align: center;
          font-family: 'Playfair Display', serif;
          color: var(--text);
          background: var(--bg);
          border: 2px solid var(--border);
          border-radius: 11px;
          outline: none;
          transition: all 0.2s ease;
          caret-color: var(--accent);
        }
        .otp-box:focus {
          border-color: var(--accent);
          background: var(--surface);
          box-shadow: 0 0 0 3px var(--glow);
          transform: translateY(-2px);
        }
        .otp-box.filled {
          border-color: var(--border-hover);
          background: var(--accent-light);
        }

        /* VERIFY BTN */
        .verify-btn {
          width: 100%; padding: 13px; margin-bottom: 14px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 11px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; box-shadow: 0 4px 14px var(--glow);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .verify-btn:hover:not(:disabled) {
          background: #9a6b39; transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--glow);
        }
        .verify-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* LOADING DOTS */
        .loading-dots span {
          display: inline-block; width: 5px; height: 5px;
          border-radius: 50%; background: #fff; margin: 0 2px;
          animation: dot-bounce 1.2s infinite ease-in-out;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* RESEND BTN */
        .resend-btn {
          width: 100%; padding: 11px;
          background: transparent; color: var(--text-muted);
          border: 1px solid var(--border); border-radius: 11px;
          font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .resend-btn:hover:not(:disabled) {
          background: var(--accent-light);
          border-color: var(--border-hover); color: var(--accent);
        }
        .resend-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* COOLDOWN BAR */
        .cooldown-bar {
          margin-top: 14px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-size: 12px; color: var(--text-dim);
        }
        .cooldown-pip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          background: var(--bg2); border: 1px solid var(--border);
          font-size: 12px; color: var(--accent); font-weight: 600;
        }
      `}</style>

      <div className="verify-wrapper">
        <div className="verify-card">

          {/* LOGO */}
          <div className="verify-logo" onClick={() => navigate("/")}>
            <div className="verify-logo-icon">🛒</div>
            <span className="verify-logo-text">
              Shawky<span className="verify-logo-dot">·</span>Market
            </span>
          </div>

          {/* ICON */}
          <div className="verify-icon">✉️</div>

          <h2 className="verify-title">Check your email</h2>
          <p className="verify-subtitle">
            We sent a 6-digit code to<br />
            <strong>{email}</strong>
          </p>

          <div className="card-divider" />

          {error && (
            <div className="error-box">
              <span>⚠</span> {error}
            </div>
          )}

          {/* OTP */}
          <form onSubmit={handleVerify}>
            <div className="otp-container">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  className={`otp-box${digit ? " filled" : ""}`}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </div>

            <button
              type="submit"
              className="verify-btn"
              disabled={loading || !isFilled}
            >
              {loading ? (
                <>
                  Verifying
                  <span className="loading-dots">
                    <span /><span /><span />
                  </span>
                </>
              ) : (
                "Verify Email →"
              )}
            </button>
          </form>

          <button
            className="resend-btn"
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading}
          >
            {resendLoading
              ? "Sending..."
              : cooldown > 0
              ? `Resend available in ${cooldown} min`
              : "Resend Code"}
          </button>

          {cooldown > 0 && (
            <div className="cooldown-bar">
              <span className="cooldown-pip">
                ⏱ {cooldown} minute{cooldown > 1 ? "s" : ""} remaining
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}