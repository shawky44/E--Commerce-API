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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Checkout</h2>
        <p style={styles.subtitle}>
          Order ID: <strong>{orderId}</strong>
        </p>
        <p style={styles.info}>
          You will be redirected to Stripe to complete your payment securely.
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.payBtn} onClick={handlePay} disabled={loading}>
          {loading ? "Redirecting..." : "Pay with Stripe 💳"}
        </button>

        <button
          style={styles.cancelBtn}
          onClick={() => navigate("/orders")}
        >
          Pay Later
        </button>
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
    maxWidth: "440px",
    textAlign: "center",
  },
  title: { marginBottom: "8px" },
  subtitle: { color: "#666", marginBottom: "24px", fontSize: "14px" },
  info: { color: "#444", marginBottom: "32px", lineHeight: "1.6" },
  payBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "12px",
  },
  cancelBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#fff",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: { color: "red", marginBottom: "16px" },
};