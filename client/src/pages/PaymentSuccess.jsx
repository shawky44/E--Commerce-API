import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Payment Successful</h1>
      <p>Your order has been paid successfully.</p>

      <Link to="/">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          Back Home
        </button>
      </Link>
    </div>
  );
}