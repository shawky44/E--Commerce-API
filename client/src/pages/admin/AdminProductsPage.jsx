import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "electronics",
    newPrice: "",
    oldPrice: "",
    quantity: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = ["electronics", "clothing", "food", "other"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: { limit: 100 } });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: "", category: "electronics", newPrice: "", oldPrice: "", quantity: "", description: "" });
    setEditProduct(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      let imageURL = editProduct?.images?.[0] || "";
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("product", imageFile);
        const uploadRes = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
        imageURL = uploadRes.data.imageURL || uploadRes.data.image || uploadRes.data.filename;
        setUploadingImage(false);
      }
      const productData = { ...form, images: imageURL ? [imageURL] : [] };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, productData);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", productData);
        setMessage("Product created successfully");
      }
      setMessageType("success");
      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      setUploadingImage(false);
      setMessage(err.response?.data?.message || "Operation failed");
      setMessageType("error");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setImageFile(null);
    setImagePreview("");
    setForm({
      name: product.name, category: product.category,
      newPrice: product.newPrice, oldPrice: product.oldPrice,
      quantity: product.quantity, description: product.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0d0f12;
          font-family: 'Inter', sans-serif;
        }

        :root {
          --bg: #0d0f12;
          --bg2: #13161b;
          --bg3: #1a1e26;
          --surface: #1e2330;
          --surface2: #252b38;
          --border: #2a3040;
          --border-light: #343d52;
          --accent: #4f8ef7;
          --accent2: #38d9a9;
          --accent-dim: rgba(79,142,247,0.12);
          --accent2-dim: rgba(56,217,169,0.1);
          --text: #e8ecf4;
          --text-muted: #7a8499;
          --text-dim: #4a5268;
          --danger: #f06b6b;
          --danger-dim: rgba(240,107,107,0.1);
          --warning: #f5a623;
          --warning-dim: rgba(245,166,35,0.1);
          --success: #38d9a9;
          --success-dim: rgba(56,217,169,0.1);
          --glow: rgba(79,142,247,0.15);
          --card-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        .admin-wrapper {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* TOPBAR */
        .topbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 32px;
          height: 58px;
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 100;
        }
        .topbar-left {
          display: flex; align-items: center; gap: 12px;
        }
        .admin-badge {
          display: flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; font-weight: 600;
          color: var(--accent);
        }
        .admin-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .topbar-divider {
          width: 1px; height: 20px; background: var(--border);
        }
        .page-label {
          font-size: 13px; color: var(--text-muted); font-weight: 500;
        }
        .topbar-nav {
          display: flex; align-items: center; gap: 6px;
        }
        .nav-link {
          padding: 6px 14px; border-radius: 7px;
          font-size: 13px; font-weight: 500;
          color: var(--text-muted); text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: var(--text); background: var(--surface);
          border-color: var(--border);
        }
        .nav-link.store {
          color: var(--accent); border-color: var(--accent-dim);
          background: var(--accent-dim);
        }
        .nav-link.store:hover {
          background: rgba(79,142,247,0.2); border-color: var(--accent);
        }

        /* PAGE */
        .page-container {
          max-width: 1200px; margin: 0 auto;
          padding: 28px 32px 60px;
        }

        /* PAGE HEADER */
        .page-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 24px;
        }
        .page-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px; font-weight: 600; color: var(--text);
          letter-spacing: -0.5px;
        }
        .page-title span { color: var(--accent); }
        .page-sub { font-size: 13px; color: var(--text-dim); margin-top: 4px; }

        /* TOOLBAR */
        .toolbar {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 20px;
        }
        .add-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 8px;
          background: var(--accent); color: #fff;
          border: none; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 2px 12px var(--glow);
        }
        .add-btn:hover { background: #3a7be8; transform: translateY(-1px); }
        .add-btn.cancel {
          background: var(--surface); color: var(--text-muted);
          border: 1px solid var(--border); box-shadow: none;
        }
        .add-btn.cancel:hover { background: var(--surface2); color: var(--text); }

        /* MESSAGE */
        .msg-box {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 7px;
          font-size: 13px; font-weight: 500;
        }
        .msg-box.success { background: var(--success-dim); color: var(--success); border: 1px solid rgba(56,217,169,0.2); }
        .msg-box.error { background: var(--danger-dim); color: var(--danger); border: 1px solid rgba(240,107,107,0.2); }

        /* FORM CARD */
        .form-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--card-shadow);
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px; font-weight: 600;
          color: var(--text-muted); margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .form-title::before {
          content: '';
          display: inline-block; width: 3px; height: 14px;
          background: var(--accent); border-radius: 2px;
        }
        .form-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 12px;
        }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; color: var(--text-dim);
        }
        .form-input {
          padding: 9px 12px; border-radius: 8px;
          background: var(--bg3); border: 1px solid var(--border);
          color: var(--text); font-size: 13px;
          font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.2s; width: 100%;
        }
        .form-input::placeholder { color: var(--text-dim); }
        .form-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        select.form-input option { background: var(--bg3); }
        textarea.form-input {
          width: 100%; height: 80px; resize: vertical;
          margin-bottom: 12px;
        }

        /* IMAGE UPLOAD */
        .upload-area {
          border: 2px dashed var(--border);
          border-radius: 10px; padding: 20px;
          text-align: center; margin-bottom: 16px;
          transition: all 0.2s; cursor: pointer;
          position: relative;
        }
        .upload-area:hover { border-color: var(--accent); background: var(--accent-dim); }
        .upload-input {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%;
        }
        .upload-icon { font-size: 24px; margin-bottom: 6px; }
        .upload-label { font-size: 13px; color: var(--text-muted); }
        .upload-sub { font-size: 11px; color: var(--text-dim); margin-top: 3px; }
        .preview-img {
          width: 90px; height: 90px; object-fit: cover;
          border-radius: 8px; border: 1px solid var(--border);
          margin-top: 12px;
        }

        /* SUBMIT BTN */
        .submit-btn {
          padding: 10px 28px; border-radius: 8px;
          background: var(--accent2); color: #0d0f12;
          border: none; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(56,217,169,0.2);
        }
        .submit-btn:hover:not(:disabled) {
          background: #2ec99a; transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* TABLE */
        .table-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden;
          box-shadow: var(--card-shadow);
        }
        .table-header {
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .table-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: var(--text-dim); font-weight: 500;
        }
        .product-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: var(--accent);
          background: var(--accent-dim); border: 1px solid rgba(79,142,247,0.2);
          padding: 3px 10px; border-radius: 20px;
        }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: var(--bg3); }
        th {
          padding: 11px 16px; text-align: left;
          font-size: 11px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; color: var(--text-dim);
          border-bottom: 1px solid var(--border);
        }
        .table-row { border-bottom: 1px solid var(--border); transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: var(--surface2); }
        td { padding: 12px 16px; font-size: 13px; color: var(--text-muted); }
        .td-name { color: var(--text); font-weight: 500; }
        .td-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; color: var(--accent2);
        }
        .td-qty {
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
        }
        .cat-pill {
          display: inline-block; padding: 3px 9px; border-radius: 5px;
          font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
          background: var(--bg3); border: 1px solid var(--border);
          color: var(--text-dim);
        }
        .avail-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 5px;
          font-size: 11px; font-weight: 600;
        }
        .avail-badge.yes { background: var(--success-dim); color: var(--success); border: 1px solid rgba(56,217,169,0.2); }
        .avail-badge.no { background: var(--danger-dim); color: var(--danger); border: 1px solid rgba(240,107,107,0.2); }
        .avail-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        /* ACTION BTNS */
        .action-btns { display: flex; gap: 6px; }
        .edit-btn {
          padding: 5px 13px; border-radius: 6px;
          background: var(--accent-dim); color: var(--accent);
          border: 1px solid rgba(79,142,247,0.2);
          font-size: 12px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .edit-btn:hover { background: rgba(79,142,247,0.2); border-color: var(--accent); }
        .delete-btn {
          padding: 5px 13px; border-radius: 6px;
          background: var(--danger-dim); color: var(--danger);
          border: 1px solid rgba(240,107,107,0.2);
          font-size: 12px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .delete-btn:hover { background: rgba(240,107,107,0.2); border-color: var(--danger); }

        /* LOADING */
        .center-state {
          text-align: center; padding: 60px;
          color: var(--text-dim); font-size: 14px;
        }
        .loading-spinner {
          width: 32px; height: 32px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="admin-wrapper">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="admin-badge">
              <div className="admin-badge-dot" />
              ADMIN
            </div>
            <div className="topbar-divider" />
            <span className="page-label">Products Management</span>
          </div>
          <nav className="topbar-nav">
            <Link to="/admin/orders" className="nav-link">Orders</Link>
            <Link to="/admin/users" className="nav-link">Users</Link>
            <Link to="/" className="nav-link store">← Store</Link>
          </nav>
        </div>

        <div className="page-container">
          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <div className="page-title">
                <span>/</span> products
              </div>
              <div className="page-sub">{products.length} total records</div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="toolbar">
            <button
              className={`add-btn${showForm ? " cancel" : ""}`}
              onClick={() => {
                if (showForm) { setShowForm(false); resetForm(); }
                else { resetForm(); setShowForm(true); }
              }}
            >
              {showForm ? "✕ Cancel" : "+ New Product"}
            </button>
            {message && (
              <div className={`msg-box ${messageType}`}>
                <span>{messageType === "success" ? "✓" : "⚠"}</span>
                {message}
              </div>
            )}
          </div>

          {/* FORM */}
          {showForm && (
            <div className="form-card">
              <div className="form-title">
                {editProduct ? "Edit Product" : "New Product"}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="field-group">
                    <label className="field-label">Name</label>
                    <input className="form-input" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Category</label>
                    <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">New Price</label>
                    <input className="form-input" name="newPrice" placeholder="0.00" type="number" value={form.newPrice} onChange={handleChange} required />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Old Price</label>
                    <input className="form-input" name="oldPrice" placeholder="0.00" type="number" value={form.oldPrice} onChange={handleChange} required />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Quantity</label>
                    <input className="form-input" name="quantity" placeholder="0" type="number" value={form.quantity} onChange={handleChange} required />
                  </div>
                </div>

                <div className="field-group" style={{ marginBottom: "12px" }}>
                  <label className="field-label">Description</label>
                  <textarea className="form-input" name="description" placeholder="Product description..." value={form.description} onChange={handleChange} required />
                </div>

                {/* IMAGE */}
                <div className="field-group" style={{ marginBottom: "16px" }}>
                  <label className="field-label">Image</label>
                  <div className="upload-area">
                    <input type="file" accept="image/*" className="upload-input" onChange={handleImageChange} />
                    <div className="upload-icon">⬆</div>
                    <div className="upload-label">Click to upload image</div>
                    <div className="upload-sub">PNG, JPG, WEBP supported</div>
                  </div>
                  {imagePreview && <img src={imagePreview} alt="preview" className="preview-img" />}
                  {!imagePreview && editProduct?.images?.[0] && (
                    <img
                      src={editProduct.images[0].startsWith("http") ? editProduct.images[0] : `http://localhost:5000/images/${editProduct.images[0]}`}
                      alt="current"
                      className="preview-img"
                    />
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={uploadingImage}>
                  {uploadingImage ? "Uploading..." : editProduct ? "Update Product" : "Create Product"}
                </button>
              </form>
            </div>
          )}

          {/* TABLE */}
          {loading ? (
            <div className="center-state">
              <div className="loading-spinner" />
              Loading products...
            </div>
          ) : (
            <div className="table-card">
              <div className="table-header">
                <span className="table-label">PRODUCT_RECORDS</span>
                <span className="product-count">{products.length} items</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="table-row">
                      <td className="td-name">{product.name}</td>
                      <td><span className="cat-pill">{product.category}</span></td>
                      <td className="td-price">${product.newPrice}</td>
                      <td className="td-qty">{product.quantity}</td>
                      <td>
                        <span className={`avail-badge ${product.available ? "yes" : "no"}`}>
                          <span className="avail-dot" />
                          {product.available ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}