import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

function Home() {
  const [orderId, setOrderId] = useState("");
  const [token, setToken] = useState("");

  const handleCheckout = async () => {
    if (!orderId || !token) {
      alert("Please enter Order ID and Token");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  return (
    <div className="App">
      <header className="App-header">

        <h2>🧪 Stripe Test Panel</h2>

        <input
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ padding: "10px", margin: "10px", width: "300px" }}
        />

        <input
          placeholder="Enter JWT Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ padding: "10px", margin: "10px", width: "300px" }}
        />

        <button
          onClick={handleCheckout}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Pay Now 💳
        </button>

      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>
    </Router>
  );
}

export default App;