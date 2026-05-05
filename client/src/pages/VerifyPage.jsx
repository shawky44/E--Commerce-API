import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const handleVerify = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // خطوة 1: verify
    await api.post("/auth/verifyVerificationCode", {
      email,
      providedCode: Number(code),
    });

    // خطوة 2: login تلقائي بعد الـ verify
    const loginRes = await api.post("/auth/signin", {
      email,
      password: location.state?.password || "",
    });

    const userData = {
      name: loginRes.data.name,
      role: loginRes.data.role,
    };

    login(userData, loginRes.data.token);
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Verification failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Email</h2>
        <p style={styles.subtitle}>
          Enter the code sent to <strong>{email}</strong>
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleVerify}>
          <input
            style={styles.input}
            type="number"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: { marginBottom: "8px", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: "24px", color: "#666" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: { color: "red", marginBottom: "16px", textAlign: "center" },
};