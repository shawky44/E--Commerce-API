import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear entire cart?")) return;
    try {
      await api.delete("/cart");
      fetchCart();
    } catch (err) {
      alert("Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    try {
      // عمل order من الـ cart
      const res = await api.post("/orders", {
        shippingAddress: {
          street: "123 Main St",
          city: "Cairo",
          country: "Egypt",
        },
        paymentMethod: "card",
      });
      const orderId = res.data.order._id;
      navigate(`/checkout/${orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create order");
    }
  };

  if (loading) return <p style={styles.center}>Loading...</p>;
  if (error) return <p style={styles.center}>{error}</p>;

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.product.newPrice * item.quantity,
    0
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Continue Shopping
        </button>
        <h2 style={styles.title}>My Cart</h2>
        {items.length > 0 && (
          <button style={styles.clearBtn} onClick={handleClearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={styles.empty}>
          <p>Your cart is empty.</p>
          <button style={styles.shopBtn} onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={styles.content}>
          {/* Items */}
          <div style={styles.items}>
            {items.map((item) => (
              <div key={item._id} style={styles.item}>
                {item.product.images?.[0] && (
                  <img
                    src={`http://localhost:5000/images/${item.product.images[0]}`}
                    alt={item.product.name}
                    style={styles.image}
                  />
                )}
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.product.name}</h3>
                  <p style={styles.itemPrice}>${item.product.newPrice}</p>
                </div>
                <div style={styles.quantityControls}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <p style={styles.itemTotal}>
                  ${(item.product.newPrice * item.quantity).toFixed(2)}
                </p>
                <button
                  style={styles.removeBtn}
                  onClick={() => handleRemoveItem(item._id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={styles.summary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Items ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: "#16a34a" }}>Free</span>
            </div>
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, fontWeight: "bold", fontSize: "18px" }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button style={styles.checkoutBtn} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "32px", maxWidth: "1000px", margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  title: { margin: 0, fontSize: "24px" },
  backBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  clearBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "14px",
  },
  empty: { textAlign: "center", padding: "60px", color: "#666" },
  shopBtn: {
    marginTop: "16px",
    padding: "12px 32px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  content: { display: "flex", gap: "32px", alignItems: "flex-start" },
  items: { flex: 1, display: "flex", flexDirection: "column", gap: "16px" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  image: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" },
  itemDetails: { flex: 1 },
  itemName: { margin: "0 0 4px", fontSize: "16px" },
  itemPrice: { margin: 0, color: "#666", fontSize: "14px" },
  quantityControls: { display: "flex", alignItems: "center", gap: "8px" },
  qtyBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qty: { fontSize: "16px", minWidth: "24px", textAlign: "center" },
  itemTotal: { fontWeight: "bold", minWidth: "60px", textAlign: "right" },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
    fontSize: "18px",
  },
  summary: {
    width: "280px",
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  summaryTitle: { margin: "0 0 16px", fontSize: "18px" },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "15px",
  },
  divider: { borderTop: "1px solid #eee", margin: "16px 0" },
  checkoutBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "16px",
  },
  center: { textAlign: "center", padding: "60px", color: "#666" },
};