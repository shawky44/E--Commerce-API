import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const productData = res.data.data || res.data;
        setProduct(productData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    setMessage("");
    try {
      await api.post("/cart", { productId: id, quantity });
      setMessage("Added to cart successfully!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to cart");
      setMessageType("error");
    } finally {
      setAdding(false);
    }
  };

  const discount =
    product?.oldPrice > product?.newPrice
      ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
      : 0;

  const inStock = product?.available && product?.quantity > 0;

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

        .product-wrapper {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* NAVBAR */
        .navbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 40px;
          background: rgba(245,240,232,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 2px 20px rgba(44,36,22,0.08);
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 20px; color: var(--text);
          display: flex; align-items: center; gap: 10px; cursor: pointer;
        }
        .logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--accent), #d4a574);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; box-shadow: 0 2px 10px var(--glow);
        }
        .logo-dot { color: var(--accent); }

        /* PAGE */
        .page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 40px 60px;
        }

        /* BACK BTN */
        .back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 9px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; margin-bottom: 24px;
        }
        .back-btn:hover {
          background: var(--accent-light);
          border-color: var(--border-hover); color: var(--accent);
        }

        /* CENTER STATE */
        .center-state {
          text-align: center; padding: 80px 40px;
          color: var(--text-muted); font-size: 15px;
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

        /* PRODUCT CARD */
        .product-card {
          display: flex; gap: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px; overflow: hidden;
          box-shadow: var(--card-shadow);
          animation: fadeInUp 0.4s ease both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* IMAGE SIDE */
        .image-side {
          position: relative;
          width: 420px; flex-shrink: 0;
          background: var(--bg2);
          overflow: hidden;
        }
        .product-image {
          width: 100%; height: 100%;
          min-height: 420px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-image { transform: scale(1.03); }
        .img-badge-out {
          position: absolute; top: 14px; left: 14px;
          padding: 4px 10px; border-radius: 7px;
          background: rgba(255,255,255,0.92); border: 1px solid #f0c8c2;
          color: var(--danger); font-size: 11px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .img-badge-discount {
          position: absolute; top: 14px; right: 14px;
          padding: 4px 10px; border-radius: 7px;
          background: rgba(255,255,255,0.92); border: 1px solid #c8dfc9;
          color: var(--accent2); font-size: 11px; font-weight: 700;
        }

        /* DETAILS SIDE */
        .details-side {
          flex: 1; padding: 36px 32px;
          display: flex; flex-direction: column; gap: 0;
        }

        .product-category {
          font-size: 11px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: var(--text-dim); margin-bottom: 10px;
        }
        .product-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700; letter-spacing: -0.5px;
          color: var(--text); line-height: 1.25; margin-bottom: 16px;
        }
        .product-description {
          font-size: 14px; color: var(--text-muted);
          line-height: 1.7; margin-bottom: 24px;
        }

        /* DIVIDER */
        .details-divider {
          height: 1px; background: var(--border); margin-bottom: 20px;
        }

        /* PRICE */
        .price-row {
          display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px;
        }
        .new-price {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 700; color: var(--accent);
        }
        .old-price {
          font-size: 18px; color: var(--text-dim);
          text-decoration: line-through;
        }

        /* STOCK */
        .stock-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 500; margin-bottom: 24px;
        }
        .stock-dot {
          width: 7px; height: 7px; border-radius: 50%;
        }
        .stock-tag.in { color: var(--accent2); }
        .stock-tag.in .stock-dot { background: var(--accent2); }
        .stock-tag.out { color: var(--danger); }
        .stock-tag.out .stock-dot { background: var(--danger); }

        /* QUANTITY */
        .qty-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
        }
        .qty-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
          text-transform: uppercase; color: var(--text-muted);
        }
        .qty-controls {
          display: flex; align-items: center; gap: 10px;
        }
        .qty-btn {
          width: 32px; height: 32px; border-radius: 9px;
          background: var(--accent-light); border: 1px solid var(--border);
          color: var(--accent); font-size: 18px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif; line-height: 1;
        }
        .qty-btn:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
        .qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .qty-num {
          font-size: 16px; font-weight: 600;
          min-width: 28px; text-align: center;
        }
        .qty-max {
          font-size: 12px; color: var(--text-dim);
        }

        /* ADD TO CART BTN */
        .add-btn {
          padding: 14px 28px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 11px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; box-shadow: 0 4px 14px var(--glow);
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 16px; align-self: flex-start;
        }
        .add-btn:hover:not(:disabled) {
          background: #9a6b39; transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--glow);
        }
        .add-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

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

        /* MESSAGE */
        .message-box {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 14px; border-radius: 9px;
          font-size: 13px; font-weight: 500;
          animation: fadeInUp 0.3s ease;
        }
        .message-box.success {
          background: rgba(122,158,126,0.12);
          border: 1px solid rgba(122,158,126,0.3);
          color: var(--accent2);
        }
        .message-box.error {
          background: var(--danger-bg);
          border: 1px solid #f0c8c2;
          color: var(--danger);
        }
      `}</style>

      <div className="product-wrapper">
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🛒</div>
            <span>Shawky<span className="logo-dot">·</span>Market</span>
          </div>
        </nav>

        {loading ? (
          <div className="center-state">
            <div className="loading-spinner" />
            Loading product...
          </div>
        ) : !product ? (
          <div className="center-state">Product not found.</div>
        ) : (
          <div className="page-container">
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Back
            </button>

            <div className="product-card">
              {/* IMAGE */}
              <div className="image-side">
                {product.images?.[0] && (
                  <img
                    src={
                      product.images[0]?.startsWith("http")
                        ? product.images[0]
                        : `http://localhost:5000/images/${product.images[0]}`
                    }
                    alt={product.name}
                    className="product-image"
                  />
                )}
                {!inStock && (
                  <div className="img-badge-out">Out of Stock</div>
                )}
                {discount > 0 && (
                  <div className="img-badge-discount">−{discount}%</div>
                )}
              </div>

              {/* DETAILS */}
              <div className="details-side">
                <div className="product-category">{product.category}</div>
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>

                <div className="details-divider" />

                {/* PRICE */}
                <div className="price-row">
                  <span className="new-price">${product.newPrice}</span>
                  {product.oldPrice > product.newPrice && (
                    <span className="old-price">${product.oldPrice}</span>
                  )}
                </div>

                {/* STOCK */}
                <div className={`stock-tag ${inStock ? "in" : "out"}`}>
                  <span className="stock-dot" />
                  {inStock
                    ? `In Stock — ${product.quantity} available`
                    : "Out of Stock"}
                </div>

                {/* QUANTITY + ADD */}
                {inStock && (
                  <>
                    <div className="qty-row">
                      <span className="qty-label">Qty</span>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <span className="qty-num">{quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                          disabled={quantity >= product.quantity}
                        >
                          +
                        </button>
                      </div>
                      <span className="qty-max">max {product.quantity}</span>
                    </div>

                    <button
                      className="add-btn"
                      onClick={handleAddToCart}
                      disabled={adding}
                    >
                      {adding ? (
                        <>
                          Adding
                          <span className="loading-dots">
                            <span /><span /><span />
                          </span>
                        </>
                      ) : (
                        <>🛒 Add to Cart</>
                      )}
                    </button>
                  </>
                )}

                {message && (
                  <div className={`message-box ${messageType}`}>
                    <span>{messageType === "success" ? "✓" : "⚠"}</span>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}