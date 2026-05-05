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

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${productId}`, { quantity });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
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

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.product.newPrice * item.quantity,
    0
  );

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
          --surface-hover: #fff4e6;
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

        .cart-page-wrapper {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* NAVBAR */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
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
          letter-spacing: -0.3px;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
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

        /* PAGE CONTAINER */
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 36px 40px 60px;
        }

        /* HEADER */
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 9px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .back-btn:hover {
          background: var(--accent-light);
          border-color: var(--border-hover);
          color: var(--accent);
        }
        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .clear-btn {
          padding: 8px 16px;
          border-radius: 9px;
          background: var(--danger-bg);
          border: 1px solid #f0c8c2;
          color: var(--danger);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .clear-btn:hover { background: #fce0dc; border-color: #e0a09a; }

        /* CONTENT LAYOUT */
        .content {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }
        .items-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* CART ITEM */
        .cart-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          box-shadow: var(--card-shadow);
          transition: all 0.25s ease;
          animation: itemIn 0.35s ease both;
        }
        .cart-item:hover {
          border-color: var(--border-hover);
          box-shadow: 0 6px 24px rgba(44,36,22,0.1);
        }
        @keyframes itemIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .item-img {
          width: 76px;
          height: 76px;
          object-fit: cover;
          border-radius: 10px;
          background: var(--bg2);
          flex-shrink: 0;
        }
        .item-details { flex: 1; }
        .item-category {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 4px;
        }
        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 5px;
          line-height: 1.3;
        }
        .item-unit-price {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* QUANTITY CONTROLS */
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .qty-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--accent-light);
          border: 1px solid var(--border);
          color: var(--accent);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .qty-btn:hover {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .qty-num {
          font-size: 15px;
          font-weight: 600;
          min-width: 22px;
          text-align: center;
        }

        .item-total {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--accent);
          min-width: 64px;
          text-align: right;
        }
        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-dim);
          font-size: 16px;
          padding: 5px 7px;
          border-radius: 7px;
          transition: all 0.2s;
          line-height: 1;
        }
        .remove-btn:hover {
          color: var(--danger);
          background: var(--danger-bg);
        }

        /* SUMMARY CARD */
        .summary-card {
          width: 280px;
          flex-shrink: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 24px;
          box-shadow: var(--card-shadow);
          position: sticky;
          top: 80px;
        }
        .summary-title {
          font-family: 'Playfair Display', serif;
          font-size: 19px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--text-muted);
        }
        .summary-row.total {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0;
        }
        .summary-total-price {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: var(--accent);
        }
        .free-tag {
          color: var(--accent2);
          font-weight: 600;
          font-size: 13px;
        }
        .summary-divider {
          height: 1px;
          background: var(--border);
          margin: 16px 0;
        }
        .checkout-btn {
          width: 100%;
          padding: 14px;
          margin-top: 18px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 4px 14px var(--glow);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .checkout-btn:hover {
          background: #9a6b39;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--glow);
        }

        /* EMPTY STATE */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 80px 40px;
          text-align: center;
        }
        .empty-icon { font-size: 40px; opacity: 0.2; }
        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .empty-sub { font-size: 14px; color: var(--text-dim); }
        .shop-btn {
          margin-top: 8px;
          padding: 11px 28px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 4px 14px var(--glow);
        }
        .shop-btn:hover { background: #9a6b39; transform: translateY(-1px); }

        /* LOADING / ERROR */
        .center-state {
          text-align: center;
          padding: 80px 40px;
          color: var(--text-muted);
          font-size: 15px;
        }
        .loading-spinner {
          width: 36px; height: 36px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="cart-page-wrapper">
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🛒</div>
            <span>Shawky<span className="logo-dot">·</span>Market</span>
          </div>
        </nav>

        {/* LOADING */}
        {loading ? (
          <div className="center-state">
            <div className="loading-spinner" />
            Loading your cart...
          </div>
        ) : error ? (
          <div className="center-state">{error}</div>
        ) : (
          <div className="page-container">
            {/* HEADER */}
            <div className="page-header">
              <button className="back-btn" onClick={() => navigate("/")}>
                ← Continue Shopping
              </button>
              <h2 className="page-title">My Cart</h2>
              {items.length > 0 && (
                <button className="clear-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
              )}
            </div>

            {/* EMPTY */}
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <div className="empty-title">Your cart is empty</div>
                <div className="empty-sub">Add some products to get started</div>
                <button className="shop-btn" onClick={() => navigate("/")}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="content">
                {/* ITEMS */}
                <div className="items-list">
                  {items.map((item, i) => (
                    <div
                      className="cart-item"
                      key={item.product._id}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {item.product.images?.[0] && (
                        <img
                          src={
                            item.product.images[0]?.startsWith("http")
                              ? item.product.images[0]
                              : `http://localhost:5000/images/${item.product.images[0]}`
                          }
                          alt={item.product.name}
                          className="item-img"
                        />
                      )}
                      <div className="item-details">
                        <div className="item-category">{item.product.category}</div>
                        <div className="item-name">{item.product.name}</div>
                        <div className="item-unit-price">${item.product.newPrice} each</div>
                      </div>
                      <div className="qty-controls">
  <button
    className="qty-btn"
    onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
  >
    −
  </button>
  <span className="qty-num">{item.quantity}</span>
  <button
    className="qty-btn"
    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
  >
    +
  </button>
</div>

<div className="item-total">
  ${(item.product.newPrice * item.quantity).toFixed(2)}
</div>

<button
  className="remove-btn"
  onClick={() => handleRemoveItem(item.product._id)}
>
  ✕
</button>
                    </div>
                  ))}
                </div>

                {/* SUMMARY */}
                <div className="summary-card">
                  <div className="summary-title">Order Summary</div>
                  <div className="summary-row">
                    <span>Items ({items.length})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="free-tag">Free</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row total">
                    <span>Total</span>
                    <span className="summary-total-price">${total.toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}