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

  // 🔐 حماية الصفحة
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
      const res = await api.post("/auth/register", form);

navigate("/verify", {
  state: {
    email: form.email,
    password: form.password,
  },
});
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Admin Registration</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="adminInviteToken"
            placeholder="Admin Invite Token"
            onChange={handleChange}
            style={styles.input}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create Admin"}
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
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  card: {
    width: 350,
    padding: 30,
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: 6,
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    marginTop: 10,
    cursor: "pointer",
  },
};