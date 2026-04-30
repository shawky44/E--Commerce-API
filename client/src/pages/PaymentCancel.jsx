import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>❌ Payment Cancelled</h1>
      <p>Your payment was cancelled. You can try again anytime.</p>

      <Link to="/">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          Back Home
        </button>
      </Link>
    </div>
  );
}