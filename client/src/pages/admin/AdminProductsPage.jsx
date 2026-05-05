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

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      category: "electronics",
      newPrice: "",
      oldPrice: "",
      quantity: "",
      description: "",
    });
    setEditProduct(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const uploadRes = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // مهم جدًا: تأكد إنك بتاخد اسم الصورة أو الرابط الصحيح
  imageURL =
    uploadRes.data.imageURL ||
    uploadRes.data.image ||
    uploadRes.data.filename;

  setUploadingImage(false);
}

      const productData = {
        ...form,
        images: imageURL ? [imageURL] : [],
      };

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, productData);
        setMessage("✅ Product updated successfully");
      } else {
        await api.post("/products", productData);
        setMessage("✅ Product created successfully");
      }

      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      setUploadingImage(false);
      setMessage(err.response?.data?.message || "❌ Failed");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setImageFile(null);
    setImagePreview("");

    setForm({
      name: product.name,
      category: product.category,
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
      quantity: product.quantity,
      description: product.description,
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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Products Management</h2>

        <div style={styles.navLinks}>
          <Link to="/admin/orders" style={styles.navLink}>
            Orders
          </Link>

          <Link to="/admin/users" style={styles.navLink}>
            Users
          </Link>

          <Link to="/" style={styles.navLink}>
            ← Store
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <button
          style={styles.addBtn}
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>

        {message && (
          <span style={{ color: message.startsWith("✅") ? "green" : "red" }}>
            {message}
          </span>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            {editProduct ? "Edit Product" : "Add New Product"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input
                style={styles.input}
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <select
                style={styles.input}
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                style={styles.input}
                name="newPrice"
                placeholder="New Price"
                type="number"
                value={form.newPrice}
                onChange={handleChange}
                required
              />

              <input
                style={styles.input}
                name="oldPrice"
                placeholder="Old Price"
                type="number"
                value={form.oldPrice}
                onChange={handleChange}
                required
              />

              <input
                style={styles.input}
                name="quantity"
                placeholder="Quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              style={{
                ...styles.input,
                width: "100%",
                height: "80px",
                resize: "vertical",
              }}
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            {/* Image Upload */}
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontSize: "14px",
                  color: "#666",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ fontSize: "14px" }}
              />

              {/* New Image Preview */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  style={styles.previewImage}
                />
              )}

              {/* Existing Product Image */}
              {!imagePreview && editProduct?.images?.[0] && (
                <img
                  src={
                    editProduct.images[0].startsWith("http")
                      ? editProduct.images[0]
                      : `http://localhost:5000/images/${editProduct.images[0]}`
                  }
                  alt="current"
                  style={styles.previewImage}
                />
              )}
            </div>

            <button
              style={styles.submitBtn}
              type="submit"
              disabled={uploadingImage}
            >
              {uploadingImage
                ? "Uploading..."
                : editProduct
                ? "Update Product"
                : "Create Product"}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <p style={styles.center}>Loading...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Available</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={styles.tableRow}>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>{product.category}</td>
                  <td style={styles.td}>${product.newPrice}</td>
                  <td style={styles.td}>{product.quantity}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        backgroundColor: product.available
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: product.available
                          ? "#16a34a"
                          : "#dc2626",
                      }}
                    >
                      {product.available ? "Yes" : "No"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    padding: "16px 24px",
    backgroundColor: "#1e40af",
    borderRadius: "8px",
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: "20px",
  },

  navLinks: {
    display: "flex",
    gap: "12px",
  },

  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    backgroundColor: "rgba(255,255,255,0.2)",
    fontSize: "14px",
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
  },

  addBtn: {
    padding: "10px 24px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },

  formCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "24px",
  },

  formTitle: {
    margin: "0 0 16px",
    fontSize: "18px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "12px",
  },

  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  },

  submitBtn: {
    marginTop: "12px",
    padding: "10px 32px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },

  previewImage: {
    marginTop: "10px",
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHead: {
    backgroundColor: "#f8fafc",
  },

  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    color: "#666",
    fontWeight: "600",
    borderBottom: "1px solid #eee",
  },

  tableRow: {
    borderBottom: "1px solid #f0f0f0",
  },

  td: {
    padding: "12px 16px",
    fontSize: "14px",
  },

  editBtn: {
    padding: "6px 14px",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
    fontSize: "13px",
  },

  deleteBtn: {
    padding: "6px 14px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },

  center: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
};