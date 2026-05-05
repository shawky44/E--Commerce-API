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

  // countdown in minutes
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
      // FIX: PATCH بدل POST
      await api.patch("/auth/verifyVerificationCode", {
        email,
        providedCode:code,
      });

      const loginRes = await api.post("/auth/signin", {
        email,
        password: location.state?.password || "",
      });

      login(
        {
          name: loginRes.data.name,
          role: loginRes.data.role,
        },
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

      await api.patch("/auth/resendVerificationCode", {
        email,
      });

      setCooldown(5); // 5 minutes
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Verify Email</h2>
        <p>Code sent to <b>{email}</b></p>

        {error && <p style={styles.error}>{error}</p>}

        {/* OTP INPUTS */}
        <div style={styles.otpContainer}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={styles.otpBox}
              maxLength={1}
            />
          ))}
        </div>

        <button onClick={handleVerify} disabled={loading} style={styles.button}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={handleResend}
          disabled={cooldown > 0 || resendLoading}
          style={{
            ...styles.resend,
            opacity: cooldown > 0 ? 0.5 : 1,
          }}
        >
          {cooldown > 0
            ? `Resend in ${cooldown} minute${cooldown > 1 ? "s" : ""}`
            : resendLoading
            ? "Sending..."
            : "Resend Code"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 30,
    background: "#fff",
    borderRadius: 10,
    width: 350,
    textAlign: "center",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0",
  },
  otpBox: {
    width: 40,
    height: 45,
    fontSize: 18,
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: 6,
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    marginTop: 10,
  },
  resend: {
    marginTop: 10,
    background: "transparent",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};