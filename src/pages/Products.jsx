import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { productsAPI } from "@/services/productsAPI";
import { authAPI } from "@/services/authAPI";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertBox from "@/components/AlertBox";

export default function Products() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Auth state
  const [role, setRole] = useState("member");

  // Form states (Admin CRUD)
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    tittle: "",
    category: "",
    brand: "",
    price: 0,
    stock: 0,
    image: ""
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await productsAPI.fetchProducts();
      setProducts(list);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      // 1. Fetch user role
      try {
        const { session } = await authAPI.getSession();
        if (session && session.user && session.user.profile) {
          setRole(session.user.profile.role || "member");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
      
      // 2. Fetch products
      await loadProducts();
    };

    initPage();
  }, []);

  const handleEditClick = (product) => {
    setFormData({
      code: product.code,
      tittle: product.tittle,
      category: product.category,
      brand: product.brand || "",
      price: product.price,
      stock: product.stock,
      image: product.image || ""
    });
    setEditingId(product.id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (prodId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      await productsAPI.deleteProduct(prodId);
      setSuccess("Product deleted successfully!");
      if (id && parseInt(id) === prodId) {
        navigate("/products");
      }
      await loadProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.code || !formData.tittle || !formData.category || formData.price <= 0) {
      setError("Please fill in all required fields (Code, Name, Category, Price).");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await productsAPI.updateProduct(editingId, formData);
        setSuccess("Product updated successfully!");
      } else {
        await productsAPI.createProduct(formData);
        setSuccess("Product added successfully!");
      }
      
      // Reset form
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        code: "",
        tittle: "",
        category: "",
        brand: "",
        price: 0,
        stock: 0,
        image: ""
      });
      
      await loadProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  // Find selected product if ID is in parameters
  const selectedProduct = products.find((item) => item.id === parseInt(id));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <PageHeader title="Products" breadcrumb={["Dashboard", "Product List"]}>
        {role === "admin" && (
          <button 
            onClick={() => {
              setIsEditing(false);
              setShowForm(!showForm);
              setFormData({
                code: "",
                tittle: "",
                category: "",
                brand: "",
                price: 0,
                stock: 0,
                image: ""
              });
            }}
            className="bg-[#009262] hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm font-semibold text-sm transition-all"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        )}
      </PageHeader>

      {success && <AlertBox type="success">{success}</AlertBox>}
      {error && <AlertBox type="error">{error}</AlertBox>}

      {/* Admin Add/Edit Form */}
      {showForm && role === "admin" && (
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Product Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="BEA-001"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
                required
                disabled={isEditing}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Product Name *</label>
              <input
                type="text"
                value={formData.tittle}
                onChange={(e) => setFormData({...formData, tittle: e.target.value})}
                placeholder="Eyeshadow Palette"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="beauty"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="GlowUp"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Price (Rp) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                placeholder="10000"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                placeholder="50"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://..."
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full py-2.5 bg-hijau hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                {isEditing ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <LoadingSpinner text="Memuat produk..." />
      ) : (
        <div className={selectedProduct ? "grid grid-cols-1 lg:grid-cols-4 gap-6" : "w-full"}>
          
          {/* PRODUCT TABLE */}
          <div className={selectedProduct ? "lg:col-span-3" : "w-full"}>
            <div className="overflow-hidden rounded-xl shadow-sm bg-white border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#009262] text-white text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-r border-green-600">Code</th>
                    <th className="p-4 font-bold border-r border-green-600">Product Name</th>
                    <th className="p-4 font-bold border-r border-green-600">Category</th>
                    <th className="p-4 font-bold border-r border-green-600">Brand</th>
                    <th className="p-4 font-bold border-r border-green-600 text-right">Price</th>
                    <th className="p-4 font-bold text-center border-r border-green-600">Stock</th>
                    {role === "admin" && <th className="p-4 font-bold text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        parseInt(id) === product.id ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="p-4 text-gray-400 border-r border-gray-100 uppercase">
                        {product.code}
                      </td>
                      <td className="p-4 border-r border-gray-100">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-[#009262] font-bold hover:underline"
                        >
                          {product.tittle}
                        </Link>
                      </td>
                      <td className="p-4 border-r border-gray-100">
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 border-r border-gray-100 text-gray-500">
                        {product.brand || "Essence"}
                      </td>
                      <td className="p-4 border-r border-gray-100 text-right font-bold text-gray-700">
                        Rp {product.price?.toLocaleString("id-ID") || "0"}
                      </td>
                      <td className={`p-4 text-center font-bold border-r border-gray-100 ${product.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                        {product.stock || "0"}
                      </td>
                      {role === "admin" && (
                        <td className="p-4 text-center space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="bg-blue-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="bg-red-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAIL PANEL */}
          {selectedProduct && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-8 animate-in fade-in slide-in-from-right-5 duration-300">
                <div className="flex justify-center mb-6 bg-gray-50 py-8 rounded-xl">
                  <img
                    src={selectedProduct.image || "https://dummyimage.com/150/009262/fff&text=Product"}
                    alt={selectedProduct.tittle}
                    className="h-40 object-contain"
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {selectedProduct.tittle}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Category</span>
                    <span className="text-sm font-semibold text-gray-700 uppercase">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Brand</span>
                    <span className="text-sm font-semibold text-gray-700">{selectedProduct.brand || "Essence"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Stock</span>
                    <span className="text-sm font-semibold text-gray-700">{selectedProduct.stock || "0"} pcs</span>
                  </div>
                  <div className="pt-4">
                    <span className="text-xs text-[#009262] font-bold uppercase block mb-1">Price</span>
                    <p className="text-2xl font-black text-gray-900">
                      Rp {selectedProduct.price?.toLocaleString("id-ID") || "0"}
                    </p>
                  </div>
                </div>

                <Link 
                  to="/products" 
                  className="mt-6 block text-center py-2 bg-gray-50 text-gray-400 hover:text-red-500 text-xs font-bold rounded-lg transition-colors"
                >
                  CLOSE DETAIL
                </Link>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}