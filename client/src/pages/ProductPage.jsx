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
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        console.log("Product Response:", res.data);
        const productData = res.data.data || res.data;
        console.log("Setting product:", productData);
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
      setMessage("✅ Added to cart successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p style={styles.center}>Loading...</p>;
  if (!product) return <p style={styles.center}>Product not found.</p>;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate("/")}>
        ← Back
      </button>

      <div style={styles.card}>
        {/* Image */}
        {product.images?.[0] && (
          <img
src={
  product.images[0]?.startsWith("http")
    ? product.images[0]
    : `http://localhost:5000/images/${product.images[0]}`
}            alt={product.name}
            style={styles.image}
          />
        )}

        {/* Details */}
        <div style={styles.details}>
          <h2 style={styles.name}>{product.name}</h2>
          <p style={styles.category}>Category: {product.category}</p>
          <p style={styles.description}>{product.description}</p>

          <div style={styles.priceRow}>
            <span style={styles.newPrice}>${product.newPrice}</span>
            {product.oldPrice > product.newPrice && (
              <span style={styles.oldPrice}>${product.oldPrice}</span>
            )}
          </div>

          <p style={styles.stock}>
            {product.available && product.quantity > 0
              ? `In Stock (${product.quantity} available)`
              : "Out of Stock"}
          </p>

          {product.available && product.quantity > 0 && (
            <>
              <div style={styles.quantityRow}>
                <label style={styles.label}>Quantity:</label>
                <input
                  style={styles.quantityInput}
                  type="number"
                  min={1}
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <button
                style={styles.addBtn}
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add to Cart 🛒"}
              </button>
            </>
          )}

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.startsWith("✅") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "32px", maxWidth: "900px", margin: "0 auto" },
  backBtn: {
    marginBottom: "24px",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  card: {
    display: "flex",
    gap: "32px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  image: { width: "400px", height: "400px", objectFit: "cover" },
  details: { padding: "32px", flex: 1 },
  name: { fontSize: "24px", marginBottom: "8px" },
  category: { color: "#666", marginBottom: "16px" },
  description: { color: "#444", lineHeight: "1.6", marginBottom: "24px" },
  priceRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" },
  newPrice: { fontSize: "28px", fontWeight: "bold", color: "#2563eb" },
  oldPrice: { fontSize: "18px", color: "#999", textDecoration: "line-through" },
  stock: { color: "#16a34a", marginBottom: "24px", fontSize: "14px" },
  quantityRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
  label: { fontSize: "16px" },
  quantityInput: {
    width: "70px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  addBtn: {
    padding: "14px 32px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: { marginTop: "16px", fontSize: "14px" },
  center: { textAlign: "center", padding: "60px", color: "#666" },
};