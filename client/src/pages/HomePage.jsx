import { useState, useEffect, useRef } from "react";
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
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const gridRef = useRef(null);

  const categories = ["", "electronics", "clothing", "food", "other"];
  const categoryIcons = {
    "": "✦",
    electronics: "⚡",
    clothing: "◈",
    food: "◉",
    other: "◆",
  };

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

        .page-wrapper {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
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
          background: rgba(245,240,232,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.3s ease;
        }
        .navbar.scrolled {
          box-shadow: 0 2px 20px rgba(44,36,22,0.1);
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
        }
        .logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--accent), #d4a574);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 10px var(--glow);
        }
        .logo-dot { color: var(--accent); }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .welcome-badge {
          font-size: 13px;
          color: var(--text-muted);
          padding: 6px 14px;
          border-radius: 20px;
          background: var(--accent-light);
          border: 1px solid var(--border);
        }
        .welcome-badge span { color: var(--accent); font-weight: 600; }
        .nav-btn {
          color: var(--text-muted);
          text-decoration: none;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          background: transparent;
          border: 1px solid var(--border);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          display: inline-block;
        }
        .nav-btn:hover {
          background: var(--accent-light);
          border-color: var(--border-hover);
          color: var(--accent);
        }
        .logout-btn {
          color: var(--danger);
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          background: var(--danger-bg);
          border: 1px solid #f0c8c2;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .logout-btn:hover {
          background: #fce0dc;
          border-color: #e0a09a;
        }
        .admin-btn {
          color: var(--danger);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          background: var(--danger-bg);
          border: 1px solid #f0c8c2;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .admin-btn:hover { background: #fce0dc; border-color: #e0a09a; }

        /* HERO — compact */
        .hero {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 40px 20px;
          gap: 24px;
        }
        .hero-left {}
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 12px;
          border-radius: 20px;
          background: var(--accent-light);
          border: 1px solid #dfc9a8;
          color: var(--accent);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .hero-tag-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.5px;
          color: var(--text);
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--accent), #d4845a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          color: var(--text-muted);
          font-size: 14px;
          margin-top: 8px;
          line-height: 1.5;
          max-width: 340px;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* FILTERS */
        .filters-section {
          position: relative;
          z-index: 1;
          padding: 0 40px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 480px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
          font-size: 17px;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border-radius: 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(44,36,22,0.05);
        }
        .search-input::placeholder { color: var(--text-dim); }
        .search-input:focus {
          border-color: var(--border-hover);
          box-shadow: 0 0 0 3px var(--glow);
        }
        .categories-row {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }
        .cat-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(44,36,22,0.05);
        }
        .cat-btn:hover { background: var(--accent-light); color: var(--accent); border-color: #dfc9a8; }
        .cat-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }

        /* SECTION HEADER */
        .section-header {
          position: relative; z-index: 1;
          padding: 0 40px 16px;
          display: flex; justify-content: space-between; align-items: flex-end;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 600;
          color: var(--text); letter-spacing: -0.3px;
        }
        .section-count { font-size: 13px; color: var(--text-dim); }

        /* GRID */
        .products-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 18px; padding: 0 40px 48px;
        }

        /* CARD */
        .product-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden; cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          animation: cardIn 0.4s ease both;
          box-shadow: var(--card-shadow);
        }
        .product-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(44,36,22,0.14);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-image-wrapper {
          position: relative; width: 100%; height: 190px;
          background: var(--bg2); overflow: hidden;
        }
        .card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .product-card:hover .card-image { transform: scale(1.05); }
        .card-badge-out {
          position: absolute; top: 10px; left: 10px;
          padding: 3px 9px; border-radius: 6px;
          background: rgba(255,255,255,0.9); border: 1px solid #f0c8c2;
          color: var(--danger); font-size: 10px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .card-discount {
          position: absolute; top: 10px; right: 10px;
          padding: 3px 9px; border-radius: 6px;
          background: rgba(255,255,255,0.9); border: 1px solid #c8dfc9;
          color: var(--accent2); font-size: 10px; font-weight: 700;
        }
        .card-body { padding: 14px; }
        .card-category {
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: var(--text-dim); margin-bottom: 5px;
        }
        .card-name {
          font-size: 14px; font-weight: 600; color: var(--text);
          margin-bottom: 10px; line-height: 1.35;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .card-price-row { display: flex; align-items: center; justify-content: space-between; }
        .card-prices { display: flex; align-items: baseline; gap: 7px; }
        .new-price {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: var(--accent);
        }
        .old-price { font-size: 12px; color: var(--text-dim); text-decoration: line-through; }
        .card-arrow {
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--accent-light); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); font-size: 13px; transition: all 0.2s ease;
        }
        .product-card:hover .card-arrow {
          background: var(--accent); border-color: var(--accent);
          color: #fff; transform: translateX(2px);
        }

        /* SKELETON */
        .skeleton-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 18px; padding: 0 40px 48px;
        }
        .skeleton-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden; box-shadow: var(--card-shadow);
        }
        .skeleton-img {
          width: 100%; height: 190px;
          background: linear-gradient(90deg, var(--bg2) 0%, var(--border) 50%, var(--bg2) 100%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite;
        }
        .skeleton-body { padding: 14px; }
        .skeleton-line {
          height: 11px; border-radius: 5px; margin-bottom: 9px;
          background: linear-gradient(90deg, var(--bg2) 0%, var(--border) 50%, var(--bg2) 100%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite;
        }
        .skeleton-line.short { width: 35%; }
        .skeleton-line.medium { width: 65%; }
        .skeleton-line.price { width: 45%; height: 18px; margin-top: 10px; }
        @keyframes shimmer { to { background-position: -200% 0; } }

        /* EMPTY */
        .empty-state {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 80px 40px;
        }
        .empty-icon { font-size: 40px; opacity: 0.2; }
        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 600; color: var(--text-muted);
        }
        .empty-sub { font-size: 13px; color: var(--text-dim); }

        /* DIVIDER */
        .divider {
          height: 1px;
          background: var(--border);
          margin: 0 40px 24px; position: relative; z-index: 1;
        }

        /* PAGINATION */
        .pagination {
          position: relative; z-index: 1;
          display: flex; justify-content: center; align-items: center;
          gap: 8px; padding: 0 40px 56px;
        }
        .page-btn {
          padding: 9px 18px; border-radius: 9px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.2s ease; box-shadow: 0 1px 4px rgba(44,36,22,0.06);
        }
        .page-btn:hover:not(:disabled) {
          background: var(--accent-light); border-color: var(--border-hover); color: var(--accent);
        }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-info {
          padding: 9px 18px; border-radius: 9px;
          background: var(--accent); color: #fff;
          font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />

        {/* NAVBAR */}
        <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
          <div className="logo">
            <div className="logo-icon">🛒</div>
            <span>Shawky<span className="logo-dot">·</span>Market</span>
          </div>
          <div className="nav-links">
            {user ? (
              <>
                <span className="welcome-badge">
                  Hey, <span>{user.name}</span>
                </span>
                <Link to="/cart" className="nav-btn">Cart</Link>
                <Link to="/orders" className="nav-btn">Orders</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn">Login</Link>
                <Link to="/register" className="nav-btn">Register</Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link to="/admin/products" className="admin-btn">⚙ Admin</Link>
            )}
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-tag">
            <div className="hero-tag-dot" />
            New Arrivals Every Week
          </div>
          <h1 className="hero-title">
            Discover What's<br />
            <span className="gradient-text">Worth Buying</span>
          </h1>
          <p className="hero-sub">
            Curated products across electronics, fashion, food and more — all in one place.
          </p>
        </div>

        {/* FILTERS */}
        <div className="filters-section">
          <div className="search-wrapper">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="categories-row">
            {categories.map((c) => (
              <button
                key={c}
                className={`cat-btn${category === c ? " active" : ""}`}
                onClick={() => { setCategory(c); setPage(1); }}
              >
                <span>{categoryIcons[c]}</span>
                {c === "" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        {!loading && products.length > 0 && (
          <div className="section-header">
            <span className="section-title">
              {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
            </span>
            <span className="section-count">Page {page} of {totalPages}</span>
          </div>
        )}

        {/* PRODUCTS */}
        {loading ? (
          <div className="skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line price" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <div className="empty-title">No products found</div>
            <div className="empty-sub">Try a different search or category</div>
          </div>
        ) : (
          <div className="products-grid" ref={gridRef}>
            {products.map((product, i) => {
              const discount =
                product.oldPrice > product.newPrice
                  ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
                  : 0;
              return (
                <div
                  key={product._id}
                  className="product-card"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onMouseEnter={() => setHoveredCard(product._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-image-wrapper">
                    {product.images?.[0] && (
                      <img
                        src={
                          product.images[0]?.startsWith("http")
                            ? product.images[0]
                            : `http://localhost:5000/images/${product.images[0]}`
                        }
                        alt={product.name}
                        className="card-image"
                      />
                    )}
                    {!product.available && (
                      <div className="card-badge-out">Out of Stock</div>
                    )}
                    {discount > 0 && (
                      <div className="card-discount">−{discount}%</div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="card-category">{product.category}</div>
                    <div className="card-name">{product.name}</div>
                    <div className="card-price-row">
                      <div className="card-prices">
                        <span className="new-price">${product.newPrice}</span>
                        {product.oldPrice > product.newPrice && (
                          <span className="old-price">${product.oldPrice}</span>
                        )}
                      </div>
                      <div className="card-arrow">→</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Prev
            </button>
            <span className="page-info">{page} / {totalPages}</span>
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}