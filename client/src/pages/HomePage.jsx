import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["", "electronics", "clothing", "food", "other"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          search,
          category: category || undefined,
          page,
          limit: 8,
        },
      });
       console.log("API Response:", res.data);
        setProducts(res.data.data || []);
        setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>🛒 E-Commerce</h1>
        <div style={styles.navLinks}>
          {user ? (
            <>
              <span style={styles.welcome}>Hi, {user.name}</span>
              <Link to="/cart" style={styles.navBtn}>Cart</Link>
              <Link to="/orders" style={styles.navBtn}>Orders</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navBtn}>Login</Link>
              <Link to="/register" style={styles.navBtn}>Register</Link>
            </>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/products" style={{...styles.navBtn, backgroundColor: "#dc2626"}}>
              Admin Panel
            </Link>
          )}
        </div>
      </nav>

      {/* Search & Filter */}
      <div style={styles.filters}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          style={styles.select}
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p style={styles.center}>Loading...</p>
      ) : products.length === 0 ? (
        <p style={styles.center}>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div
              key={product._id}
              style={styles.card}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {product.images?.[0] && (
                <img
src={
  product.images[0]?.startsWith("http")
    ? product.images[0]
    : `http://localhost:5000/images/${product.images[0]}`
}                  alt={product.name}
                  style={styles.image}
                />
              )}
              <div style={styles.cardBody}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.category}>{product.category}</p>
                <div style={styles.priceRow}>
                  <span style={styles.newPrice}>${product.newPrice}</span>
                  {product.oldPrice > product.newPrice && (
                    <span style={styles.oldPrice}>${product.oldPrice}</span>
                  )}
                </div>
                {!product.available && (
                  <p style={styles.unavailable}>Out of Stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span style={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            style={styles.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f5f5f5" },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#2563eb",
    color: "#fff",
  },
  logo: { margin: 0, fontSize: "22px" },
  navLinks: { display: "flex", alignItems: "center", gap: "12px" },
  welcome: { color: "#fff", fontSize: "14px" },
  navBtn: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    backgroundColor: "rgba(255,255,255,0.2)",
    fontSize: "14px",
  },
  logoutBtn: {
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    backgroundColor: "#dc2626",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  filters: {
    display: "flex",
    gap: "12px",
    padding: "24px 32px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  searchInput: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  select: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
    padding: "32px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.2s",
  },
  image: { width: "100%", height: "200px", objectFit: "cover" },
  cardBody: { padding: "16px" },
  productName: { margin: "0 0 8px", fontSize: "16px" },
  category: { color: "#666", fontSize: "12px", marginBottom: "8px" },
  priceRow: { display: "flex", alignItems: "center", gap: "8px" },
  newPrice: { fontSize: "18px", fontWeight: "bold", color: "#2563eb" },
  oldPrice: {
    fontSize: "14px",
    color: "#999",
    textDecoration: "line-through",
  },
  unavailable: { color: "#dc2626", fontSize: "12px", marginTop: "8px" },
  center: { textAlign: "center", padding: "60px", color: "#666" },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "32px",
  },
  pageBtn: {
    padding: "10px 24px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  pageInfo: { color: "#666" },
};